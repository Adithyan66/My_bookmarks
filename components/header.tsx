'use client'

import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Header({ user }: { user: User }) {
  const router = useRouter()
  const supabase = createClient()

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/95">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Smart Bookmark
        </h1>
        <div className="flex items-center gap-3">
          <span className="max-w-[120px] truncate text-sm text-zinc-500 dark:text-zinc-400">
            {user.email}
          </span>
          <button
            type="button"
            onClick={signOut}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
