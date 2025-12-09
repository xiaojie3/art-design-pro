<template>
  <div class="art-full-height">
    <Search v-model="searchParams" @search="getData" @reset="resetSearchParams"></Search>
    <ElCard class="art-table-card" shadow="never">
      <!-- 表格头部 -->
      <ArtTableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData">
        <template #left>
          <ElSpace wrap>
            <ElButton @click="showDialog('add')" v-ripple
              ><ArtSvgIcon icon="ri:add-line" class="mr-1" />新增</ElButton
            >
          </ElSpace>
        </template>
      </ArtTableHeader>

      <!-- 表格 -->
      <ArtTable
        :loading="loading"
        :data="data"
        :pagination="pagination"
        :table-layout="tableLayout"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
        :columns="columns"
        stripe
        ><template #isEnabled="{ row }">
          <ElSwitch v-if="!row.name" v-model="row.isEnabled" @change="handleToggleEnabled(row)" />
        </template>
      </ArtTable>

      <EditDialog
        v-model:visible="dialogVisible"
        :type="dialogType"
        :edit-data="editData"
        @submit="handleDialogSubmit"
      />

      <StudentDialog
        v-model:visible="studentsDialogVisible"
        :class-id="currentClass.id || ''"
        :class-name="currentClass.className || ''"
      />
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import { useTable } from '@/hooks/core/useTable'
  import { fetchGetClassPage, fetchDeleteClass, fetchSaveClass } from '@/api/resources/class'
  import EditDialog from './modules/edit-dialog.vue'
  import StudentDialog from '@/views/common/student-dialog.vue'
  import Search from './modules/search.vue'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import { DialogType } from '@/types'

  defineOptions({ name: 'Major' })

  type Item = Api.ResourcesManage.ClassItem

  // 弹窗相关
  const dialogType = ref<DialogType>('add')
  const dialogVisible = ref(false)
  const editData = ref<Partial<Item>>({})
  const tableLayout = ref<'auto' | 'fixed'>('fixed')

  const {
    columns,
    columnChecks,
    data,
    loading,
    pagination,
    handleSizeChange,
    handleCurrentChange,
    getData,
    searchParams,
    resetSearchParams,
    refreshData
  } = useTable({
    // 核心配置
    core: {
      apiFn: fetchGetClassPage,
      columnsFactory: () => [
        { type: 'index', label: '序号' },
        { prop: 'className', label: '班级名称', showOverflowTooltip: true },
        { prop: 'classAbbr', label: '班级简称' },
        { prop: 'majorName', label: '专业名称', showOverflowTooltip: true },
        { prop: 'collegeName', label: '学院名称', showOverflowTooltip: true },
        { prop: 'teacherName', label: '班主任' },
        {
          prop: 'classSize',
          label: '班级人数',
          formatter: (row) =>
            h(
              'span',
              {
                style: 'color: var(--el-color-primary); cursor: pointer;',
                onClick: () => openStudentsDialog(row)
              },
              String(row.classSize || 0)
            )
        },
        {
          prop: 'operation',
          label: '操作',
          fixed: 'right', // 固定列
          width: 100,
          formatter: (row) =>
            h('div', [
              h(ArtButtonTable, {
                type: 'edit',
                onClick: () => showDialog('edit', row)
              }),
              h(ArtButtonTable, {
                type: 'delete',
                onClick: () => deleteUnit(row)
              })
            ])
        }
      ]
    }
  })

  /**
   * 显示用户弹窗
   */
  const showDialog = (type: DialogType, row?: Item): void => {
    dialogType.value = type
    editData.value = row || {}
    nextTick(() => {
      dialogVisible.value = true
    })
  }

  /**
   * 删除校区
   */
  const deleteUnit = (row: Item): void => {
    ElMessageBox.confirm(`确定要删除${row.className}吗？`, '删除班级', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }).then(async () => {
      await fetchDeleteClass([row.id])
      refreshData()
      ElMessage.success('删除成功')
    })
  }

  /**
   * 处理弹窗提交事件
   */
  const handleDialogSubmit = async () => {
    try {
      dialogVisible.value = false
      editData.value = {}
      refreshData()
    } catch (error) {
      console.error('提交失败:', error)
    }
  }

  const handleToggleEnabled = async (row: Item) => {
    await fetchSaveClass(row)
    ElMessage.success('状态更新成功')
  }

  const studentsDialogVisible = ref(false)
  const studentsLoading = ref(false)
  const currentClass = ref<Partial<Item>>({})

  const openStudentsDialog = async (row: Item) => {
    currentClass.value = row
    studentsDialogVisible.value = true
    studentsLoading.value = true
  }
</script>

<style scoped>
  .tree-card :deep(.el-card__body) {
    flex: 1;
    min-height: 0;
    padding: 10px 2px 10px 10px;
  }
</style>
