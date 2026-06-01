import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/main.css'
import { StoryblokVue, apiPlugin } from '@storyblok/vue';


import App from './App.vue'
import router from './router'

const app = createApp(App)


app.use(StoryblokVue, {
    accessToken: 'xJmKf9Wz4kCCRkn96VgiAAtt',
    use: [apiPlugin]
});
app.use(createPinia())
app.use(router)

app.mount('#app')