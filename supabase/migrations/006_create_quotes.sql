-- =============================================
-- ISY CRM — Database Schema Migration
-- 006_create_quotes.sql
-- =============================================

-- ─── QUOTES ──────────────────────────────────
CREATE TABLE IF NOT EXISTS quotes (
    id              UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    opportunity_id  UUID REFERENCES opportunities(id) ON DELETE CASCADE,
    total_amount    NUMERIC(15, 2) NOT NULL DEFAULT 0,
    status          TEXT NOT NULL DEFAULT 'draft',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── QUOTE ITEMS ─────────────────────────────
CREATE TABLE IF NOT EXISTS quote_items (
    id          UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    quote_id    UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
    product_id  UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity    INTEGER NOT NULL DEFAULT 1,
    unit_price  NUMERIC(15, 2) NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
