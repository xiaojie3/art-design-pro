<template>
  <div class="console">
    <h1>home</h1>
  </div>
</template>

<script setup lang="ts">
  import { useCommon } from '@/composables/useCommon'

  defineOptions({ name: 'Console' })

  useCommon().scrollToTop()
</script>

<style lang="scss" scoped>
  @use './style';
</style>
