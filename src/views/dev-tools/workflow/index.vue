<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import type { Node, Edge } from '@vue-flow/core'
  import { VueFlow, Panel, useVueFlow } from '@vue-flow/core'
  import { Background } from '@vue-flow/background'
  import AuditConfigDialog from './components/audit-config-dialog.vue'

  // 自定义节点组件
  import JudgeNode from './components/judge-node.vue'
  import StartNode from './components/start-node.vue'

  // 初始化为空数组，实现动态nodes
  const nodes = ref<Node[]>([])

  // 边数组
  const edges = ref<Edge[]>([])

  // 添加开始节点
  const addStartNode = () => {
    const id = Date.now().toString()

    nodes.value.push({
      id,
      position: { x: 150, y: 50 },
      data: { label: `流程开始` },
      type: 'start'
    })
  }

  // 添加审批节点
  const addAuditNode = () => {
    const id = Date.now().toString()

    nodes.value.push({
      id,
      position: { x: 150, y: nodes.value.length * 100 + 50 },
      data: {
        label: `审批节点${nodes.value.length}`,
        type: 'user',
        value: ''
      }
    })
  }

  // 添加判断节点
  const addJudgeNode = () => {
    const id = Date.now().toString()

    nodes.value.push({
      id,
      position: { x: 150, y: nodes.value.length * 100 + 50 },
      data: { label: `条件判断${nodes.value.length}` },
      type: 'judge'
    })
  }

  // 添加结束节点
  const addEndNode = () => {
    const id = Date.now().toString()

    nodes.value.push({
      id,
      position: { x: 150, y: nodes.value.length * 100 + 50 },
      data: { label: `流程结束` },
      type: 'output'
    })
  }

  // 删除节点
  const deleteNode = (nodeId: string) => {
    // 删除节点
    nodes.value = nodes.value.filter((node) => node.id !== nodeId)
    // 删除与该节点相关的边
    edges.value = edges.value.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
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

    // 找到对应的节点索引
    const nodeIndex = nodes.value.findIndex((node) => node.id === data.node.id)
    if (nodeIndex === -1) return

    // 更新节点数据
    nodes.value[nodeIndex].data = {
      ...nodes.value[nodeIndex].data,
      ...data.node
    }

    console.log('节点配置已保存:', nodes.value[nodeIndex].data)
  }

  // 点击节点时显示配置窗口
  function onNodeClick({ node }: { node: any }) {
    if (node.type === 'input' || node.type === 'output') {
      return
    }
    configPanelVisible.value = true
    selectedNode.value = node
  }

  // 点击删除节点
  function onNodeDelete({ node }: { node: any }) {
    deleteNode(node.id)
  }

  // Edge click event handler
  function onEdgeClick({ event, edge }: { event: any; edge: any }) {
    console.log('Edge clicked:', edge, event)
  }

  const { getEdges } = useVueFlow()
  const save = async (): Promise<void> => {
    console.log('保存流程:', nodes.value, getEdges.value)
  }

  // 模拟从API获取节点数据
  onMounted(() => {
    // 这里可以替换为实际的API调用
    setTimeout(() => {
      // 初始化一些示例节点
      nodes.value = [
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
        }
      ]

      // 初始化一些示例边
      edges.value = [
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
        }
      ]
    }, 1000)
  })
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
        @nodeDelete="onNodeDelete"
        class="flow-container"
      >
        <Background />
        <Panel position="top-left" class="m-0!">
          <ArtIconButton icon="ri-add-circle-fill" @click="addStartNode" title="添加开始节点" />
          <ArtIconButton icon="ri-user-add-fill" @click="addAuditNode" title="添加审批节点" />
          <ArtIconButton
            icon="ri-checkbox-circle-fill"
            @click="addJudgeNode"
            title="添加判断节点"
          />
          <ArtIconButton icon="ri-close-circle-fill" @click="addEndNode" title="添加结束节点" />
          <button type="button" @click="save" class="ml-2">保存流程</button>
        </Panel>
        <!-- 自定义节点类型 -->
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
