import { ref, shallowRef, watchEffect, type MaybeRefOrGetter, toValue } from 'vue'
import type { IshdGame, IshdSchedule, IshdTables } from '@/types/ishd'

const API_URL = import.meta.env.VITE_ISHD_API_URL || '/api/ishd'

const requests = new Map<string, Promise<unknown>>()

const request = <T>(typ: 'spielplan' | 'tabelle', team: string): Promise<T> => {
  const key = `${typ}:${team}`
  let pending = requests.get(key) as Promise<T> | undefined
  if (!pending) {
    const url = `${API_URL}?typ=${typ}&team=${encodeURIComponent(team)}`
    pending = fetch(url).then(async (response) => {
      if (!response.ok) throw new Error(`ISHD-Proxy antwortet mit ${response.status}`)
      return (await response.json()) as T
    })
    pending.catch(() => requests.delete(key))
    requests.set(key, pending)
  }
  return pending
}

const useIshdResource = <T>(
  typ: 'spielplan' | 'tabelle',
  team: MaybeRefOrGetter<string | undefined>,
) => {
  const data = shallowRef<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  watchEffect(async () => {
    const current = toValue(team)
    data.value = null
    error.value = null
    if (!current) return

    loading.value = true
    try {
      const result = await request<T>(typ, current)
      if (toValue(team) === current) data.value = result
    } catch (e) {
      console.error(`ISHD-${typ} für "${current}" konnte nicht geladen werden.`, e)
      if (toValue(team) === current) error.value = 'Daten von ISHD konnten nicht geladen werden.'
    } finally {
      if (toValue(team) === current) loading.value = false
    }
  })

  return { data, loading, error }
}

export const useIshdSchedule = (team: MaybeRefOrGetter<string | undefined>) =>
  useIshdResource<IshdSchedule>('spielplan', team)

export const useIshdTables = (team: MaybeRefOrGetter<string | undefined>) =>
  useIshdResource<IshdTables>('tabelle', team)

export interface LabeledGame {
  game: IshdGame
  label: string
  teamPath: string
}

export interface IshdTeamRef {
  ishdTeam: string
  label: string
  teamPath: string
}

export const loadGamesForTeams = async (list: IshdTeamRef[]) => {
  const results = await Promise.allSettled(
    list.map((team) => request<IshdSchedule>('spielplan', team.ishdTeam)),
  )

  const games: LabeledGame[] = []
  results.forEach((result, index) => {
    const team = list[index]!
    if (result.status === 'fulfilled') {
      for (const game of result.value.games) {
        games.push({ game, label: team.label, teamPath: team.teamPath })
      }
    } else {
      console.error(`ISHD-Spielplan für "${team.ishdTeam}" konnte nicht geladen werden.`, result.reason)
    }
  })

  const failed = list.length > 0 && results.every((result) => result.status === 'rejected')
  return { games, failed }
}

export const useIshdGamesForTeams = (teams: MaybeRefOrGetter<IshdTeamRef[]>) => {
  const games = shallowRef<LabeledGame[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  watchEffect(async () => {
    const list = toValue(teams)
    loading.value = true
    error.value = null
    const result = await loadGamesForTeams(list)
    games.value = result.games
    if (result.failed) error.value = 'Daten von ISHD konnten nicht geladen werden.'
    loading.value = false
  })

  return { games, loading, error }
}
