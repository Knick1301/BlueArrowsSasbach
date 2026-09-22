<script setup lang="ts">
import { STORYBLOK_VERSION, CONFIG_STORY } from '@/storyblok'
import { useRoute } from 'vue-router'
import basLogo from '@/assets/BASlogo.png'
import instagramLogo from '@/assets/InstagramLogo.png'
import facebookLogo from '@/assets/FacebookLogo.png'
import { useStoryblokApi } from '@storyblok/vue'
import { getUrl, type StoryblokLink } from '@/utils/methods.ts'

import { computed, onMounted, ref } from 'vue'

const isMenuOpen = ref(false)
const route = useRoute()

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const openSubMenu = ref<string | null>(null)

const toggleSubMenu = (id: string) => {
  if (openSubMenu.value === id) {
    openSubMenu.value = null
  } else {
    openSubMenu.value = id
  }
}

const closeMenu = () => {
  isMenuOpen.value = false
}

interface HeadersBlok {
  _uid: string
  component: string
  title: string
  link?: StoryblokLink
  subLinks?: { title: string; link: StoryblokLink }[]
}

const storyblokApi = useStoryblokApi()

const body = ref<{ component: string }[]>([])

onMounted(async () => {
  try {
    const { data } = await storyblokApi.get(`cdn/stories/${CONFIG_STORY}`, {
      version: STORYBLOK_VERSION,
    })

    body.value = data.story.content.body
  } catch (error) {
    console.error('Error fetching Storyblok content:', error)
  }
})

const navItems = computed(() =>
  body.value.filter(
    (blok: { component: string }): blok is HeadersBlok => blok.component === 'Headers',
  ),
)
</script>

<template v-if="body.length > 0">
  <div class="min-h-screen flex flex-col font-sans bg-gray-100">
    <header
      class="sticky top-0 z-[1000] w-full h-24 bg-white shadow-md flex items-center px-4 overflow-visible"
    >
      <div
        class="max-w-7xl mx-auto w-full flex items-center justify-between overflow-visible relative"
      >
        <div class="hidden lg:block w-20"></div>

        <nav class="flex items-center bg-transparent rounded-full px-2 py-1 overflow-visible">
          <router-link
            to="/"
            @click="closeMenu"
            class="relative w-24 h-full flex items-center justify-center mr-8 overflow-visible group z-[1100]"
          >
            <img
              :src="basLogo"
              class="absolute left-1/2 -translate-x-1/2 max-w-none transition-transform group-hover:scale-105"
              :class="['-top-10 w-28', 'lg:-top-10 lg:w-45']"
              alt="BAS Logo"
            />
          </router-link>

          <div class="hidden lg:flex items-center gap-1">
            <div v-for="item in navItems" :key="item._uid" class="relative group">
              <div
                v-editable="item"
                class="px-4 py-2 text-base font-semibold text-[#032650] hover:text-blue-700 transition-all rounded-full flex items-center gap-1 select-none cursor-pointer"
              >
                {{ item.title }}
                <svg
                  v-if="item.subLinks?.length"
                  class="w-4 h-4 transition-transform group-hover:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              <div
                v-if="item.subLinks?.length"
                class="absolute left-0 mt-0 w-48 bg-white shadow-xl rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 z-[1200]"
              >
                <router-link
                  v-for="sub in item.subLinks"
                  :key="sub.title"
                  :to="getUrl(sub.link)"
                  @click="closeMenu"
                  class="block px-4 py-2 text-sm text-[#032650] hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  {{ sub.title }}
                </router-link>
              </div>
            </div>

            <router-link
              :to="{ name: 'kontakt' }"
              class="ml-2 bg-[#032650] text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-900 transition-colors shadow-sm"
            >
              Kontakt
            </router-link>
          </div>
        </nav>

        <div class="lg:hidden flex items-center">
          <button
            @click="toggleMenu"
            class="relative w-10 h-10 text-[#032650] focus:outline-none z-[1100]"
            aria-label="Menü öffnen"
          >
            <div
              class="block w-6 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <span
                class="block absolute h-0.5 w-6 bg-current transform transition duration-500 ease-in-out"
                :class="{ 'rotate-45': isMenuOpen, '-translate-y-1.5': !isMenuOpen }"
              ></span>
              <span
                class="block absolute h-0.5 w-6 bg-current transform transition duration-500 ease-in-out"
                :class="{ 'opacity-0': isMenuOpen }"
              ></span>
              <span
                class="block absolute h-0.5 w-6 bg-current transform transition duration-500 ease-in-out"
                :class="{ '-rotate-45': isMenuOpen, 'translate-y-1.5': !isMenuOpen }"
              ></span>
            </div>
          </button>
        </div>

        <div class="hidden lg:block w-20"></div>
      </div>

      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <div
          v-if="isMenuOpen"
          class="fixed inset-0 bg-white z-[1050] flex flex-col pt-24 px-8 lg:hidden overflow-y-auto"
        >
          <div class="flex flex-col gap-4">
            <div v-for="item in navItems" :key="item._uid" class="border-b border-gray-100 pb-2">
              <button
                type="button"
                @click="item.subLinks?.length ? toggleSubMenu(item._uid) : null"
                class="w-full flex justify-between items-center py-2 text-left"
                :class="{ 'cursor-pointer': item.subLinks?.length }"
              >
                <span class="text-2xl font-bold text-[#032650]">
                  {{ item.title }}
                </span>

                <span v-if="item.subLinks?.length" class="p-2 text-[#032650]">
                  <svg
                    :class="{ 'rotate-180': openSubMenu === item._uid }"
                    class="w-6 h-6 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </button>

              <div
                v-if="openSubMenu === item._uid && item.subLinks?.length"
                class="pl-4 flex flex-col gap-4 pb-4 mt-2 border-l-2 border-blue-100 transition-all"
              >
                <router-link
                  v-for="sub in item.subLinks"
                  :key="sub.title"
                  :to="getUrl(sub.link)"
                  @click="closeMenu"
                  class="text-lg text-gray-600 hover:text-blue-600"
                >
                  {{ sub.title }}
                </router-link>
              </div>
            </div>

            <router-link
              :to="{ name: 'kontakt' }"
              @click="closeMenu"
              class="mt-6 bg-[#032650] text-white px-8 py-3 rounded-full text-lg font-bold text-center"
            >
              Kontakt
            </router-link>
          </div>
        </div>
      </transition>
    </header>

    <main class="flex-grow flex flex-col">
      <Suspense>
        <router-view :key="route.path" />
      </Suspense>
    </main>

    <footer class="bg-[#032650] relative flex justify-center items-center h-24 mt-auto px-6">
      <a
        href="https://www.facebook.com/bluearrows.de"
        target="_blank"
        rel="noopener noreferrer"
        class="absolute left-6 hover:scale-110 transition-transform md:hidden block"
        aria-label="Facebook"
      >
        <img :src="facebookLogo" class="w-13 h-13 object-contain" alt="Facebook" />
      </a>
      <img :src="basLogo" class="h-20 w-auto object-contain" alt="BAS Footer Logo" />

      <a
        href="https://www.facebook.com/bluearrows.de"
        target="_blank"
        rel="noopener noreferrer"
        class="absolute right-24 hover:scale-110 transition-transform hidden md:block"
        aria-label="Facebook"
      >
        <img :src="facebookLogo" class="w-13 h-13 object-contain" alt="Facebook" />
      </a>
      <a
        href="https://www.instagram.com/bluearrows.de/"
        target="_blank"
        rel="noopener noreferrer"
        class="absolute right-6 hover:scale-110 transition-transform"
        aria-label="Instagram"
      >
        <img :src="instagramLogo" class="w-13 h-13 object-contain" alt="Instagram" />
      </a>
    </footer>

    <div class="bg-[#021b3d] flex justify-center items-center gap-4 py-2 px-6">
      <router-link
        to="/impressum"
        class="text-blue-200 text-xs font-medium hover:text-white transition-colors"
      >
        Impressum
      </router-link>
      <span class="text-blue-200/40 text-xs">|</span>
      <router-link
        to="/datenschutz"
        class="text-blue-200 text-xs font-medium hover:text-white transition-colors"
      >
        Datenschutz
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.nav-link.router-link-active {
  color: #2563eb;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0px;
  left: 20%;
  right: 20%;
  height: 2px;
  background-color: #2563eb;
  border-radius: 2px;
  animation: slideIn 0.3s ease forwards;
}

@keyframes slideIn {
  from {
    transform: scaleX(0);
    opacity: 0;
  }

  to {
    transform: scaleX(1);
    opacity: 1;
  }
}

header {
  backface-visibility: hidden;
}
</style>
