import { fileURLToPath, URL } from 'node:url'

import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

const ishdDevApi = (): Plugin => ({
  name: 'ishd-dev-api',
  configureServer(server) {
    server.middlewares.use('/api/ishd', async (req, res) => {
      const { GET } = await server.ssrLoadModule('/api/ishd.ts')
      const response: Response = await GET(new Request(`http://localhost${req.originalUrl}`))
      res.statusCode = response.status
      response.headers.forEach((value, key) => res.setHeader(key, value))
      res.end(await response.text())
    })
  },
})

// Lokal gibt es kein PHP: Anmeldungen nur in der Konsole ausgeben statt Mails zu verschicken.
const anmeldungDevApi = (): Plugin => ({
  name: 'anmeldung-dev-api',
  configureServer(server) {
    server.middlewares.use('/api/anmeldung', async (req, res) => {
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      if (req.method !== 'POST') {
        res.statusCode = 405
        res.end(JSON.stringify({ error: 'Nur POST erlaubt.' }))
        return
      }
      let body = ''
      for await (const chunk of req) body += chunk
      console.log('[anmeldung] Neue Laufschul-Anmeldung (nicht versendet):', JSON.parse(body))
      res.end(JSON.stringify({ ok: true }))
    })
  },
})

export default defineConfig(({ command, mode }) => ({
  plugins: [
    vue(),
    tailwindcss(),
    ...(command === 'serve' && mode !== 'test'
      ? [vueDevTools(), basicSsl(), ishdDevApi(), anmeldungDevApi()]
      : []),
  ],
  server: {
    port: 5173,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
