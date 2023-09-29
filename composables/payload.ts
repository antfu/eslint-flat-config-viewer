/* eslint-disable no-console */
import { $fetch } from 'ofetch'
import type { Payload, ResolvedPayload } from '~/composables/types'

const data = ref(await $fetch<Payload>('/api/get'))

export const payload = computed(() => resolvePayload(data.value!))

export function getRule(name: string): RuleInfo | undefined {
  return payload.value.rules[name]
}

export function getRuleStates(name: string): RuleConfigStates | undefined {
  return payload.value.ruleStateMap.get(name)
}

// Connect to WebSocket, listen for config changes
const ws = new WebSocket(`ws://${location.hostname}:${payload.value!.meta.wsPort}`)
ws.addEventListener('message', async (event) => {
  const payload = JSON.parse(event.data)
  if (payload.type === 'config-change')
    data.value = await $fetch<Payload>('/api/get')
})
ws.addEventListener('open', () => {
  console.log('WebSocket connected')
})
ws.addEventListener('close', () => {
  console.log('WebSocket closed')
})
ws.addEventListener('error', (error) => {
  console.error('WebSocket error', error)
})

export function resolvePayload(payload: Payload): ResolvedPayload {
  const ruleStateMap = new Map<string, RuleConfigStates>()
  payload.configs.forEach((config, index) => {
    if (!config.rules)
      return
    Object.entries(config.rules).forEach(([name, raw]) => {
      const value = getRuleLevel(raw)
      if (!value)
        return
      const options = getRuleOptions(raw)
      if (!ruleStateMap.has(name))
        ruleStateMap.set(name, [])
      ruleStateMap.get(name)!.push([index, value, options])
    })
  })

  return {
    ...payload,
    ruleStateMap,
  }
}
