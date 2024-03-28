// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    unocss: true,
    vue: {
      overrides: {
        'vue/no-extra-parens': 'off',
      },
    },
  },
)
