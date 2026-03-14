-- =============================================
-- ISY CRM — Database Schema Migration
-- 009_create_activities.sql
-- =============================================

-- ─── ACTIVITIES ──────────────────────────────
CREATE TABLE IF NOT EXISTS activities (
    id              UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    type            TEXT NOT NULL,
    subject         TEXT NOT NULL,
    account_id      UUID REFERENCES accounts(id) ON DELETE CASCADE,
    contact_id      UUID REFERENCES contacts(id) ON DELETE SET NULL,
    opportunity_id  UUID REFERENCES opportunities(id) ON DELETE SET NULL,
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    activity_date   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
