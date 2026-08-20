<script setup lang="ts">
import { useStoryblok } from '@storyblok/vue'
import { STORYBLOK_VERSION } from '@/storyblok'
import { computed, ref } from 'vue'
import GameCard from '@/components/GameCard.vue'

import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

const modules = [Navigation]

const selectedTeam = ref('Alle')

interface StoryblokLink {
  linktype: string
  cached_url?: string
  url?: string
}

interface NextGameBlok {
  _uid: string
  component: string
  date: string
  homeTeam: string
  awayTeam: string
  homelogo?: { filename: string }
  awaylogo?: { filename: string }
  venue?: string
  team: string
}

interface TeaserBlok {
  _uid: string
  component: string
  headline: string
  subline?: string
}

interface CardBlok {
  _uid: string
  component: string
  title: string
  image?: {
    filename: string
  }
  link?: StoryblokLink
}

const teamOrder = ['Herren', 'Junioren', 'Jugend', 'Schüler', 'Bambini']

const teamOptions = computed(() => {
  const now = new Date()

  const upcomingGames = nextGames.value.filter((g: any) => new Date(g.date) >= now)

  const teams = [...new Set<string>(upcomingGames.map((g: any) => g.team as string))]

  const sortedTeams = teams.sort((a, b) => {
    let indexA = teamOrder.indexOf(a)
    let indexB = teamOrder.indexOf(b)

    if (indexA === -1) indexA = 99
    if (indexB === -1) indexB = 99

    return indexA - indexB
  })

  return ['Alle', ...sortedTeams]
})

const story = await useStoryblok('home', { version: STORYBLOK_VERSION })

const teaser = computed(() =>
  story.value?.content.body.find((blok: any): blok is TeaserBlok => blok.component === 'teaser'),
)

const teamCards = computed(
  () =>
    story.value?.content.body.filter(
      (blok: any): blok is CardBlok => blok.component === 'TeamCard',
    ) || [],
)

const newsCards = computed(
  () =>
    story.value?.content.body.filter(
      (blok: any): blok is CardBlok => blok.component === 'NewsCard',
    ) || [],
)

const nextGames = computed(
  () =>
    story.value?.content.body.filter(
      (blok: any): blok is NextGameBlok => blok.component === 'NextGame',
    ) || [],
)

const getUrl = (link: StoryblokLink | undefined): string => {
  if (!link) return '#'
  if (link.linktype === 'story' && link.cached_url) {
    return link.cached_url.startsWith('/') ? link.cached_url : '/' + link.cached_url
  }
  return link.url || '#'
}

const filteredGames = computed(() => {
  const now = new Date()
  return nextGames.value
    .filter((g: any) => new Date(g.date) >= now)
    .filter((g: any) => selectedTeam.value === 'Alle' || g.team === selectedTeam.value)
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4)
})
</script>

<template v-if="story && story.content">
  <div class="mainPicture w-full flex items-center h-[25vh] lg:h-[45vh] m-0 p-0">
    <h1 v-if="teaser"
      class="text-white text-[5vmin] font-extrabold leading-loose ml-[10vmin] drop-shadow-[2px_2px_8px_rgba(255,255,255,0.2)]"
      v-editable="teaser">
      {{ teaser.headline }}
      <br v-if="teaser.subline" />
      {{ teaser.subline }}
    </h1>
  </div>

  <div class="bg-[#f2eded] p-6 pt-0 flex-grow flex flex-col">
    <div class="grid grid-cols-1 sm:gap-10 lg:grid-cols-12 lg:gap-20 items-stretch">
      <div class="lg:col-span-4 col-span-1 flex flex-col h-full order-2 lg:order-1">
        <h2 class="font-bold text-[#032650] border-b-4 border-[#032650] inline-block mb-8 mt-4 text-2xl self-start">
          Unsere Teams
        </h2>

        <div
          class="flex flex-wrap lg:flex-nowrap h-auto lg:h-[clamp(150px,20vh,250px)] mt-auto justify-between gap-y-4 lg:gap-y-0">
          <router-link v-for="team in teamCards" :key="team._uid" :to="getUrl(team.link)" v-editable="team"
            class="bg-white w-[48%] lg:w-[23%] rounded-t-xl rounded-b-lg master-card-shadow hover:-translate-y-1 transition-all flex flex-col overflow-hidden active:scale-95">
            <img :src="team.image?.filename" class="aspect-video lg:h-[80%] w-full object-cover" alt="Team Image" />
            <div
              class="text-xm lg:text-[1.7vmin] font-bold text-[#032650] flex items-center justify-center h-[20%] px-2 text-center">
              {{ team.title }}
            </div>
          </router-link>
        </div>
      </div>

      <div class="lg:col-span-3 col-span-1 flex flex-col lg:pl-4 h-full order-1 lg:order-2">
        <h2
          class="font-bold text-[#032650] border-b-4 border-[#032650] inline-block mb-8 mx-8 mt-4 text-2xl self-start">
          <router-link to="/news" class="hover:text-blue-800 transition-colors">Aktuelle News</router-link>
        </h2>

        <div class="mt-auto relative w-full h-[clamp(150px,20vh,250px)] px-8">
          <template v-if="newsCards.length > 0">
            <button
              class="news-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 text-[#032650] hover:scale-110 transition-transform cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            <Swiper :modules="modules" :slides-per-view="2" :space-between="16" :navigation="{
              prevEl: '.news-prev',
              nextEl: '.news-next',
            }" class="w-full h-full pb-4">
              <swiper-slide v-for="news in newsCards" :key="news._uid">
                <router-link :to="getUrl(news.link)" v-editable="news"
                  class="bg-white w-full h-full rounded-t-xl rounded-b-lg master-card-shadow hover:-translate-y-1 transition-all flex flex-col overflow-hidden active:scale-95">
                  <img :src="news.image?.filename" class="h-[60%] w-full object-cover" alt="News Image" />
                  <div
                    class="text-xs lg:text-[1.7vmin] font-bold text-[#032650] flex items-center justify-center p-2 text-center flex-grow">
                    {{ news.title }}
                  </div>
                </router-link>
              </swiper-slide>
            </Swiper>

            <button
              class="news-next absolute right-0 top-1/2 -translate-y-1/2 z-10 text-[#032650] hover:scale-110 transition-transform cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </template>

          <div v-else
            class="w-full h-full flex items-center justify-center text-[#032650] font-medium text-center px-4">
            Aktuell keine News verfügbar.
          </div>
        </div>
      </div>

      <div class="lg:col-span-5 col-span-1 flex flex-col lg:pl-6 h-full order-3">
        <div class="px-8">
          <h2
            class="font-bold text-[#032650] border-b-4 border-[#032650] inline-block mb-6 mt-4 text-2xl self-start ml-1">
            Nächste Spiele
          </h2>

          <div v-if="teamOptions.length > 1" class="mt-auto flex flex-wrap gap-2 mb-4 pl-1">
            <button v-for="option in teamOptions" :key="option" @click="selectedTeam = option" :class="[
              'px-3 py-1 text-sm font-medium rounded-full transition-colors cursor-pointer',
              selectedTeam === option
                ? 'bg-[#032650] text-white shadow-sm'
                : 'border border-[#032650] text-[#032650] hover:bg-[#032650] hover:text-white',
            ]">
              {{ option }}
            </button>
          </div>
        </div>

        <div class="relative w-full mt-auto px-8">
          <template v-if="filteredGames.length > 0">
            <button
              class="swiper-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 text-[#032650] hover:scale-110 transition-transform cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            <swiper :modules="modules" :slides-per-view="2" :space-between="16" :navigation="{
              prevEl: '.swiper-prev-custom',
              nextEl: '.swiper-next-custom',
            }" :key="filteredGames.length" class="w-full h-[clamp(150px,20vh,250px)] overflow-hidden">
              <swiper-slide v-for="game in filteredGames" :key="game._uid">
                <GameCard :date="game.date" :home-team="game.homeTeam" :away-team="game.awayTeam"
                  :homelogo="game.homelogo?.filename" :awaylogo="game.awaylogo?.filename" :venue="game.venue"
                  :team="game.team" v-editable="game" class="master-card-shadow" />
              </swiper-slide>
            </swiper>

            <button
              class="swiper-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 text-[#032650] hover:scale-110 transition-transform cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </template>

          <div v-else
            class="w-full h-[clamp(150px,20vh,250px)] flex items-center justify-center text-[#032650] font-bold text-center px-4 text-lg">
            Aktuell keine Spiele geplant.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mainPicture {
  background-image:
    linear-gradient(to right, rgba(2, 23, 49, 0.95) 30%, rgba(14, 112, 231, 0) 70%),
    url(@/assets/team.png);
  background-size: cover;
  color: rgb(3, 38, 80);
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: #032650 !important;
  transform: scale(0.4);
  font-weight: bold;
}

:deep(.swiper) {
  overflow: visible !important;
  clip-path: inset(-100px -3px -100px -3px);
  width: 100%;
  height: 100%;
}

.master-card-shadow {
  background-color: white;
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.master-card-shadow:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.3);
}

.swiper-button-disabled {
  opacity: 0.2;
  cursor: not-allowed;
  pointer-events: none;
  filter: grayscale(100%);
}
</style>