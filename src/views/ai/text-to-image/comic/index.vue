<template>
  <div class="art-full-height">
    <Search v-model="searchForm" @search="handleSearch" @reset="resetSearchParams"></Search>
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
        :columns="columns"
        :pagination="pagination"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
      </ArtTable>

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
  import { fetchGetComicPage, fetchDeleteComic } from '@/api/ai/comic'
  import EditDialog from './modules/edit-dialog.vue'
  import Search from './modules/search.vue'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import { DialogType } from '@/types'

  defineOptions({ name: 'Comic' })

  type Item = Api.Ai.ComicItem
  // 搜索表单
  const searchForm = ref({
    comicName: ''
  })
  // 弹窗相关
  const dialogType = ref<DialogType>('add')
  const dialogVisible = ref(false)
  const editData = ref<Partial<Item>>({})
  const {
    columns,
    columnChecks,
    data,
    loading,
    pagination,
    getData,
    searchParams,
    resetSearchParams,
    handleSizeChange,
    handleCurrentChange,
    refreshData
  } = useTable({
    // 核心配置
    core: {
      apiFn: fetchGetComicPage,
      columnsFactory: () => [
        { type: 'index', label: '序号' },
        {
          prop: 'comicName',
          label: '漫画名称',
          formatter: (row) => {
            return row.comicName || ''
          }
        },
        { prop: 'comicType', label: '漫画类型' },
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
                onClick: () => deleteComic(row)
              })
            ])
        }
      ]
    }
  })
  /**
   * 搜索处理
   * @param params 参数
   */
  const handleSearch = (params: Record<string, any>) => {
    console.log(params)
    // 搜索参数赋值
    Object.assign(searchParams, params)
    getData()
  }
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
   * 删除
   */
  const deleteComic = (row: Item): void => {
    ElMessageBox.confirm(`确定要删除${row.comicName}吗？`, '删除漫画', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }).then(async () => {
      await fetchDeleteComic([row.id])
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
