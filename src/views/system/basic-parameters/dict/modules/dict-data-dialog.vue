<template>
  <ElDialog
    v-model="dialogVisible"
    :title="dialogType === 'add' ? '添加字典数据' : '编辑字典数据'"
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
  import { fetchSaveDictData, fetchUpdateDictData } from '@/api/system/dict'
  import type { FormInstance } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import { ref, computed, reactive, watch } from 'vue'

  type DataItem = Api.SystemManage.DictDataItem

  interface Props {
    visible: boolean
    type: string
    editData?: Partial<DataItem>
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
  const formData = reactive<DataItem>({
    id: '',
    type: '',
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
    code: createFormItem({
      label: '字典编码',
      key: 'code',
      type: 'input',
      span: 12,
      placeholder: '请输入字典编码',
      clearable: true
    }),
    label: createFormItem({
      label: '字典标签',
      key: 'label',
      type: 'input',
      span: 12,
      placeholder: '请输入字典标签',
      clearable: true
    }),
    isEnabled: createFormItem({
      label: '是否启用',
      key: 'isEnabled',
      type: 'switch',
      span: 12,
      activeValue: true,
      inactiveValue: false
    }),
    sort: createFormItem({
      label: '字典排序',
      key: 'sort',
      type: 'input-number',
      span: 12,
      props: { placeholder: '请输入字典排序', min: 0, max: 999999 }
    })
  }

  const formItems = computed(() => [
    baseFormItems.code,
    baseFormItems.label,
    baseFormItems.isEnabled,
    baseFormItems.sort
  ])

  // 表单验证规则
  const formRules = {
    code: [
      { required: true, message: '请输入字典编码', trigger: 'blur' },
      { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
    ],
    label: [
      { required: true, message: '请输入字典标签', trigger: 'blur' },
      { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
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
      code: row ? row.code || '' : '',
      label: row ? row.label || '' : '',
      isEnabled: row ? row.isEnabled || true : true,
      sort: row ? row.sort || 0 : 0
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
    const valid = await formRef.value.validate()
    if (valid) {
      // 根据类型执行新增或更新，等待接口请求完成
      if (dialogType.value === 'add') {
        await fetchSaveDictData(formData)
      } else {
        await fetchUpdateDictData(formData)
      }
      ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功')
      dialogVisible.value = false
      emit('submit')
    }
  }
</script>
