<template>
  <div class="art-full-height">
    <ElCard class="art-table-card" shadow="never">
      <!-- 表格头部 -->
      <ArtTableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData">
        <template #left>
          <ElSpace wrap>
            <ElButton @click="showDialog('add')" v-ripple>新增</ElButton>
          </ElSpace>
        </template>
      </ArtTableHeader>

      <!-- 表格 -->
      <ArtTable :loading="loading" :data="data" :columns="columns"> </ArtTable>

      <EditDialog
        v-model:visible="dialogVisible"
        :type="dialogType"
        :edit-data="editData"
        @submit="handleDialogSubmit"
      />
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import { useTable } from '@/hooks/core/useTable'
  import { fetchGetCollegePage, fetchDeleteCollege } from '@/api/resources/college'
  import { fetchGetCampusList } from '@/api/resources/campus'
  import EditDialog from './modules/edit-dialog.vue'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import { DialogType } from '@/types'
  import { onMounted } from 'vue'

  defineOptions({ name: 'College' })

  type Item = Api.ResourcesManage.CollegeItem

  // 弹窗相关
  const dialogType = ref<DialogType>('add')
  const dialogVisible = ref(false)
  const editData = ref<Partial<Item>>({})
  const campusList = ref<Api.ResourcesManage.CampusItem[]>([])

  // 获取校区列表数据
  const getCampusList = async () => {
    try {
      campusList.value = await fetchGetCampusList()
    } catch (error) {
      console.error('获取校区列表失败:', error)
      ElMessage.error('获取校区列表失败')
    }
  }

  // 组件加载时获取校区列表
  onMounted(() => {
    getCampusList()
  })

  const { columns, columnChecks, data, loading, refreshData } = useTable({
    // 核心配置
    core: {
      apiFn: fetchGetCollegePage,
      columnsFactory: () => [
        { type: 'index', label: '序号' },
        {
          prop: 'campusName',
          label: '校区名称',
          formatter: (row) => {
            return campusList.value.find((item) => item.id === row.campusId)?.campusName || ''
          }
        },
        { prop: 'collegeCode', label: '学院编码' },
        { prop: 'collegeName', label: '学院名称' },
        {
          prop: 'operation',
          label: '操作',
          fixed: 'right', // 固定列
          formatter: (row) =>
            h('div', [
              h(ArtButtonTable, {
                type: 'edit',
                onClick: () => showDialog('edit', row)
              }),
              h(ArtButtonTable, {
                type: 'delete',
                onClick: () => deleteCollege(row)
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
  const deleteCollege = (row: Item): void => {
    ElMessageBox.confirm(`确定要删除${row.collegeName}吗？`, '删除校区', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }).then(async () => {
      await fetchDeleteCollege([row.id])
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
</script>
