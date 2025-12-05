<template>
  <ElDialog
    v-model="dialogVisible"
    :title="dialogType === 'add' ? '添加' : '编辑'"
    width="60%"
    align-center
  >
    <ArtForm
      ref="formRef"
      v-model="formData"
      :items="formItems"
      :rules="formRules"
      :span="24"
      :label-width="80"
      :defaultExpanded="true"
      @submit="handleSubmit"
    >
    </ArtForm>
  </ElDialog>
</template>

<script setup lang="ts">
  import { fetchSaveCollege } from '@/api/resources/college'
  import { fetchGetCampusList } from '@/api/resources/campus'
  import type { FormInstance } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import { ref, computed, reactive, watch } from 'vue'

  type Item = Api.ResourcesManage.CollegeItem
  interface Props {
    visible: boolean
    type: string
    editData?: Partial<Item>
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
  const formData = reactive<Item>({
    id: '',
    campusId: '',
    collegeCode: '',
    collegeName: '',
    collegeAbbr: '',
    englishName: '',
    dean: '',
    contact: '',
    intro: ''
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
    campusId: createFormItem({
      label: '校区',
      key: 'campusId',
      type: 'select',
      span: 12,
      placeholder: '请选择校区',
      clearable: true
    }),
    collegeCode: createFormItem({
      label: '学院编码',
      key: 'collegeCode',
      type: 'input',
      span: 12,
      placeholder: '请输入学院编码',
      clearable: true
    }),
    collegeName: createFormItem({
      label: '学院名称',
      key: 'collegeName',
      type: 'input',
      span: 12,
      placeholder: '请输入学院名称',
      clearable: true
    }),
    collegeAbbr: createFormItem({
      label: '中文简称',
      key: 'collegeAbbr',
      type: 'input',
      span: 12,
      placeholder: '请输入中文简称',
      clearable: true
    }),
    englishName: createFormItem({
      label: '英文名称',
      key: 'englishName',
      type: 'input',
      span: 12,
      placeholder: '请输入英文名称',
      clearable: true
    }),
    dean: createFormItem({
      label: '院长',
      key: 'dean',
      type: 'input',
      span: 12,
      placeholder: '请输入院长',
      clearable: true
    }),
    contact: createFormItem({
      label: '联系电话',
      key: 'contact',
      type: 'input',
      span: 12,
      placeholder: '请输入联系电话',
      clearable: true
    }),
    intro: createFormItem({
      label: '简介',
      key: 'intro',
      type: 'input',
      span: 12,
      placeholder: '请输入简介',
      clearable: true
    })
  }

  const formItems = computed(() => [
    {
      ...baseFormItems.campusId,
      props: {
        options: campusOptions.value
      }
    },
    baseFormItems.collegeCode,
    baseFormItems.collegeName,
    baseFormItems.englishName,
    baseFormItems.collegeAbbr,
    baseFormItems.dean,
    baseFormItems.contact,
    baseFormItems.intro
  ])

  // 表单验证规则
  const formRules = {
    collegeCode: [
      { required: true, message: '请输入学院编码', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    collegeName: [
      { required: true, message: '请输入学院名称', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    collegeAbbr: [
      { required: true, message: '请输入中文简称', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    campusId: [{ required: true, message: '请选择所属校区', trigger: 'blur' }]
  }

  /**
   * 初始化表单数据
   * 根据对话框类型（新增/编辑）填充表单
   */
  const initFormData = () => {
    const isEdit = props.type === 'edit' && props.editData
    const row = props.editData

    Object.assign(formData, {
      campusId: isEdit && row ? row.campusId || '' : '',
      collegeCode: isEdit && row ? row.collegeCode || '' : '',
      collegeName: isEdit && row ? row.collegeName || '' : '',
      collegeAbbr: isEdit && row ? row.collegeAbbr || '' : '',
      englishName: isEdit && row ? row.englishName || '' : '',
      dean: isEdit && row ? row.dean || '' : '',
      contact: isEdit && row ? row.contact || '' : '',
      intro: isEdit && row ? row.intro || '' : ''
    })
  }
  const campusOptions = ref<Api.Common.OptionItem[]>([])
  const loadCampusOptions = async () => {
    const data = await fetchGetCampusList()
    campusOptions.value = data.map((item) => ({
      label: item.campusName || '',
      value: item.id || ''
    }))
  }

  /**
   * 监听对话框状态变化
   * 当对话框打开时初始化表单数据并清除验证状态
   */
  watch(
    () => [props.visible, props.type, props.editData],
    ([visible]) => {
      if (visible) {
        loadCampusOptions()
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

    await formRef.value.validate(async (valid) => {
      if (valid) {
        await fetchSaveCollege(formData)
        ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功')
        dialogVisible.value = false
        emit('submit')
      }
    })
  }
</script>
