const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const inline = (value: string) => {
  const escaped = escapeHtml(value)
  return escaped
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
}

const isTableSeparator = (line: string) => /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line.trim())

const tableHtml = (rows: string[][]) => {
  const [head, ...body] = rows
  const headHtml = head.map((cell) => `<th>${inline(cell)}</th>`).join('')
  const bodyHtml = body
    .map((row) => `<tr>${row.map((cell) => `<td>${inline(cell)}</td>`).join('')}</tr>`)
    .join('')
  return `<table><thead><tr>${headHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>`
}

const splitRow = (line: string) =>
  line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim())

/** Renders the small markdown subset used by the Users Manual. */
export const renderSimpleMarkdown = (source: string) => {
  const lines = source.replace(/\r\n/g, '\n').split('\n')
  const blocks: string[] = []
  let i = 0

  const flushParagraph = (buffer: string[]) => {
    if (!buffer.length) return
    blocks.push(`<p>${inline(buffer.join(' '))}</p>`)
    buffer.length = 0
  }

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) {
      i += 1
      continue
    }

    if (trimmed.startsWith('### ')) {
      blocks.push(`<h3>${inline(trimmed.slice(4))}</h3>`)
      i += 1
      continue
    }

    if (trimmed.startsWith('## ')) {
      blocks.push(`<h2>${inline(trimmed.slice(3))}</h2>`)
      i += 1
      continue
    }

    if (trimmed.startsWith('# ')) {
      blocks.push(`<h1>${inline(trimmed.slice(2))}</h1>`)
      i += 1
      continue
    }

    if (trimmed.startsWith('|')) {
      const rows: string[][] = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        if (!isTableSeparator(lines[i])) rows.push(splitRow(lines[i]))
        i += 1
      }
      if (rows.length) blocks.push(tableHtml(rows))
      continue
    }

    if (trimmed.startsWith('- ')) {
      const items: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(`<li>${inline(lines[i].trim().slice(2))}</li>`)
        i += 1
      }
      blocks.push(`<ul>${items.join('')}</ul>`)
      continue
    }

    const paragraph: string[] = []
    while (i < lines.length && lines[i].trim() && !lines[i].trim().startsWith('#') && !lines[i].trim().startsWith('|') && !lines[i].trim().startsWith('- ')) {
      paragraph.push(lines[i].trim())
      i += 1
    }
    flushParagraph(paragraph)
  }

  return blocks.join('\n')
}
