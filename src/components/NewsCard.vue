<script setup lang="ts">
import { renderRichText, type StoryblokRichTextNode } from '@storyblok/vue'
import { formatDate, resizeImage } from '@/utils/methods.ts'

defineProps<{
    slug: string
    title: string
    date: string
    image?: { filename: string }
    content: StoryblokRichTextNode
    score?: string
}>()
</script>

<template>
    <router-link :to="`/aktuelles/news/${slug}`"
        class="group bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col transition-all hover:-translate-y-1 hover:shadow-md shadow-sm h-full">
        <div class="w-full aspect-[600/348] shrink-0 min-h-0">
            <img loading="lazy" decoding="async" v-if="image?.filename" :src="resizeImage(image.filename, 600)"
                alt="News Image" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center"></div>
        </div>

        <div class="p-5 pt-3 flex flex-col flex-grow">
            <div class="flex items-center justify-between mb-2">
                <span class="flex items-center text-[#032650] font-bold text-sm uppercase tracking-wider gap-2">
                    {{ formatDate(date) }}
                </span>

                <span v-if="score"
                    class="bg-[#032650] text-white text-sm font-bold px-2.5 py-1 rounded-md tracking-wide shrink-0">
                    {{ score }}
                </span>
            </div>

            <h3 class="text-xl font-black text-gray-900 leading-tight mb-3">
                {{ title }}
            </h3>

            <div class="text-gray-700 text-md mb-4 line-clamp-2 font-medium flex-grow break-words"
                v-html="renderRichText(content)"></div>

            <span class="inline-flex items-center gap-1.5 text-[#032650] font-bold text-sm mt-auto">
                Weiterlesen
                <span aria-hidden="true" class="transition-transform group-hover:translate-x-1">&rarr;</span>
            </span>
        </div>
    </router-link>
</template>
