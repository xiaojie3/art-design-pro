<script setup lang="ts">
  import { Position, Handle } from '@vue-flow/core'
  import type { NodeProps } from '@vue-flow/core'
  defineProps<NodeProps>()
</script>

<template>
  <div class="vue-flow__node-default">
    <div>{{ data.label }}</div>

    <div>请假天数</div>

    <Handle type="target" :position="Position.Top" />
    <Handle type="target" :position="Position.Right" />
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>
