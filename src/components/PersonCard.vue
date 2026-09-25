<script setup lang="ts">
interface Person {
  _uid: string
  name: string
  role?: string
  image?: { filename: string }
  email?: string
  phone?: string
}

defineProps<{
  person: Person
}>()
</script>

<template>
  <div
    class="flex flex-row items-stretch min-h-32 sm:min-h-52 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all">
    <div class="relative w-21 h-auto sm:w-32 lg:w-40 shrink-0 bg-gray-200">
      <img v-if="person.image?.filename" loading="lazy" decoding="async" :src="person.image.filename" :alt="person.name"
        class="absolute inset-0 w-full h-full object-cover" />
      <div v-else class="absolute inset-0 flex items-center justify-center text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-10 h-10 sm:w-14 sm:h-14">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      </div>
    </div>
    <div class="flex flex-col justify-center min-w-0 flex-1 px-3 py-3 sm:px-5 sm:py-4 gap-1 sm:gap-1.5">
      <p class="text-base font-black text-[#032650] uppercase tracking-wide">
        {{ person.name }}
      </p>
      <span v-if="person.role"
        class="inline-block bg-blue-50 text-[#032650] text-[11px] sm:text-xs leading-tight font-bold uppercase tracking-wide px-2 sm:px-2.5 py-1 rounded-xl w-fit max-w-full">
        {{ person.role }}
      </span>
      <div class="flex flex-col gap-1 mt-1 min-w-0">
        <a v-if="person.email" :href="`mailto:${person.email}`"
          class="flex items-start gap-1.5 break-all text-[13px] sm:text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
            class="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 mt-0.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
          {{ person.email }}
        </a>
        <a v-if="person.phone" :href="`tel:${person.phone}`"
          class="flex items-center gap-1.5 whitespace-nowrap text-[13px] sm:text-sm text-gray-500 font-medium hover:text-[#032650] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
            class="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M2.25 6.75c0 8.284 6.716 15 15 15h1.5a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106a1.125 1.125 0 0 0-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97a1.125 1.125 0 0 0 .417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
          </svg>
          <span>{{ person.phone }}</span>
        </a>
      </div>
    </div>
  </div>
</template>
