-- =============================================
-- ISY CRM — Database Schema Migration
-- 008_create_support_tickets.sql
-- =============================================

-- ─── SUPPORT TICKETS ─────────────────────────
CREATE TABLE IF NOT EXISTS support_tickets (
    id          UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    account_id  UUID REFERENCES accounts(id) ON DELETE CASCADE,
    contact_id  UUID REFERENCES contacts(id) ON DELETE SET NULL,
    subject     TEXT NOT NULL,
    status      TEXT NOT NULL DEFAULT 'open',
    priority    TEXT NOT NULL DEFAULT 'medium',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── TICKET MESSAGES ─────────────────────────
CREATE TABLE IF NOT EXISTS ticket_messages (
    id           UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    ticket_id    UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_type  TEXT NOT NULL DEFAULT 'agent',
    message      TEXT NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
