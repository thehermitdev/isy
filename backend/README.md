# 🚀 ISY CRM Backend

Powerful, scalable, and clean CRM backend built with **Node.js**, **Fastify**, and **Supabase**. This project follows **Clean Architecture** principles to ensure maintainability, testability, and clear separation of concerns.

---

## 🏗️ Architecture Overview

The backend is structured into four distinct layers:

1.  **Domain**: Core business logic, entities, and repository interfaces.
2.  **Application**: Use cases that orchestrate the flow of data between the domain and external layers.
3.  **Infrastructure**: Implementation of repository interfaces, database configurations, and external integrations (Supabase).
4.  **Interfaces**: Entry points for the application (HTTP controllers, middleware).

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: [Fastify](https://www.fastify.io/) (High performance, low overhead)
- **Language**: TypeScript
- **Database / Auth**: [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **Validation**: [Zod](https://zod.dev/)
- **Development**: tsx (TypeScript Execution)

---

## 🚦 Getting Started

### 1. Prerequisites

- Node.js installed
- pnpm (recommended) or npm
- Supabase project (URL and Anon key)

### 2. Installation

```bash
cd backend
pnpm install
```

### 3. Environment Setup

Create a `.env` file in the `backend` directory:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=3001
```

### 4. Running the Server

```bash
# Development mode with hot-reload
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

---

## 🔐 Authentication

All private routes require a valid **Supabase JWT** in the Authorization header.

**Header Format**:

```
Authorization: Bearer {your_access_token}
```

- Obtain a token via `/api/auth/signin` or `/api/auth/signup`.
- The token must be provided for all private routes.

---

## 📋 Full API Reference

Comprehensive documentation of all server-side API endpoints with request/response formats and detailed reasons.

### 🏥 System

- Endpoint: `GET /health`
- Reason: Monitor server availability and timestamp for uptime tracking.
- Request Body: None
- Response:
```json
{
  "status": "ok",
  "timestamp": "2026-03-14T12:00:00.000Z"
}
```

### 🔑 Authentication (Public)

- Endpoint: `POST /api/auth/signup`
- Reason: Register a new user in the CRM system.
- Request Body:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```
- Response:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "agent"
  },
  "session": {
    "access_token": "eyJhbGciOi...",
    "refresh_token": "def50200...",
    "expires_in": 3600
  }
}
```

- Endpoint: `POST /api/auth/signin`
- Reason: Authenticate an existing user and obtain a JWT session.
- Request Body:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```
- Response:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "agent"
  },
  "session": {
    "access_token": "eyJhbGciOi...",
    "refresh_token": "def50200...",
    "expires_in": 3600
  }
}
```

### 👤 Users (Private)

- Endpoint: `GET /api/auth/me`
- Reason: Fetch the profile of the currently authenticated user.
- Request Body: None
- Response:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "agent"
  }
}
```

- Endpoint: `GET /api/users`
- Reason: Retrieve a list of all CRM users for assignment and collaboration.
- Request Body: None
- Response:
```json
[
  {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "agent"
  }
]
```

### 👥 Accounts (Private)

- Endpoint: `GET /api/accounts`
- Reason: Fetch all company accounts.
- Request Body: None
- Response:
```json
[
  {
    "id": "uuid",
    "name": "Acme Corp",
    "industry": "Technology"
  }
]
```

- Endpoint: `GET /api/accounts/:id`
- Reason: Fetch details for a specific company account.
- Request Body: None
- Response:
```json
{
  "id": "uuid",
  "name": "Acme Corp",
  "industry": "Technology"
}
```

- Endpoint: `POST /api/accounts`
- Reason: Register a new business account.
- Request Body:
```json
{
  "name": "Acme Corp",
  "industry": "Technology",
  "email": "contact@acme.com"
}
```
- Response:
```json
{
  "id": "uuid",
  "name": "Acme Corp",
  "industry": "Technology",
  "email": "contact@acme.com"
}
```

- Endpoint: `PUT /api/accounts/:id`
- Reason: Update company information.
- Request Body:
```json
{
  "name": "Acme Corp Updated",
  "industry": "Software"
}
```
- Response:
```json
{
  "id": "uuid",
  "name": "Acme Corp Updated",
  "industry": "Software"
}
```

- Endpoint: `DELETE /api/accounts/:id`
- Reason: Remove an account from the system.
- Request Body: None
- Response: None

### 👤 Contacts (Private)

- Endpoint: `GET /api/contacts`
- Reason: List all people linked to accounts.
- Request Body: None
- Response:
```json
[
  {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "accountId": "uuid"
  }
]
```

- Endpoint: `GET /api/contacts/:id`
- Reason: Fetch personal details of a specific contact.
- Request Body: None
- Response:
```json
{
  "id": "uuid",
  "firstName": "John",
  "lastName": "Doe",
  "accountId": "uuid"
}
```

- Endpoint: `POST /api/contacts`
- Reason: Create a new contact person.
- Request Body:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "accountId": "uuid"
}
```
- Response:
```json
{
  "id": "uuid",
  "firstName": "John",
  "lastName": "Doe",
  "accountId": "uuid"
}
```

- Endpoint: `PATCH /api/contacts/:id`
- Reason: Partially update contact details.
- Request Body:
```json
{
  "email": "john.new@email.com"
}
```
- Response:
```json
{
  "id": "uuid",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.new@email.com",
  "accountId": "uuid"
}
```

- Endpoint: `DELETE /api/contacts/:id`
- Reason: Remove a contact.
- Request Body: None
- Response: None

### 🎯 Leads (Private)

- Endpoint: `GET /api/leads`
- Reason: View all incoming prospects.
- Request Body: None
- Response:
```json
[
  {
    "id": "uuid",
    "name": "Prospect X",
    "company": "Futurama",
    "status": "new"
  }
]
```

- Endpoint: `GET /api/leads/:id`
- Reason: Fetch details of a specific prospect.
- Request Body: None
- Response:
```json
{
  "id": "uuid",
  "name": "Prospect X",
  "company": "Futurama",
  "status": "new"
}
```

- Endpoint: `POST /api/leads`
- Reason: Log a new incoming lead/inquiry.
- Request Body:
```json
{
  "name": "Prospect X",
  "company": "Futurama",
  "source": "website"
}
```
- Response:
```json
{
  "id": "uuid",
  "name": "Prospect X",
  "company": "Futurama",
  "source": "website",
  "status": "new"
}
```

- Endpoint: `PATCH /api/leads/:id`
- Reason: Qualify or update lead status.
- Request Body:
```json
{
  "status": "qualified"
}
```
- Response:
```json
{
  "id": "uuid",
  "name": "Prospect X",
  "company": "Futurama",
  "source": "website",
  "status": "qualified"
}
```

- Endpoint: `DELETE /api/leads/:id`
- Reason: Discard a lead.
- Request Body: None
- Response: None

### 💼 Sales & Pipeline (Private)

- Endpoint: `GET /api/opportunities`
- Reason: List all sales deals in the system.
- Request Body: None
- Response:
```json
[
  {
    "id": "uuid",
    "name": "Big Deal",
    "amount": 50000,
    "pipelineStageId": "uuid"
  }
]
```

- Endpoint: `POST /api/opportunities`
- Reason: Create a new sales deal.
- Request Body:
```json
{
  "name": "Big Deal",
  "amount": 50000,
  "accountId": "uuid",
  "pipelineStageId": "uuid"
}
```
- Response:
```json
{
  "id": "uuid",
  "name": "Big Deal",
  "amount": 50000,
  "accountId": "uuid",
  "pipelineStageId": "uuid"
}
```

- Endpoint: `PATCH /api/opportunities/:id`
- Reason: Move deal in pipeline, or update probability/amount.
- Request Body:
```json
{
  "pipelineStageId": "new_uuid",
  "probability": 80
}
```
- Response:
```json
{
  "id": "uuid",
  "name": "Big Deal",
  "amount": 50000,
  "probability": 80,
  "accountId": "uuid",
  "pipelineStageId": "new_uuid"
}
```

- Endpoint: `GET /api/pipeline`
- Reason: Generate the Kanban board view showing all stages and their corresponding nested opportunities.
- Request Body: None
- Response:
```json
[
  {
    "id": "uuid",
    "name": "Prospecting",
    "opportunities": [
      {
        "id": "uuid",
        "name": "Big Deal",
        "amount": 50000
      }
    ]
  }
]
```

- Endpoint: `GET /api/pipeline/stages`
- Reason: Fetch the ordered sequence of sales stages.
- Request Body: None
- Response:
```json
[
  {
    "id": "uuid",
    "name": "Prospecting",
    "sequence": 1
  },
  {
    "id": "uuid",
    "name": "Qualification",
    "sequence": 2
  }
]
```

### 📄 Quotes (Private)

- Endpoint: `GET /api/quotes`
- Reason: List all generated price quotes.
- Request Body: None
- Response:
```json
[
  {
    "id": "uuid",
    "quoteNumber": "Q-001",
    "opportunityId": "uuid"
  }
]
```

- Endpoint: `POST /api/quotes`
- Reason: Generate a new quote for an opportunity.
- Request Body:
```json
{
  "quoteNumber": "Q-002",
  "opportunityId": "uuid",
  "totalAmount": 4500
}
```
- Response:
```json
{
  "id": "uuid",
  "quoteNumber": "Q-002",
  "opportunityId": "uuid",
  "totalAmount": 4500,
  "status": "draft"
}
```

### 📢 Campaigns (Private)

- Endpoint: `GET /api/campaigns`
- Reason: List all marketing initiatives and campaigns.
- Request Body: None
- Response:
```json
[
  {
    "id": "uuid",
    "name": "Spring Launch",
    "budget": 10000
  }
]
```

- Endpoint: `POST /api/campaigns`
- Reason: Launch a new marketing campaign.
- Request Body:
```json
{
  "name": "Summer Promos",
  "budget": 5000,
  "startDate": "2026-06-01"
}
```
- Response:
```json
{
  "id": "uuid",
  "name": "Summer Promos",
  "budget": 5000,
  "startDate": "2026-06-01"
}
```

- Endpoint: `POST /api/campaigns/:id/members`
- Reason: Add a Lead or Contact to a marketing campaign list.
- Request Body:
```json
{
  "memberId": "uuid",
  "type": "contact"
}
```
- Response: None

### 🎟️ Support Tickets (Private)

- Endpoint: `GET /api/tickets`
- Reason: View all active support cases.
- Request Body: None
- Response:
```json
[
  {
    "id": "uuid",
    "subject": "Login Issue",
    "description": "I cannot login",
    "status": "open"
  }
]
```

- Endpoint: `POST /api/tickets`
- Reason: Open a new support ticket.
- Request Body:
```json
{
  "subject": "Billing Error",
  "description": "Overcharged by $5"
}
```
- Response:
```json
{
  "id": "uuid",
  "subject": "Billing Error",
  "description": "Overcharged by $5",
  "status": "open"
}
```

- Endpoint: `GET /api/tickets/:id/messages`
- Reason: Fetch the conversation/reply history for a specific ticket.
- Request Body: None
- Response:
```json
[
  {
    "id": "uuid",
    "message": "Investigating...",
    "senderType": "agent"
  }
]
```

- Endpoint: `POST /api/tickets/:id/messages`
- Reason: Post a new reply to a ticket (from an agent or customer).
- Request Body:
```json
{
  "message": "Please try again now.",
  "senderType": "agent"
}
```
- Response: None

### 🎁 Products (Private)

- Endpoint: `GET /api/products`
- Reason: List all products/services available for quotes and opportunities.
- Request Body: None
- Response:
```json
[
  {
    "id": "uuid",
    "name": "CRM License",
    "price": 99.99,
    "category": "Software"
  }
]
```

- Endpoint: `POST /api/products`
- Reason: Add a new item to the product catalog system.
- Request Body:
```json
{
  "name": "Premium Support",
  "price": 500,
  "category": "Service"
}
```
- Response:
```json
{
  "id": "uuid",
  "name": "Premium Support",
  "price": 500,
  "category": "Service"
}
```

### 📅 Activities (Private)

- Endpoint: `GET /api/activities`
- Reason: Fetch the global activity log (Calls, Emails, meetings, tasks).
- Request Body: None
- Response:
```json
[
  {
    "id": "uuid",
    "type": "call",
    "subject": "Discovery Call",
    "activityDate": "2026-03-14T10:00:00Z"
  }
]
```

- Endpoint: `POST /api/activities`
- Reason: Log a newly completed activity to a record.
- Request Body:
```json
{
  "type": "email",
  "subject": "Sent pricing sheet",
  "accountId": "uuid"
}
```
- Response:
```json
{
  "id": "uuid",
  "type": "email",
  "subject": "Sent pricing sheet",
  "accountId": "uuid"
}
```

- Endpoint: `PUT /api/activities/:id`
- Reason: Correct or update an existing activity log details.
- Request Body:
```json
{
  "subject": "Discovery Call (Updated)",
  "activityDate": "2026-03-15T10:00:00Z"
}
```
- Response:
```json
{
  "id": "uuid",
  "type": "call",
  "subject": "Discovery Call (Updated)",
  "activityDate": "2026-03-15T10:00:00Z"
}
```

- Endpoint: `DELETE /api/activities/:id`
- Reason: Remove an activity entry from history.
- Request Body: None
- Response: None

---

## 🚀 Deployment

The project is configured for easy deployment to **Vercel**.

1.  Ensure `vercel.json` and `api/index.ts` are present.
2.  Configure environment variables in the Vercel dashboard.
3.  Push to your repository to trigger the automated build.
