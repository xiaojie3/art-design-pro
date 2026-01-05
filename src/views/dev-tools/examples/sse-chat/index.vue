<template>
  <div class="page-content mb-5">
    <div class="mb-15 text-center">
      <h1 class="my-4 text-2xl font-semibold leading-tight">SSE 连接示例</h1>
      <p class="m-0 text-base leading-relaxed text-g-700">
        基于 Server-Sent Events 的实时通信演示，支持连接管理、消息接收和状态监控
      </p>
    </div>

    <!-- 连接状态和统计信息 -->
    <ElRow :gutter="20" class="mb-15">
      <ElCol :xs="24" :sm="12" :md="8">
        <ElCard class="h-full border-0" :body-style="{ padding: '20px' }" shadow="never">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-500 mb-1">{{ messageCount }}</div>
            <div class="text-sm font-medium text-gray-900 mb-1">消息统计</div>
            <div class="text-xs text-gray-500">接收到的消息数量</div>
          </div>
        </ElCard>
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="8">
        <ElCard class="h-full border-0" :body-style="{ padding: '20px' }" shadow="never">
          <div class="text-center">
            <ElTag :type="connectionTagType" size="large" class="mb-2">
              {{ connectionStatusText || '未连接' }}
            </ElTag>
            <div class="text-sm font-medium text-gray-900">连接状态</div>
            <div class="text-xs text-gray-500">当前SSE连接状态</div>
          </div>
        </ElCard>
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="8">
        <ElCard class="h-full border-0" :body-style="{ padding: '20px' }" shadow="never">
          <div class="text-center">
            <div class="text-2xl font-bold text-amber-500 mb-1">{{ reconnectCount }}</div>
            <div class="text-sm font-medium text-gray-900 mb-1">重连次数</div>
            <div class="text-xs text-gray-500">自动重连尝试次数</div>
          </div>
        </ElCard>
      </ElCol>
    </ElRow>

    <!-- 连接配置 -->
    <ElRow :gutter="20" class="mb-15">
      <ElCol :xs="24" :md="12">
        <ElCard class="h-full border-0" shadow="never">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="text-base font-bold">连接配置</span>
              <ElTag :type="connectionTagType" size="large">
                {{ connectionStatusText || '未连接' }}
              </ElTag>
            </div>
          </template>

          <ElForm :model="connectForm" label-width="100px" class="max-w-md">
            <ElFormItem label="服务器地址">
              <ElInput
                v-model="connectForm.url"
                placeholder="http://localhost:8080/sse"
                clearable
              />
            </ElFormItem>
            <ElFormItem label="连接选项">
              <ElSpace>
                <ElCheckbox v-model="connectForm.autoReconnect">自动重连</ElCheckbox>
                <ElCheckbox v-model="connectForm.withCredentials">带凭据</ElCheckbox>
              </ElSpace>
            </ElFormItem>
            <ElFormItem>
              <ElSpace>
                <ElButton
                  type="primary"
                  @click="handleConnect"
                  :loading="isConnecting"
                  :disabled="isConnected"
                >
                  {{ isConnecting ? '连接中...' : '连接' }}
                </ElButton>
                <ElButton type="danger" @click="handleDisconnect" :disabled="!isConnected">
                  断开连接
                </ElButton>
                <ElButton @click="handleReconnect" :disabled="isConnecting">重连</ElButton>
              </ElSpace>
            </ElFormItem>
          </ElForm>
        </ElCard>
      </ElCol>

      <ElCol :xs="24" :md="12">
        <ElCard class="h-full border-0" shadow="never">
          <template #header>
            <span class="text-base font-bold">消息说明</span>
          </template>

          <div class="text-sm text-gray-600 space-y-2">
            <p><strong>SSE特性：</strong></p>
            <ul class="list-disc pl-5 space-y-1">
              <li>单向通信：只能接收服务器推送的消息</li>
              <li>自动重连：连接断开后自动重新连接</li>
              <li>事件流格式：支持多种事件类型</li>
              <li>基于HTTP协议：兼容性好</li>
            </ul>

            <p class="mt-4"><strong>限制：</strong></p>
            <ul class="list-disc pl-5 space-y-1">
              <li>无法主动向服务器发送消息</li>
              <li>只能接收文本数据</li>
            </ul>
          </div>
        </ElCard>
      </ElCol>
    </ElRow>

    <!-- 接收消息 - 单独占一行 -->
    <ElRow class="mb-15">
      <ElCol :span="24">
        <ElCard class="border-0" shadow="never">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="text-base font-bold">接收消息</span>
              <ElButton size="small" @click="clearMessages">清空记录</ElButton>
            </div>
          </template>

          <div class="message-container">
            <div v-for="(message, index) in messageList" :key="index" class="message-item">
              <div class="message-header">
                <ElTag size="small" type="success"> 接收 </ElTag>
                <span class="message-time">{{ message.time }}</span>
                <ElTag v-if="message.event" size="small" type="info">{{ message.event }}</ElTag>
              </div>
              <div class="message-content">{{ message.content }}</div>
            </div>

            <ElEmpty v-if="messageList.length === 0" description="暂无消息记录" :image-size="100" />
          </div>
        </ElCard>
      </ElCol>
    </ElRow>

    <!-- 连接日志 -->
    <ElCard class="border-0" shadow="never">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-base font-bold">连接日志</span>
          <ElButton size="small" @click="clearLogs">清空日志</ElButton>
        </div>
      </template>

      <div class="log-container">
        <ElAlert
          v-for="(log, index) in logList"
          :key="index"
          :type="log.type"
          :closable="false"
          class="!mb-2"
        >
          <template #title>
            <div class="flex items-start gap-2">
              <span class="text-xs opacity-70 whitespace-nowrap">{{ log.time }}</span>
              <span class="flex-1">{{ log.message }}</span>
            </div>
          </template>
        </ElAlert>

        <ElEmpty v-if="logList.length === 0" description="暂无日志记录" :image-size="100" />
      </div>
    </ElCard>
  </div>
</template>
<script setup lang="ts">
  import { ElMessage } from 'element-plus'

  defineOptions({ name: 'SseChat' })

  // SSE连接实例
  const eventSource = ref<EventSource | null>(null)

  // 连接状态
  const isConnecting = ref(false)
  const isConnected = ref(false)
  const connectionStatusText = ref('未连接')
  const reconnectCount = ref(0)
  const messageCount = ref(0)
  const CLIENT_ID = 'user_1001'

  // 表单数据
  const connectForm = ref({
    url: 'http://localhost:8080/sse',
    autoReconnect: true,
    withCredentials: false
  })

  // 消息和日志列表
  const messageList = ref<
    Array<{
      event: string
      content: string
      time: string
    }>
  >([])

  const logList = ref<
    Array<{
      type: 'info' | 'success' | 'warning' | 'error'
      message: string
      time: string
    }>
  >([])

  // 计算属性
  const connectionTagType = computed(() => {
    if (isConnecting.value) return 'warning'
    if (isConnected.value) return 'success'
    return 'danger'
  })

  /**
   * 添加日志
   */
  const addLog = (type: 'info' | 'success' | 'warning' | 'error', message: string) => {
    logList.value.unshift({
      type,
      message,
      time: new Date().toLocaleTimeString()
    })

    // 限制日志数量
    if (logList.value.length > 100) {
      logList.value = logList.value.slice(0, 100)
    }
  }

  /**
   * 添加消息记录
   */
  const addMessage = (event: string, content: string) => {
    messageList.value.unshift({
      event,
      content,
      time: new Date().toLocaleTimeString()
    })

    // 限制消息数量
    if (messageList.value.length > 50) {
      messageList.value = messageList.value.slice(0, 50)
    }
  }

  /**
   * 处理SSE消息
   */
  const handleMessage = (event: MessageEvent) => {
    messageCount.value++
    const eventType = event.type || 'message'
    addMessage(eventType, event.data)
    addLog('success', `收到消息 (${eventType}): ${event.data}`)
  }

  /**
   * 处理SSE错误
   */
  const handleError = (event: Event) => {
    console.error('SSE错误:', event)
    addLog('error', 'SSE连接发生错误')

    if (connectForm.value.autoReconnect) {
      addLog('warning', 'SSE自动重连中...')
      setTimeout(() => {
        handleConnect()
      }, 3000)
    }
  }

  /**
   * 连接SSE
   */
  const handleConnect = () => {
    if (isConnecting.value || isConnected.value) {
      return
    }

    isConnecting.value = true
    connectionStatusText.value = '连接中...'
    addLog('info', `开始连接到 ${connectForm.value.url}`)

    try {
      // 创建EventSource实例
      eventSource.value = new EventSource(
        `${connectForm.value.url}/connect?clientId=${CLIENT_ID}`,
        {
          withCredentials: false
        }
      )

      // 监听连接成功
      eventSource.value.onopen = () => {
        isConnected.value = true
        isConnecting.value = false
        connectionStatusText.value = '已连接'
        addLog('success', 'SSE连接成功')
        reconnectCount.value = 0
      }

      // 监听消息
      eventSource.value.onmessage = handleMessage

      // 监听错误
      eventSource.value.onerror = handleError

      // 监听自定义事件
      eventSource.value.addEventListener('notification', (event) => {
        messageCount.value++
        addMessage('notification', (event as MessageEvent).data)
        addLog('info', '收到通知事件')
      })

      eventSource.value.addEventListener('update', (event) => {
        messageCount.value++
        addMessage('update', (event as MessageEvent).data)
        addLog('info', '收到更新事件')
      })
    } catch (error) {
      isConnecting.value = false
      connectionStatusText.value = '连接失败'
      const errorMessage = error instanceof Error ? error.message : String(error)
      addLog('error', `连接失败: ${errorMessage}`)
      ElMessage.error('连接失败，请检查服务器地址')
    }
  }

  /**
   * 断开连接
   */
  const handleDisconnect = () => {
    if (eventSource.value) {
      eventSource.value.close()
      eventSource.value = null
      addLog('info', '手动断开SSE连接')
    }

    isConnected.value = false
    isConnecting.value = false
    connectionStatusText.value = '未连接'
  }

  /**
   * 重新连接
   */
  const handleReconnect = () => {
    handleDisconnect()
    setTimeout(() => {
      handleConnect()
    }, 1000)
  }

  /**
   * 清空消息记录
   */
  const clearMessages = () => {
    messageList.value = []
    messageCount.value = 0
  }

  /**
   * 清空日志
   */
  const clearLogs = () => {
    logList.value = []
  }

  /**
   * 页面卸载时清理连接
   */
  onUnmounted(() => {
    handleDisconnect()
  })

  /**
   * 监听页面可见性变化，页面隐藏时断开连接
   */
  onMounted(() => {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && isConnected.value) {
        addLog('info', '页面隐藏，保持连接')
      }
    })
  })
</script>

<style scoped>
  @reference '@styles/core/tailwind.css';

  .message-container {
    @apply max-h-96 overflow-y-auto space-y-3;
  }

  .message-item {
    @apply p-3 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700;
  }

  .message-header {
    @apply flex items-center justify-between mb-2;
  }

  .message-time {
    @apply text-xs text-gray-500;
  }

  .message-content {
    @apply text-sm text-gray-800 dark:text-gray-200 break-words font-mono bg-gray-50 dark:bg-gray-900 p-2 rounded;
  }

  .log-container {
    @apply max-h-64 overflow-y-auto;
  }

  /* 滚动条样式 */
  .message-container::-webkit-scrollbar,
  .log-container::-webkit-scrollbar {
    @apply w-4;
  }

  .message-container::-webkit-scrollbar-track,
  .log-container::-webkit-scrollbar-track {
    @apply bg-gray-100 rounded;
  }

  .message-container::-webkit-scrollbar-thumb,
  .log-container::-webkit-scrollbar-thumb {
    @apply bg-gray-300 rounded hover:bg-gray-400;
  }
</style>
