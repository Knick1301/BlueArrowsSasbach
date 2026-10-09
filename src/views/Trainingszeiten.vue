<script setup lang="ts">
import { useStoryblok } from '@storyblok/vue'
import { STORYBLOK_VERSION } from '@/storyblok'
import { computed, type CSSProperties } from 'vue'
import { TRAINING_TEAM_LABELS } from '@/utils/games'
import DecoratedCard from '@/components/DecoratedCard.vue'

interface TrainingsBlok {
  _uid: string
  component: 'training'
  team: string
  from: string
  to: string
  day: string
}

let story: Awaited<ReturnType<typeof useStoryblok>> | null = null
try {
  story = await useStoryblok(`teams/trainings`, { version: STORYBLOK_VERSION })
} catch (e) {
  console.error('Storyblok-Story "teams/trainings" konnte nicht geladen werden.', e)
}

const trainings = computed(() => {
  const trainingsData = story?.value?.content?.trainings
  if (Array.isArray(trainingsData)) {
    return trainingsData.filter(
      (blok: { component: string }): blok is TrainingsBlok => blok.component === 'training',
    )
  }
  return []
})

const allDays = {
  Montag: 'monday',
  Dienstag: 'tuesday',
  Mittwoch: 'wednesday',
  Donnerstag: 'thursday',
  Freitag: 'friday',
  Samstag: 'saturday',
  Sonntag: 'sunday',
}

const getGermanDayName = (dayKey: string): string => {
  const found = Object.entries(allDays).find(([, englishValue]) => englishValue === dayKey)
  return found ? found[0] : dayKey
}
const trainingsPerDay = (dayName: string) => {
  const dayKey = allDays[dayName as keyof typeof allDays]
  return trainings.value.filter((training) => training.day === dayKey)
}

const START_HOUR = 9
const END_HOUR = 22

const timeToMinutes = (time: string): number => {
  if (!time || !time.includes(':')) return 0

  const parts = time.split(':')
  const hours = Number(parts[0] || 0)
  const minutes = Number(parts[1] || 0)
  return hours * 60 + minutes
}

const getTrainingStyle = (from: string, to: string): CSSProperties => {
  const fromMinutes = timeToMinutes(from)
  const toMinutes = timeToMinutes(to)
  const calenderStart = START_HOUR * 60

  const top = (fromMinutes - calenderStart) * 0.75
  const height = (toMinutes - fromMinutes) * 0.75 - 2

  return {
    position: 'absolute',
    top: `${top}px`,
    height: `${height}px`,
    left: '4px',
    right: '4px',
  }
}

const teamMapping = TRAINING_TEAM_LABELS

const weekDays = Object.keys(allDays)

const calendarHours = computed(() => {
  const hours = []
  for (let hour = START_HOUR; hour < END_HOUR; hour++) {
    hours.push(`${hour}`)
  }
  return hours
})

// "Bambini (U10)" -> Name und Altersklasse getrennt darstellen
const teamName = (teamKey: string) => {
  const label = teamMapping[teamKey] ?? teamKey
  const match = label.match(/^(.*?)\s*\((.+)\)$/)
  return match ? { name: match[1], age: match[2] } : { name: label, age: '' }
}

const trainingsByTeam = computed(() => {
  const dayOrder = Object.values(allDays)

  const grouped: Record<string, TrainingsBlok[]> = {}
  Object.keys(teamMapping).forEach((teamKey) => {
    grouped[teamKey] = []
  })
  trainings.value.forEach((training) => {
    const teamKey = training.team

    if (!grouped[teamKey]) {
      grouped[teamKey] = []
    }

    grouped[teamKey].push(training)
  })
  Object.keys(grouped).forEach((teamKey) => {
    const teamTrainings = grouped[teamKey]

    if (teamTrainings) {
      teamTrainings.sort((a, b) => {
        return (
          dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day) ||
          timeToMinutes(a.from) - timeToMinutes(b.from)
        )
      })
    }
  })

  return Object.entries(grouped).filter(([, list]) => list.length > 0)
})
</script>
<template>
  <div class="mb-15">
    <div class="w-full py-13 bg-[#032650] text-center px-4">
      <h1 class="text-3xl font-black text-white uppercase tracking-wider">
        {{ story?.content.title || 'Trainingszeiten' }}
      </h1>
    </div>
    <div class="max-w-[600px] mx-auto mt-10 px-4 xl:hidden">
      <DecoratedCard content-class="px-5">
        <section
          v-for="[teamKey, teamTrainings] in trainingsByTeam"
          :key="teamKey"
          class="py-5 border-b border-gray-200 last:border-b-0"
        >
          <h3 class="flex items-baseline gap-2 mb-2">
            <span class="font-black text-[#032650] text-xl">{{ teamName(teamKey).name }}</span>
            <span v-if="teamName(teamKey).age" class="text-sm font-bold text-gray-500">{{
              teamName(teamKey).age
            }}</span>
          </h3>

          <div
            v-for="training in teamTrainings"
            :key="training._uid"
            class="flex justify-between items-center py-1.5"
          >
            <span class="text-gray-600">{{ getGermanDayName(training.day) }}</span>
            <span class="font-bold text-[#032650] tabular-nums"
              >{{ training.from }} – {{ training.to }} Uhr</span
            >
          </div>
        </section>
      </DecoratedCard>
    </div>

    <div
      class="max-w-[1400px] w-[95%] mx-auto mt-10 px-4 hidden xl:grid grid-cols-[60px_1fr] gap-4"
    >
      <div></div>

      <div class="grid grid-cols-7 gap-4">
        <div
          v-for="day in weekDays"
          :key="day"
          class="text-[#032650] text-xl font-bold mb-2 text-center"
        >
          {{ day }}
        </div>
      </div>

      <div class="flex flex-col text-xs font-bold text-gray-500 text-right pr-4">
        <div v-for="hour in calendarHours" :key="hour" class="h-[45px]">{{ hour }}:00</div>
      </div>

      <div class="grid grid-cols-7 gap-4">
        <div
          v-for="day in weekDays"
          :key="day"
          class="relative bg-white rounded-xl border border-gray-300 overflow-hidden shadow-[inset_0_8px_16px_rgba(0,0,0,0.12)]"
          :style="{
            height: `${(END_HOUR - START_HOUR) * 45}px`,
            backgroundImage:
              'linear-gradient(to bottom, rgba(229, 231, 235, 0.5) 1px, transparent 2px)',
            backgroundSize: '100% 45px',
          }"
        >
          <div
            v-for="training in trainingsPerDay(day)"
            :key="training._uid"
            class="bg-[#f0f7fd] hover:bg-[#e0effc] rounded-md shadow border border-gray-200 border-l-4 border-l-[#032650] p-2 hover:shadow-md transition-shadow z-10 overflow-hidden flex flex-col"
            :style="getTrainingStyle(training.from, training.to)"
          >
            <div class="text-xs text-gray-500 font-bold leading-none mb-1">
              {{ training.from }} - {{ training.to }}
            </div>
            <div
              class="flex-1 flex items-center justify-center text-center font-black text-[#032650] text-base leading-tight"
            >
              {{ teamMapping[training.team] || training.team }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
