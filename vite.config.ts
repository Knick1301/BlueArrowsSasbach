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

export default defineConfig(({ command, mode }) => ({
  plugins: [
    vue(),
    tailwindcss(),
    ...(command === 'serve' && mode !== 'test' ? [vueDevTools(), basicSsl(), ishdDevApi()] : []),
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
