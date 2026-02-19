export function isValidUrl(url: string): boolean {
  const trimmed = url.trim()
  if (!trimmed) return false
  
  try {
    let urlToCheck = trimmed
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      urlToCheck = `https://${trimmed}`
    }
    
    if (urlToCheck.includes(':////') || urlToCheck.match(/https?:\/\/[^/]+\/\/+/)) {
      return false
    }
    
    const u = new URL(urlToCheck)
    
    if (u.protocol !== 'http:' && u.protocol !== 'https:') {
      return false
    }
    
    const hostname = u.hostname
    
    if (!hostname || hostname.length === 0) {
      return false
    }
    
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.')) {
      return true
    }
    
    if (!hostname.includes('.')) {
      return false
    }
    
    const hostnameParts = hostname.split('.')
    if (hostnameParts.length < 2) {
      return false
    }
    
    const tld = hostnameParts[hostnameParts.length - 1]
    if (tld.length < 2) {
      return false
    }
    
    const domainPattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/
    if (!domainPattern.test(hostname)) {
      return false
    }
    
    return true
  } catch {
    return false
  }
}

export function normalizeUrl(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return trimmed
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }
  return `https://${trimmed}`
}

export function validateBookmark(url: string, title: string): { ok: true } | { ok: false; message: string } {
  const t = title.trim()
  if (!t) return { ok: false, message: 'Title is required' }
  
  const urlTrimmed = url.trim()
  if (!urlTrimmed) return { ok: false, message: 'URL is required' }
  
  if (!isValidUrl(urlTrimmed)) {
    return { ok: false, message: 'Please enter a valid URL (e.g. https://example.com or example.com)' }
  }
  
  return { ok: true }
}
