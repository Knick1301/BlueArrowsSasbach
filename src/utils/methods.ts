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
    year: 'numeric'
  })
}