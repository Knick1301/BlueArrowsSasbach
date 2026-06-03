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
  herren: 'Herren',
  junioren: 'Junioren (U19)',
  jugend: 'Jugend (U16)',
  schueler: 'Schüler (U13)',
  bambini: 'Bambini (U10)',
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
</script>
<template>
  <div v-if="story" v-editable="story" class="min-h-screen bg-gray-50 pb-12">
    <div class="w-full py-13 bg-[#032650] text-center px-4">
      <h1 class="text-3xl font-black text-white uppercase tracking-wider">
        {{ story.content.title || 'Teamseite' }}
      </h1>
    </div>

    <div class="max-w-[1400px] mx-auto mt-10 px-4 hidden lg:grid grid-cols-[60px_1fr] gap-4">
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

      <div class="flex flex-col text-xs font-bold text-gray-400 text-right pr-4">
        <div v-for="hour in calendarHours" :key="hour" class="h-[45px]">{{ hour }}:00</div>
      </div>

      <div class="grid grid-cols-7 gap-4">
        <div
          v-for="day in weekDays"
          :key="day"
          class="relative bg-white rounded-lg border border-gray-300 overflow-hidden shadow-[inset_0_8px_16px_rgba(0,0,0,0.12)]"
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
            <div class="text-[11px] text-gray-500 font-bold leading-none mb-1">
              {{ training.from }} - {{ training.to }}
            </div>
            <div
              class="flex-1 flex items-center justify-center text-center font-black text-[#032650] text-md leading-tight"
            >
              {{ teamMapping[training.team] || training.team }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
