import { isDark } from './dark'

const pluginColorMap = {
  'ts': '#2b7489',
  '@typescript-eslint': '#2b7489',
  'vue': '#41b883',
  'node': '#026e00',
  'n': '#026e00',
  'js': '#f1e05a',
  'import': '#e36209',
  'style': '#ffac45',
  'antfu': '#30b8af',
} as Record<string, string>

export function getHashColorFromString(
  name: string,
  saturation = 65,
  lightness = isDark.value ? 60 : 40,
  opacity: number | string = 1,
) {
  let hash = 0
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  const h = hash % 360
  return `hsla(${h}, ${saturation}%, ${lightness}%, ${opacity})`
}

export function getPluginColor(name: string, opacity = 1) {
  if (pluginColorMap[name]) {
    if (opacity === 1)
      return pluginColorMap[name]
    const opacityHex = Math.floor(opacity * 255).toString(16).padStart(2, '0')
    return pluginColorMap[name] + opacityHex
  }
  return getHashColorFromString(name, undefined, undefined, opacity)
}
