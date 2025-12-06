<template>
  <div class="art-full-height">
    <div class="box-border flex gap-4 h-full max-md:block max-md:gap-0 max-md:h-auto">
      <div class="shrink-0 w-58 h-full max-md:w-full max-md:h-auto max-md:mb-5">
        <ElCard class="tree-card art-card-xs flex flex-col h-full mt-0" shadow="never">
          <ElScrollbar class="pr-3">
            <ElTree
              :data="treeData"
              :props="treeProps"
              node-key="id"
              @node-click="handleNodeClick"
              default-expand-all
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
              <ElSwitch
                v-if="!row.name"
                v-model="row.isEnabled"
                @change="handleToggleEnabled(row)"
              />
            </template>
          </ArtTable>

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
  import { fetchGetMajorPage, fetchDeleteMajor, fetchSaveMajor } from '@/api/resources/major'
  import { fetchGetCollegeTree, fetchGetCollegeList } from '@/api/resources/college'
  import { fetchGetDictData } from '@/api/system/dict'
  import EditDialog from './modules/edit-dialog.vue'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import { DialogType } from '@/types'
  import { onMounted } from 'vue'

  defineOptions({ name: 'Major' })
  const treeData = ref<Api.Common.TreeItem[]>([])
  const treeProps = {
    children: 'children',
    label: 'label'
  }
  const handleNodeClick = (data: any) => {
    console.log('选中节点:', data)
    searchParams.collegeId = data.id
    refreshData()
    searchParams.collegeId = ''
  }

  type Item = Api.ResourcesManage.MajorItem

  // 弹窗相关
  const dialogType = ref<DialogType>('add')
  const dialogVisible = ref(false)
  const editData = ref<Partial<Item>>({})
  const tableLayout = ref<'auto' | 'fixed'>('fixed')
  const educationLevelOptions = ref<Api.Common.OptionItem[]>([])
  const degreeOptions = ref<Api.Common.OptionItem[]>([])
  const collegeList = ref<Api.ResourcesManage.CollegeItem[]>([])
  const getDictOptions = async (): Promise<void> => {
    const dictMap = await fetchGetDictData(['education_level', 'degree'])
    educationLevelOptions.value = dictMap.education_level
    degreeOptions.value = dictMap.degree || []
  }
  // 获取校区列表数据
  const getCampusList = async () => {
    try {
      collegeList.value = await fetchGetCollegeList()
    } catch (error) {
      console.error('获取学院列表失败:', error)
      ElMessage.error('获取学院列表失败')
    }
  }

  // 组件加载时获取校区列表
  onMounted(async () => {
    await getCampusList()
    treeData.value = await fetchGetCollegeTree()
    await getDictOptions()
  })
  const {
    columns,
    columnChecks,
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
      apiFn: fetchGetMajorPage,
      columnsFactory: () => [
        { type: 'index', label: '序号' },
        { prop: 'majorName', label: '专业名称', showOverflowTooltip: true },
        { prop: 'majorAbbr', label: '专业简称' },
        { prop: 'englishName', label: '英文名称', showOverflowTooltip: true },
        { prop: 'englishAbbr', label: '英文简称' },
        {
          prop: 'collegeName',
          label: '学院名称',
          formatter: (row) =>
            collegeList.value.find((college) => college.id === row.collegeId)?.collegeName || ''
        },
        {
          prop: 'education_level',
          label: '教育层次',
          formatter: (row) =>
            educationLevelOptions.value.find((item) => item.value === row.educationLevel)?.label ||
            ''
        },
        {
          prop: 'degree',
          label: '学位',
          formatter: (row) =>
            degreeOptions.value.find((item) => item.value === row.degree)?.label || ''
        },
        { prop: 'years', label: '学制' },
        {
          prop: 'isEnabled',
          label: '专业状态',
          useSlot: true,
          slotName: 'isEnabled'
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
    ElMessageBox.confirm(`确定要删除${row.majorName}吗？`, '删除专业', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }).then(async () => {
      await fetchDeleteMajor([row.id])
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
    await fetchSaveMajor(row)
    ElMessage.success('状态更新成功')
  }
</script>

<style scoped>
  .tree-card :deep(.el-card__body) {
    flex: 1;
    min-height: 0;
    padding: 10px 2px 10px 10px;
  }
</style>
