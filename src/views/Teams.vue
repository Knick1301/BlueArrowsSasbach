<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useStoryblok } from '@storyblok/vue'
import { computed } from 'vue'
import PlayerCard from '@/components/Player.vue'
import GameTable from '@/components/GameTable.vue'
import Table from '@/components/Table.vue'

const route = useRoute()

const teamSlug = computed(() => route.params.teamName as string)

let story: Awaited<ReturnType<typeof useStoryblok>> | null = null
try {
  story = await useStoryblok(`teams/${teamSlug.value}`, { version: 'draft' })
} catch (e) {
  console.error(`Storyblok-Story "teams/${teamSlug.value}" konnte nicht geladen werden.`, e)
}

interface TrainerBlok {
  _uid: string
  component: 'staff'
  bild: {
    filename: string
  }
  name: string
  email: string
  role: string[]
}

interface PlayerBlok {
  _uid: string
  component: 'player'
  name: string
  position: 'goalie' | 'defender' | 'forward'
  nummer: number | string
  bild: {
    filename: string
  }
}

const staff = computed(() => {
  const staffData = story?.value?.content?.staff
  if (Array.isArray(staffData)) {
    return staffData.filter((blok: any): blok is TrainerBlok => blok.component === 'staff')
  }
  return []
})

const allPlayers = computed(() => {
  const playersData = story?.value?.content?.players
  if (Array.isArray(playersData)) {
    return playersData.filter((blok: any): blok is PlayerBlok => blok.component === 'player')
  }
  return []
})

const allTeamGames = computed(() => {
  const gamesData = story?.value?.content?.games
  if (Array.isArray(gamesData)) {
    return gamesData.filter((blok: any) => blok.component === 'games')
  }
  return []
})

const allTeamTable = computed(() => {
  const tableData = story?.value?.content?.table
  if (Array.isArray(tableData)) {
    return tableData.filter((blok: any) => blok.component === 'table')
  }
  return []
})

const goalies = computed(() => allPlayers.value.filter((player) => player.position === 'goalie'))
const defenders = computed(() =>
  allPlayers.value.filter((player) => player.position === 'defender'),
)
const forwards = computed(() => allPlayers.value.filter((player) => player.position === 'forward'))
</script>

<template>
  <div v-if="story" v-editable="story" class="min-h-screen mb-15">
    <div class="w-full py-8 bg-[#032650] text-center px-4 mb-15">
      <h1 class="text-3xl font-black text-white uppercase tracking-wider">
        {{ story.content.title || 'Teamseite' }}
      </h1>
      <h5 class="text-sm text-blue-200 mt-5 font-medium uppercase tracking-wide">
        {{ story.content.liga || 'Liga nicht angegeben' }}
      </h5>
    </div>

    <div v-if="story.content.heroImage?.filename" class="block xl:hidden mx-auto px-4 mt-6 w-[95%]">
      <img :src="story.content.heroImage.filename" alt="Teamfoto kompakt"
        class="w-full h-auto rounded-xl shadow-sm border border-gray-200" />
    </div>

    <div class="mx-auto px-4 w-[95%] mt-8 flex flex-col xl:grid xl:grid-cols-5 gap-8 relative">
      <div class="order-4 xl:order-1 xl:col-span-3">
        <h2 class="text-3xl font-bold text-[#032650] border-b-3 border-blue-200 pb-2 mb-6">
          Kader
        </h2>

        <p v-if="!allPlayers.length" class="text-gray-500 italic">
          Noch keine Spieler eingetragen.
        </p>

        <div v-else class="space-y-8">
          <div v-if="goalies.length">
            <h3 class="font-bold text-[#032650] uppercase tracking-wider text-sm border-b-3 inline-block pb-1 mb-4">
              Torhüter
            </h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <PlayerCard v-for="player in goalies" :key="player._uid" :name="player.name" :position="player.position"
                :nummer="player.nummer" :bild="player.bild?.filename" :blok="player" />
            </div>
          </div>

          <div v-if="defenders.length">
            <h3 class="font-bold text-[#032650] uppercase tracking-wider text-sm border-b-3 inline-block pb-1 mb-4">
              Verteidigung
            </h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <PlayerCard v-for="player in defenders" :key="player._uid" :name="player.name" :position="player.position"
                :nummer="player.nummer" :bild="player.bild?.filename" :blok="player" />
            </div>
          </div>

          <div v-if="forwards.length">
            <h3 class="font-bold text-[#032650] uppercase tracking-wider text-sm border-b-3 inline-block pb-1 mb-4">
              Sturm
            </h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <PlayerCard v-for="player in forwards" :key="player._uid" :name="player.name" :position="player.position"
                :nummer="player.nummer" :bild="player.bild?.filename" :blok="player" />
            </div>
          </div>
        </div>
      </div>

      <div class="order-1 xl:order-2 xl:col-span-2">
        <div class="sticky top-32 flex flex-col gap-5">
          <div v-if="story.content.heroImage?.filename"
            class="bg-white p-3 rounded-xl shadow-sm border border-gray-200 hidden xl:block">
            <img :src="story.content.heroImage.filename" alt="Teamfoto kompakt" class="w-full h-auto rounded-lg" />
          </div>

          <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h3 class="font-bold text-[#032650] mb-4 uppercase tracking-wider text-sm border-b-2 pb-2">
              Ansprechpartner
            </h3>
            <div class="flex flex-col mt-4">
              <div v-for="member in staff" :key="member._uid"
                class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3 border-b border-gray-100 last:border-0 last:pb-0">
                <div class="flex items-center gap-3">
                  <img v-if="member.bild?.filename" :src="member.bild.filename"
                    class="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-200" alt="Profilbild" />
                  <div class="flex flex-col">
                    <span class="font-bold text-[#032650]">{{ member.name }}</span>
                    <span v-if="member.role?.length" class="text-xs uppercase tracking-wide mt-0.5">
                      {{ member.role.join(', ') }}
                    </span>
                  </div>
                </div>
                <a :href="`mailto:${member.email}`"
                  class="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                  E-Mail schreiben
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="order-2 xl:order-3 xl:col-span-3">
        <GameTable :games="allTeamGames" />
      </div>

      <div class="order-3 xl:order-4 xl:col-span-2">
        <Table :teams="allTeamTable" />
      </div>
    </div>
  </div>

  <div v-else class="min-h-screen flex flex-col items-center justify-center text-center px-4 py-20">
    <h1 class="text-2xl font-black text-[#032650] uppercase tracking-wide mb-4">
      Team nicht gefunden
    </h1>
    <p class="text-gray-600 mb-6 max-w-md">
      Dieses Team existiert nicht oder wurde entfernt.
    </p>
    <router-link to="/"
      class="inline-block bg-[#032650] text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-900 transition-colors text-sm">
      Zur Startseite
    </router-link>
  </div>
</template>