import antfu from '@antfu/eslint-config'
import unocss from '@unocss/eslint-plugin'

export default antfu(
  {
    // typescript: false,
  },
  unocss.configs.flat,
)

throw new Error('unreachable')
