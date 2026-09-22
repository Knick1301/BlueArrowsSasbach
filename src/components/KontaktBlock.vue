<script setup lang="ts">
import { resizeImage } from '@/utils/methods'
import type { Ansprechpartner } from '@/utils/kontakt'

withDefaults(
  defineProps<{
    person: Ansprechpartner
    email?: string
  }>(),
  { email: 'info@bluearrows.de' },
)

const telefonLink = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`
</script>

<template>
  <div class="flex items-center gap-3 sm:gap-6">
    <img
      v-if="person.image"
      :src="resizeImage(person.image, 200)"
      :alt="person.name"
      loading="lazy"
      decoding="async"
      class="w-20 sm:w-24 aspect-[3/4] object-cover object-top rounded-lg border-2 border-[#032650] shadow-sm shrink-0"
    />

    <div class="flex flex-col items-start gap-1 min-w-0">
      <span class="text-[#032650] font-bold">{{ person.name }}</span>

      <a
        v-if="person.phone"
        :href="telefonLink(person.phone)"
        class="flex items-center gap-1.5 whitespace-nowrap text-[13px] sm:text-sm font-medium text-gray-500 hover:text-[#032650] transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.25 6.75c0 8.284 6.716 15 15 15h1.5a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106a1.125 1.125 0 0 0-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97a1.125 1.125 0 0 0 .417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
          />
        </svg>
        {{ person.phone }}
      </a>

      <a
        :href="`mailto:${email}`"
        class="flex items-center gap-1.5 whitespace-nowrap text-[13px] sm:text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
          />
        </svg>
        E-Mail schreiben
      </a>
    </div>
  </div>
</template>
