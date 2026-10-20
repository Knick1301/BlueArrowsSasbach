<script setup lang="ts">
import basLogo from '@/assets/BASlogo.webp'
</script>

<!-- Ersatz, wenn in Storyblok kein Bild hinterlegt ist: Vereinsfarbe mit Logo -->
<template>
  <div class="bg-[#032650] flex items-center justify-center">
    <img :src="basLogo" alt="" class="h-1/2 max-h-40 w-auto object-contain opacity-90" />
  </div>
</template>
