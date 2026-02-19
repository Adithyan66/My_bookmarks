'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import type { Bookmark } from '@/lib/types'
import AddBookmarkForm from './add-bookmark-form'
import BookmarkItem from './bookmark-item'

export default function BookmarkList({
  initialBookmarks,
  userId,
}: {
  initialBookmarks: Bookmark[]
  userId: string
}) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
  const [isHydrated, setIsHydrated] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    setBookmarks(initialBookmarks)
    setIsHydrated(true)
  }, [initialBookmarks])

  useEffect(() => {
    const channel = supabase
      .channel('bookmarks')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookmarks((prev) => [payload.new as Bookmark, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setBookmarks((prev) =>
              prev.map((b) => (b.id === (payload.new as Bookmark).id ? (payload.new as Bookmark) : b))
            )
          } else if (payload.eventType === 'DELETE') {
            setBookmarks((prev) => prev.filter((b) => b.id !== (payload.old as Bookmark).id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, userId])

  if (!isHydrated) {
    return (
      <div className="space-y-4">
        <div className="h-[120px] animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-[72px] animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-[72px] animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-[72px] animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AddBookmarkForm userId={userId} />
      {bookmarks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 py-12 text-center dark:border-zinc-700 dark:bg-zinc-900/50">
          <p className="text-zinc-600 dark:text-zinc-400">No bookmarks yet</p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
            Add one using the form above
          </p>
          <div className="mt-6 flex justify-center">
            <Image
              src="/images/pointingUp.png"
              alt="Pointing up"
              width={200}
              height={200}
              className="h-auto w-auto"
            />
          </div>
        </div>
      ) : (
        <ul className="space-y-3">
          {bookmarks.map((bookmark) => (
            <BookmarkItem
              key={bookmark.id}
              bookmark={bookmark}
              userId={userId}
              onUpdate={(updated) =>
                setBookmarks((prev) =>
                  prev.map((b) => (b.id === updated.id ? updated : b))
                )
              }
              onRemove={() =>
                setBookmarks((prev) => prev.filter((b) => b.id !== bookmark.id))
              }
            />
          ))}
        </ul>
      )}
    </div>
  )
}
