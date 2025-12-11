<script setup lang="ts">
  import { Position, Handle } from '@vue-flow/core'
  import type { NodeProps } from '@vue-flow/core'
  defineProps<NodeProps>()
</script>

<template>
  <div class="circle-container">
    <div class="circle-text">{{ data.label }}</div>
    <div class="circle-plus">+</div>
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>
<style scoped>
  .circle-node {
    width: 150px;
    padding: 10px;
    font-size: 12px;
    color: var(--vf-node-text);
    text-align: center;
    background-color: var(--vf-node-bg);
    border-color: var(--vf-node-color);
    border-style: solid;
    border-width: 1px;
    border-radius: 3px;
  }

  /* 容器：用于定位圆形和加号 */
  .circle-container {
    position: relative;
    display: inline-block;
    margin: 50px;
  }

  /* 基础圆形样式 */
  .circle-text {
    width: 150px;
    padding: 10px;
    font-size: 12px;
    color: var(--vf-node-text);
    text-align: center;
    cursor: pointer;
    background-color: var(--vf-node-bg);
    border-color: var(--vf-node-color);
    border-style: solid;
    border-width: 1px;
    border-radius: 3px;

    /* 过渡动画，让悬停更丝滑 */
    transition: background-color 0.3s ease;
  }

  /* 悬停时圆形变色 */
  .circle-text:hover {
    border-color: #66b1ff;
  }

  /* 加号样式 - 初始隐藏 */
  .circle-plus {
    /* 绝对定位，相对于容器居中 */
    position: absolute;
    bottom: -8px;
    left: 50%;

    /* 加号样式 */
    width: 20px;
    height: 20px;
    font-size: 24px;
    font-weight: bold;
    line-height: 20px;
    color: #409eff;
    text-align: center;
    visibility: hidden;

    /* 初始隐藏 */
    opacity: 0;

    /* 过渡动画 */
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }

  /* 悬停时显示加号 */
  .circle-container:hover .circle-plus {
    /* 轻微上移，增加动效 */
    bottom: -8px;
    z-index: 100;
    visibility: visible;
    opacity: 1;
  }
</style>
