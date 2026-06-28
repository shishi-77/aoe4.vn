import './assets/main.css'
import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes } from './router'

export const createApp = ViteSSG(
  App,
  {
    routes,
    base: import.meta.env.BASE_URL,
    // ViteSSG creates the runtime router from these options, so scroll
    // behavior must live here - the createRouter in ./router is only used by tests.
    scrollBehavior: (_to, _from, savedPosition) => savedPosition ?? { top: 0 },
  },
  ({ app }) => {
    void app
  },
)
