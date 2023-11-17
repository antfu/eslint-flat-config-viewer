export const filtersConfigs = reactive<FiltersConfigsPage>({
  rule: '',
})

export const filtersRules = reactive({
  plugin: '',
  search: '',
  state: 'using' as 'using' | 'unused' | 'deprecated' | '',
  fixable: null as boolean | null,
})
