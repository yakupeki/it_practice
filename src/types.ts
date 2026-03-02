export type LeadStatus = 'new' | 'waiting' | 'followup' | 'won' | 'lost';
export type OptInStatus = 'unknown' | 'confirmed' | 'denied';
export type InteractionType = 'sent' | 'received' | 'note';
export type TemplateCategory = 'firstReply' | 'followUp' | 'faq' | 'closing' | 'other';

export interface Lead {
  id: string;
  platform: 'instagram';
  handle: string;
  displayName?: string;
  status: LeadStatus;
  tags: string[];
  tagsText: string;
  optInStatus: OptInStatus;
  lastContactAt?: string;
  nextFollowUpAt?: string;
  memo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Interaction {
  id: string;
  leadId: string;
  type: InteractionType;
  templateId?: string;
  body?: string;
  createdAt: string;
}

export interface Template {
  id: string;
  title: string;
  category: TemplateCategory;
  body: string;
  variables: string[];
  complianceFlags: string[];
  updatedAt: string;
}

export interface AppSettings {
  blockDeniedCopy: boolean;
  warnUnknownCopy: boolean;
  antiSpamEnabled: boolean;
}
