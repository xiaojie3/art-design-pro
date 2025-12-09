<template>
  <ElDialog
    v-model="dialogVisible"
    :title="`学生列表 - ${className || ''}`"
    width="60%"
    align-center
    body-class="pt-0!"
  >
    <Search
      ref="searchBarRef"
      v-model="searchParams"
      :items="formItems"
      @reset="handleReset"
      @search="handleSearch"
    >
    </Search>
    <ArtTable
      :loading="loading"
      :data="data"
      :pagination="pagination"
      @pagination:size-change="handleSizeChange"
      @pagination:current-change="handleCurrentChange"
      :columns="columns"
      stripe
    >
    </ArtTable>
  </ElDialog>
</template>
<script setup lang="ts">
  import { useTable } from '@/hooks/core/useTable'
  import { fetchGetStudentPage } from '@/api/student/info'
  import Search from './modules/search.vue'
  interface Props {
    visible: boolean
    classId: string
    className: string
  }
  interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'search', params: Record<string, any>): void
    (e: 'reset'): void
  }
  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()
  // 对话框显示控制
  const dialogVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
  })
  const className = ref(props.className)
  const {
    columns,
    data,
    loading,
    pagination,
    handleSizeChange,
    handleCurrentChange,
    searchParams,
    refreshData
  } = useTable({
    // 核心配置
    core: {
      apiFn: fetchGetStudentPage,
      columnsFactory: () => [
        { type: 'index', label: '序号' },
        { prop: 'studentNo', label: '学号' },
        { prop: 'studentName', label: '学生名称', showOverflowTooltip: true },
        { prop: 'gender', label: '性别' },
        { prop: 'majorId', label: '专业名称', showOverflowTooltip: true },
        { prop: 'grade', label: '年级' },
        { prop: 'classId', label: '班级名称', showOverflowTooltip: true }
      ]
    }
  })
  const openDialog = () => {
    searchParams.classId = props.classId
    className.value = props.className
    console.log(props)
    refreshData()
  }

  /**
   * 监听对话框状态变化
   * 当对话框打开时初始化表单数据并清除验证状态
   */
  watch(
    () => [props.visible, props.className, props.classId],
    ([visible]) => {
      if (visible) {
        openDialog()
      }
    },
    { immediate: true }
  )

  const formItems = computed(() => [
    {
      label: '学生学号',
      key: 'studentNo   ',
      type: 'input',
      clearable: true,
      placeholder: '请输入学生学号'
    },
    {
      label: '学生名称',
      key: 'studentName',
      type: 'input',
      clearable: true,
      placeholder: '请输入学生名称'
    }
  ])
  const searchBarRef = ref()
  // 事件
  function handleReset() {
    console.log('重置表单')
    emit('reset')
  }
  async function handleSearch() {
    await searchBarRef.value.validate()
    emit('search', searchParams)
    refreshData()
  }
</script>
