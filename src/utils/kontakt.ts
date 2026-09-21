import { useStoryblokApi } from '@storyblok/vue'
import { STORYBLOK_VERSION } from '@/storyblok'
import danielBild from '@/assets/DanielBuehler.jpg'

export interface Ansprechpartner {
  name: string
  phone?: string
  image?: string
}

interface KontaktEintrag {
  name: string
  phone?: string
  image?: { filename?: string }
}

let eintraege: Promise<KontaktEintrag[]> | null = null

export const useAnsprechpartner = async (
  name: string,
  fallback: Omit<Ansprechpartner, 'name'>,
): Promise<Ansprechpartner> => {
  const api = useStoryblokApi()
  eintraege ??= api
    .get('cdn/stories/verein/kontakt', { version: STORYBLOK_VERSION })
    .then(({ data }) => (data.story.content.kontakt as KontaktEintrag[] | undefined) ?? [])
    .catch((e) => {
      console.error('Storyblok-Story "verein/kontakt" konnte nicht geladen werden.', e)
      eintraege = null
      return []
    })

  const person = (await eintraege).find((eintrag) => eintrag.name === name)
  return {
    name,
    phone: person?.phone || fallback.phone,
    image: person?.image?.filename || fallback.image,
  }
}

export const useDaniel = () =>
  useAnsprechpartner('Daniel Bühler', { phone: '0178 / 47 44 1 44', image: danielBild })
