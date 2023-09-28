import process from 'node:process'
import { join } from 'pathe'
import { defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'eslint-flat-config-viewer',
  },
  setup(_, nuxt) {
    const cwd = process.cwd()
    const config = process.env.ESLINT_CONFIG || 'eslint.config.js'

    nuxt.options.runtimeConfig.public = {
      configPath: join(cwd, config),
    }
  },
})
