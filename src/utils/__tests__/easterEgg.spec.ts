import { describe, expect, it } from 'vitest'
import { createCodeMatcher } from '../easterEgg'

describe('createCodeMatcher', () => {
  it('löst bei der richtigen Reihenfolge aus', () => {
    const tippe = createCodeMatcher(['18', '11', '18', '11'], 5000)
    expect(tippe(18, 0)).toBe(false)
    expect(tippe(11, 100)).toBe(false)
    expect(tippe(18, 200)).toBe(false)
    expect(tippe(11, 300)).toBe(true)
  })

  it('löst bei falscher Reihenfolge nicht aus', () => {
    const tippe = createCodeMatcher(['18', '11', '18', '11'], 5000)
    ;[11, 18, 11, 18].forEach((n, i) => expect(tippe(n, i * 100)).toBe(false))
  })

  it('erkennt den Code auch nach Fehlversuchen davor', () => {
    const tippe = createCodeMatcher(['18', '11', '18', '11'], 5000)
    ;[7, 18, 11, 18].forEach((n, i) => expect(tippe(n, i * 100)).toBe(false))
    expect(tippe(11, 400)).toBe(true)
  })

  it('setzt die Eingabe nach einer zu langen Pause zurück', () => {
    const tippe = createCodeMatcher(['18', '11', '18', '11'], 5000)
    tippe(18, 0)
    tippe(11, 100)
    tippe(18, 200)
    expect(tippe(11, 6000)).toBe(false)
  })
})
