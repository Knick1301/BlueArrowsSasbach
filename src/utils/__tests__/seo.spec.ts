import { beforeEach, describe, expect, it } from 'vitest'
import { DEFAULT_DESCRIPTION, setPageMeta } from '../seo'

const meta = (attr: string, key: string) =>
  document.head.querySelector(`meta[${attr}="${key}"]`)?.getAttribute('content')

describe('setPageMeta', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
    document.title = ''
  })

  it('setzt Titel, Beschreibung und Open-Graph-Tags', () => {
    setPageMeta({ title: 'News', description: 'Aktuelles', image: 'https://example.com/a.webp' })
    expect(document.title).toBe('News – Blue Arrows Sasbach')
    expect(meta('name', 'description')).toBe('Aktuelles')
    expect(meta('property', 'og:title')).toBe('News – Blue Arrows Sasbach')
    expect(meta('property', 'og:image')).toBe('https://example.com/a.webp')
  })

  it('nutzt ohne Angaben Standardwerte und legt keine Tags doppelt an', () => {
    setPageMeta()
    setPageMeta()
    expect(document.title).toBe('Blue Arrows Sasbach')
    expect(meta('name', 'description')).toBe(DEFAULT_DESCRIPTION)
    expect(document.head.querySelectorAll('meta[name="description"]')).toHaveLength(1)
  })
})
