-- =============================================
-- ISY CRM — Database Schema Migration
-- 003_create_core_entities.sql
-- =============================================

-- ─── ACCOUNTS ────────────────────────────────
CREATE TABLE IF NOT EXISTS accounts (
    id               UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    name             TEXT NOT NULL,
    industry         TEXT,
    website          TEXT,
    phone            TEXT,
    billing_address  TEXT,
    shipping_address TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── CONTACTS ────────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
    id          UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    account_id  UUID REFERENCES accounts(id) ON DELETE SET NULL,
    first_name  TEXT NOT NULL,
    last_name   TEXT NOT NULL,
    email       TEXT,
    phone       TEXT,
    job_title   TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── LEADS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
    id               UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    name             TEXT NOT NULL,
    email            TEXT,
    company          TEXT,
    source           TEXT,
    status           TEXT NOT NULL DEFAULT 'new',
    assigned_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
