import process from 'node:process'
import JITI from 'jiti'
import { relative, resolve } from 'pathe'
import type { FlatESLintConfigItem } from 'eslint-define-config'
import chokidar from 'chokidar'
import { consola } from 'consola'
import type { WebSocket } from 'ws'
import { WebSocketServer } from 'ws'
import type { Payload, RuleInfo } from '~/composables/types'

export default lazyEventHandler(async () => {
  const wss = new WebSocketServer({
    port: 5895,
  })
  const wsClients = new Set<WebSocket>()
  wss.on('connection', (ws) => {
    wsClients.add(ws)
    ws.on('close', () => wsClients.delete(ws))
  })

  const cwd = process.cwd()
  const configPath = resolve(cwd, process.env.ESLINT_CONFIG || 'eslint.config.js')

  const jiti = JITI(cwd, { cache: false })

  const eslintRules = await import('eslint/use-at-your-own-risk').then(r => r.default.builtinRules)

  let invalidated = true
  let rawConfigs: FlatESLintConfigItem[] = []
  let payload: Payload = undefined!

  const watcher = chokidar.watch([], {
    ignoreInitial: true,
    cwd: process.cwd(),
    disableGlobbing: true,
  })

  watcher.on('change', (path) => {
    invalidated = true
    consola.info('Config change detected', path)
    wss.clients.forEach((ws) => {
      ws.send(JSON.stringify({
        type: 'config-change',
        path,
      }))
    })
  })

  function readConfig() {
    Object.keys(jiti.cache).forEach(i => delete jiti.cache[i])
    rawConfigs = jiti(configPath).default as FlatESLintConfigItem[]
    payload = processConfig(rawConfigs)
    const deps = Object.keys(jiti.cache).map(i => i.replace(/\\/g, '/')).filter(i => !i.includes('/node_modules/'))
    watcher.add(deps)
    invalidated = false

    consola.success(`Read ESLint config from \`${relative(cwd, configPath)}\` with`, rawConfigs.length, 'configs and', Object.keys(payload.rules).length, 'rules')
  }

  function processConfig(raw: FlatESLintConfigItem[]): Payload {
    const rulesMap = new Map<string, RuleInfo>()

    for (const [name, rule] of eslintRules.entries()) {
      rulesMap.set(name, {
        ...(rule as any).meta as any,
        name,
        plugin: 'eslint',
        schema: undefined,
        messages: undefined,
      })
    }

    for (const item of raw) {
      for (const [prefix, plugin] of Object.entries(item.plugins ?? {})) {
        for (const [name, rule] of Object.entries(plugin.rules ?? {})) {
          rulesMap.set(`${prefix}/${name}`, {
            ...(rule as any).meta as any,
            name: `${prefix}/${name}`,
            plugin: prefix,
            schema: undefined,
            messages: undefined,
          })
        }
      }
    }

    const rules = Object.fromEntries(rulesMap.entries())
    const configs = raw.map((c): FlatESLintConfigItem => {
      return {
        ...c,
        plugins: undefined,
        processor: undefined,
        languageOptions: undefined,
      }
    })

    return {
      configs,
      rules,
      meta: {
        lastUpdate: Date.now(),
        wsPort: 5895,
        configPath,
      },
    }
  }

  return defineEventHandler(() => {
    if (invalidated)
      readConfig()
    return payload
  })
})
