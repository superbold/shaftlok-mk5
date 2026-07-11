const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}

export const escapeHtml = (value: unknown) => {
  if (value === null || value === undefined) return ''
  return String(value).replace(/[&<>"']/g, (char) => HTML_ESCAPES[char])
}
