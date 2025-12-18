<template>
  <!-- 配置窗口 -->
  <el-drawer
    v-model="configPanelVisible"
    class="right-9! bottom-8! top-30! h-auto!"
    title="审批节点配置"
    header-class="mb-0!"
  >
    <ElInput v-model="nodeData.label" placeholder="请输入节点名称" style="width: 100%" />
    <el-tabs v-model="activeTab" type="card">
      <!-- 选择用户标签页 -->
      <el-tab-pane label="选择用户" name="user">
        <el-select v-model="selectedUser" placeholder="请选择审批用户" style="width: 100%">
          <!-- 这里可以根据实际API获取用户列表 -->
          <el-option label="张三" value="zhangsan" />
          <el-option label="李四" value="lisi" />
          <el-option label="王五" value="wangwu" />
        </el-select>
      </el-tab-pane>

      <!-- 选择角色标签页 -->
      <el-tab-pane label="选择角色" name="role">
        <el-select v-model="selectedRole" placeholder="请选择审批角色" style="width: 100%">
          <!-- 这里可以根据实际API获取角色列表 -->
          <el-option label="部门经理" value="department_manager" />
          <el-option label="部门总监" value="department_director" />
          <el-option label="总经理" value="general_manager" />
        </el-select>
      </el-tab-pane>

      <!-- 选择Java类方法标签页 -->
      <el-tab-pane label="选择Java类方法" name="javaMethod">
        <el-input
          v-model="javaMethod"
          placeholder="请输入Java类方法路径"
          type="textarea"
          :rows="3"
          style="width: 100%"
        />
        <div class="mt-2 text-xs text-gray-500">
          格式示例：com.example.workflow.ApprovalService.getApprover
        </div>
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="configPanelVisible = false">取消</el-button>
        <el-button type="primary" @click="saveNodeConfig">保存配置</el-button>
      </div>
    </template>
  </el-drawer>
</template>
<script setup lang="ts">
  import { ref, watch, computed } from 'vue'
  interface AuditNodeData {
    id: string
    label: string
    type: string
    value: string
  }
  interface AuditNode {
    id: string
    type: string
    data: AuditNodeData
  }
  interface Props {
    visible: boolean
    node?: AuditNode
  }
  const props = defineProps<Props>()
  const nodeData = ref<AuditNodeData>(
    props.node?.data
      ? {
          ...props.node.data,
          id: props.node.id // 确保id是节点的id，而不是数据的id
        }
      : {
          id: '',
          label: '',
          type: 'audit',
          value: ''
        }
  )
  const emit = defineEmits<{
    'update:visible': [value: boolean]
    save: [config: any]
  }>()

  // 使用计算属性实现visible的双向绑定
  const configPanelVisible = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val)
  })

  const activeTab = ref('user')
  const selectedUser = ref('')
  const selectedRole = ref('')
  const javaMethod = ref('')

  // 监听props.node变化，更新内部状态
  watch(
    () => props.node,
    (newNode) => {
      if (newNode) {
        nodeData.value = {
          ...newNode.data,
          id: newNode.id // 确保id是节点的id
        }

        // 如果是条件判断节点，设置activeTab为'judge'
        if (newNode.type === 'judge') {
          activeTab.value = 'judge'
        }
        // 否则，根据节点数据类型设置activeTab
        else if (newNode.data.type) {
          activeTab.value = newNode.data.type
          // 设置对应的值
          if (newNode.data.type === 'user') {
            selectedUser.value = newNode.data.value
          } else if (newNode.data.type === 'role') {
            selectedRole.value = newNode.data.value
          } else if (newNode.data.type === 'javaMethod') {
            javaMethod.value = newNode.data.value
          }
        }
      } else {
        // 重置状态
        nodeData.value = {
          id: '',
          label: '',
          type: 'user',
          value: ''
        }
        activeTab.value = 'user'
        selectedUser.value = ''
        selectedRole.value = ''
        javaMethod.value = ''
      }
    },
    { immediate: true }
  )

  // 保存节点配置
  const saveNodeConfig = () => {
    if (!nodeData.value) return

    // 创建要传递给父组件的配置对象
    const config = {
      id: nodeData.value.id, // 节点的id，用于在父组件中找到对应的节点
      data: {
        ...nodeData.value
      }
    }

    // 只有当节点不是条件判断节点时，才根据activeTab更新配置数据
    if (activeTab.value !== 'judge') {
      let configType = activeTab.value
      let configValue = ''

      if (configType === 'user') {
        configValue = selectedUser.value
      } else if (configType === 'role') {
        configValue = selectedRole.value
      } else if (configType === 'javaMethod') {
        configValue = javaMethod.value
      }

      // 更新配置对象
      config.data.type = configType
      config.data.value = configValue
    }

    // 触发save事件，将配置传递给父组件
    emit('save', config)

    // 关闭配置窗口
    emit('update:visible', false)

    // 清空选择
    selectedUser.value = ''
    selectedRole.value = ''
    javaMethod.value = ''
    activeTab.value = 'user'
  }
</script>
