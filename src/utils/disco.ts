export interface StoryblokBild {
  filename?: string
}

// Felder eines Termin-Blocks in Storyblok (z. B. in events/inlinedisco → dates)
export interface TerminBlok {
  date?: string
  title?: string
  time?: string
  image_landscape?: StoryblokBild
  image_portrait?: StoryblokBild
}

export type BildFormat = 'quer' | 'hoch'

// Storyblok liefert „2026-11-05 19:00“; Safari kann das ohne „T“ nicht lesen.
export const parseStoryblokDatum = (wert: unknown): Date | null => {
  if (typeof wert !== 'string' || !wert) return null
  const datum = new Date(wert.replace(' ', 'T'))
  return isNaN(datum.getTime()) ? null : datum
}

export const kommendeTermine = <T extends TerminBlok>(termine: T[], jetzt = new Date()): T[] =>
  termine
    .map((termin) => ({ termin, start: parseStoryblokDatum(termin.date) }))
    .filter(
      (eintrag): eintrag is { termin: T; start: Date } => !!eintrag.start && eintrag.start >= jetzt,
    )
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .map(({ termin }) => termin)

// Erst das Bild im gewünschten Format, dann das andere Format, zuletzt das Ersatzbild der Story.
export const terminBild = (
  termin: TerminBlok | undefined,
  format: BildFormat,
  fallback?: StoryblokBild,
): string | undefined => {
  const quer = termin?.image_landscape?.filename
  const hoch = termin?.image_portrait?.filename
  return (format === 'quer' ? quer || hoch : hoch || quer) || fallback?.filename || undefined
}
