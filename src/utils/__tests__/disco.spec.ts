import { describe, expect, it } from 'vitest'
import { kommendeTermine, parseStoryblokDatum, terminBild } from '../disco'

const quer = { filename: 'https://a.storyblok.com/f/1/1600x900/quer.jpg' }
const hoch = { filename: 'https://a.storyblok.com/f/1/900x1600/hoch.jpg' }
const story = { filename: 'https://a.storyblok.com/f/1/1000x1000/story.jpg' }

describe('terminBild', () => {
  it('nimmt das Bild im gewünschten Format', () => {
    const termin = { image_landscape: quer, image_portrait: hoch }
    expect(terminBild(termin, 'quer', story)).toBe(quer.filename)
    expect(terminBild(termin, 'hoch', story)).toBe(hoch.filename)
  })

  it('weicht auf das andere Format des Termins aus', () => {
    expect(terminBild({ image_portrait: hoch }, 'quer', story)).toBe(hoch.filename)
    expect(terminBild({ image_landscape: quer }, 'hoch', story)).toBe(quer.filename)
  })

  it('nutzt sonst das Ersatzbild der Story', () => {
    expect(terminBild({ image_landscape: { filename: '' } }, 'quer', story)).toBe(story.filename)
    expect(terminBild(undefined, 'hoch', story)).toBe(story.filename)
  })

  it('liefert undefined ganz ohne Bild', () => {
    expect(terminBild({}, 'quer')).toBeUndefined()
  })
})

describe('kommendeTermine', () => {
  it('filtert vergangene Termine und sortiert nach Datum', () => {
    const jetzt = new Date(2026, 9, 27, 12)
    const termine = [
      { date: '2026-12-05 19:00', title: 'Dezember' },
      { date: '2026-10-01 19:00', title: 'vorbei' },
      { date: '2026-11-07 19:00', title: 'November' },
      { date: '', title: 'ohne Datum' },
    ]
    expect(kommendeTermine(termine, jetzt).map((t) => t.title)).toEqual(['November', 'Dezember'])
  })
})

describe('parseStoryblokDatum', () => {
  it('liest das Storyblok-Format mit Leerzeichen', () => {
    expect(parseStoryblokDatum('2026-11-07 19:30')?.getHours()).toBe(19)
  })

  it('liefert null bei fehlendem oder kaputtem Wert', () => {
    expect(parseStoryblokDatum(undefined)).toBeNull()
    expect(parseStoryblokDatum('kein Datum')).toBeNull()
  })
})
