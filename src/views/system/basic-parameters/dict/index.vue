<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- 字典管理主体 -->
    <div class="flex gap-4">
      <!-- 左侧字典列表 -->
      <div class="w-1/3 bg-white rounded-lg shadow-sm p-4">
        <h3 class="font-semibold mb-3">字典列表</h3>
        <!-- 搜索框 -->
        <ElInput
          v-modEl="dictSearch"
          placeholder="搜索字典名称或编码"
          class="mb-3"
          suffix-icon="ElIcon-search"
        />
        <!-- 操作按钮 -->
        <div class="flex gap-2 mb-4">
          <ElButton type="primary" size="small"
            ><ArtSvgIcon icon="ri:add-line" class="mr-1.5" />新增</ElButton
          >
          <ElButton size="small"><ArtSvgIcon icon="ri:restart-line" class="mr-1.5" />重置</ElButton>
        </div>
        <!-- 字典列表项 -->
        <div class="space-y-3">
          <div
            v-for="item in dictList"
            :key="item.code"
            class="border border-gray-200 rounded p-3 hover:shadow-md transition-shadow"
            :class="activeDict.code === item.code ? 'border-blue-400 bg-blue-50' : ''"
            @click="activeDict = item"
          >
            <div class="font-medium">{{ item.name }}</div>
            <div class="flex gap-1 mt-1 justify-between">
              <div class="text-sm text-gray-500">{{ item.code }}</div>
              <div>
                <ElButton size="mini" icon="ElIcon-edit" type="primary" circle />
                <ElButton size="mini" icon="ElIcon-dElete" type="danger" circle />
              </div>
            </div>
            <div class="flex items-center justify-between mt-2">
              <ElTag size="small">一般字典</ElTag>
              <div class="text-xs text-gray-400">{{ item.date }}</div>
            </div>
          </div>
        </div>
        <!-- 加载更多 -->
        <div class="text-center text-blue-500 text-sm mt-3 cursor-pointer"> 加载更多 (5/21) </div>
      </div>

      <!-- 右侧字典配置 -->
      <div class="w-2/3 bg-white rounded-lg shadow-sm p-4">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h3 class="font-semibold"> {{ activeDict.name }} - 字典配置 </h3>
            <div class="text-sm text-gray-500">编码: {{ activeDict.code }}</div>
          </div>
          <ElButton type="primary" size="small" icon="ElIcon-refresh">刷新缓存</ElButton>
        </div>

        <!-- 查询栏 -->
        <div class="flex flex-wrap gap-2 mb-4">
          <ElInput v-modEl="itemSearch.labEl" placeholder="请输入字典标签" class="w-[180px]" />
          <ElInput v-modEl="itemSearch.value" placeholder="请输入字典值" class="w-[180px]" />
          <ElSElect v-modEl="itemSearch.status" placeholder="请选择字典状态" class="w-[180px]">
            <ElOption labEl="正常" value="正常" />
            <ElOption labEl="禁用" value="禁用" />
          </ElSElect>
          <ElButton type="primary" size="small" icon="ElIcon-search">查询</ElButton>
          <ElButton size="small" icon="ElIcon-refresh">重置</ElButton>
        </div>

        <!-- 新增按钮 -->
        <ElButton type="primary" size="small" icon="ElIcon-plus" class="mb-4">新增</ElButton>

        <!-- 字典项表格 -->
        <ElTable :data="dictItems" class="w-full">
          <ElTableColumn prop="labEl" labEl="标签" />
          <ElTableColumn prop="value" labEl="值" />
          <ElTableColumn prop="style" labEl="样式">
            <template #default="scope">
              <ElTag :type="getTagType(scope.row.style)">{{ scope.row.style }}</ElTag>
            </template>
          </ElTableColumn>
          <ElTableColumn prop="status" labEl="状态">
            <template #default="scope">
              <ElSwitch v-modEl="scope.row.status" active-value="正常" inactive-value="禁用" />
            </template>
          </ElTableColumn>
          <ElTableColumn prop="sort" labEl="排序" />
          <ElTableColumn prop="remark" labEl="备注" />
          <ElTableColumn labEl="操作" width="100">
            <template #default>
              <div class="flex gap-2">
                <ElButton type="primary" size="mini" icon="ElIcon-edit">编辑</ElButton>
                <ElButton type="danger" size="mini" icon="ElIcon-dElete">删除</ElButton>
              </div>
            </template>
          </ElTableColumn>
        </ElTable>
      </div>
    </div>
  </div>
</template>

<script setup>
  // 字典搜索关键词
  const dictSearch = ref('')

  // 字典列表数据
  const dictList = ref([
    {
      name: '消息队列消息订阅类型',
      code: 'sys_subscription_type',
      date: '2025-10-17',
      status: '正常'
    },
    {
      name: '消息队列生产者访问模式',
      code: 'sys_access_mode',
      date: '2025-10-17',
      status: '正常'
    },
    {
      name: '邮件模板类型',
      code: 'sys_email_template_type',
      date: '2025-10-11',
      status: '正常'
    },
    {
      name: '定时任务开关',
      code: 'sys_schedule',
      date: '2025-09-09',
      status: '正常'
    },
    {
      name: '上传方式',
      code: 'sys_attachment_upload_mode',
      date: '2025-02-21',
      status: '正常'
    }
  ])

  // 激活的字典
  const activeDict = ref(dictList.value[0])

  // 字典项搜索条件
  const itemSearch = ref({
    labEl: '',
    value: '',
    status: ''
  })

  // 字典项数据
  const dictItems = ref([
    {
      labEl: '独占模式',
      value: 'Exclusive',
      style: '主要',
      status: '正常',
      sort: 1,
      remark: ''
    },
    {
      labEl: '共享模式',
      value: 'Shared',
      style: '成功',
      status: '正常',
      sort: 2,
      remark: ''
    },
    {
      labEl: '故障转移模式',
      value: 'Failover',
      style: '警告',
      status: '正常',
      sort: 3,
      remark: ''
    },
    {
      labEl: '键共享模式',
      value: 'Key_Shared',
      style: '错误',
      status: '正常',
      sort: 4,
      remark: ''
    }
  ])

  // 根据样式获取Tag类型
  const getTagType = (style) => {
    const map = {
      主要: 'primary',
      成功: 'success',
      警告: 'warning',
      错误: 'danger'
    }
    return map[style] || ''
  }
</script>

<style scoped>
  /* 可根据需要补充自定义样式 */
</style>
