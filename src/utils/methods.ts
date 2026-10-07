export interface StoryblokLink {
  linktype: string
  cached_url?: string
  url?: string
}

export const getUrl = (link: StoryblokLink | undefined): string => {
  if (!link) return '#'
  if (link.linktype === 'story' && link.cached_url) {
    return link.cached_url.startsWith('/') ? link.cached_url : '/' + link.cached_url
  }
  return link.url || '#'
}

export const formatDate = (dateString: string): string => {
  if (!dateString) return ''

  const date = new Date(dateString)

  return date.toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// Fehlt das Datum-Feld in Storyblok, wird der Tag der Veröffentlichung bzw. Erstellung verwendet
export const getNewsDate = (story: {
  content: Record<string, unknown>
  first_published_at?: string | null
  published_at?: string | null
  created_at?: string
}): string => {
  const date = typeof story.content.date === 'string' ? story.content.date : ''
  return date || story.first_published_at || story.published_at || story.created_at || ''
}

const isResizable = (url: string | undefined): url is string =>
  !!url && url.includes('a.storyblok.com') && !url.endsWith('.svg')

export const resizeImage = (url: string | undefined, width: number): string => {
  if (!isResizable(url)) return url ?? ''
  return `${url}/m/${width}x0/filters:format(webp):quality(75)`
}

// Mehrere Bildbreiten, damit der Browser je nach Anzeigegröße die passende lädt
export const imageSrcset = (url: string | undefined, widths: number[]): string | undefined => {
  if (!isResizable(url)) return undefined
  return widths.map((width) => `${resizeImage(url, width)} ${width}w`).join(', ')
}
