-- =============================================
-- ISY CRM — Database Schema Migration
-- 011_enable_rls_and_policies.sql
-- =============================================

-- ─── ROW LEVEL SECURITY (RLS) ────────────────
-- Enable RLS on all core tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricebook_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Baseline Policy: Authenticated users (Staff) can read all CRM data
-- In a multi-tenant setup, we would filter by tenant_id.
-- For this enterprise app, we assume all authenticated users are authorized staff.

DO $$
DECLARE
    t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY[
        'users', 'accounts', 'contacts', 'leads', 'pipeline_stages',
        'opportunities', 'products', 'pricebooks', 'pricebook_items',
        'quotes', 'quote_items', 'campaigns', 'campaign_members',
        'support_tickets', 'ticket_messages', 'activities'
    ] LOOP
        EXECUTE format('CREATE POLICY "Allow authenticated read" ON %I FOR SELECT TO authenticated USING (true)', t);
        EXECUTE format('CREATE POLICY "Allow authenticated insert" ON %I FOR INSERT TO authenticated WITH CHECK (true)', t);
        EXECUTE format('CREATE POLICY "Allow authenticated update" ON %I FOR UPDATE TO authenticated USING (true)', t);
        EXECUTE format('CREATE POLICY "Allow authenticated delete" ON %I FOR DELETE TO authenticated USING (true)', t);
    END LOOP;
END;
$$;
