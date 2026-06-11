import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Đường dẫn gốc khi serve tại https://shishi-77.github.io/aoe4.vn/
  // Khi trỏ DNS aoe4.vn về GitHub Pages và gắn custom domain, đổi lại thành '/'
  base: '/aoe4.vn/',
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
