<script setup lang="ts">
defineProps<{
  glob: string
}>()
</script>

<template>
  <div border="~ base rounded" bg-gray:5 px2 font-mono op75>
    {{ glob }}
  </div>
</template>
