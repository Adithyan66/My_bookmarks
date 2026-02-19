'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { validateBookmark, normalizeUrl } from '@/lib/validate'

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
      url: normalizeUrl(url),
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border-0 border-b-2 border-zinc-300 bg-transparent px-0 py-2 text-sm outline-none transition-colors focus:border-zinc-900 dark:border-zinc-700 dark:focus:border-zinc-100"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-gradient-to-r from-zinc-900 to-zinc-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-zinc-900/20 transition-all duration-200 hover:from-zinc-800 hover:to-zinc-600 hover:shadow-xl hover:shadow-zinc-900/30 hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 dark:from-zinc-100 dark:to-zinc-300 dark:text-zinc-900 dark:shadow-zinc-100/20 dark:hover:from-zinc-200 dark:hover:to-zinc-400 dark:hover:shadow-zinc-100/30"
        >
          {loading ? 'Adding…' : 'Add'}
        </button>
      </div>
      <div>
        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full border-0 border-b-2 border-zinc-300 bg-transparent px-0 py-2 text-sm outline-none transition-colors focus:border-zinc-900 dark:border-zinc-700 dark:focus:border-zinc-100"
          disabled={loading}
        />
      </div>
    </form>
  )
}
