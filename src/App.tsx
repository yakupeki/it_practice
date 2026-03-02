import { useEffect, useMemo, useState } from 'react';
import { Link, Route, Routes, useNavigate, useSearchParams } from 'react-router-dom';
import { db } from './db';
import type { AppSettings, Interaction, Lead, LeadStatus, OptInStatus, Template } from './types';
import { applyTemplate, detectRiskyContent, extractVariables, nowIso, uuid } from './utils';

const defaultSettings: AppSettings = { blockDeniedCopy: true, warnUnknownCopy: true, antiSpamEnabled: true };
const defaultTemplates = [
  { id: uuid(), title: '初回返信', category: 'firstReply' as const, body: 'こんにちは{name}さん。お問い合わせありがとうございます！', variables: ['name'], complianceFlags: ['needs_optin_check'], updatedAt: nowIso() }
];

export default function App() {
  return <div className="app"><h1>DMセールス台帳</h1><Nav /><Routes><Route path="/" element={<Dashboard/>}/><Route path="/leads" element={<LeadList/>}/><Route path="/lead/:id" element={<LeadDetail/>}/><Route path="/templates" element={<Templates/>}/><Route path="/settings" element={<Settings/>}/><Route path="/help" element={<Help/>}/></Routes></div>;
}

function Nav(){return <nav>{['/','/leads','/templates','/settings','/help'].map((p,i)=><Link key={p} to={p}>{['ダッシュボード','リード一覧','テンプレ','設定','ヘルプ'][i]}</Link>)}</nav>;}

function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const navigate = useNavigate();
  useEffect(() => { db.leads.toArray().then(setLeads); }, []);
  const today = new Date().toISOString().slice(0, 10);
  const counts = useMemo(() => ['new', 'waiting', 'followup', 'won', 'lost'].map((s) => [s, leads.filter((l) => l.status === s).length] as const), [leads]);
  const due = leads.filter((l) => l.nextFollowUpAt && l.nextFollowUpAt.slice(0, 10) <= today);
  return <section><h2>概要</h2><div className="cards">{counts.map(([s,c]) => <button key={s} onClick={()=>navigate(`/leads?status=${s}`)}>{s}:{c}</button>)}</div><h3>今日の要フォロー</h3><ul>{due.map(l=><li key={l.id}><Link to={`/lead/${l.id}`}>@{l.handle}</Link></li>)}</ul></section>;
}

function LeadList() {
  const [all, setAll] = useState<Lead[]>([]);
  const [q, setQ] = useState('');
  const [sp] = useSearchParams();
  const status = sp.get('status');
  useEffect(() => { db.leads.orderBy('nextFollowUpAt').toArray().then(setAll); }, []);
  const list = all.filter((l) => (!status || l.status === status) && `${l.handle} ${l.displayName ?? ''} ${l.memo ?? ''} ${l.tagsText}`.toLowerCase().includes(q.toLowerCase()));
  return <section><h2>リード一覧</h2><Link to="/lead/new">+ 新規</Link><input placeholder="検索" value={q} onChange={(e)=>setQ(e.target.value)}/><table><thead><tr><th>handle</th><th>status</th><th>optIn</th><th>nextFollowUp</th></tr></thead><tbody>{list.map(l=><tr key={l.id}><td><Link to={`/lead/${l.id}`}>@{l.handle}</Link></td><td>{l.status}</td><td>{l.optInStatus}</td><td>{l.nextFollowUpAt?.slice(0,10) ?? '-'}</td></tr>)}</tbody></table></section>;
}

function LeadDetail() {
  const id = location.pathname.split('/').pop()!;
  const [lead, setLead] = useState<Lead | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [vars, setVars] = useState<Record<string,string>>({});
  const navigate = useNavigate();
  useEffect(() => { db.templates.toArray().then(async (t) => { setTemplates(t.length?t:defaultTemplates); if(!t.length) await db.templates.bulkAdd(defaultTemplates); }); }, []);
  useEffect(() => {
    if (id === 'new') {
      setLead({ id: uuid(), platform: 'instagram', handle: '', status: 'new', tags: [], tagsText: '', optInStatus: 'unknown', createdAt: nowIso(), updatedAt: nowIso() });
      setInteractions([]); return;
    }
    db.leads.get(id).then((l) => l && setLead(l));
    db.interactions.where('leadId').equals(id).sortBy('createdAt').then(setInteractions);
  }, [id]);
  if (!lead) return <p>読み込み中...</p>;
  const rendered = selectedTemplate ? applyTemplate(selectedTemplate.body, vars) : '';
  const risky = detectRiskyContent(rendered);
  const canCopy = !(lead.optInStatus === 'denied');
  return <section><h2>リード詳細</h2>
    <div className="form-grid">
      <label>handle<input value={lead.handle} onChange={e=>setLead({...lead,handle:e.target.value.replace('@','')})}/></label>
      <label>表示名<input value={lead.displayName ?? ''} onChange={e=>setLead({...lead,displayName:e.target.value})}/></label>
      <label>status<select value={lead.status} onChange={e=>setLead({...lead,status:e.target.value as LeadStatus})}>{['new','waiting','followup','won','lost'].map(s=><option key={s}>{s}</option>)}</select></label>
      <label>optIn<select value={lead.optInStatus} onChange={e=>setLead({...lead,optInStatus:e.target.value as OptInStatus})}>{['unknown','confirmed','denied'].map(s=><option key={s}>{s}</option>)}</select></label>
      <label>次フォロー<input type="date" value={lead.nextFollowUpAt?.slice(0,10) ?? ''} onChange={e=>setLead({...lead,nextFollowUpAt:e.target.value?new Date(e.target.value).toISOString():undefined})}/></label>
      <label>メモ<textarea value={lead.memo ?? ''} onChange={e=>setLead({...lead,memo:e.target.value})}/></label>
    </div>
    <button onClick={async()=>{const rec={...lead,tagsText:lead.tags.join(' '),updatedAt:nowIso()}; await db.leads.put(rec); navigate('/leads');}}>保存</button>
    {id !== 'new' && <button onClick={async()=>{await db.transaction('rw', db.leads, db.interactions, async ()=>{await db.leads.delete(id); const children = await db.interactions.where('leadId').equals(id).primaryKeys(); await db.interactions.bulkDelete(children as string[]);}); navigate('/leads');}}>削除</button>}
    <h3>テンプレ適用</h3>
    <select value={selectedTemplate?.id ?? ''} onChange={e=>{const t=templates.find(x=>x.id===e.target.value) ?? null; setSelectedTemplate(t); const init:Record<string,string>={}; t?.variables.forEach(v=>init[v]=''); setVars(init);}}><option value="">選択</option>{templates.map(t=><option value={t.id} key={t.id}>{t.title}</option>)}</select>
    {selectedTemplate && <div>{selectedTemplate.variables.map(v=><label key={v}>{v}<input value={vars[v] ?? ''} onChange={e=>setVars({...vars,[v]:e.target.value})}/></label>)}</div>}
    <pre>{rendered}</pre>
    {lead.optInStatus==='denied' && <p className="warn">オプトイン拒否のためコピー禁止</p>}
    {lead.optInStatus==='unknown' && <p className="warn">オプトイン未確認です</p>}
    {risky.length>0 && <p className="warn">注意語句: {risky.join(',')}</p>}
    <button disabled={!canCopy || !rendered} onClick={async()=>{await navigator.clipboard.writeText(rendered); if(id!=='new'){await db.interactions.add({id:uuid(),leadId:id,type:'sent',templateId:selectedTemplate?.id,body:rendered,createdAt:nowIso()});} alert('コピーしました');}}>コピー</button>
    <h3>ログ</h3><ul>{interactions.map(i=><li key={i.id}>{i.type}: {i.body}</li>)}</ul>
  </section>;
}

function Templates() {
  const [list, setList] = useState<Template[]>([]);
  const [editing, setEditing] = useState<Template | null>(null);
  useEffect(()=>{db.templates.toArray().then(async (arr)=>{if(!arr.length){await db.templates.bulkAdd(defaultTemplates); setList(defaultTemplates);} else setList(arr);});},[]);
  return <section><h2>テンプレ</h2><button onClick={()=>setEditing({id:uuid(),title:'',category:'other',body:'',variables:[],complianceFlags:[],updatedAt:nowIso()})}>+新規</button>
  <ul>{list.map(t=><li key={t.id}><button onClick={()=>setEditing(t)}>{t.title}</button></li>)}</ul>
  {editing && <div className="form-grid"><input placeholder="タイトル" value={editing.title} onChange={e=>setEditing({...editing,title:e.target.value})}/><textarea value={editing.body} onChange={e=>setEditing({...editing,body:e.target.value,variables:extractVariables(e.target.value)})}/><p>変数: {editing.variables.join(', ') || '-'}</p><button onClick={async()=>{const rec={...editing,updatedAt:nowIso()}; await db.templates.put(rec); setList(await db.templates.toArray()); setEditing(null);}}>保存</button></div>}</section>;
}

function Settings() {
  const [settings, setSettings] = useState(defaultSettings);
  useEffect(()=>{db.settings.get('app').then(v=>setSettings(v?.value ?? defaultSettings));},[]);
  const save = async()=>{await db.settings.put({key:'app',value:settings}); alert('保存');};
  const exportData = async()=>{
    const payload = { leads: await db.leads.toArray(), interactions: await db.interactions.toArray(), templates: await db.templates.toArray(), meta: await db.meta.toArray(), settings: await db.settings.toArray() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `dm-ledger-${Date.now()}.json`; a.click();
  };
  const importData = async(f: File)=>{const text = await f.text(); const data = JSON.parse(text); await db.transaction('rw', db.leads,db.interactions,db.templates,db.meta,db.settings, async()=>{await db.leads.clear();await db.interactions.clear();await db.templates.clear();await db.meta.clear();await db.settings.clear(); if(data.leads) await db.leads.bulkAdd(data.leads); if(data.interactions) await db.interactions.bulkAdd(data.interactions); if(data.templates) await db.templates.bulkAdd(data.templates); if(data.meta) await db.meta.bulkAdd(data.meta); if(data.settings) await db.settings.bulkAdd(data.settings);}); alert('インポート完了');};
  return <section><h2>設定</h2><label><input type="checkbox" checked={settings.blockDeniedCopy} onChange={e=>setSettings({...settings,blockDeniedCopy:e.target.checked})}/> deniedコピー禁止</label><label><input type="checkbox" checked={settings.warnUnknownCopy} onChange={e=>setSettings({...settings,warnUnknownCopy:e.target.checked})}/> unknown警告</label><button onClick={save}>設定保存</button><hr/><button onClick={exportData}>JSONエクスポート</button><input type="file" accept="application/json" onChange={e=>e.target.files?.[0] && importData(e.target.files[0])}/></section>;
}

function Help(){return <section><h2>ヘルプ</h2><p>本アプリはInstagram DMの管理とコピペ支援専用です。自動送信はしません。メモ欄に住所/電話/メール等の個人情報は記録しないでください。</p></section>;}
