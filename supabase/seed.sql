-- Create demo users in auth.users
-- Passwords are all 'password123'
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
)
VALUES
(
  '00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 'admin@crm.com',
  crypt('password123', gen_salt('bf')), current_timestamp, '{"provider":"email","providers":["email"]}', '{"name":"Admin User"}', current_timestamp, current_timestamp, '', '', '', ''
),
(
  '00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 'manager@crm.com',
  crypt('password123', gen_salt('bf')), current_timestamp, '{"provider":"email","providers":["email"]}', '{"name":"Manager User"}', current_timestamp, current_timestamp, '', '', '', ''
),
(
  '00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated', 'sales@crm.com',
  crypt('password123', gen_salt('bf')), current_timestamp, '{"provider":"email","providers":["email"]}', '{"name":"Sales Rep"}', current_timestamp, current_timestamp, '', '', '', ''
) ON CONFLICT (id) DO NOTHING;

-- Insert into public.users
INSERT INTO users (id, name, email, role)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Admin User', 'admin@crm.com', 'admin'),
  ('22222222-2222-2222-2222-222222222222', 'Manager User', 'manager@crm.com', 'manager'),
  ('33333333-3333-3333-3333-333333333333', 'Sales Rep', 'sales@crm.com', 'user')
ON CONFLICT (id) DO NOTHING;

-- Accounts
INSERT INTO accounts (id, name, industry, website, phone, billing_address, shipping_address)
VALUES
  ('aaaa1111-1111-1111-1111-111111111111', 'Acme Corp', 'Technology', 'https://acme.com', '+1-555-0100', '123 Tech Blvd, Silicon Valley', '123 Tech Blvd, Silicon Valley'),
  ('aaaa2222-2222-2222-2222-222222222222', 'Globex Inc', 'Manufacturing', 'https://globex.io', '+1-555-0200', '456 Industrial Way, Chicago', '456 Industrial Way, Chicago')
ON CONFLICT (id) DO NOTHING;

-- Contacts
INSERT INTO contacts (id, account_id, first_name, last_name, email, phone, job_title)
VALUES
  ('cccc1111-1111-1111-1111-111111111111', 'aaaa1111-1111-1111-1111-111111111111', 'John', 'Doe', 'john@acme.com', '+1-555-0101', 'CTO'),
  ('cccc2222-2222-2222-2222-222222222222', 'aaaa2222-2222-2222-2222-222222222222', 'Jane', 'Smith', 'jane@globex.io', '+1-555-0201', 'VP of Sales')
ON CONFLICT (id) DO NOTHING;

-- Leads
INSERT INTO leads (id, name, email, company, source, status, assigned_user_id)
VALUES
  ('bbbb1111-1111-1111-1111-111111111111', 'Alice Johnson', 'alice@startup.io', 'Startup IO', 'web', 'new', '33333333-3333-3333-3333-333333333333'),
  ('bbbb2222-2222-2222-2222-222222222222', 'Bob Builder', 'bob@construction.co', 'BuildCo', 'referral', 'qualified', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (id) DO NOTHING;

-- Pipeline Stages
INSERT INTO pipeline_stages (id, name, probability, sequence)
VALUES 
  ('eeee1111-1111-1111-1111-111111111111', 'Prospecting', 10, 1),
  ('eeee2222-2222-2222-2222-222222222222', 'Qualification', 20, 2),
  ('eeee3333-3333-3333-3333-333333333333', 'Needs Analysis', 40, 3),
  ('eeee4444-4444-4444-4444-444444444444', 'Proposal/Quote', 60, 4),
  ('eeee5555-5555-5555-5555-555555555555', 'Negotiation', 80, 5),
  ('eeee6666-6666-6666-6666-666666666666', 'Closed Won', 100, 6),
  ('eeee7777-7777-7777-7777-777777777777', 'Closed Lost', 0, 7)
ON CONFLICT (id) DO NOTHING;

-- Opportunities
INSERT INTO opportunities (id, account_id, contact_id, stage_id, name, value, expected_close, probability, owner_id)
VALUES
  ('00001111-1111-1111-1111-111111111111', 'aaaa1111-1111-1111-1111-111111111111', 'cccc1111-1111-1111-1111-111111111111', 'eeee4444-4444-4444-4444-444444444444', 'Acme Q3 Upgrade', 50000, current_date + interval '30 days', 60, '22222222-2222-2222-2222-222222222222'),
  ('00002222-2222-2222-2222-222222222222', 'aaaa2222-2222-2222-2222-222222222222', 'cccc2222-2222-2222-2222-222222222222', 'eeee2222-2222-2222-2222-222222222222', 'Globex Initial Deal', 120000, current_date + interval '60 days', 20, '33333333-3333-3333-3333-333333333333')
ON CONFLICT (id) DO NOTHING;

-- Products
INSERT INTO products (id, name, sku, base_price)
VALUES
  ('00003333-3333-3333-3333-333333333333', 'CRM Enterprise License', 'CRM-ENT-001', 12000),
  ('00004444-4444-4444-4444-444444444444', 'Setup & Onboarding', 'SRV-SET-001', 5000)
ON CONFLICT (id) DO NOTHING;

-- Pricebooks
INSERT INTO pricebooks (id, name, currency)
VALUES
  ('00005555-5555-5555-5555-555555555555', 'Standard USD', 'USD')
ON CONFLICT (id) DO NOTHING;

-- Pricebook Items
INSERT INTO pricebook_items (id, pricebook_id, product_id, unit_price)
VALUES
  (gen_random_uuid(), '00005555-5555-5555-5555-555555555555', '00003333-3333-3333-3333-333333333333', 12000),
  (gen_random_uuid(), '00005555-5555-5555-5555-555555555555', '00004444-4444-4444-4444-444444444444', 5000)
ON CONFLICT (id) DO NOTHING;

-- Quotes
INSERT INTO quotes (id, opportunity_id, total_amount, status)
VALUES
  ('00006666-6666-6666-6666-666666666666', '00001111-1111-1111-1111-111111111111', 17000, 'draft')
ON CONFLICT (id) DO NOTHING;

-- Quote Items
INSERT INTO quote_items (id, quote_id, product_id, quantity, unit_price)
VALUES
  (gen_random_uuid(), '00006666-6666-6666-6666-666666666666', '00003333-3333-3333-3333-333333333333', 1, 12000),
  (gen_random_uuid(), '00006666-6666-6666-6666-666666666666', '00004444-4444-4444-4444-444444444444', 1, 5000)
ON CONFLICT (id) DO NOTHING;

-- Campaigns
INSERT INTO campaigns (id, name, budget, start_date, end_date)
VALUES
  ('00007777-7777-7777-7777-777777777777', 'Q3 Tech Summit Sponsorship', 15000, current_date, current_date + interval '90 days')
ON CONFLICT (id) DO NOTHING;

-- Campaign Members
INSERT INTO campaign_members (id, campaign_id, contact_id, status)
VALUES
  (gen_random_uuid(), '00007777-7777-7777-7777-777777777777', 'cccc1111-1111-1111-1111-111111111111', 'sent')
ON CONFLICT (id) DO NOTHING;

-- Support Tickets
INSERT INTO support_tickets (id, account_id, contact_id, subject, status, priority)
VALUES
  ('00008888-8888-8888-8888-888888888888', 'aaaa1111-1111-1111-1111-111111111111', 'cccc1111-1111-1111-1111-111111111111', 'Integration Error with ERP', 'open', 'high')
ON CONFLICT (id) DO NOTHING;

-- Ticket Messages
INSERT INTO ticket_messages (id, ticket_id, sender_type, message)
VALUES
  (gen_random_uuid(), '00008888-8888-8888-8888-888888888888', 'customer', 'We are seeing 500 errors when trying to sync data.')
ON CONFLICT (id) DO NOTHING;

-- Activities
INSERT INTO activities (id, type, subject, account_id, contact_id, user_id, activity_date)
VALUES
  (gen_random_uuid(), 'call', 'Initial discovery call', 'aaaa1111-1111-1111-1111-111111111111', 'cccc1111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', current_timestamp - interval '2 days'),
  (gen_random_uuid(), 'email', 'Follow up on proposal', 'aaaa1111-1111-1111-1111-111111111111', 'cccc1111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', current_timestamp)
ON CONFLICT (id) DO NOTHING;
