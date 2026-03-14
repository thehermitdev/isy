-- =============================================
-- ISY CRM — Database Schema Migration
-- 004_create_pipeline_and_opportunities.sql
-- =============================================

-- ─── PIPELINE STAGES ─────────────────────────
CREATE TABLE IF NOT EXISTS pipeline_stages (
    id          UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    name        TEXT NOT NULL,
    probability INTEGER NOT NULL DEFAULT 0,
    sequence    INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default pipeline stages
INSERT INTO pipeline_stages (name, probability, sequence) VALUES
    ('Prospecting',       10, 1),
    ('Qualification',     20, 2),
    ('Needs Analysis',    40, 3),
    ('Proposal/Quote',    60, 4),
    ('Negotiation',       80, 5),
    ('Closed Won',       100, 6),
    ('Closed Lost',        0, 7)
ON CONFLICT DO NOTHING;

-- ─── OPPORTUNITIES ───────────────────────────
CREATE TABLE IF NOT EXISTS opportunities (
    id             UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    account_id     UUID REFERENCES accounts(id) ON DELETE CASCADE,
    contact_id     UUID REFERENCES contacts(id) ON DELETE SET NULL,
    stage_id       UUID REFERENCES pipeline_stages(id) ON DELETE SET NULL,
    value          NUMERIC(15, 2) NOT NULL DEFAULT 0,
    expected_close DATE,
    probability    INTEGER DEFAULT 0,
    owner_id       UUID REFERENCES users(id) ON DELETE SET NULL,
    name           TEXT NOT NULL,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
