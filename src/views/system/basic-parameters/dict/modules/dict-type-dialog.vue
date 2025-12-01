<template>
  <ElDialog
    v-model="dialogVisible"
    :title="dialogType === 'add' ? '添加字典表' : '编辑字典表'"
    width="66%"
    align-center
  >
    <ArtForm
      ref="formRef"
      v-model="formData"
      :items="formItems"
      :rules="formRules"
      :span="24"
      :labelWidth="94"
      :defaultExpanded="true"
      @submit="handleSubmit"
    >
    </ArtForm>
  </ElDialog>
</template>

<script setup lang="ts">
  // 移除mock数据导入，改为导入API
  import { fetchSaveDictType } from '@/api/system/dict'
  import type { FormInstance } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import { ref, computed, reactive, watch } from 'vue'

  interface Props {
    visible: boolean
    type: string
    editData?: Partial<Api.SystemManage.DictTypeItem>
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'submit'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  // 对话框显示控制
  const dialogVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
  })

  const dialogType = computed(() => props.type)

  // 表单实例
  const formRef = ref<FormInstance>()

  // 表单数据
  const formData = reactive<Api.SystemManage.DictTypeItem>({
    id: '',
    type: '',
    name: '',
    module: '',
    description: '',
    createTime: '',
    code: '',
    label: '',
    isEnabled: true,
    sort: 0
  })

  /**
   * 表单项配置类型
   */
  interface FormItemConfig {
    label: string
    key: string
    type: string
    placeholder?: string
    props?: Record<string, any>
    [key: string]: any
  }

  /**
   * 创建表单项的工厂函数
   */
  const createFormItem = (config: FormItemConfig) => config

  // 基础表单项配置
  const baseFormItems = {
    name: createFormItem({
      label: '字典名称',
      key: 'name',
      type: 'input',
      span: 12,
      placeholder: '请输入字典名称',
      clearable: true
    }),
    type: createFormItem({
      label: '字典类型',
      key: 'type',
      type: 'input',
      span: 12,
      placeholder: '请输入字典类型',
      clearable: true
    }),
    module: createFormItem({
      label: '模块名称',
      key: 'module',
      type: 'input',
      span: 12,
      placeholder: '请输入模块名称',
      clearable: true
    }),
    description: createFormItem({
      label: '字典描述',
      key: 'description',
      type: 'input',
      span: 12,
      props: { placeholder: '请输入字典描述', maxlength: '200' }
    })
  }

  const formItems = computed(() => [
    baseFormItems.name,
    baseFormItems.type,
    baseFormItems.module,
    baseFormItems.description
  ])

  // 表单验证规则
  const formRules = {
    name: [
      { required: true, message: '请输入字典名称', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    type: [
      { required: true, message: '请输入字典类型', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    module: [
      { required: true, message: '请输入所属模块', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ]
  }

  /**
   * 初始化表单数据
   * 根据对话框类型（新增/编辑）填充表单
   */
  const initFormData = () => {
    const row = props.editData
    Object.assign(formData, {
      id: row ? row.id || '' : '',
      type: row ? row.type || '' : '',
      name: row ? row.name || '' : '',
      module: row ? row.module || '' : '',
      description: row ? row.description || '' : ''
    })
  }

  /**
   * 监听对话框状态变化
   * 当对话框打开时初始化表单数据并清除验证状态
   */
  watch(
    () => [props.visible, props.type, props.editData],
    ([visible]) => {
      if (visible) {
        initFormData()
      }
    },
    { immediate: true }
  )

  /**
   * 提交表单
   * 验证通过后触发提交事件
   */
  const handleSubmit = async () => {
    if (!formRef.value) return
    // 调用API保存数据
    await fetchSaveDictType(formData)
    ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功')
    dialogVisible.value = false
    emit('submit')
  }
</script>
