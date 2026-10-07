import { useStoryblokApi } from '@storyblok/vue'
import { STORYBLOK_VERSION } from '@/storyblok'

interface TrainingBlok {
  _uid: string
  component: 'training'
  team: string
  from: string
  to: string
  day: string
}

const DAYS: Record<string, string> = {
  monday: 'Montag',
  tuesday: 'Dienstag',
  wednesday: 'Mittwoch',
  thursday: 'Donnerstag',
  friday: 'Freitag',
  saturday: 'Samstag',
  sunday: 'Sonntag',
}
const DAY_ORDER = Object.keys(DAYS)

const toMinutes = (time: string) => {
  const [hours = 0, minutes = 0] = time.split(':').map(Number)
  return hours * 60 + minutes
}

// Trainingszeiten eines Teams aus der zentralen Storyblok-Seite "teams/trainings"
export const getTeamTrainings = async (teamSlug: string) => {
  try {
    const response = await useStoryblokApi().get('cdn/stories/teams/trainings', {
      version: STORYBLOK_VERSION,
    })
    const blocks: unknown = response.data.story?.content?.trainings
    if (!Array.isArray(blocks)) return []

    return (blocks as TrainingBlok[])
      .filter((blok) => blok.component === 'training' && blok.team === teamSlug)
      .sort(
        (a, b) =>
          DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day) || toMinutes(a.from) - toMinutes(b.from),
      )
      .map((blok) => ({ ...blok, dayLabel: DAYS[blok.day] ?? blok.day }))
  } catch (e) {
    console.error('Storyblok-Story "teams/trainings" konnte nicht geladen werden.', e)
    return []
  }
}
