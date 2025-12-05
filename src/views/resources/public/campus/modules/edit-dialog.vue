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
  import { fetchSaveCampus } from '@/api/resources/campus'
  import { fetchGetSchoolList } from '@/api/resources/school'
  import type { FormInstance } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import { ref, computed, reactive, watch } from 'vue'

  type Item = Api.ResourcesManage.CampusItem
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
    campusCode: '',
    schoolId: '',
    campusName: '',
    englishName: '',
    address: '',
    principal: '',
    phone: '',
    intro: '',
    createTime: ''
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
    campusCode: createFormItem({
      label: '校区编码',
      key: 'campusCode',
      type: 'input',
      span: 12,
      placeholder: '请输入校区编码',
      clearable: true
    }),
    campusName: createFormItem({
      label: '校区名称',
      key: 'campusName',
      type: 'input',
      span: 12,
      placeholder: '请输入校区名称',
      clearable: true
    }),
    schoolId: createFormItem({
      label: '所属学校',
      key: 'schoolId',
      type: 'select',
      span: 12,
      placeholder: '请选择所属学校',
      clearable: true
    }),
    address: createFormItem({
      label: '地址',
      key: 'address',
      type: 'input',
      span: 12,
      placeholder: '请输入地址',
      clearable: true
    })
  }

  const formItems = computed(() => [
    baseFormItems.campusCode,
    baseFormItems.campusName,
    {
      ...baseFormItems.schoolId,
      props: {
        options: schoolOptions.value
      }
    },
    baseFormItems.address
  ])

  // 表单验证规则
  const formRules = {
    campusCode: [
      { required: true, message: '请输入校区编码', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    campusName: [
      { required: true, message: '请输入校区名称', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    schoolId: [{ required: true, message: '请选择所属学校', trigger: 'blur' }]
  }

  /**
   * 初始化表单数据
   * 根据对话框类型（新增/编辑）填充表单
   */
  const initFormData = () => {
    const isEdit = props.type === 'edit' && props.editData
    const row = props.editData

    Object.assign(formData, {
      campusCode: isEdit && row ? row.campusCode || '' : '',
      campusName: isEdit && row ? row.campusName || '' : '',
      schoolId: isEdit && row ? row.schoolId || '' : '',
      address: isEdit && row ? row.address || '' : ''
    })
  }
  const schoolOptions = ref<Api.Common.OptionItem[]>([])
  const loadSchoolOptions = async () => {
    const data = await fetchGetSchoolList()
    schoolOptions.value = data.map((item) => ({
      label: item.schoolName || '',
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
        loadSchoolOptions()
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
        await fetchSaveCampus(formData)
        ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功')
        dialogVisible.value = false
        emit('submit')
      }
    })
  }
</script>
