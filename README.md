# 🚀 Adiyo’s Bookmark

A minimal, real-time bookmark manager built with **Next.js App Router + Supabase**.  
Users can log in with Google, manage personal bookmarks, and see updates sync instantly across tabs.

> Built in 3 days while learning Next.js App Router for the first time.

🌍 **Live Demo:** https://my-bookmarks-chi.vercel.app  

---

## ✨ Features

- 🔐 Google OAuth login (Supabase Auth)
- 📌 Create / Edit / Delete bookmarks
- 👤 Per-user data isolation using Row Level Security (RLS)
- ⚡ Real-time updates using Supabase Realtime
- 🖥️ Server-side initial load (SSR) for fast first render
- 🍪 Proper session handling with App Router + cookies

---

## 🛠 Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **Supabase**
  - Auth
  - Postgres
  - Realtime
  - `@supabase/ssr`
  - `@supabase/supabase-js`
- **Tailwind CSS**
- **Sonner** (toast notifications)
- **Vercel** (deployment)

---

# 🧠 Why I Built This

I’m already comfortable with React, but this was my first serious project using **Next.js App Router**.

Instead of just watching tutorials, I built something real — with SSR, OAuth, middleware, realtime database, and database-level security.

---

# 📅 3-Day Build Timeline

## Day 1–2 → Learning Phase

- Server vs Client Components
- App Router file structure
- Route Handlers
- Cookies & session patterns
- Redirect mechanics
- Middleware behavior

The biggest shift was understanding server-first rendering compared to traditional React SPA architecture.

---

## Day 3 → Implementation

- Integrated Supabase Auth (Google OAuth)
- Built protected dashboard
- Implemented full CRUD flow
- Added Realtime sync
- Secured database with RLS
- Deployed to Vercel

---

# 🧩 Key Problems & Solutions

## 1️⃣ Server vs Client Responsibilities

- Initial bookmark fetch happens in a **Server Component**
- UI interactions and realtime subscription handled in **Client Components**
- Clear separation improved performance and architecture clarity

---

## 2️⃣ Auth + Session with SSR

- Used `@supabase/ssr` for cookie handling
- Validated user server-side
- Redirected unauthenticated users before rendering dashboard
- Prevented protected content flash

---

## 3️⃣ Protected Routes + Middleware

- Implemented middleware session refresh
- Ensured proper redirect behavior
- Fixed “logged out on refresh” issues

---

## 4️⃣ OAuth Callback Handling

Created:

app/auth/callback/route.ts


- Exchanges OAuth code for session
- Redirects securely into the app

---

## 5️⃣ Database Security (RLS)

Row Level Security policies ensure:

- Users can only access their own bookmarks
- All filtering is enforced at database level

---

## 6️⃣ Realtime Without Complex State Management

- Subscribed to Postgres changes
- Filtered by `user_id`
- Updated local state on INSERT / UPDATE / DELETE
- Achieved cross-tab sync without Redux

---

# 🏗 Project Structure

app/
├─ login/
├─ dashboard/
├─ auth/
│ └─ callback/
├─ middleware.ts
supabase/
├─ schema.sql


---

# ⚙️ Local Setup

## 1️⃣ Install Dependencies

```bash
npm install
2️⃣ Create Supabase Project
Create project

Enable Google Provider in Authentication

Configure redirect URLs

3️⃣ Run Database Schema + RLS
Execute:

supabase/schema.sql
4️⃣ Enable Realtime Replication
In Supabase:

Database → Realtime

Enable replication for bookmarks table

5️⃣ Environment Variables
Create .env.local:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
6️⃣ Run Development Server
npm run dev
🚀 Deployment (Vercel)
Add environment variables in Vercel

Add Vercel domain to Supabase Auth redirect URLs

Add same redirect URL in Google OAuth settings

Redeploy

📸 Screenshots
(Add screenshots later inside a /screenshots folder if needed.)

💡 What This Project Demonstrates
Understanding of Next.js App Router architecture

Secure SSR authentication patterns

OAuth flow handling

Database-level security (RLS)

Real-time systems

Production-ready deployment

🔭 Future Improvements
Bookmark categories / tags

Optimistic UI layer

Metadata preview fetching

Test coverage

Extract reusable auth utilities

Final Note
This project marks my transition from building client-heavy React apps
to designing full-stack, secure, SSR-first applications with Next.js.

