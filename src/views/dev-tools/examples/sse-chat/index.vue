<template>
  <div class="sse-container" style="padding: 30px">
    <h2 style="margin-bottom: 20px; color: #333"
      >✅ Vue3 + SpringBoot SSE 实时通信演示（带前端推送按钮）</h2
    >

    <!-- 1. 连接配置区 -->
    <div
      class="config-box"
      style="padding: 15px; margin-bottom: 20px; border: 1px solid #eee; border-radius: 8px"
    >
      <el-input
        v-model="connectForm.url"
        placeholder="请输入后端SSE地址，例：http://localhost:8080/api/sse"
        style="width: 400px; margin-right: 10px"
      />
      <el-checkbox v-model="connectForm.withCredentials" label="携带凭证" />
      <el-button type="primary" @click="handleConnect" :disabled="isConnecting || isConnected">
        {{ isConnected ? '已连接' : '建立连接' }}
      </el-button>
      <el-button
        type="danger"
        @click="handleClose"
        :disabled="!isConnected"
        style="margin-left: 10px"
      >
        关闭连接
      </el-button>
      <span style="margin-left: 20px; color: #666">状态：{{ connectionStatusText }}</span>
    </div>

    <!-- ✅ 核心新增：前端测试消息推送按钮区 -->
    <div
      class="send-box"
      style="padding: 15px; margin-bottom: 20px; border: 1px solid #eee; border-radius: 8px"
    >
      <h3 style="margin: 0 0 15px; color: #333">🔧 前端测试推送（一键发送，无需Postman）</h3>
      <el-input
        v-model="sendForm.message"
        placeholder="请输入要推送的消息内容"
        style="width: 300px; margin-right: 10px"
      />
      <el-button type="success" @click="sendNormalMsg" :disabled="!isConnected"
        >发送普通消息</el-button
      >
      <el-button
        type="warning"
        @click="sendNoticeEvent"
        :disabled="!isConnected"
        style="margin-left: 8px"
        >推送通知事件</el-button
      >
      <el-button
        type="info"
        @click="sendUpdateEvent"
        :disabled="!isConnected"
        style="margin-left: 8px"
        >推送更新事件</el-button
      >
      <el-button
        type="primary"
        @click="sendBroadcastMsg"
        :disabled="!isConnected"
        style="margin-left: 8px"
        >全局广播消息</el-button
      >
    </div>

    <!-- 2. 消息接收区 -->
    <div class="msg-box" style="display: flex; gap: 20px">
      <!-- 普通消息 -->
      <div style="flex: 1; padding: 15px; border: 1px solid #eee; border-radius: 8px">
        <h3>📩 普通消息（{{ normalMsgList.length }}条）</h3>
        <div
          v-for="(item, index) in normalMsgList"
          :key="index"
          style="margin-top: 8px; color: #333"
        >
          {{ item }}
        </div>
      </div>
      <!-- 自定义事件消息 -->
      <div style="flex: 1; padding: 15px; border: 1px solid #eee; border-radius: 8px">
        <h3>🔔 自定义事件消息（{{ customMsgList.length }}条）</h3>
        <div
          v-for="(item, index) in customMsgList"
          :key="index"
          style="margin-top: 8px; color: #333"
        >
          {{ item }}
        </div>
      </div>
    </div>

    <!-- 3. 操作日志区 -->
    <div
      class="log-box"
      style="padding: 15px; margin-top: 20px; border: 1px solid #eee; border-radius: 8px"
    >
      <h3>📝 操作日志（{{ logList.length }}条）</h3>
      <div
        v-for="(item, index) in logList"
        :key="index"
        :style="{ color: item.color, marginTop: '4px' }"
      >
        {{ item.content }}
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, reactive } from 'vue'
  import { ElMessage, ElInput, ElButton, ElCheckbox } from 'element-plus'
  import axios from 'axios' // ✅ 新增：引入axios用于调用推送接口

  // ========== 常量配置 ==========
  // 客户端唯一标识（前后端必须完全一致！）
  const CLIENT_ID = 'vue3_sse_client_001'
  // 超时时间配置（毫秒）
  const CONNECT_TIMEOUT = 5000 // 连接超时
  const RECONNECT_DELAY = 10000 // 断连重连延迟

  // ========== 状态管理 ==========
  // 连接表单配置
  const connectForm = reactive({
    url: 'http://localhost:8080/api/sse', // 后端SSE接口地址
    withCredentials: true // 是否携带跨域凭证
  })
  // ✅ 新增：推送消息表单配置
  const sendForm = reactive({
    message: '测试SSE消息推送' // 默认测试消息
  })
  // 连接状态
  const isConnecting = ref(false) // 连接中
  const isConnected = ref(false) // 已连接
  const connectionStatusText = ref('未连接') // 状态文本
  // 消息存储
  const normalMsgList = ref([]) // 普通消息列表
  const customMsgList = ref([]) // 自定义事件消息列表
  // 日志存储
  const logList = ref([])
  // SSE连接对象
  let eventSource = null

  // ========== 工具方法 ==========
  /**
   * 添加操作日志
   * @param {String} type 类型：success/error/info/warn
   * @param {String} content 日志内容
   */
  const addLog = (type, content) => {
    const colorMap = { success: '#198754', error: '#dc3545', info: '#0d6efd', warn: '#ffc107' }
    logList.value.unshift({
      color: colorMap[type],
      content: `[${new Date().toLocaleString()}] ${content}`
    })
    // 日志最多保留50条
    if (logList.value.length > 50) logList.value.pop()
  }

  // ========== SSE连接核心方法 ==========
  /**
   * 建立SSE连接
   */
  const handleConnect = () => {
    if (isConnecting.value || isConnected.value) return

    // 初始化状态
    isConnecting.value = true
    connectionStatusText.value = '连接中...'
    addLog('info', `开始连接SSE服务：${connectForm.url}/connect?clientId=${CLIENT_ID}`)

    // 连接超时兜底
    const timeoutTimer = setTimeout(() => {
      if (!isConnected.value) {
        isConnecting.value = false
        connectionStatusText.value = '连接超时'
        addLog('error', '连接超时，5秒未收到后端响应')
        ElMessage.error('SSE连接超时，请检查服务地址')
      }
    }, CONNECT_TIMEOUT)

    // 创建原生EventSource连接（SSE标准）
    try {
      eventSource = new EventSource(`${connectForm.url}/connect?clientId=${CLIENT_ID}`, {
        withCredentials: connectForm.withCredentials
      })

      // ✅ 1. 连接成功回调
      eventSource.onopen = () => {
        clearTimeout(timeoutTimer)
        isConnecting.value = false
        isConnected.value = true
        connectionStatusText.value = '已连接 ✅'
        addLog('success', 'SSE连接成功，已就绪接收消息')
        ElMessage.success('SSE连接成功')
      }

      // ✅ 2. 接收普通消息（核心）
      eventSource.onmessage = (e) => {
        if (!e.data) return
        const msg = `普通消息：${e.data}`
        normalMsgList.value.unshift(msg)
        addLog('info', `收到普通消息：${e.data}`)
        // 消息最多保留30条
        if (normalMsgList.value.length > 30) normalMsgList.value.pop()
      }

      // ✅ 3. 接收自定义事件 - notification通知
      eventSource.addEventListener('notification', (e) => {
        const msg = `通知事件：${e.data}`
        customMsgList.value.unshift(msg)
        addLog('info', msg)
      })

      // ✅ 4. 接收自定义事件 - update更新
      eventSource.addEventListener('update', (e) => {
        const msg = `更新事件：${e.data}`
        customMsgList.value.unshift(msg)
        addLog('info', msg)
      })

      // ✅ 5. 连接异常/断连回调（自动重连）
      eventSource.onerror = () => {
        clearTimeout(timeoutTimer)
        isConnecting.value = false
        isConnected.value = false
        connectionStatusText.value = '连接异常 ❌'
        addLog('error', 'SSE连接异常/断开，准备重连')
        ElMessage.error('SSE连接断开，正在重连...')

        // 关闭异常连接
        if (eventSource) eventSource.close()
        // 自动重连
        setTimeout(() => handleConnect(), RECONNECT_DELAY)
      }
    } catch (error) {
      clearTimeout(timeoutTimer)
      isConnecting.value = false
      connectionStatusText.value = '连接失败'
      addLog('error', `连接失败：${error.message}`)
      ElMessage.error('SSE连接失败，请检查配置')
    }
  }

  /**
   * 手动关闭SSE连接
   */
  const handleClose = () => {
    if (!eventSource) return
    eventSource.close()
    eventSource = null
    isConnected.value = false
    connectionStatusText.value = '已断开'
    addLog('warn', '手动关闭SSE连接')
    ElMessage.warning('SSE连接已关闭')
  }

  // ========== ✅ 核心新增：前端推送消息的4个方法 ==========
  /**
   * 1. 发送普通消息
   */
  const sendNormalMsg = async () => {
    if (!sendForm.message) return ElMessage.warning('请输入推送消息内容')
    try {
      const res = await axios.get(`${connectForm.url}/send`, {
        params: { clientId: CLIENT_ID, message: sendForm.message },
        withCredentials: connectForm.withCredentials
      })
      if (res.data.code === 200) {
        addLog('success', `前端主动推送普通消息成功：${sendForm.message}`)
        ElMessage.success('普通消息推送成功')
      }
    } catch (err) {
      addLog('error', `普通消息推送失败：${err.message}`)
      ElMessage.error('普通消息推送失败')
    }
  }

  /**
   * 2. 推送通知事件（notification）
   */
  const sendNoticeEvent = async () => {
    if (!sendForm.message) return ElMessage.warning('请输入推送消息内容')
    try {
      const res = await axios.get(`${connectForm.url}/send-event`, {
        params: { clientId: CLIENT_ID, eventName: 'notification', message: sendForm.message },
        withCredentials: connectForm.withCredentials
      })
      if (res.data.code === 200) {
        addLog('success', `前端主动推送通知事件成功：${sendForm.message}`)
        ElMessage.success('通知事件推送成功')
      }
    } catch (err) {
      addLog('error', `通知事件推送失败：${err.message}`)
      ElMessage.error('通知事件推送失败')
    }
  }

  /**
   * 3. 推送更新事件（update）
   */
  const sendUpdateEvent = async () => {
    if (!sendForm.message) return ElMessage.warning('请输入推送消息内容')
    try {
      const res = await axios.get(`${connectForm.url}/send-event`, {
        params: { clientId: CLIENT_ID, eventName: 'update', message: sendForm.message },
        withCredentials: connectForm.withCredentials
      })
      if (res.data.code === 200) {
        addLog('success', `前端主动推送更新事件成功：${sendForm.message}`)
        ElMessage.success('更新事件推送成功')
      }
    } catch (err) {
      addLog('error', `更新事件推送失败：${err.message}`)
      ElMessage.error('更新事件推送失败')
    }
  }

  /**
   * 4. 全局广播消息
   */
  const sendBroadcastMsg = async () => {
    if (!sendForm.message) return ElMessage.warning('请输入推送消息内容')
    try {
      const res = await axios.get(`${connectForm.url}/broadcast`, {
        params: { message: sendForm.message },
        withCredentials: connectForm.withCredentials
      })
      if (res.data.code === 200) {
        addLog('success', `前端主动推送全局广播消息成功：${sendForm.message}`)
        ElMessage.success('全局广播推送成功')
      }
    } catch (err) {
      addLog('error', `全局广播推送失败：${err.message}`)
      ElMessage.error('全局广播推送失败')
    }
  }
</script>

<style scoped>
  .sse-container {
    box-sizing: border-box;
    width: 100%;
  }
</style>
