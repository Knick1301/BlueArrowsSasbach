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


export const resizeImage = (url: string | undefined, width: number): string => {
  if (!url || !url.includes('a.storyblok.com') || url.endsWith('.svg')) return url ?? ''
  return `${url}/m/${width}x0/filters:format(webp)`
}
