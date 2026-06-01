<script setup lang="ts">
import { useStoryblok } from '@storyblok/vue'

const story = await useStoryblok(`training/trainings`, { version: 'draft' })
</script>
<template>
  <div v-if="story" v-editable="story" class="min-h-screen bg-gray-50 pb-12">
    <div class="w-full py-14 bg-[#032650] text-center px-4">
      <h1 class="text-3xl font-black text-white uppercase tracking-wider">
        {{ story.content.title || 'Teamseite' }}
      </h1>
    </div>
  </div>
</template>
