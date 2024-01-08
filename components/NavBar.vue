<script setup lang="ts">
import { version } from '../package.json'
import { payload } from '~/composables/payload'
import { filtersRules as filters } from '~/composables/state'

const lastUpdate = useTimeAgo(() => payload.value.meta.lastUpdate)

const isDark = useDark()

const rules = computed(() => Object.values(payload.value.rules))
const deprecatedUsing = computed(() => rules.value.filter(rule => rule.deprecated && payload.value.ruleStateMap.get(rule.name)))

const router = useRouter()
function showDeprecated() {
  filters.status = 'deprecated'
  filters.plugin = ''
  filters.state = 'using'
  filters.search = ''

  if (router.currentRoute.value.path !== '/rules')
    router.push('/rules')
}
</script>

<template>
  <div text-3xl font-200>
    <a
      href="https://github.com/antfu/eslint-flat-config-viewer" target="_blank"
      flex="inline gap-2 items-center" mr1
    >
      <img src="/favicon.svg" inline-block h-1em> ESLint Flat Config Viewer
    </a>
    <sup op50>v{{ version }}</sup>
  </div>
  <div flex="~ gap-1 items-center" text-sm>
    <span font-mono op50>{{ payload.meta.configPath }}</span>
  </div>
  <div flex="~ gap-1 items-center" text-sm>
    <span op50>Composed with</span>
    <span font-bold>{{ payload.configs.length }}</span>
    <span op50>config items, updated</span>
    <span op75>{{ lastUpdate }}</span>
  </div>
  <div flex="~ gap-2 items-center" py2>
    <NuxtLink
      to="/configs" active-class="op100! bg-active"
      px3 py1 op50 border="~ base rounded"
      flex="~ gap-2 items-center"
    >
      <div i-carbon-list-dropdown flex-none />
      Config Items
    </NuxtLink>
    <NuxtLink
      to="/rules" active-class="op100! bg-active"
      px3 py1 op50 border="~ base rounded"
      flex="~ gap-2 items-center"
    >
      <div i-carbon-list-checked flex-none />
      Available Rules
    </NuxtLink>
    <button
      title="Toggle Dark Mode"
      i-carbon-sun dark:i-carbon-moon ml1 text-lg op50 hover:op75
      @click="isDark = !isDark"
    />
    <NuxtLink
      href="https://github.com/antfu/eslint-flat-config-viewer" target="_blank"
      i-carbon-logo-github text-lg op50 hover:op75
    />

    <div v-if="deprecatedUsing.length" ml-5>
      <button
        to="/configs" active-class="bg-active"
        border="~ base rounded"
        flex="~ gap-2 items-center"
        px3 py1 text-sm text-orange
        @click="showDeprecated"
      >
        <div i-carbon-warning-alt flex-none />
        Using {{ deprecatedUsing.length }} deprecated rules
      </button>
    </div>
  </div>
</template>
