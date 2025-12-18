<script setup lang="ts">
  import { Position, Handle } from '@vue-flow/core'
  import type { NodeProps } from '@vue-flow/core'

  const { selected, data } = defineProps<NodeProps>()
</script>

<template>
  <div class="vue-flow__node-default" :class="{ active: selected }">
    <div>{{ data.label }}</div>

    <div>请假天数</div>

    <Handle type="target" :position="Position.Top" />
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<style scoped>
  /* 激活状态样式 */
  .vue-flow__node-default.active {
    background-color: #f0f8ff;
    border-color: #409eff;
    box-shadow: 0 0 10px rgb(64 158 255 / 50%);
  }
</style>
