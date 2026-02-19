'use client'

import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import ConfirmationModal from './confirmation-modal'

export default function Header({ user }: { user: User }) {
  const router = useRouter()
  const supabase = createClient()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/95">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 dark:from-zinc-100 dark:via-zinc-300 dark:to-zinc-100 bg-clip-text text-transparent tracking-tight">
            Adiyo's Bookmark
          </h1>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            {user.email}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowLogoutModal(true)}
          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Logout
        </button>
      </div>
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={signOut}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        variant="default"
      />
    </header>
  )
}
