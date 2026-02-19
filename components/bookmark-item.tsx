'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Bookmark } from '@/lib/types'
import { validateBookmark, normalizeUrl } from '@/lib/validate'
import ConfirmationModal from './confirmation-modal'

export default function BookmarkItem({
  bookmark,
  userId,
  onUpdate,
  onRemove,
}: {
  bookmark: Bookmark
  userId: string
  onUpdate: (b: Bookmark) => void
  onRemove: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [editUrl, setEditUrl] = useState(bookmark.url)
  const [editTitle, setEditTitle] = useState(bookmark.title)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const supabase = createClient()

  async function handleSave() {
    const result = validateBookmark(editUrl, editTitle)
    if (!result.ok) {
      toast.error(result.message)
      return
    }
    setSaving(true)
    const { data, error } = await supabase
      .from('bookmarks')
      .update({ url: normalizeUrl(editUrl), title: editTitle.trim() })
      .eq('id', bookmark.id)
      .eq('user_id', userId)
      .select()
      .single()
    setSaving(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Bookmark updated')
    if (data) onUpdate(data as Bookmark)
    setEditing(false)
  }

  async function handleDelete() {
    setDeleting(true)
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', bookmark.id)
      .eq('user_id', userId)
    setDeleting(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Bookmark removed')
    onRemove()
  }

  if (editing) {
    return (
      <li className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto]">
          <input
            type="text"
            value={editUrl}
            onChange={(e) => setEditUrl(e.target.value)}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800"
            disabled={saving}
          />
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800"
            disabled={saving}
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button
            type="button"
            onClick={() => {
              setEditing(false)
              setEditUrl(bookmark.url)
              setEditTitle(bookmark.title)
            }}
            disabled={saving}
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
        </div>
      </li>
    )
  }

  return (
    <li className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="min-w-0 flex-1">
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block truncate font-medium text-zinc-900 hover:underline dark:text-zinc-100"
        >
          {bookmark.title}
        </a>
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-0.5 block truncate text-sm text-zinc-500 hover:underline dark:text-zinc-400"
        >
          {bookmark.url}
        </a>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          disabled={deleting}
          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          disabled={deleting}
          className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
        >
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Bookmark"
        message={`Are you sure you want to delete "${bookmark.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </li>
  )
}
