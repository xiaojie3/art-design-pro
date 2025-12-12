<template>
  <!-- 配置窗口 -->
  <el-dialog v-model="configPanelVisible" :modal="false" class="dialog-right" title="审批节点配置">
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
  </el-dialog>
</template>
<script setup lang="ts">
  import { ref, watch, computed } from 'vue'
  interface Props {
    visible: boolean
    node?: any
  }
  const props = defineProps<Props>()
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
      if (newNode && newNode.data?.approverConfig) {
        const { type, value } = newNode.data.approverConfig
        activeTab.value = type

        // 根据类型设置对应的值
        if (type === 'user') {
          selectedUser.value = value
        } else if (type === 'role') {
          selectedRole.value = value
        } else if (type === 'javaMethod') {
          javaMethod.value = value
        }
      } else {
        // 重置状态
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
    if (!props.node) return

    // 根据当前激活的标签页获取审批人配置
    let approverConfig = {}
    if (activeTab.value === 'user') {
      approverConfig = { type: 'user', value: selectedUser.value }
    } else if (activeTab.value === 'role') {
      approverConfig = { type: 'role', value: selectedRole.value }
    } else if (activeTab.value === 'javaMethod') {
      approverConfig = { type: 'javaMethod', value: javaMethod.value }
    }

    // 触发save事件，将配置传递给父组件
    emit('save', {
      node: props.node,
      approverConfig
    })

    // 关闭配置窗口
    emit('update:visible', false)

    // 清空选择
    selectedUser.value = ''
    selectedRole.value = ''
    javaMethod.value = ''
    activeTab.value = 'user'
  }
</script>
