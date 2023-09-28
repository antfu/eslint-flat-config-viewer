<script setup lang="ts">
import Fuse from 'fuse.js'
import type { Payload, RuleConfigStates } from '~/composables/types'

const props = defineProps<{
  payload: Payload
}>()
</script>

<template>
  <div>
    <NavBar />
    <div flex="~ col gap-3" py6>
      <ConfigItem
        v-for="config, idx in payload.configs"
        :key="idx"
        :config="config"
        :index="idx"
      />
    </div>
  </div>
</template>
