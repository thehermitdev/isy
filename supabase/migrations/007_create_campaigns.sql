-- =============================================
-- ISY CRM — Database Schema Migration
-- 007_create_campaigns.sql
-- =============================================

-- ─── CAMPAIGNS ───────────────────────────────
CREATE TABLE IF NOT EXISTS campaigns (
    id          UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    name        TEXT NOT NULL,
    budget      NUMERIC(15, 2) DEFAULT 0,
    start_date  TIMESTAMPTZ,
    end_date    TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── CAMPAIGN MEMBERS ────────────────────────
CREATE TABLE IF NOT EXISTS campaign_members (
    id           UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    campaign_id  UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    contact_id   UUID REFERENCES contacts(id) ON DELETE CASCADE,
    lead_id      UUID REFERENCES leads(id) ON DELETE CASCADE,
    status       TEXT NOT NULL DEFAULT 'invited',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
