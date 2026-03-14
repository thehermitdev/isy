# ISY CRM — Integrated Sales & Support Platform

ISY CRM is a high-performance, enterprise-grade Customer Relationship Management system built with a focus on **Liquid Glass** design aesthetics and a robust **Clean Architecture** backend. It features predictive analytics, a dynamic sales pipeline, and a modern Apple-inspired user interface for managing accounts, leads, opportunities, campaigns, quotes, products, and support tickets.

## 🚀 Key Features
- **Liquid Glass UI**: Stunning frosted glass effects, mesh gradients, and spring micro-interactions
- **Enterprise Auth**: Secure sign-in/sign-up powered by Supabase Auth
- **Dynamic Sales Pipeline**: High-performance drag-and-drop opportunity management
- **Complete CRM Module**: Manage accounts, leads, opportunities, campaigns, quotes, products, and support tickets
- **Real-time Dashboard**: Real-time data visualization with sophisticated dark-mode charts
- **Clean Architecture**: Decoupled domain logic from infrastructure for maximum testability

---

## 🛠 Technology Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: **TailwindCSS v4** (Theme Tokens) + **Vanilla CSS** (Component Utilities)
- **Design System**: **Liquid Glass** (Glassmorphism, Bokeh effects, Spring animations)
- **Architecture**: **Atomic Design** (Atoms, Molecules, Organisms, Templates, Pages)
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v7 (Data Router)
- **Visuals**: Recharts (Analytics), Lucide React (Icons)

### Backend
- **Framework**: Fastify (Node.js)
- **Architecture**: **Clean Architecture** (Decoupled Domain, Application, and Infrastructure layers)
- **Database**: PostgreSQL (via Supabase)
- **Auth**: Supabase Auth with JWT & RLS
- **Validation**: Zod (Type-safe schema validation)
- **Communication**: RESTful API with Axios Interceptors

---

## 📋 Prerequisites

- **Node.js** v18 or higher
- **pnpm** package manager (`npm install -g pnpm`)
- **Git** for version control
- **Docker** (required for local Supabase)

---

## 🏁 Complete Setup Guide

### Step 1: Clone the Repository

```bash
git clone https://github.com/thehermitdev/isy.git
cd isy
```

### Step 2: Install Dependencies

```bash
# Install all dependencies for both frontend and backend
pnpm install
```

### Step 3: Set Up Local Supabase Database

#### Install Supabase CLI

```bash
# Using npm globally
npm install -g supabase

# Or using your package manager
# macOS with Homebrew: brew install supabase/tap/supabase
# Windows with Scoop: scoop install supabase
```

#### Start Local Supabase Instance

```bash
# From the project root directory
pnpm supabase start
```

This command will:
- Start a local PostgreSQL database in Docker
- Start local Supabase services (Auth, PostgREST, Storage, etc.)
- Output connection details and API URLs
- Display credentials for your `.env` files

**Example output:**
```
Seeding data SQL.
Supabase local development setup is running.

API URL: http://127.0.0.1:54321
DB URL: postgresql://postgres:postgres@127.0.0.1:5432/postgres
Anon key: sb_publishable_XXXXXXXXXXXXXXXXXXXXXXXXXXXX
Service role key: sb_secret_XXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Step 4: Configure Environment Variables

#### Backend Configuration

Create/update `backend/.env`:

```env
# Supabase Configuration (use values from 'pnpm supabase start' output)
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=sb_publishable_XXXXXXXXXXXXXXXXXXXXXXXXXXXX
SUPABASE_SERVICE_ROLE=sb_secret_XXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Server Configuration
PORT=3001
HOST=0.0.0.0
NODE_ENV=development
LOG_LEVEL=info

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

#### Frontend Configuration

Create/update `frontend/.env`:

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api

# Supabase Configuration
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=sb_XXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Step 5: Run the Application

```bash
# From the project root, start both backend and frontend
pnpm run dev
```

This will start:
- **Backend**: http://localhost:3001 with hot-reload
- **Frontend**: http://localhost:5173 (or available port) with hot-reload

**Or run separately:**

```bash
# Terminal 1: Backend
cd backend && pnpm run dev

# Terminal 2: Frontend
cd frontend && pnpm run dev
```

### Step 6: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **Local Supabase Console**: http://127.0.0.1:54321 (admin panel)

---

## 📖 Usage Guide

### Authentication Flow
1. Open http://localhost:5173
2. Click **Sign Up** to create a new account with name, email, and password
3. Click **Sign In** to authenticate with your credentials
4. Access your personalized dashboard
5. Use **Sign Out** from the profile menu to log out

### Sales Pipeline
- Navigate to **Pipeline** module
- Drag and drop Opportunity cards between stages (e.g., *Prospecting* → *Qualification*)
- Changes are persisted immediately to the backend

### Managing CRM Data
- **Accounts**: View, create, and manage company accounts
- **Leads**: Track potential leads and convert them to opportunities
- **Opportunities**: Manage sales opportunities through different pipeline stages
- **Campaigns**: Create and manage marketing campaigns
- **Quotes**: Generate and manage sales quotes
- **Products**: Maintain product catalog
- **Contacts**: Store and manage contact information
- **Support**: Track and manage customer support tickets

---

## 🗄️ Database Management

### View and Manage Data

Access the local Supabase admin interface:
```bash
# Visit this URL after 'pnpm supabase start'
http://127.0.0.1:54321
# Default credentials: email: supabase@localhost, password: postgres
```

### Database Migrations

Manage schema changes through Supabase migrations:

```bash
# Create a new migration
pnpm supabase migration new migration_name

# Apply pending migrations
pnpm supabase db push

# Reset database to initial state (caution: deletes all data)
pnpm supabase db reset
```

Existing migrations are located in: `supabase/migrations/`

### Seed Data

Initial seed data is automatically applied from: `supabase/seed.sql`

---

## 📁 Project Structure

```
isy/
├── backend/                    # Fastify Backend (Clean Architecture)
│   ├── src/
│   │   ├── domain/             # Entities & Repository Interfaces
│   │   ├── application/        # Use Cases & Service Layer
│   │   ├── infrastructure/     # Supabase & Persistence Implementations
│   │   ├── interfaces/         # HTTP Handlers (Fastify Routes)
│   │   ├── core/               # Shared logic, Exceptions, Middleware
│   │   └── server/             # App initialization & Plugin registration
│   └── api/                    # Vercel Serverless Entrypoint
│
├── frontend/                   # React Frontend (Atomic Design)
│   ├── src/
│   │   ├── atoms/              # Smallest UI units (Buttons, Inputs)
│   │   ├── molecules/          # Combinations of atoms (FormGroups, SearchBars)
│   │   ├── organisms/          # Complex UI components (Sidebar, Tables, Charts)
│   │   ├── templates/          # Layout structures (DashboardLayout, AuthLayout)
│   │   ├── pages/              # High-level views (Pipeline, Accounts, CRM)
│   │   ├── services/           # API Client & Query Hooks
│   │   ├── types/              # TypeScript Interfaces & Enums
│   │   └── index.css           # Liquid Glass Design System (Tailwind v4)
│
├── supabase/                   # Database & Cloud Config
│   ├── migrations/             # Incremental Schema Migrations
│   └── seed.sql                # Rich Demo Data for Testing
│
├── pnpm-workspace.yaml         # Monorepo Orchestration
└── package.json                # Root Scripts
```

---

## 🏗️ Implementation Deep Dive

ISY CRM is engineered with a focus on code maintainability, type safety, and premium user experience.

### 1. Backend: Clean Architecture
The backend follows Uncle Bob's Clean Architecture, ensuring the business logic remains independent of the database and web framework.

- **Domain Layer**: Contains pure business entities (e.g., `Account`, `Lead`) and Repository interfaces. It has zero dependencies on frameworks.
- **Application Layer**: Orchestrates use cases (e.g., `CreateOpportunity`, `ConvertLead`). This is where the core business rules live.
- **Infrastructure Layer**: Implements technical details. We use `SupabaseRepository` implementations to interact with PostgreSQL via the Supabase client.
- **Interface Layer**: Fastify routes and controllers. Handles HTTP requests, parses inputs using **Zod schemas**, and maps results to appropriate status codes.

### 2. Frontend: Atomic Design & Liquid Glass
The UI implementation prioritizes visual excellence and modularity.

- **Atomic Design**: Components are broken down into five levels. This ensures high reusability and a "Lego-like" developer experience.
- **Design System (Liquid Glass)**: 
  - Uses **TailwindCSS v4**'s new `@theme` configuration for semantic tokens (colors, shadows, spacing).
  - Implements complex **Glassmorphism** using `backdrop-filter`, `radial-gradients` for mesh backgrounds, and sophisticated `box-shadow` hierarchies.
  - Supports **Dark Mode** natively via CSS custom properties defined in the `@theme` block.
- **Unified Relationship Management**: A specialized pattern used in the Relationships module to manage Account, Contact, and Lead entities within a single, cohesive interface. It uses URL-synced tab state and generic modal handlers to streamline CRUD operations across different CRM entities.
- **Data Flow**: 
  - **TanStack Query** handles all server state, providing automatic caching, revalidation, and loading states.
  - **Axios Interceptors** automatically attach authentication tokens to every request.

### 3. Database: Supabase & RLS
We leverage Supabase's powerful PostgreSQL features to ensure data integrity and security.

- **Migrations**: Every schema change is version-controlled in `supabase/migrations`.
- **Row Level Security (RLS)**: Crucial for multi-tenant security. Policies (e.g., `user_id = auth.uid()`) are applied at the database level, ensuring users can only access their own CRM data even if the application layer has a bug.
- **Triggers**: Automated tasks (like updating `updated_at` timestamps) are handled by PostgreSQL triggers to guarantee consistency.

---

---

## 🔄 Development Workflow

### Running Development Servers

```bash
# Start both frontend and backend from root
pnpm run dev

# Or start services individually
cd backend && pnpm run dev    # Backend on port 3001
cd frontend && pnpm run dev   # Frontend on port 5173
```

### Building for Production

```bash
# Build backend
cd backend && pnpm run build

# Build frontend
cd frontend && pnpm run build
```

### Code Quality

```bash
# Lint code
pnpm run lint

# Type checking
pnpm run type-check
```

---

## 🔐 Authentication

The application uses **Supabase Authentication** with JWT tokens:

1. Users register/login via `/api/auth/signup` or `/api/auth/signin`
2. Backend returns `access_token` in the session
3. Frontend stores token in localStorage as `isy_token`
4. All protected endpoints require `Authorization: Bearer {token}` header
5. Backend validates tokens using Supabase's anon key

**Protected Endpoints:**
All API endpoints except `/api/auth/signup`, `/api/auth/signin`, and `/health` require authentication.

---

## ☁️ Deployment Guide

Complete step-by-step instructions for deploying to **Supabase Cloud** (database) and **Vercel** (frontend & backend).

### Prerequisites for Deployment

- GitHub account with your repository pushed
- Supabase account (https://supabase.com)
- Vercel account (https://vercel.com)
- Your project pushed to GitHub main branch

---

## 1️⃣ Deploy Supabase Database

### Step 1: Create Supabase Project

1. Visit https://supabase.com and sign in
2. Click **New Project**
3. Configure:
   - **Name**: `isy-crm` (or your preference)
   - **Region**: Choose closest to your users (e.g., `us-east-1`)
   - **Password**: Generate secure database password
4. Click **Create new project** and wait for initialization (2-5 minutes)

### Step 2: Get Project Credentials

Once your project is ready:

1. Go to **Settings** → **API**
2. Copy these values (you'll need them for backend):
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE`

Example:
```
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIs...
```

### Step 3: Run Database Migrations

From your local machine, apply your database schema to Supabase Cloud:

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link your local project to Supabase Cloud
supabase link --project-ref your-project-ref

# When prompted, enter your database password from Step 1

# Push all migrations to cloud
supabase db push
```

**Note**: Replace `your-project-ref` with the first part of your SUPABASE_URL (before `.supabase.co`)

Example: If SUPABASE_URL is `https://abcdefghijklmnop.supabase.co`, the ref is `abcdefghijklmnop`

### Step 4: Verify Database

1. In Supabase dashboard, go to **SQL Editor**
2. You should see your tables: `accounts`, `leads`, `opportunities`, `campaigns`, `products`, `contacts`, `quotes`, `tickets`, `users`
3. Verify data was seeded (if applicable) - you can run sample queries

---

## 2️⃣ Deploy Backend to Vercel

### Step 1: Configure Backend for Vercel

Vercel can run Fastify using serverless functions. Update your backend configuration:

**File**: `backend/vercel.json`

```json
{
  "buildCommand": "pnpm install && pnpm run build",
  "outputDirectory": "dist",
  "devCommand": "pnpm run dev",
  "env": {
    "NODE_ENV": "production"
  }
}
```

**File**: `backend/package.json` - Ensure build script exists:

```json
{
  "scripts": {
    "build": "tsc",
    "dev": "tsx src/server.ts",
    "start": "node dist/server.js"
  }
}
```

### Step 2: Push Code to GitHub

```bash
git add .
git commit -m "Configure for cloud deployment"
git push origin main
```

### Step 3: Deploy Backend to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. Visit https://vercel.com and sign in
2. Click **Add New** → **Project**
3. **Import Git Repository**:
   - Select your GitHub repository (authorize if needed)
   - Select your ISY repository
4. **Configure Project**:
   - **Project Name**: `isy-backend`
   - **Framework Preset**: Select "Other" or "Node.js"
   - **Root Directory**: `backend`
5. **Environment Variables** - Add these:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE=your_service_role_key_here
   CORS_ORIGIN=https://your-frontend-url.vercel.app
   NODE_ENV=production
   PORT=3001
   ```
   (Get SUPABASE values from Step 1 above)

6. Click **Deploy** and wait for build to complete (2-5 minutes)

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project root
cd backend
vercel

# Follow prompts to:
# 1. Link project
# 2. Confirm directory (backend)
# 3. Accept defaults
# 4. Add environment variables in dashboard after deployment

# Get your backend URL - looks like:
# https://isy-backend-abc123.vercel.app
```

### Step 4: Verify Backend Deployment

```bash
# Test health endpoint (no auth needed)
curl https://your-backend-url.vercel.app/health

# Should return: {"status":"ok"}
```

---

## 3️⃣ Deploy Frontend to Vercel

### Step 1: Configure Frontend Environment

Update your frontend environment for production:

**File**: `frontend/.env.production`

Create new file with:
```env
VITE_API_URL=https://your-backend-url.vercel.app/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Also update `frontend/.env` for development:
```env
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=sb_publishable_XXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Step 2: Push Code to GitHub

```bash
git add .
git commit -m "Add frontend production environment"
git push origin main
```

### Step 3: Deploy Frontend to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. Visit https://vercel.com
2. Click **Add New** → **Project**
3. **Import Git Repository**:
   - Select your ISY repository
4. **Configure Project**:
   - **Project Name**: `isy-frontend`
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `dist`
5. **Environment Variables** - Add for production:
   ```
   VITE_API_URL=https://your-backend-url.vercel.app/api
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```
6. Click **Deploy**

#### Option B: Using Vercel CLI

```bash
cd frontend
vercel

# Follow prompts and add environment variables in dashboard
```

### Step 4: Verify Frontend Deployment

1. Open your frontend URL (looks like `https://isy-frontend-xyz.vercel.app`)
2. You should see the login page
3. Try signing up with a test account
4. After login, you should see the dashboard with data loading

---

## 🔧 Post-Deployment Configuration

### Update Backend CORS

After getting your frontend URL, update the backend:

1. Go to Vercel dashboard for backend
2. **Settings** → **Environment Variables**
3. Update `CORS_ORIGIN`:
   ```
   CORS_ORIGIN=https://your-frontend-url.vercel.app
   ```
4. **Deployments** → Redeploy latest with environment changes

### Configure Supabase Auth

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Enable desired auth methods (Email/Password is default)
3. Go to **Settings** → **Auth** → **Site URL**:
   ```
   https://your-frontend-url.vercel.app
   ```
4. Add **Redirect URLs**:
   ```
   https://your-frontend-url.vercel.app/auth
   https://your-frontend-url.vercel.app/dashboard
   ```

---

## 🔐 Security Checklist

Before going live, ensure:

- ✅ `SUPABASE_SERVICE_ROLE` is **only** in backend environment (never in frontend)
- ✅ `SUPABASE_ANON_KEY` is in both frontend and backend (this is safe, it's public)
- ✅ `CORS_ORIGIN` matches your frontend URL exactly
- ✅ All sensitive keys are in Vercel environment variables (never committed to git)
- ✅ `.env` files are in `.gitignore` (they should be)
- ✅ Database has Row Level Security (RLS) enabled for user isolation
- ✅ Backend validates all authentication tokens before processing requests

---

## 📊 Environment Variables Summary

### Production Backend (Vercel)
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ...  # Public, safe to expose
SUPABASE_SERVICE_ROLE=eyJ...  # KEEP SECRET
CORS_ORIGIN=https://your-frontend.vercel.app
NODE_ENV=production
PORT=3001
LOG_LEVEL=info
```

### Production Frontend (Vercel)
```env
VITE_API_URL=https://your-backend.vercel.app/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...  # Public, safe to expose
```

### Local Development
```env
# backend/.env
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE=sb_secret_...
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development

# frontend/.env
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=sb_publishable_...
```

---

## 🔄 Deployment Pipeline

### Automatic Deployments

Vercel automatically deploys when you push to GitHub `main` branch:

```bash
# Local development
git add .
git commit -m "Fix: issue description"
git push origin main

# Vercel automatically detects push and deploys
# Check status at https://vercel.com → Project Dashboard
```

### Rollback Deployment

If something breaks:

1. Go to Vercel project dashboard
2. **Deployments** tab
3. Click on previous working deployment
4. Click **...** → **Promote to Production**

---

## 🐛 Troubleshooting Deployment

### Backend Getting 500 Errors

**Solution**:
1. Check Vercel logs: **Project** → **Deployments** → Click failed deployment → **Logs**
2. Verify environment variables are set correctly
3. Ensure Supabase credentials are valid
4. Test with: `curl https://your-backend.vercel.app/health`

### Frontend Can't Connect to Backend

**Solution**:
1. Check browser DevTools → **Network** tab
2. Open failed request → **Headers** → Check URL
3. Verify `VITE_API_URL` matches backend URL exactly
4. Ensure backend `CORS_ORIGIN` matches frontend URL
5. Redeploy both with updated URLs

### Database Migrations Failed

**Solution**:
```bash
# Check migration status
supabase db pull

# View detailed error logs
supabase migrate list

# Manually apply if needed
supabase db push --dry-run  # See what would be applied
supabase db push            # Actually apply migrations
```

### Authentication Not Working

**Steps to debug**:
1. Try login in production
2. Check browser localStorage for `isy_token`
3. Go to DevTools → **Network** → Try API call
4. Check request headers for `Authorization: Bearer ...`
5. Check Supabase dashboard → **Auth** → **Users** to see if user was created

---

## 📈 Monitoring & Logs

### Backend Logs (Vercel)

1. Go to backend project on Vercel
2. **Deployments** → Select deployment
3. **Logs** tab shows real-time logs
4. Search for errors: "ERROR", "401", "500"

### Database Logs (Supabase)

1. Go to Supabase dashboard
2. **Logs** → **Database Logs**
3. View query performance and errors
4. **Auth Logs** → See authentication events

### Frontend Monitoring

1. Open production site
2. DevTools → **Console** tab
3. Look for any errors
4. Check **Network** tab for failed requests

---

## 🚀 Performance Optimization

### Frontend Optimization

```bash
# Check bundle size
cd frontend && pnpm run build

# View optimized size (should be < 200KB)
ls -lh dist/
```

### Backend Optimization

- Vercel serverless automatically scales
- Monitor response times in Vercel dashboard
- Use CloudFlare for edge caching (optional upgrade)

---

## 💰 Cost Estimates (March 2026)

### Vercel
- **Free Tier**: Up to 6,000 function invocations/day, unlimited bandwidth
- **Pro**: $20/month for faster builds
- Typical cost for small team: **Free to $20/month**

### Supabase
- **Free Tier**: 500 MB database, 2 GB bandwidth, 1 concurrent connection
- **Pro**: $25/month for scaling
- Typical cost for small team: **Free to $25/month**

**Total Estimated Monthly Cost**: **$0-50** (depending on scale)

4️⃣ Cloud Readiness & Production

### Deployment Steps

1. **Supabase Database**:
   - Create a new project at https://supabase.com
   - Apply migrations from `supabase/migrations/` to your project
   - Initialize Row Level Security (RLS) policies

2. **Backend Deployment** (e.g., Render, Railway, Vercel, or AWS):
   - Set environment variables: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE`, `CORS_ORIGIN`
   - Deploy using platform's recommended method
   - Update `CORS_ORIGIN` to production frontend URL

3. **Frontend Deployment** (e.g., Vercel, Netlify):
   - Build using `pnpm run build`
   - Set environment variables: `VITE_API_URL` (your backend URL)
   - Deploy to your hosting platform

---

## 🚀 Production Launch Checklist

Follow these steps for a successful cloud deployment:

### 1. Supabase Cloud (Database & Auth)
- [ ] Create a new project on [Supabase.com](https://supabase.com).
- [ ] Link your local CLI to the cloud project: `supabase link --project-ref your-ref`.
- [ ] Push schema: `supabase db push`.
- [ ] (Optional) Seed demo data: `psql -h db.your-ref.supabase.co -U postgres -f supabase/seed.sql`.
- [ ] Set "Site URL" in Auth Settings to your Vercel frontend URL.

### 2. Vercel Backend (API)
- [ ] Create a new project, select the `backend` directory as root.
- [ ] Set the following environment variables:
  - `SUPABASE_URL`: Your project URL.
  - `SUPABASE_ANON_KEY`: Public anon key.
  - `SUPABASE_SERVICE_ROLE`: **Private** service role key.
  - `CORS_ORIGIN`: Your frontend URL (e.g., `https://isy-crm.vercel.app`).
  - `NODE_ENV`: `production`.
- [ ] Deploy and copy the provided URL.

### 3. Vercel Frontend (UI)
- [ ] Create a new project, select the `frontend` directory as root.
- [ ] Set environment variables:
  - `VITE_API_URL`: Your backend URL (e.g., `https://isy-backend.vercel.app/api`).
  - `VITE_SUPABASE_URL`: Your Supabase URL.
  - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key.
- [ ] Deploy and verify the connection in the network tab.

---

## 🛠️ Troubleshooting

### Port Already in Use

```bash
# Windows: Kill process on port 3001
netstat -ano | findstr ":3001"
taskkill /PID <PID> /F

# macOS/Linux: Kill process on port
lsof -ti:3001 | xargs kill -9
```

### Supabase Connection Issues

```bash
# Check Supabase status
pnpm supabase status

# View Supabase logs
pnpm supabase logs

# Restart Supabase
pnpm supabase stop
pnpm supabase start
```

### Missing Environment Variables

Ensure both `.env` files are present and contain all required variables:
- `backend/.env` - Uses Supabase keys from `pnpm supabase start`
- `frontend/.env` - Uses same Supabase anon key

### Authentication 401 Errors

If getting 401 on API calls:
1. Verify `isy_token` exists in browser localStorage after login
2. Check backend logs for token validation errors
3. Ensure `SUPABASE_ANON_KEY` is correctly set in `backend/.env`
4. Verify frontend token is being sent: DevTools → Network → Check request headers

---

## 📚 Additional Documentation

- **Backend API Endpoints**: See [backend/README.md](backend/README.md)
- **Frontend API Requests**: See [frontend/README.md](frontend/README.md)
- **Supabase Documentation**: https://supabase.com/docs
- **Fastify Documentation**: https://www.fastify.io/docs/latest/
- **React Documentation**: https://react.dev
- **Vite Documentation**: https://vitejs.dev

---

## ⚖️ License

Enterprise Proprietary - ISY CRM Group.
