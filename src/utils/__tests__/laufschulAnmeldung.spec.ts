import { describe, expect, it } from 'vitest'
import {
  istGueltigeEmail,
  istGueltigeTelefonnummer,
  istGueltigesGeburtsdatum,
  leereAnmeldung,
  validiereAnmeldung,
  type LaufschulAnmeldung,
} from '../laufschulAnmeldung'

const HEUTE = new Date(2026, 9, 26)

const gueltig = (): LaufschulAnmeldung => ({
  ...leereAnmeldung(),
  vorname: 'Mia',
  name: 'Muster',
  geschlecht: 'weiblich',
  geburtsdatum: '2019-05-14',
  erziehungsberechtigter: 'Anna Muster',
  telefon: '0178 / 1234567',
  email: 'anna@example.com',
  wohnort: 'Sasbach',
  erfahrung: 'Anfänger',
  wochentage: ['Dienstag', 'Freitag'],
  erwachsenenkurs: 'Nein',
  datenschutz: true,
})

describe('validiereAnmeldung', () => {
  it('akzeptiert eine vollständige Anmeldung', () => {
    expect(validiereAnmeldung(gueltig(), HEUTE)).toEqual({})
  })

  it('meldet alle Pflichtfelder bei leerem Formular', () => {
    const fehler = validiereAnmeldung(leereAnmeldung(), HEUTE)
    expect(Object.keys(fehler).sort()).toEqual(
      [
        'vorname',
        'name',
        'geschlecht',
        'geburtsdatum',
        'erziehungsberechtigter',
        'telefon',
        'email',
        'wohnort',
        'erfahrung',
        'wochentage',
        'erwachsenenkurs',
        'datenschutz',
      ].sort(),
    )
  })

  it('wertet reine Leerzeichen als leer', () => {
    expect(validiereAnmeldung({ ...gueltig(), vorname: '   ' }, HEUTE).vorname).toBeDefined()
  })

  it('lehnt Werte außerhalb der Auswahl ab', () => {
    const fehler = validiereAnmeldung(
      { ...gueltig(), geschlecht: 'x', wochentage: ['Montag'], leihausruestung: ['Schläger'] },
      HEUTE,
    )
    expect(fehler.geschlecht).toBeDefined()
    expect(fehler.wochentage).toBeDefined()
    expect(fehler.leihausruestung).toBeDefined()
  })

  it('verlangt die Schuhgröße bei Leih-Skates', () => {
    const ohne = { ...gueltig(), leihausruestung: ['Inline-Skates'] }
    expect(validiereAnmeldung(ohne, HEUTE).leihDetails).toBeDefined()
    expect(validiereAnmeldung({ ...ohne, leihDetails: 'Größe 31' }, HEUTE)).toEqual({})
  })

  it('braucht keine Details nur für Helm oder Schoner', () => {
    expect(validiereAnmeldung({ ...gueltig(), leihausruestung: ['Helm'] }, HEUTE)).toEqual({})
  })

  it('begrenzt die Länge der Nachricht', () => {
    const fehler = validiereAnmeldung({ ...gueltig(), nachricht: 'a'.repeat(2001) }, HEUTE)
    expect(fehler.nachricht).toBeDefined()
  })
})

describe('istGueltigesGeburtsdatum', () => {
  it('akzeptiert ein Datum in der Vergangenheit', () => {
    expect(istGueltigesGeburtsdatum('2020-02-29', HEUTE)).toBe(true)
  })

  it('lehnt Zukunft, nicht existierende Tage und falsches Format ab', () => {
    expect(istGueltigesGeburtsdatum('2027-01-01', HEUTE)).toBe(false)
    expect(istGueltigesGeburtsdatum('2021-02-29', HEUTE)).toBe(false)
    expect(istGueltigesGeburtsdatum('14.05.2019', HEUTE)).toBe(false)
  })

  it('lehnt Daten über 100 Jahre zurück ab', () => {
    expect(istGueltigesGeburtsdatum('1920-01-01', HEUTE)).toBe(false)
  })
})

describe('istGueltigeTelefonnummer', () => {
  it('akzeptiert übliche Schreibweisen', () => {
    expect(istGueltigeTelefonnummer('0178-4744144')).toBe(true)
    expect(istGueltigeTelefonnummer('+49 178 4744144')).toBe(true)
    expect(istGueltigeTelefonnummer('0178 / 47 44 1 44')).toBe(true)
  })

  it('lehnt Buchstaben und zu kurze Nummern ab', () => {
    expect(istGueltigeTelefonnummer('0178abc')).toBe(false)
    expect(istGueltigeTelefonnummer('123')).toBe(false)
  })
})

describe('istGueltigeEmail', () => {
  it('prüft das Grundformat', () => {
    expect(istGueltigeEmail('anna@example.com')).toBe(true)
    expect(istGueltigeEmail('anna@example')).toBe(false)
    expect(istGueltigeEmail('anna example.com')).toBe(false)
  })
})
