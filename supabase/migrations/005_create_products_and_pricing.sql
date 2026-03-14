-- =============================================
-- ISY CRM — Database Schema Migration
-- 005_create_products_and_pricing.sql
-- =============================================

-- ─── PRODUCTS ────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
    id          UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    name        TEXT NOT NULL,
    sku         TEXT UNIQUE,
    base_price  NUMERIC(15, 2) NOT NULL DEFAULT 0,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert sample products
INSERT INTO products (name, sku, base_price) VALUES
    ('CRM Basic User License', 'LIC-BASIC', 29.00),
    ('CRM Pro User License', 'LIC-PRO', 79.00),
    ('Implementation Service (Hourly)', 'SRV-IMPL', 150.00),
    ('Priority Support Add-on', 'SRV-SUPP', 199.00)
ON CONFLICT DO NOTHING;

-- ─── PRICEBOOKS ──────────────────────────────
CREATE TABLE IF NOT EXISTS pricebooks (
    id          UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    name        TEXT NOT NULL,
    currency    TEXT NOT NULL DEFAULT 'USD',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── PRICEBOOK ITEMS ─────────────────────────
CREATE TABLE IF NOT EXISTS pricebook_items (
    id           UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    pricebook_id UUID NOT NULL REFERENCES pricebooks(id) ON DELETE CASCADE,
    product_id   UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    unit_price   NUMERIC(15, 2) NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(pricebook_id, product_id)
);
