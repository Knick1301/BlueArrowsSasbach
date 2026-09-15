<script setup lang="ts">
import { useStoryblok } from '@storyblok/vue'
import { computed, type CSSProperties } from 'vue'

interface TrainingsBlok {
  _uid: string
  component: 'training'
  team: string
  from: string
  to: string
  day: string
}
const story = await useStoryblok(`training/trainings`, { version: 'draft' })

const trainings = computed(() => {
  const trainingsData = story.value?.content?.trainings
  if (Array.isArray(trainingsData)) {
    return trainingsData.filter((blok: any): blok is TrainingsBlok => blok.component === 'training')
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
  const found = Object.entries(allDays).find(([_, englishValue]) => englishValue === dayKey)
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

const teamMapping: Record<string, string> = {
  bambini: 'Bambini (U10)',
  schueler: 'Schüler (U13)',
  jugend: 'Jugend (U16)',
  junioren: 'Junioren (U19)',
  herren: 'Herren',
  hobby: 'Hobby',
}

const weekDays = Object.keys(allDays)

const calendarHours = computed(() => {
  const hours = []
  for (let hour = START_HOUR; hour < END_HOUR; hour++) {
    hours.push(`${hour}`)
  }
  return hours
})

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
        return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
      })
    }
  })

  return Object.entries(grouped).filter(([_, list]) => list.length > 0)
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
      <div v-for="[teamKey, teamTrainings] in trainingsByTeam" :key="teamKey"
        class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-6 p-4 border-l-4 border-l-[#032650]">
        <h3 class="font-black text-[#032650] text-xl mb-3 border-b pb-2 border-gray-100">
          {{ teamMapping[teamKey] }}
        </h3>

        <div class="space-y-2">
          <div v-for="training in teamTrainings" :key="training._uid"
            class="flex justify-between items-center bg-[#f0f7fd] p-2.5 rounded-md">
            <span class="font-bold text-gray-700 text-sm">
              {{ getGermanDayName(training.day) }}
            </span>

            <span class="font-black text-[#032650] text-sm">
              {{ training.from }} - {{ training.to }} Uhr
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-[1400px] mx-auto mt-10 px-4 hidden xl:grid grid-cols-[60px_1fr] gap-4">
      <div></div>

      <div class="grid grid-cols-7 gap-4">
        <div v-for="day in weekDays" :key="day" class="text-[#032650] text-xl font-bold mb-2 text-center">
          {{ day }}
        </div>
      </div>

      <div class="flex flex-col text-xs font-bold text-gray-500 text-right pr-4">
        <div v-for="hour in calendarHours" :key="hour" class="h-[45px]">{{ hour }}:00</div>
      </div>

      <div class="grid grid-cols-7 gap-4">
        <div v-for="day in weekDays" :key="day"
          class="relative bg-white rounded-xl border border-gray-300 overflow-hidden shadow-[inset_0_8px_16px_rgba(0,0,0,0.12)]"
          :style="{
            height: `${(END_HOUR - START_HOUR) * 45}px`,
            backgroundImage:
              'linear-gradient(to bottom, rgba(229, 231, 235, 0.5) 1px, transparent 2px)',
            backgroundSize: '100% 45px',
          }">
          <div v-for="training in trainingsPerDay(day)" :key="training._uid"
            class="bg-[#f0f7fd] hover:bg-[#e0effc] rounded-md shadow border border-gray-200 border-l-4 border-l-[#032650] p-2 hover:shadow-md transition-shadow z-10 overflow-hidden flex flex-col"
            :style="getTrainingStyle(training.from, training.to)">
            <div class="text-xs text-gray-500 font-bold leading-none mb-1">
              {{ training.from }} - {{ training.to }}
            </div>
            <div
              class="flex-1 flex items-center justify-center text-center font-black text-[#032650] text-md leading-tight">
              {{ teamMapping[training.team] || training.team }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
