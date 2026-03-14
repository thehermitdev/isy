# 🎨 ISY CRM Frontend

Stunning, highly interactive CRM user interface built with **React 19**, **Vite**, and **Tailwind CSS 4**. This application delivers a premium, data-driven experience for managing customers, sales pipelines, and support tickets.

---

## ✨ Features

-   **Unified CRM View**: Manage Accounts, Contacts, and Leads from a single dashboard.
-   **Sales Pipeline**: Drag-and-drop opportunity management using `@dnd-kit`.
-   **Real-time Insights**: Visual data representation with `recharts`.
-   **Support Ticket Center**: Full conversation history for customer issues.
-   **Responsive Design**: Fluid layouts optimized for all screen sizes.
-   **State Management**: Optimized data fetching and global state with **TanStack Query** and **Zustand**.

---

## 🛠️ Tech Stack

-   **Framework**: [React 19](https://react.dev/)
-   **Build Tool**: [Vite 8](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
-   **Data Fetching**: [TanStack Query v5](https://tanstack.com/query)
-   **API Client**: [Axios](https://axios-http.com/)
-   **Validation**: [Zod](https://zod.dev/)
-   **State**: [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
-   **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚦 Getting Started

### 1. Installation
```bash
cd frontend
pnpm install
```

### 2. Environment Variables
Create a `.env` file in the `frontend` directory:
```env
VITE_API_BASE_URL=http://localhost:3001
```

### 3. Development Mode
```bash
pnpm dev
```
The app will be available at `http://localhost:5173`.

---

## 🧪 Comprehensive API & Integration Testing Guide

This guide ensures that the frontend correctly integrates with every endpoint defined in the backend's `routes.ts`.

### 1. Integration Architecture
Frontend-Backend communication is centralized in `src/services/`:
-   **`api.ts`**: Configures the Axios instance with interceptors for attaching the **Supabase JWT** and handling `401 Unauthorized` globally.
-   **Module Services**: Files like `accountService.ts` and `contactService.ts` map frontend calls to backend endpoints.

### 2. Testing Procedure for Every Endpoint

To verify that the frontend can successfully talk to every backend endpoint, follow these steps:

#### Step 1: Authentication Heat-check
1.  **Sign-in Flow**: Use the Login page. 
    *   *Verify*: Check LocalStorage for `isy_access_token`. 
    *   *Backend Point*: `POST /api/auth/signin`
2.  **Profile Load**: Refresh the page.
    *   *Verify*: Check if the user profile displays correctly in the sidebar/header.
    *   *Backend Point*: `GET /api/auth/me`

#### Step 2: Data Retrieval (GET Endpoints)
Navigate through each page to trigger the following:
-   **Dashboard**: `GET /api/activities`, `GET /api/pipeline`
-   **Accounts**: `GET /api/accounts`
-   **Contacts**: `GET /api/contacts`
-   **Leads**: `GET /api/leads`
-   **Products**: `GET /api/products`
-   **Support**: `GET /api/tickets`

**Verification Checklist**:
- [ ] No "Spinner" lasts forever (Check for 500 errors).
- [ ] Data renders in tables/grids exactly as expected.
- [ ] Browser DevTools -> Network Tab: Status Code `200 OK`.

#### Step 3: Mutation Operations (POST/PUT/PATCH/DELETE)
Perform actions in the UI and verify backend response:

| UI Action | Backend Endpoint | Success Criteria |
| :--- | :--- | :--- |
| **Create Account** | `POST /api/accounts` | New row appears in table immediately. |
| **Edit Contact** | `PATCH /api/contacts/:id` | Data updates in the list/detail view. |
| **Move Opportunity** | `PATCH /api/opportunities/:id` | Column changes on Kanban board. |
| **Reply to Ticket** | `POST /api/tickets/:id/messages` | Message appears in the chat thread. |
| **Delete Activity** | `DELETE /api/activities/:id` | Activity disappears from timeline. |

### 3. Debugging Integration Issues

If an endpoint is not working as expected:

1.  **Check the Request**: 
    - Is the `Authorization` header present? 
    - Is the URL correct (e.g., `/api/accounts` vs `/accounts`)?
2.  **Check the JSON Payload**:
    - Does it match the character case? (e.g., `firstName` in frontend vs `first_name` in DB? *Note: Services should handle this mapping*).
3.  **Handle Network Failures**:
    - Ensure the backend is running at `http://localhost:3001`.
    - Check the `vite.config.ts` proxy settings if you encounter CORS issues.

---

## 🏗️ Folder Structure

-   `src/components/`: Atomized UI components (Atoms, Molecules, Organisms).
-   `src/pages/`: Route-level views.
-   `src/hooks/`: Custom React hooks for business logic.
-   `src/services/`: API communication layer.
-   `src/store/`: Zustand stores for global state.
-   `src/types/`: TypeScript interfaces and Zod schemas.

---

## 🚀 Build for Production

```bash
pnpm build
```
The output will be generated in the `dist/` folder, ready for deployment to Vercel or any static hosting provider.
