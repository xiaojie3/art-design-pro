<template>
  <div class="role-page art-full-height">
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

    <!-- 编辑弹窗 -->
    <EditDialog
      v-model="dialogVisible"
      :dialog-type="dialogType"
      :campus-data="currentData"
      @success="refreshData"
    />
  </div>
</template>

<script setup lang="ts">
  import { ButtonMoreItem } from '@/components/core/forms/art-button-more/index.vue'
  import { Edit, Delete } from '@element-plus/icons-vue'
  import { useTable } from '@/composables/useTable'
  import { fetchFindCampusPage, fetchDeleteCampus } from '@/api/resource-manage'
  import ArtButtonMore from '@/components/core/forms/art-button-more/index.vue'
  import EditDialog from './modules/edit-dialog.vue'
  import { ElMessageBox } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  defineOptions({ name: 'Campus' })

  type CampusListItem = Api.ResourceManage.CampusListItem

  const showSearchBar = ref(false)

  const dialogVisible = ref(false)
  const currentData = ref<CampusListItem | undefined>(undefined)

  const {
    columns,
    columnChecks,
    data,
    loading,
    pagination,
    handleSizeChange,
    handleCurrentChange,
    refreshData
  } = useTable({
    // 核心配置
    core: {
      apiFn: fetchFindCampusPage,
      // 排除 apiParams 中的属性
      excludeParams: ['daterange'],
      columnsFactory: () => [
        {
          type: 'index',
          label: t('table.column.index'),
          width: 100
        },
        {
          prop: 'campusName',
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
    ElMessageBox.confirm(`确定删除校区"${row.campusName}"吗？此操作不可恢复！`, '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        // TODO: 调用删除接口
        await fetchDeleteCampus(row.id)
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
