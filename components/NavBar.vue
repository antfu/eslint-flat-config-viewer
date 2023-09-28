<template>
  <div text-2xl font-200>
    ESLint Flat Config Viewer
  </div>
  <div flex="~ gap-2" py2>
    <NuxtLink
      to="/configs" active-class="op100! bg-active"
      px3 py1 op30 border="~ base rounded"
      flex="~ gap-2 items-center"
    >
      <div i-carbon-list-dropdown flex-none />
      Config Items
    </NuxtLink>
    <NuxtLink
      to="/rules" active-class="op100! bg-active"
      px3 py1 op30 border="~ base rounded"
      flex="~ gap-2 items-center"
    >
      <div i-carbon-list-checked flex-none />
      Available Rules
    </NuxtLink>
  </div>
</template>
