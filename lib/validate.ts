export function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export function validateBookmark(url: string, title: string): { ok: true } | { ok: false; message: string } {
  const t = title.trim()
  if (!t) return { ok: false, message: 'Title is required' }
  if (!isValidUrl(url.trim())) return { ok: false, message: 'Please enter a valid URL (e.g. https://example.com)' }
  return { ok: true }
}
