<script setup lang="ts">
  import { ref } from 'vue'
  import type { Node, Edge } from '@vue-flow/core'
  import { VueFlow, Panel, useVueFlow } from '@vue-flow/core'
  import { Background } from '@vue-flow/background'
  import AuditConfigDialog from './components/audit-config-dialog.vue'

  // these components are only shown as examples of how to use a custom node or edge
  // you can find many examples of how to create these custom components in the examples page of the docs
  import JudgeNode from './components/judge-node.vue'
  import StartNode from './components/start-node.vue'

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
      data: { label: '条件判断' }
    },
    {
      id: '5',
      position: { x: 500, y: 100 },
      data: { label: '部门经理审核' }
    },
    {
      id: '6',
      position: { x: 500, y: 200 },
      type: 'judge',
      data: { label: '条件判断' }
    },
    {
      id: '7',
      position: { x: 750, y: 100 },
      data: { label: '部门总监审核' }
    },
    {
      id: '3',
      type: 'output',
      position: { x: 500, y: 350 },
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
    },
    {
      id: 'e5->6',
      source: '5',
      target: '6',
      animated: true
    },
    {
      id: 'e6->3',
      source: '6',
      target: '3',
      label: '小于等于3天',
      animated: true
    },
    {
      id: 'e6->7',
      source: '6',
      target: '7',
      label: '大于3天',
      animated: true
    },
    {
      id: 'e7->3',
      source: '7',
      target: '3',
      animated: true
    }
  ])
  function addStartNode() {
    const id = Date.now().toString()

    nodes.value.push({
      id,
      position: { x: 150, y: 50 },
      data: { label: `流程开始` },
      type: 'start'
    })
  }
  const { addEdges } = useVueFlow()
  function onConnect(params: any) {
    console.log('on connect', params)
    addEdges(params)
  }

  // 配置窗口显示状态
  const configPanelVisible = ref(false)
  // 当前选中的节点
  const selectedNode = ref<any>(null)
  // 审计配置对话框引用
  const auditConfigDialog = ref<InstanceType<any>>()

  // 保存节点配置
  const saveNodeConfig = (data: any) => {
    if (!data || !data.node) return

    // 将配置保存到节点数据中
    data.node.data = {
      ...data.node.data,
      approverConfig: data.approverConfig
    }

    console.log('节点配置已保存:', data.node.data)
  }

  function onNodeClick({ event, node }: { event: any; node: any }) {
    if (node.type === 'input' || node.type === 'output') {
      return
    }
    // 点击节点时显示配置窗口
    configPanelVisible.value = true
    selectedNode.value = node
    console.log('Node clicked:', node, event)
  }

  // Edge click event handler
  function onEdgeClick({ event, edge }: { event: any; edge: any }) {
    console.log('Edge clicked:', edge, event)
  }
  const { getEdges } = useVueFlow()
  const save = async (): Promise<void> => {
    console.log('save', getEdges.value)
  }
</script>
<template>
  <ElCard shadow="never" class="art-full-height">
    <div class="workflow-container">
      <!-- 左侧配置面板 -->
      <AuditConfigDialog
        ref="auditConfigDialog"
        v-model:visible="configPanelVisible"
        :node="selectedNode"
        @save="saveNodeConfig"
      />
      <VueFlow
        :nodes="nodes"
        :edges="edges"
        @connect="onConnect"
        @nodeClick="onNodeClick"
        @edgeClick="onEdgeClick"
        class="flow-container"
      >
        <Background />
        <Panel position="top-left" class="m-0!">
          <ArtIconButton icon="ri-add-circle-fill" @click="addStartNode" />
          <button type="button" @click="save">保存</button>
        </Panel>
        <!-- bind your custom node type to a component by using slots, slot names are always `node-<type>` -->
        <template #node-judge="judgeNodeProps">
          <JudgeNode v-bind="judgeNodeProps" />
        </template>
        <template #node-start="startNodeProps">
          <StartNode v-bind="startNodeProps" />
        </template>
      </VueFlow>
    </div>
  </ElCard>
</template>
<style>
  /* import the necessary styles for Vue Flow to work */
  @import '@vue-flow/core/dist/style.css';

  /* import the default theme, this is optional but generally recommended */
  @import '@vue-flow/core/dist/theme-default.css';

  /* 工作流容器样式 */
  .workflow-container {
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  /* 左侧配置面板样式 */
  .config-panel {
    z-index: 10;
    display: flex;
    flex-direction: column;
    width: 300px;
    height: 100%;
    background-color: #fff;
    border-right: 1px solid #e0e0e0;
    box-shadow: 2px 0 8px rgb(0 0 0 / 10%);
  }

  /* 配置面板头部 */
  .config-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    font-weight: bold;
    background-color: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;
  }

  /* 关闭按钮 */
  .close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 0;
    font-size: 20px;
    color: #999;
    cursor: pointer;
    background: none;
    border: none;
    border-radius: 4px;
  }

  .close-btn:hover {
    color: #333;
    background-color: #e0e0e0;
  }

  /* 配置面板内容 */
  .config-panel-content {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
  }

  /* 流程容器 */
  .flow-container {
    flex: 1;
    height: 100%;
  }

  /* 右侧配置窗口 */

  /* 穿透 scoped 样式，覆盖 ElDialog 的默认样式 */
  :deep(.dialog-right) {
    /* 可选：调整顶部间距，避免贴顶 */
    top: 20px;

    /* 固定右侧位置（可根据需求调整 px 值） */
    right: 20px;
    left: auto !important;

    /* 取消默认居中的 margin 和 left */
    margin: 0 !important;
  }

  /* 可选：让模态框内容区域自适应宽度 */
  :deep(.dialog-right .el-dialog__body) {
    padding: 20px;
  }
</style>
