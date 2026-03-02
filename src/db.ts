import Dexie, { type Table } from 'dexie';
import type { AppSettings, Interaction, Lead, Template } from './types';

export class AppDB extends Dexie {
  leads!: Table<Lead, string>;
  interactions!: Table<Interaction, string>;
  templates!: Table<Template, string>;
  meta!: Table<{ key: string; value: string }, string>;
  settings!: Table<{ key: string; value: AppSettings }, string>;

  constructor() {
    super('dmSalesLedgerDB');
    this.version(1).stores({
      leads: 'id,&handle,status,optInStatus,lastContactAt,nextFollowUpAt,tagsText,updatedAt',
      interactions: 'id,leadId,createdAt',
      templates: 'id,category,updatedAt',
      meta: 'key',
      settings: 'key'
    });
  }
}

export const db = new AppDB();
