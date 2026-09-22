export const SITE_NAME = 'Blue Arrows Sasbach'
export const DEFAULT_DESCRIPTION =
  'Blue Arrows Sasbach – Inline-Skaterhockey-Verein aus Sasbach: Teams, Spielpläne, News und Trainingszeiten.'

export interface PageMeta {
  title?: string
  description?: string
  image?: string
}

const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export const setPageMeta = ({ title, description, image }: PageMeta = {}) => {
  const fullTitle = title ? `${title} – ${SITE_NAME}` : SITE_NAME
  const desc = description || DEFAULT_DESCRIPTION

  document.title = fullTitle
  setMeta('name', 'description', desc)
  setMeta('property', 'og:title', fullTitle)
  setMeta('property', 'og:description', desc)
  setMeta('property', 'og:type', 'website')
  setMeta('property', 'og:url', window.location.href)
  if (image) setMeta('property', 'og:image', image)
}
