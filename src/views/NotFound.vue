<template>
  <div class="min-h-screen flex flex-col items-center justify-center text-center px-4 py-20">
    <h1 class="text-2xl font-black text-[#032650] uppercase tracking-wide mb-4">
      Seite nicht gefunden
    </h1>
    <p class="text-gray-600 mb-6 max-w-md">Diese Seite existiert nicht oder wurde verschoben.</p>
    <router-link
      to="/"
      class="inline-block bg-[#032650] text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-900 transition-colors text-sm"
    >
      Zur Startseite
    </router-link>
  </div>
</template>
