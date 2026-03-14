// ============================================================
// Domain Types — ISY CRM
// ============================================================

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
}

export interface AuthResponse {
  user: User;
  session?: AuthTokens;
  access_token?: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface SignUpParams {
  email: string;
  password: string;
  name: string;
}

// ============================================================
// Account
// ============================================================
export interface Account {
  id: string;
  name: string;
  industry?: string;
  website?: string;
  phone?: string;
  billingAddress?: string;
  shippingAddress?: string;
  createdAt?: string;
}

export type CreateAccountPayload = Omit<Account, 'id' | 'createdAt'>;
export type UpdateAccountPayload = Partial<CreateAccountPayload>;

// ============================================================
// Contact
// ============================================================
export interface Contact {
  id: string;
  accountId?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  createdAt?: string;
}

export type CreateContactPayload = Omit<Contact, 'id' | 'createdAt'>;

// ============================================================
// Lead
// ============================================================
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
export type LeadSource = 'web' | 'referral' | 'email' | 'social' | 'event' | 'other';

export interface Lead {
  id: string;
  name: string;
  email?: string;
  company?: string;
  source?: LeadSource;
  status: LeadStatus;
  assigned_user_id?: string;
  created_at?: string;
}

export type CreateLeadPayload = Omit<Lead, 'id' | 'created_at'>;

// ============================================================
// Opportunity + Pipeline
// ============================================================
export interface PipelineStage {
  id: string;
  name: string;
  probability: number;
  sequence: number;
}

export interface Opportunity {
  id: string;
  accountId?: string;
  contactId?: string;
  stageId?: string;
  value?: number;
  expectedClose?: string;
  probability?: number;
  ownerId?: string;
  name?: string;
  // joined fields
  account?: Account;
  contact?: Contact;
  stage?: PipelineStage;
}

export interface PipelineBoard {
  [stageId: string]: {
    stage: PipelineStage;
    opportunities: Opportunity[];
  };
}

export type CreateOpportunityPayload = {
  accountId?: string;
  contactId?: string;
  stageId: string;
  value: number;
  expectedClose?: string;
  probability?: number;
  name?: string;
};

export type UpdateOpportunityPayload = Partial<CreateOpportunityPayload> & { stageId?: string };

// ============================================================
// Quote
// ============================================================
export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected';

export interface Quote {
  id: string;
  opportunity_id: string;
  total_amount: number;
  status: QuoteStatus;
  created_at?: string;
  items?: QuoteItem[];
}

export interface QuoteItem {
  id: string;
  quote_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
}

export type CreateQuotePayload = {
  opportunity_id: string;
  items: Array<{ product_id: string; quantity: number; unit_price: number }>;
};

// ============================================================
// Product + Pricebook
// ============================================================
export interface Product {
  id: string;
  name: string;
  sku?: string;
  base_price: number;
}

export type CreateProductPayload = Omit<Product, 'id' | 'created_at' | 'updated_at'>;

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface Pricebook extends BaseEntity {
  name: string;
  currency: string;
}

export interface PricebookItem extends BaseEntity {
  pricebook_id: string;
  product_id: string;
  unit_price: number;
}

// ============================================================
// Campaign
// ============================================================
export type CampaignMemberStatus = 'pending' | 'sent' | 'responded';

export interface Campaign extends BaseEntity {
  name: string;
  budget?: number;
  start_date?: string;
  end_date?: string;
  members?: CampaignMember[];
}

export interface CampaignMember extends BaseEntity {
  campaign_id: string;
  contact_id?: string;
  lead_id?: string;
  status: CampaignMemberStatus;
}

export type CreateCampaignPayload = {
  name: string;
  budget?: number;
  start_date?: string;
  end_date?: string;
};

export type AddCampaignMemberPayload = {
  memberId: string;
  type: 'contact' | 'lead';
};

// ============================================================
// Support
// ============================================================
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type SenderType = 'agent' | 'customer';

export interface SupportTicket extends BaseEntity {
  account_id?: string;
  contact_id?: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  account?: Account;
  contact?: Contact;
}

export interface TicketMessage extends BaseEntity {
  ticket_id: string;
  sender_type: SenderType;
  message: string;
}

export interface Activity extends BaseEntity {
  type: string;
  subject: string;
  account_id?: string;
  contact_id?: string;
  opportunity_id?: string;
  user_id?: string;
  activity_date: string;
}

export type CreateTicketPayload = {
  account_id?: string;
  contact_id?: string;
  subject: string;
  status?: TicketStatus;
  priority: TicketPriority;
};

export type AddTicketMessagePayload = {
  senderType: SenderType;
  message: string;
};

// ============================================================
// API Response Wrappers
// ============================================================
export interface ApiError {
  message: string;
  statusCode?: number;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ============================================================
// Theme
// ============================================================
export type ThemeMode = 'system' | 'dark' | 'light';
