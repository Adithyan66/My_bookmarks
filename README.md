# Smart Bookmark

Bookmark manager with Google sign-in and real-time sync (Next.js App Router, Supabase, Tailwind).

## Setup

1. Create a [Supabase](https://supabase.com) project and enable Google Auth in Authentication > Providers.
2. In Supabase SQL Editor, run the schema in `supabase/schema.sql`.
3. In Database > Realtime, enable replication for the `bookmarks` table.
4. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. `npm install` then `npm run dev`.

## Deploy on Vercel

Set the same env vars in the Vercel project. Add your Vercel site URL to Supabase Auth redirect URLs and to Google OAuth authorized redirect URIs.
