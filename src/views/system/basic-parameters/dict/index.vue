<!-- 菜单管理页面 -->
<template>
  <div class="art-full-height">
    <!-- 搜索栏 -->
    <ArtSearchBar
      v-model="formFilters"
      :items="formItems"
      :showExpand="false"
      @reset="resetSearchParams"
      @search="handleSearch"
    />
    <ElCard class="art-table-card" shadow="never">
      <!-- 表格头部 -->
      <ArtTableHeader
        :showZebra="false"
        :loading="loading"
        v-model:columns="columnChecks"
        @refresh="refreshData"
      >
        <template #left>
          <ElButton v-auth="'add'" @click="handleAddDictType" v-ripple
            ><ArtSvgIcon icon="ri:add-line" class="mr-1" />添加</ElButton
          >
        </template>
      </ArtTableHeader>

      <ArtTable
        ref="tableRef"
        rowKey="id"
        :loading="loading"
        :columns="columns"
        :data="data"
        :pagination="pagination"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
        :stripe="false"
        :tree-props="treeProps"
        :default-expand-all="false"
        ><template #isEnabled="{ row }">
          <ElSwitch v-if="!row.name" v-model="row.isEnabled" @change="handleToggleEnabled(row)" />
        </template>
      </ArtTable>

      <!-- 字典类型弹窗 -->
      <DictTypeDialog
        v-model:visible="dialogVisible"
        :type="dialogType"
        :editData="editDictTypeData"
        @submit="refreshData"
      />

      <!-- 字典弹窗 -->
      <DictDataDialog
        v-model:visible="dictDataDialogVisible"
        :type="dialogType"
        :editData="editDictData"
        @submit="refreshData"
      />
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import { useTable } from '@/hooks/core/useTable'
  import DictTypeDialog from './modules/dict-type-dialog.vue'
  import DictDataDialog from './modules/dict-data-dialog.vue'
  import {
    fetchGetDictTypePage,
    fetchDeleteDictData,
    fetchDeleteDictType,
    fetchUpdateDictData
  } from '@/api/system/dict'
  import { ElMessage, ElMessageBox } from 'element-plus'

  defineOptions({ name: 'Menus' })

  type DictDataItem = Api.SystemManage.DictDataItem
  type DictTypeItem = Api.SystemManage.DictTypeItem

  // 状态管理
  const tableRef = ref()

  // 弹窗相关
  const dialogVisible = ref(false)
  const dictDataDialogVisible = ref(false)
  const dialogType = ref<'add' | 'edit'>('add')
  const editDictData = ref<DictDataItem | any>(null)
  const editDictTypeData = ref<DictTypeItem | any>(null)

  const treeProps = reactive({
    children: 'dictDataList'
  })

  // 搜索相关
  const initialSearchState = {
    name: '',
    type: ''
  }

  const formFilters = reactive({ ...initialSearchState })

  const formItems = computed(() => [
    {
      label: '字典名称',
      key: 'name',
      type: 'input',
      props: { clearable: true }
    },
    {
      label: '字典类型',
      key: 'type',
      type: 'input',
      props: { clearable: true }
    }
  ])

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
      apiFn: fetchGetDictTypePage,
      apiParams: {
        current: 1,
        size: 20,
        ...initialSearchState
      },
      // 自定义分页字段映射，未设置时将使用全局配置 tableConfig.ts 中的 paginationKey
      // paginationKey: {
      //   current: 'pageNum',
      //   size: 'pageSize'
      // },
      columnsFactory: () => [
        {
          prop: 'name',
          label: '字典名称'
        },
        {
          prop: 'type',
          label: '字典类型'
        },
        {
          prop: 'module',
          label: '所属模块'
        },
        {
          prop: 'code',
          label: '字典代码'
        },
        {
          prop: 'label',
          label: '字典标题'
        },
        {
          prop: 'isEnabled',
          label: '是否启用',
          useSlot: true,
          slotName: 'isEnabled'
        },
        {
          prop: 'sort',
          label: '排序',
          formatter: (row) => {
            if (!row.name) {
              return row.sort || '-'
            }
          }
        },
        {
          prop: 'operation',
          label: '操作',
          width: 180,
          align: 'right',
          formatter: (row) => {
            const buttonStyle = { style: 'text-align: right' }
            if (row.name) {
              return h('div', buttonStyle, [
                h(ArtButtonTable, {
                  type: 'add',
                  onClick: () => handleAddDictData(row),
                  title: '新增字典项'
                }),
                h(ArtButtonTable, {
                  type: 'edit',
                  onClick: () => handleEditDictType(row)
                }),
                h(ArtButtonTable, {
                  type: 'delete',
                  onClick: () => handleDeleteDictType(row)
                })
              ])
            }
            return h('div', buttonStyle, [
              h(ArtButtonTable, {
                type: 'edit',
                onClick: () => handleEditDictData(row)
              }),
              h(ArtButtonTable, {
                type: 'delete',
                onClick: () => handleDeleteDictData(row)
              })
            ])
          }
        }
      ]
    }
  })

  const handleToggleEnabled = async (row: DictDataItem) => {
    await fetchUpdateDictData(row)
    ElMessage.success('状态更新成功')
  }

  const handleSearch = (): void => {
    console.log(formItems)
    // 搜索参数赋值
    Object.assign(searchParams, formItems)
    getData()
  }

  const handleAddDictType = (): void => {
    editDictTypeData.value = null
    dialogType.value = 'add'
    dialogVisible.value = true
  }

  const handleAddDictData = (row: DictDataItem): void => {
    editDictData.value = row
    dialogType.value = 'add'
    dictDataDialogVisible.value = true
  }

  const handleEditDictType = (row: DictTypeItem): void => {
    editDictTypeData.value = row
    dialogType.value = 'edit'
    dialogVisible.value = true
  }

  const handleEditDictData = (row: DictDataItem): void => {
    editDictData.value = row
    dialogType.value = 'edit'
    dictDataDialogVisible.value = true
  }

  const handleDeleteDictType = async (row: DictTypeItem): Promise<void> => {
    ElMessageBox.confirm(`确定删除吗？此操作不可恢复！`, '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        await fetchDeleteDictType(row.id)
        ElMessage.success('删除成功')
        refreshData()
      })
      .catch(() => {
        ElMessage.info('已取消删除')
      })
  }

  const handleDeleteDictData = async (row: DictDataItem): Promise<void> => {
    ElMessageBox.confirm(`确定删除吗？此操作不可恢复！`, '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        await fetchDeleteDictData(row.id)
        ElMessage.success('删除成功')
        refreshData()
      })
      .catch(() => {
        ElMessage.info('已取消删除')
      })
  }
</script>
