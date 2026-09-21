import { describe, expect, it } from 'vitest'
import { formatDate, getUrl, resizeImage } from '../methods'

describe('getUrl', () => {
  it('liefert # ohne Link', () => {
    expect(getUrl(undefined)).toBe('#')
  })

  it('ergänzt führenden Slash bei Story-Links', () => {
    expect(getUrl({ linktype: 'story', cached_url: 'teams/erste' })).toBe('/teams/erste')
    expect(getUrl({ linktype: 'story', cached_url: '/teams/erste' })).toBe('/teams/erste')
  })

  it('nutzt url bei externen Links und fällt auf # zurück', () => {
    expect(getUrl({ linktype: 'url', url: 'https://example.com' })).toBe('https://example.com')
    expect(getUrl({ linktype: 'url' })).toBe('#')
  })
})

describe('formatDate', () => {
  it('formatiert deutsch', () => {
    expect(formatDate('2026-03-05T12:00:00Z')).toBe('5. März 2026')
  })

  it('liefert leeren String bei leerer Eingabe', () => {
    expect(formatDate('')).toBe('')
  })
})

describe('resizeImage', () => {
  const url = 'https://a.storyblok.com/f/123/foto.jpg'

  it('hängt Image-Service-Parameter an Storyblok-Bilder an', () => {
    expect(resizeImage(url, 600)).toBe(`${url}/m/600x0/filters:format(webp)`)
  })

  it('lässt SVG, fremde und fehlende URLs unverändert', () => {
    const svg = 'https://a.storyblok.com/f/123/logo.svg'
    expect(resizeImage(svg, 600)).toBe(svg)
    expect(resizeImage('/assets/team.png', 600)).toBe('/assets/team.png')
    expect(resizeImage(undefined, 600)).toBe('')
  })
})
