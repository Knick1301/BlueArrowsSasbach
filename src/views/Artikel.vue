<script setup lang="ts">
import { renderRichText, useStoryblok } from '@storyblok/vue'
import { STORYBLOK_VERSION } from '@/storyblok'
import { formatDate, resizeImage } from '@/utils/methods.ts'
import { setPageMeta } from '@/utils/seo'
import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import DecoratedCard from '@/components/DecoratedCard.vue'

import { Swiper, SwiperSlide } from 'swiper/vue'
import type { Swiper as SwiperType } from 'swiper'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const modules = [Navigation, Pagination]

const route = useRoute()
const slug = route.params.slug

let story: Awaited<ReturnType<typeof useStoryblok>> | null = null
try {
  story = await useStoryblok(`aktuelles/news/${slug}`, { version: STORYBLOK_VERSION })
} catch (e) {
  console.error(`Storyblok-Story "aktuelles/news/${slug}" konnte nicht geladen werden.`, e)
}

const images = computed(
  () => (story?.value?.content.image as { filename: string }[] | undefined) ?? [],
)

// Bilder werden erst geladen, wenn ihr Slide der aktuelle oder der nächste ist.
const reachedSlide = ref(0)
const currentSlide = ref(0)
const onSlideChange = (swiper: SwiperType) => {
  currentSlide.value = swiper.activeIndex
  reachedSlide.value = Math.max(reachedSlide.value, swiper.activeIndex)
}

setPageMeta({ title: story?.value?.content.title, image: resizeImage(images.value[0]?.filename, 1200) })
</script>

<template>
  <div v-if="story" class="pb-20">
    <div class="w-full py-[54px] bg-[#032650] text-center px-4 relative flex items-center justify-center">
      <router-link to="/aktuelles/news"
        class="absolute left-4 md:left-10 inline-flex items-center leading-none gap-1.5 text-white font-bold hover:text-gray-300 transition-colors text-sm">
        <span class="inline-block leading-none">&larr;</span>
        <span class="leading-none">Zurück</span>
      </router-link>

      <h1 class="text-2xl font-black text-white uppercase tracking-wider truncate px-20 md:px-28">
        <span class="md:hidden">News</span>
        <span class="hidden md:inline">{{ story.content.title }}</span>
      </h1>

      <span v-if="story.content.score"
        class="hidden md:inline-block absolute right-4 md:right-10 bg-white text-[#032650] text-base font-black px-3 py-1 rounded-lg shadow-sm leading-none">
        {{ story.content.score }}
      </span>
    </div>

    <div class="w-[95%] max-w-4xl mx-auto mt-10">
      <DecoratedCard content-class="flex flex-col">

        <div v-if="images.length > 1" class="w-full shrink-0">
          <div class="relative w-full aspect-[600/348] rounded-t-xl overflow-hidden">
          <Swiper :modules="modules" :navigation="true" :pagination="{ el: '.artikel-pagination', clickable: true }"
            class="w-full h-full" @slide-change="onSlideChange">
            <SwiperSlide v-for="(bild, index) in images" :key="index" class="bg-gray-100">
              <img v-if="index <= reachedSlide + 1" :src="resizeImage(bild.filename, 1200)"
                :alt="`Artikel Bild ${index + 1}`" :fetchpriority="index === 0 ? 'high' : 'auto'" decoding="async"
                class="w-full h-full object-cover" />
            </SwiperSlide>
          </Swiper>
          <span
            class="absolute top-3 right-3 z-10 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white tabular-nums backdrop-blur-sm">
            {{ currentSlide + 1 }}/{{ images.length }}
          </span>
          </div>
          <div class="artikel-pagination flex justify-center items-center py-3"></div>
        </div>
        <img v-else-if="images[0]?.filename" :src="resizeImage(images[0].filename, 1200)" alt="Artikel Bild" fetchpriority="high"
          class="w-full aspect-[600/348] h-auto object-cover shrink-0 rounded-t-xl" />

        <div class="md:hidden px-6 pt-5 pb-5 border-b border-gray-200">
          <div class="flex items-center justify-between mb-3">
            <span class="text-[#032650] font-bold text-sm uppercase tracking-wider">
              {{ formatDate(story.content.date) }}
            </span>
            <span v-if="story.content.score"
              class="bg-[#032650] text-white text-sm font-bold px-2.5 py-1 rounded-md tracking-wide shrink-0">
              {{ story.content.score }}
            </span>
          </div>
          <h2 class="text-2xl font-black text-gray-900 leading-tight">
            {{ story.content.title }}
          </h2>
        </div>

        <div class="min-w-0 px-6 pb-6 pt-4 md:p-10 lg:p-12">
          <p
            class="hidden md:inline-block text-gray-500 font-bold uppercase tracking-wider text-sm mb-8 text-center border-b border-gray-200 pb-4 w-full">
            {{ formatDate(story.content.date) }}
          </p>

          <div
            class="prose prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800 prose-lg md:prose-xl max-w-none break-words text-gray-800 prose-h4:mt-8 prose-h4:mb-2 prose-h5:mt-8 prose-h5:mb-2 prose-h6:mt-8 prose-h6:mb-2 prose-h4:text-[#032650] prose-h5:text-[#032650] prose-h6:text-[#032650] prose-h4:font-black prose-h5:font-black prose-h6:font-black"
            v-html="renderRichText(story.content.content)">
          </div>
        </div>

      </DecoratedCard>
    </div>
  </div>

  <div v-else class="min-h-screen flex flex-col items-center justify-center text-center px-4 py-20">
    <h1 class="text-2xl font-black text-[#032650] uppercase tracking-wide mb-4">
      Artikel nicht gefunden
    </h1>
    <p class="text-gray-600 mb-6 max-w-md">
      Dieser Artikel existiert nicht oder wurde entfernt.
    </p>
    <router-link to="/aktuelles/news"
      class="inline-block bg-[#032650] text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-900 transition-colors text-sm">
      Zu den News
    </router-link>
  </div>
</template>

<style scoped>
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  width: 36px;
  height: 36px;
  margin-top: -18px;
  border-radius: 9999px;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.55);
}

:deep(.swiper-button-next::after),
:deep(.swiper-button-prev::after) {
  font-size: 15px;
  font-weight: 900;
}

.artikel-pagination {
  --swiper-pagination-color: #032650;
  --swiper-pagination-bullet-inactive-color: #9ca3af;
  --swiper-pagination-bullet-inactive-opacity: 0.6;
  --swiper-pagination-bullet-size: 7px;
  --swiper-pagination-bullet-horizontal-gap: 3px;
}
</style>
