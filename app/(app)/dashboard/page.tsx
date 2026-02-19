import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BookmarkList from '@/components/bookmark-list'
import type { Bookmark } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <BookmarkList
      initialBookmarks={(bookmarks ?? []) as Bookmark[]}
      userId={user.id}
    />
  )
}
