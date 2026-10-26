// Auswahlwerte der Laufschul-Anmeldung. public/api/anmeldung.php prüft gegen dieselben Werte –
// Änderungen hier immer auch dort nachziehen.
export const GESCHLECHTER = ['weiblich', 'männlich'] as const

export const ERFAHRUNG = [
  'noch keine Erfahrung (noch nie Inlineskates gefahren)',
  'Anfänger',
  'Fortgeschritten',
] as const

export const LEIHAUSRUESTUNG = [
  'Inline-Skates',
  'Schutzausrüstung (Hand-, Knie-, Ellbogenschoner)',
  'Helm',
  'Sonstiges',
] as const

export const WOCHENTAGE = ['Dienstag', 'Donnerstag', 'Freitag', 'Samstag (vormittags)'] as const

export const ERWACHSENENKURS = ['Ja', 'Nein'] as const

export const MAX_LAENGE = 200
export const MAX_LAENGE_NACHRICHT = 2000

export interface LaufschulAnmeldung {
  vorname: string
  name: string
  geschlecht: string
  /** ISO-Datum YYYY-MM-DD, wie es <input type="date"> liefert */
  geburtsdatum: string
  erziehungsberechtigter: string
  telefon: string
  email: string
  wohnort: string
  erfahrung: string
  leihausruestung: string[]
  /** Schuhgröße bei Leih-Skates bzw. Angabe zu „Sonstiges“ */
  leihDetails: string
  wochentage: string[]
  erwachsenenkurs: string
  nachricht: string
  datenschutz: boolean
  /** Honeypot: bleibt für Menschen unsichtbar und leer */
  website: string
}

export type AnmeldungsFehler = Partial<Record<keyof LaufschulAnmeldung, string>>

export const leereAnmeldung = (): LaufschulAnmeldung => ({
  vorname: '',
  name: '',
  geschlecht: '',
  geburtsdatum: '',
  erziehungsberechtigter: '',
  telefon: '',
  email: '',
  wohnort: '',
  erfahrung: '',
  leihausruestung: [],
  leihDetails: '',
  wochentage: [],
  erwachsenenkurs: '',
  nachricht: '',
  datenschutz: false,
  website: '',
})

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const TELEFON_PATTERN = /^\+?[\d\s/()-]+$/

export const istGueltigeEmail = (email: string) => EMAIL_PATTERN.test(email.trim())

export const istGueltigeTelefonnummer = (telefon: string) => {
  const wert = telefon.trim()
  return TELEFON_PATTERN.test(wert) && wert.replace(/\D/g, '').length >= 6
}

// Geburtsdatum muss existieren, darf nicht in der Zukunft und nicht über 100 Jahre zurück liegen.
export const istGueltigesGeburtsdatum = (datum: string, heute = new Date()) => {
  const treffer = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datum)
  if (!treffer) return false
  const [jahr, monat, tag] = treffer.slice(1).map(Number) as [number, number, number]
  const geburt = new Date(jahr, monat - 1, tag)
  if (geburt.getFullYear() !== jahr || geburt.getMonth() !== monat - 1 || geburt.getDate() !== tag)
    return false
  const frueheste = new Date(heute.getFullYear() - 100, heute.getMonth(), heute.getDate())
  return geburt <= heute && geburt >= frueheste
}

// Bei Leih-Skates braucht es die Schuhgröße, bei „Sonstiges“ eine Beschreibung.
export const brauchtLeihDetails = (leihausruestung: string[]) =>
  leihausruestung.includes('Inline-Skates') || leihausruestung.includes('Sonstiges')

const PFLICHTTEXTE: [keyof LaufschulAnmeldung, string][] = [
  ['vorname', 'Bitte den Vornamen des Kindes angeben.'],
  ['name', 'Bitte den Nachnamen des Kindes angeben.'],
  ['erziehungsberechtigter', 'Bitte den Namen eines Erziehungsberechtigten angeben.'],
  ['wohnort', 'Bitte den Wohnort angeben.'],
]

export const validiereAnmeldung = (
  daten: LaufschulAnmeldung,
  heute = new Date(),
): AnmeldungsFehler => {
  const fehler: AnmeldungsFehler = {}

  for (const [feld, meldung] of PFLICHTTEXTE) {
    const wert = String(daten[feld]).trim()
    if (!wert) fehler[feld] = meldung
    else if (wert.length > MAX_LAENGE) fehler[feld] = `Bitte höchstens ${MAX_LAENGE} Zeichen.`
  }

  if (!(GESCHLECHTER as readonly string[]).includes(daten.geschlecht))
    fehler.geschlecht = 'Bitte ein Geschlecht auswählen.'

  if (!daten.geburtsdatum) fehler.geburtsdatum = 'Bitte das Geburtsdatum angeben.'
  else if (!istGueltigesGeburtsdatum(daten.geburtsdatum, heute))
    fehler.geburtsdatum = 'Bitte ein gültiges Geburtsdatum angeben.'

  if (!daten.telefon.trim()) fehler.telefon = 'Bitte eine Handynummer angeben.'
  else if (!istGueltigeTelefonnummer(daten.telefon) || daten.telefon.length > MAX_LAENGE)
    fehler.telefon = 'Bitte eine gültige Telefonnummer angeben.'

  if (!daten.email.trim()) fehler.email = 'Bitte eine E-Mail-Adresse angeben.'
  else if (!istGueltigeEmail(daten.email) || daten.email.length > MAX_LAENGE)
    fehler.email = 'Bitte eine gültige E-Mail-Adresse angeben.'

  if (!(ERFAHRUNG as readonly string[]).includes(daten.erfahrung))
    fehler.erfahrung = 'Bitte die Erfahrung auf Skates auswählen.'

  if (daten.leihausruestung.some((teil) => !(LEIHAUSRUESTUNG as readonly string[]).includes(teil)))
    fehler.leihausruestung = 'Ungültige Auswahl bei der Leihausrüstung.'

  if (brauchtLeihDetails(daten.leihausruestung) && !daten.leihDetails.trim())
    fehler.leihDetails = 'Bitte Schuhgröße bzw. gewünschte Ausrüstung angeben.'
  else if (daten.leihDetails.length > MAX_LAENGE)
    fehler.leihDetails = `Bitte höchstens ${MAX_LAENGE} Zeichen.`

  if (daten.wochentage.length === 0) fehler.wochentage = 'Bitte mindestens einen Wochentag wählen.'
  else if (daten.wochentage.some((tag) => !(WOCHENTAGE as readonly string[]).includes(tag)))
    fehler.wochentage = 'Ungültige Auswahl bei den Wochentagen.'

  if (!(ERWACHSENENKURS as readonly string[]).includes(daten.erwachsenenkurs))
    fehler.erwachsenenkurs = 'Bitte Ja oder Nein auswählen.'

  if (daten.nachricht.length > MAX_LAENGE_NACHRICHT)
    fehler.nachricht = `Bitte höchstens ${MAX_LAENGE_NACHRICHT} Zeichen.`

  if (!daten.datenschutz) fehler.datenschutz = 'Bitte der Datenschutzerklärung zustimmen.'

  return fehler
}
