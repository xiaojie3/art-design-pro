<script setup lang="ts">
  import { ref } from 'vue'
  import type { Node, Edge } from '@vue-flow/core'
  import { VueFlow, Panel, Position } from '@vue-flow/core'
  import { Background } from '@vue-flow/background'

  // these components are only shown as examples of how to use a custom node or edge
  // you can find many examples of how to create these custom components in the examples page of the docs
  import JudgeNode from './components/judge-node.vue'

  const nodes = ref<Node[]>([
    {
      id: '1',
      type: 'input',
      position: { x: 250, y: 5 },
      data: { label: '流程开始' }
    },
    {
      id: '2',
      position: { x: 250, y: 100 },
      data: { label: '上级领导审核' }
    },
    {
      id: '4',
      position: { x: 250, y: 200 },
      type: 'judge',
      data: { label: '条件判断' },
      sourcePosition: Position.Right
    },
    {
      id: '5',
      position: { x: 500, y: 200 },
      data: { label: '部门总监审核' }
    },
    {
      id: '3',
      type: 'output',
      position: { x: 250, y: 350 },
      data: { label: '流程结束' }
    }
  ])

  // these are our edges
  const edges = ref<Edge[]>([
    // default bezier edge
    // consists of an edge id, source node id and target node id
    {
      id: 'e1->2',
      source: '1',
      target: '2',
      animated: true
    },
    {
      id: 'e2->4',
      source: '2',
      target: '4',
      animated: true
    },
    {
      id: 'e4->3',
      source: '4',
      target: '3',
      label: '小于等于1天',
      animated: true
    },
    {
      id: 'e4->5',
      source: '4',
      target: '5',
      label: '大于1天',
      animated: true
    }
  ])
  function addNode() {
    const id = Date.now().toString()

    nodes.value.push({
      id,
      position: { x: 150, y: 50 },
      data: { label: `Node ${id}` }
    })
  }
</script>

<template>
  <ElCard shadow="never" class="art-full-height">
    <VueFlow :nodes="nodes" :edges="edges">
      <Background />
      <Panel position="top-left">
        <button type="button" @click="addNode">Add a node</button>
      </Panel>
      <!-- bind your custom node type to a component by using slots, slot names are always `node-<type>` -->
      <template #node-judge="judgeNodeProps">
        <JudgeNode v-bind="judgeNodeProps" />
      </template>
    </VueFlow>
  </ElCard>
</template>
<style>
  /* import the necessary styles for Vue Flow to work */
  @import '@vue-flow/core/dist/style.css';

  /* import the default theme, this is optional but generally recommended */
  @import '@vue-flow/core/dist/theme-default.css';
</style>
