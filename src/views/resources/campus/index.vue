<template>
  <div class="role-page art-full-height">
    <RoleSearch
      v-show="showSearchBar"
      v-model="searchForm"
      @search="handleSearch"
      @reset="resetSearchParams"
    ></RoleSearch>

    <ElCard
      class="art-table-card"
      shadow="never"
      :style="{ 'margin-top': showSearchBar ? '12px' : '0' }"
    >
      <ArtTableHeader
        v-model:columns="columnChecks"
        v-model:showSearchBar="showSearchBar"
        :loading="loading"
        @refresh="refreshData"
      >
        <template #left>
          <ElSpace wrap>
            <ElButton @click="showDialog('add')" v-ripple>
              {{ t('resources.campus.operation.add') }}
            </ElButton>
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
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { ButtonMoreItem } from '@/components/core/forms/art-button-more/index.vue'
  import { Edit, Delete } from '@element-plus/icons-vue'
  import { useTable } from '@/composables/useTable'
  import { fetchFindCampusPage } from '@/api/resource-manage'
  import ArtButtonMore from '@/components/core/forms/art-button-more/index.vue'
  import { ElMessageBox } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  defineOptions({ name: 'Campus' })

  type CampusListItem = Api.ResourceManage.CampusListItem

  // 搜索表单
  const searchForm = ref({
    chineseName: undefined,
    englishName: undefined,
    address: undefined,
    principal: undefined,
    contact: undefined,
    intro: undefined
  })

  const showSearchBar = ref(false)

  const dialogVisible = ref(false)
  const currentData = ref<CampusListItem | undefined>(undefined)

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
      apiFn: fetchFindCampusPage,
      apiParams: {
        current: 1,
        size: 20
      },
      // 排除 apiParams 中的属性
      excludeParams: ['daterange'],
      columnsFactory: () => [
        {
          type: 'index',
          label: t('table.column.index'),
          width: 100
        },
        {
          prop: 'chineseName',
          label: t('resources.campus.table.column.chineseName'),
          minWidth: 120
        },
        {
          prop: 'englishName',
          label: t('resources.campus.table.column.englishName'),
          minWidth: 120
        },
        {
          prop: 'address',
          label: t('resources.campus.table.column.address'),
          minWidth: 150,
          showOverflowTooltip: true
        },
        {
          prop: 'createTime',
          label: t('table.column.createTime'),
          width: 180,
          sortable: true
        },
        {
          prop: 'operation',
          label: t('table.column.operation'),
          width: 80,
          fixed: 'right',
          formatter: (row) =>
            h('div', [
              h(ArtButtonMore, {
                list: [
                  {
                    key: 'edit',
                    label: t('resources.campus.operation.edit'),
                    icon: Edit
                  },
                  {
                    key: 'delete',
                    label: t('resources.campus.operation.delete'),
                    icon: Delete,
                    color: '#f56c6c'
                  }
                ],
                onClick: (item: ButtonMoreItem) => buttonMoreClick(item, row)
              })
            ])
        }
      ]
    }
  })

  const dialogType = ref<'add' | 'edit'>('add')

  const showDialog = (type: 'add' | 'edit', row?: CampusListItem) => {
    dialogVisible.value = true
    dialogType.value = type
    currentData.value = row
  }

  /**
   * 搜索处理
   * @param params 搜索参数
   */
  const handleSearch = (params: Record<string, any>) => {
    // 处理日期区间参数，把 daterange 转换为 startTime 和 endTime
    const { daterange, ...filtersParams } = params
    const [startTime, endTime] = Array.isArray(daterange) ? daterange : [null, null]

    // 搜索参数赋值
    Object.assign(searchParams, { ...filtersParams, startTime, endTime })
    getData()
  }

  const buttonMoreClick = (item: ButtonMoreItem, row: CampusListItem) => {
    switch (item.key) {
      case 'edit':
        showDialog('edit', row)
        break
      case 'delete':
        deleteRole(row)
        break
    }
  }

  const deleteRole = (row: CampusListItem) => {
    ElMessageBox.confirm(`确定删除校区"${row.chineseName}"吗？此操作不可恢复！`, '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        // TODO: 调用删除接口
        ElMessage.success('删除成功')
        refreshData()
      })
      .catch(() => {
        ElMessage.info('已取消删除')
      })
  }
</script>

<style lang="scss" scoped>
  .role-page {
    padding-bottom: 15px;
  }
</style>
