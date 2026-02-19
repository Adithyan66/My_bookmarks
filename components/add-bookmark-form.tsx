'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { validateBookmark } from '@/lib/validate'

export default function AddBookmarkForm({ userId }: { userId: string }) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const result = validateBookmark(url, title)
    if (!result.ok) {
      toast.error(result.message)
      return
    }
    const { data: { user } } = await supabase.auth.getUser()
console.log("Auth user:", user?.id)
console.log("Prop userId:", userId)
const { data: sessionData } = await supabase.auth.getSession()
console.log(sessionData.session)


    setLoading(true)
    const { error } = await supabase.from('bookmarks').insert({
      user_id: userId,
      url: url.trim(),
      title: title.trim(),
    })
    setLoading(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Bookmark added')
    setUrl('')
    setTitle('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
          disabled={loading}
        />
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading ? 'Adding…' : 'Add'}
        </button>
      </div>
    </form>
  )
}
