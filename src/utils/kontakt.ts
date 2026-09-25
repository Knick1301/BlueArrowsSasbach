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

export const MAPS_URL =
  'https://www.google.com/maps/place/Blue+Arrows+Arena+Sasbach/@48.6447567,8.0801272,365m/data=!3m1!1e3!4m6!3m5!1s0x4796d8e348db6f7d:0x63629dbd73f23464!8m2!3d48.6448296!4d8.0801818!16s%2Fg%2F1tmqq97s?entry=ttu&g_ep=EgoyMDI2MDkyMi4wIKXMDSoASAFQAw%3D%3D'

let eintraege: Promise<KontaktEintrag[]> | null = null

export const useAnsprechpartner = async (
  name: string,
  fallback: Omit<Ansprechpartner, 'name'>,
): Promise<Ansprechpartner> => {
  const api = useStoryblokApi()
  eintraege ??= api
    .get('cdn/stories/verein/vorstand', { version: STORYBLOK_VERSION })
    .then(({ data }) => (data.story.content.personen as KontaktEintrag[] | undefined) ?? [])
    .catch((e) => {
      console.error('Storyblok-Story "verein/vorstand" konnte nicht geladen werden.', e)
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
