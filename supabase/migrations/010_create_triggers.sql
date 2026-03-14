-- =============================================
-- ISY CRM — Database Schema Migration
-- 010_create_triggers.sql
-- =============================================

-- ─── UPDATED_AT TRIGGER FUNCTION ─────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
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
        EXECUTE format(
            'CREATE OR REPLACE TRIGGER set_%I_updated_at
             BEFORE UPDATE ON %I
             FOR EACH ROW EXECUTE FUNCTION set_updated_at()',
            t, t
        );
    END LOOP;
END;
$$;
