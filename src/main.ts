import { createApp } from 'vue'
import './assets/main.css'
import { StoryblokVue, apiPlugin } from '@storyblok/vue'

import App from './App.vue'
import router from './router'

const accessToken = import.meta.env.VITE_STORYBLOK_TOKEN
if (!accessToken) {
  throw new Error('VITE_STORYBLOK_TOKEN ist nicht gesetzt (siehe .env.example).')
}

const app = createApp(App)

app.use(StoryblokVue, {
  accessToken,
  use: [apiPlugin],
})
app.use(router)

app.mount('#app')
