<script setup lang="ts">
withDefaults(
  defineProps<{
    contentClass?: string
  }>(),
  { contentClass: 'p-6 px-4 md:p-10' },
)
</script>

<template>
  <div
    class="relative w-full bg-white rounded-xl border border-gray-200 shadow-sm text-gray-800"
    :class="contentClass"
  >
    <div
      class="absolute -top-2 -left-2 w-6 h-6 border-t-[3px] border-l-[3px] border-[#032650] rounded-tl-md pointer-events-none"
    ></div>
    <div
      class="absolute -top-2 -right-2 w-6 h-6 border-t-[3px] border-r-[3px] border-[#032650] rounded-tr-md pointer-events-none"
    ></div>
    <div
      class="absolute -bottom-2 -left-2 w-6 h-6 border-b-[3px] border-l-[3px] border-[#032650] rounded-bl-md pointer-events-none"
    ></div>
    <div
      class="absolute -bottom-2 -right-2 w-6 h-6 border-b-[3px] border-r-[3px] border-[#032650] rounded-br-md pointer-events-none"
    ></div>

    <slot />
  </div>
</template>
