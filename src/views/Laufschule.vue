<script setup lang="ts">
import { useStoryblok } from '@storyblok/vue'
import { computed, type CSSProperties } from 'vue'

interface TrainingsBlok {
  _uid: string
  component: 'laufschulTraining'
  group: string
  from: string
  to: string
  day: string
}

const story = await useStoryblok(`skating/laufschule`, { version: 'draft' })

const trainings = computed(() => {
  const trainingsData = story.value?.content?.trainings
  if (Array.isArray(trainingsData)) {
    return trainingsData.filter(
      (blok: any): blok is TrainingsBlok => blok.component === 'laufschulTraining',
    )
  }
  return []
})

const Days = {
  Dienstag: 'tuesday',
  Donnerstag: 'thursday',
}

const getGermanDayName = (dayKey: string): string => {
  const found = Object.entries(Days).find(([_, englishValue]) => englishValue === dayKey)
  return found ? found[0] : dayKey
}

const trainingsPerDay = (dayName: string) => {
  const dayKey = Days[dayName as keyof typeof Days]
  return trainings.value.filter((training) => training.day === dayKey)
}

const START_HOUR = 16
const END_HOUR = 21

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

  const top = (fromMinutes - calenderStart) * 1.75
  const height = (toMinutes - fromMinutes) * 1.75 - 2

  return {
    position: 'absolute',
    top: `${top}px`,
    height: `${height}px`,
    left: '4px',
    right: '4px',
  }
}

const teamMapping: Record<string, string> = {
  'Gruppe 1': 'Anfänger',
  'Gruppe 2': 'Fortgeschrittene',
}

const weekDays = Object.keys(Days)

const calendarHours = computed(() => {
  const hours = []
  for (let hour = START_HOUR; hour < END_HOUR; hour++) {
    hours.push(`${hour}`)
  }
  return hours
})

const trainingsByTeam = computed(() => {
  const dayOrder = Object.values(Days)

  const grouped: Record<string, TrainingsBlok[]> = {}
  Object.keys(teamMapping).forEach((teamKey) => {
    grouped[teamKey] = []
  })
  trainings.value.forEach((training) => {
    const teamKey = training.group

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
  <div class="mb-20">
    <div class="w-full py-13 bg-[#032650] text-center px-4">
      <h1 class="text-3xl font-black text-white uppercase tracking-wider">
        {{ story?.content.title || 'Laufschule' }}
      </h1>
    </div>

    <div
      class="max-w-[1400px] mx-auto mt-10 px-4 flex flex-col lg:flex-row gap-10 xl:gap-16 items-start"
    >
      <div
        class="w-full lg:w-1/2 bg-white rounded-xl shadow-[0_2px_20px_rgba(0,0,0,0.1)] border-t-[5px] border-[#032650] p-6 md:p-10 text-gray-800 flex flex-col h-full"
      >
        <h2 class="text-[#032650] text-3xl font-black mt-0 uppercase tracking-wide mb-4">
          Laufschule 2026
        </h2>

        <div
          v-if="story?.content?.fullyBooked"
          class="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-3 mb-6 font-bold text-base rounded-r-md"
        >
          Aktuell sind alle Kurse voll belegt! Voranmeldungen für die Warteliste sind möglich.
        </div>

        <p class="mb-6 text-xl font-medium text-gray-700 leading-relaxed">
          Herzlich Willkommen bei der Inline-Skating Laufschule der Blue Arrows! Wir bringen Kindern
          (ab 3 Jahren) von den ersten Grundschritten an das Inlineskaten bei.
        </p>

        <h3
          class="text-[#032650] text-xl font-bold border-b-[3px] border-[#032650] w-fit pb-1 mb-4 mt-2"
        >
          Unsere Einteilung
        </h3>
        <div class="mb-8 space-y-4">
          <div class="bg-blue-50 p-4 rounded-lg border-l-[4px] border-[#032650]">
            <div class="text-[#032650] font-black text-lg uppercase tracking-wider mb-1">
              Anfänger
            </div>
            <div class="text-lg font-medium text-gray-700">
              Kinder bis 8 Jahre & Anfänger unabhängig des Alters.
            </div>
          </div>
          <div class="bg-blue-50 p-4 rounded-lg border-l-[4px] border-[#032650]">
            <div class="text-[#032650] font-black text-lg uppercase tracking-wider mb-1">
              Fortgeschrittene
            </div>
            <div class="text-lg font-medium text-gray-700">
              Für alle Skater mit ersten Erfahrungen.
            </div>
          </div>
        </div>

        <h3
          class="text-[#032650] text-xl font-bold border-b-[3px] border-[#032650] w-fit pb-1 mb-4"
        >
          Eckdaten & Kosten
        </h3>
        <div class="mb-8 space-y-4">
          <div class="bg-gray-50 p-4 rounded-lg border-l-[4px] border-[#032650]">
            <div class="text-[#032650] font-black text-lg uppercase tracking-wider mb-1">Wo</div>
            <div class="text-lg font-medium text-gray-700">Blue Arrows Hockeyarena</div>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg border-l-[4px] border-[#032650]">
            <div class="text-[#032650] font-black text-lg uppercase tracking-wider mb-1">
              Kosten
            </div>
            <div class="text-lg font-medium text-gray-700">
              15 EUR für 3 Monate
              <span class="text-[1.5vmin] text-gray-500 font-bold block mt-1"
                >(+ 5 EUR einmalige Aufnahmegebühr)</span
              >
            </div>
          </div>
          <div
            class="text-[#032650] font-black text-lg mt-6 bg-blue-100 p-4 rounded-lg text-center shadow-sm border border-blue-200"
          >
            Einmal Schnuppern ist kostenfrei!
          </div>
        </div>

        <div class="bg-gray-50 p-5 rounded-lg border border-gray-200 mt-auto">
          <h4 class="font-bold text-[#032650] text-lg mb-3">Anmeldung & Kontakt</h4>
          <p class="text-base font-medium text-gray-700 mb-4">
            Neue Skater/innen sind jederzeit willkommen. Bitte nehmt vorab Kontakt auf:
          </p>

          <div class="flex items-center gap-4 mb-5">
            <img
              src="../assets/DanielBuehler.jpg"
              alt="Daniel Bühler"
              class="w-25 h-35 rounded-full border-2 border-[#032650] shadow-sm object-cover object-top"
            />
            <div class="flex flex-col">
              <span class="text-[#032650] font-black text-lg leading-tight">Daniel Bühler</span>
              <span class="text-gray-600 font-bold text-base">0178 / 47 44 1 44</span>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3">
            <a
              href="https://forms.cloud.microsoft/pages/responsepage.aspx?id=0zjPOmDwmE6Fom6vADXC9_fd0gqtyfFIk3ESRMdyEo1UQkhaNjNWOEVTSE9YTllVU0NVSEpZS0RQWS4u&route=shorturl"
              target="_blank"
              class="text-center bg-[#032650] text-white px-4 py-2 rounded font-bold hover:bg-blue-800 transition-colors text-sm"
            >
              Zur Warteliste
            </a>
            <a
              href="https://www.bluearrows.de/fileadmin/user_upload/downloads/Anmeldung-Inline-Skating-Laufschule.pdf"
              target="_blank"
              class="text-center bg-gray-200 text-[#032650] px-4 py-2 rounded font-bold hover:bg-gray-300 transition-colors text-sm"
            >
              Formular (PDF)
            </a>
          </div>
        </div>
      </div>

      <div class="w-full lg:w-1/2 sticky top-24 lg:-mt-2">
        <div class="lg:hidden">
          <div
            v-for="[teamKey, teamTrainings] in trainingsByTeam"
            :key="teamKey"
            class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-6 p-4 border-l-4 border-l-[#032650]"
          >
            <h3 class="font-black text-[#032650] text-xl mb-3 border-b pb-2 border-gray-100">
              {{ teamMapping[teamKey] || teamKey }}
            </h3>
            <div class="space-y-2">
              <div
                v-for="training in teamTrainings"
                :key="training._uid"
                class="flex justify-between items-center bg-[#f0f7fd] p-2.5 rounded-md"
              >
                <span class="font-bold text-gray-700 text-base">
                  {{ getGermanDayName(training.day) }}
                </span>
                <span class="font-black text-[#032650] text-base">
                  {{ training.from }} - {{ training.to }} Uhr
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="hidden lg:grid grid-cols-[50px_1fr] gap-4">
          <div></div>
          <div class="grid grid-cols-2 gap-6">
            <div
              v-for="day in weekDays"
              :key="day"
              class="text-[#032650] text-xl font-bold mb-2 text-center"
            >
              {{ day }}
            </div>
          </div>

          <div class="flex flex-col text-sm font-bold text-gray-400 text-right pr-4">
            <div v-for="hour in calendarHours" :key="hour" class="h-[105px]">{{ hour }}:00</div>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div
              v-for="day in weekDays"
              :key="day"
              class="relative bg-white rounded-lg border border-gray-300 overflow-hidden shadow-[inset_0_8px_16px_rgba(0,0,0,0.12)]"
              :style="{
                height: `${(END_HOUR - START_HOUR) * 105}px`,
                backgroundImage:
                  'linear-gradient(to bottom, rgba(229, 231, 235, 0.5) 1px, transparent 2px)',
                backgroundSize: '100% 105px',
              }"
            >
              <div
                v-for="training in trainingsPerDay(day)"
                :key="training._uid"
                class="bg-[#f0f7fd] hover:bg-[#e0effc] rounded-md shadow border border-gray-200 border-l-4 border-l-[#032650] p-2 hover:shadow-md transition-shadow z-10 overflow-hidden flex flex-col"
                :style="getTrainingStyle(training.from, training.to)"
              >
                <div class="text-xs text-gray-600 font-bold leading-none mb-1">
                  {{ training.from }} - {{ training.to }}
                </div>
                <div
                  class="flex-1 flex items-center justify-center text-center font-black text-[#032650] text-lg leading-tight"
                >
                  {{ teamMapping[training.group] || training.group }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-[1400px] mx-auto mt-20 px-4">
      <div class="text-center mb-10">
        <h2
          class="text-3xl font-black text-[#032650] uppercase tracking-wider mb-4 border-b-[3px] border-[#032650] inline-block pb-1"
        >
          Der Skatepass
        </h2>
        <p class="text-gray-700 text-lg font-medium leading-relaxed max-w-2xl mx-auto mt-4">
          Mit dem Skatepass wird das Erlernen des Inliner-Laufens vereinheitlicht und in insgesamt 4
          Schritten motivierend dokumentiert.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          class="bg-white rounded-xl shadow-md border-t-[5px] border-blue-400 p-6 flex flex-col h-full hover:shadow-lg transition-shadow"
        >
          <h3 class="font-black text-xl text-[#032650] mb-4 flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-blue-400"></span>
            Starter-Rolle
          </h3>
          <ul class="text-base font-medium text-gray-700 space-y-3 list-disc pl-4 flex-1">
            <li>20m Geradeauslauf (nicht bergab)</li>
            <li>Je 5m Rollerlauf rechts/links</li>
            <li>Eine 8 um 2 Hütchen</li>
            <li>Unter einem nasenhohen Tor durchfahren</li>
          </ul>
        </div>

        <div
          class="bg-white rounded-xl shadow-md border-t-[5px] border-[#cd7f32] p-6 flex flex-col h-full hover:shadow-lg transition-shadow"
        >
          <h3 class="font-black text-xl text-[#032650] mb-4 flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-[#cd7f32]"></span>
            Bronzene Rolle
          </h3>
          <ul class="text-base font-medium text-gray-700 space-y-3 list-disc pl-4 flex-1">
            <li>20m Powerskating</li>
            <li>20m Slalomparcour (ohne Hütchen umwerfen)</li>
            <li>Bremsen aus einfacher Geschwindigkeit innerhalb von 5m</li>
            <li>5m Rückwärtsfahren</li>
          </ul>
        </div>

        <div
          class="bg-white rounded-xl shadow-md border-t-[5px] border-[#c0c0c0] p-6 flex flex-col h-full hover:shadow-lg transition-shadow"
        >
          <h3 class="font-black text-xl text-[#032650] mb-4 flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-[#c0c0c0]"></span>
            Silberne Rolle
          </h3>
          <ul class="text-base font-medium text-gray-700 space-y-3 list-disc pl-4 flex-1">
            <li>Je 5m auf einem Bein, ohne abzusetzen</li>
            <li>20m sauberer Eierlauf</li>
            <li>Unter einem schulterhohen Tor durchfahren</li>
            <li>Über ein flaches Hindernis (Stock) steigen</li>
          </ul>
        </div>

        <div
          class="bg-white rounded-xl shadow-md border-t-[5px] border-[#ffd700] p-6 flex flex-col h-full hover:shadow-lg transition-shadow"
        >
          <h3 class="font-black text-xl text-[#032650] mb-4 flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-[#ffd700]"></span>
            Goldene Rolle
          </h3>
          <ul class="text-base font-medium text-gray-700 space-y-3 list-disc pl-4 flex-1">
            <li>20m Slalomparcour mit Übersetzen</li>
            <li>Bremsen aus schnellem Lauf innerhalb von 3m</li>
            <li>Springen über ein flaches Hindernis</li>
            <li>20m Rückwärtsfahren um Hütchen in gerader Linie</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
