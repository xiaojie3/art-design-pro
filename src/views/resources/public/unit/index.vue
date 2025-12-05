<template>
  <div class="art-full-height">
    <div class="box-border flex gap-4 h-full max-md:block max-md:gap-0 max-md:h-auto">
      <div class="shrink-0 w-58 h-full max-md:w-full max-md:h-auto max-md:mb-5">
        <ElCard class="tree-card art-card-xs flex flex-col h-full mt-0" shadow="never">
          <ElScrollbar>
            <ElTree
              :data="treeData"
              :props="treeProps"
              node-key="id"
              default-expand-all
              highlight-current
              @node-click="handleNodeClick"
            />
          </ElScrollbar>
        </ElCard>
      </div>

      <div class="flex flex-col grow min-w-0">
        <ElCard class="art-table-card mt-0!" shadow="never">
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
    </div>
  </div>
</template>

<script setup lang="ts">
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import { useTable } from '@/hooks/core/useTable'
  import { fetchGetUnitPage, fetchDeleteUnit, fetchGetUnitTree } from '@/api/resources/unit'
  import { fetchGetCampusList } from '@/api/resources/campus'
  import EditDialog from './modules/edit-dialog.vue'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import { DialogType } from '@/types'
  import { onMounted } from 'vue'

  defineOptions({ name: 'Unit' })
  const treeData = ref<Api.Common.TreeItem[]>([])
  const treeProps = {
    children: 'children',
    label: 'label'
  }
  const handleNodeClick = (data: any) => {
    console.log('选中节点:', data)
    // 可以根据选中的节点更新右侧表格数据
  }

  type Item = Api.ResourcesManage.UnitItem

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
  onMounted(async () => {
    await getCampusList()
    treeData.value = await fetchGetUnitTree()
  })

  const { columns, columnChecks, data, loading, refreshData } = useTable({
    // 核心配置
    core: {
      apiFn: fetchGetUnitPage,
      columnsFactory: () => [
        { type: 'index', label: '序号' },
        { prop: 'unitName', label: '单位名称' },
        { prop: 'unitAbbr', label: '单位简称' },
        { prop: 'englishName', label: '英文名称' },
        { prop: 'englishAbbr', label: '英文简称' },
        { prop: 'unitType', label: '单位类型' },
        { prop: 'unitCategory', label: '单位分类' },
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
    ElMessageBox.confirm(`确定要删除${row.unitName}吗？`, '删除单位', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }).then(async () => {
      await fetchDeleteUnit([row.id])
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
