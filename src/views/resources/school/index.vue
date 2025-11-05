<!-- 表单示例 -->
<template>
  <div class="form-example">
    <ElCard class="art-custom-card" shadow="never">
      <ArtForm
        ref="formRef"
        v-model="formData"
        :items="formItems"
        :rules="formRules"
        :defaultExpanded="true"
        :labelWidth="labelWidth"
        :labelPosition="labelPosition"
        :span="span"
        :gutter="gutter"
        @reset="handleReset"
        @submit="handleSubmit"
      >
      </ArtForm>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { $t } from '@/locales'
  import { useI18n } from 'vue-i18n'
  import { fetchGetSchool, fetchEditSchool } from '@/api/resource-manage'
  interface Emits {
    (e: 'update:modelValue', value: Record<string, any>): void
    (e: 'search', params: Record<string, any>): void
    (e: 'reset'): void
  }

  const emit = defineEmits<Emits>()

  const formRef = ref()

  /**
   * 表单数据
   */
  const formData = reactive<Api.ResourceManage.SchoolListItem>({
    id: '',
    schoolCode: '',
    schoolName: '',
    schoolAbbr: '',
    englishName: '',
    englishAbbr: '',
    address: '',
    intro: '',
    createTime: ''
  })

  // 加载初始数据的函数
  const loadInitialData = async () => {
    const responseData = await fetchGetSchool()
    // 后端返回的数据结构与 FormData 一致，直接赋值
    Object.assign(formData, responseData) // 使用 Object.assign 逐个属性赋值，避免重新赋值常量
  }
  // 组件挂载后执行加载
  onMounted(() => {
    loadInitialData()
  })
  const { t } = useI18n()
  /**
   * 表单校验规则
   */
  const formRules = {
    schoolCode: [
      {
        required: true,
        message: t('resources.school.placeholder.schoolCode'),
        trigger: 'blur'
      }
    ],
    schoolName: [
      {
        required: true,
        message: t('resources.school.placeholder.schoolName'),
        trigger: 'blur'
      }
    ],
    schoolAbbr: [
      {
        required: true,
        message: t('resources.school.placeholder.schoolAbbr'),
        trigger: 'blur'
      }
    ],
    englishName: [
      {
        required: true,
        message: t('resources.school.placeholder.englishName'),
        trigger: 'blur'
      }
    ],
    englishAbbr: [
      {
        required: true,
        message: t('resources.school.placeholder.englishAbbr'),
        trigger: 'blur'
      }
    ]
  }

  const labelWidth = ref(100)
  const labelPosition = ref<'right' | 'left' | 'top'>('right')
  const span = ref(6)
  const gutter = ref(12)

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
    schoolCode: createFormItem({
      label: $t('resources.school.label.schoolCode'),
      key: 'schoolCode',
      type: 'input',
      placeholder: $t('resources.school.placeholder.schoolCode'),
      clearable: true
    }),
    schoolName: createFormItem({
      label: $t('resources.school.label.schoolName'),
      key: 'schoolName',
      type: 'input',
      placeholder: $t('resources.school.placeholder.schoolName')
    }),
    schoolAbbr: createFormItem({
      label: $t('resources.school.label.schoolAbbr'),
      key: 'schoolAbbr',
      type: 'input',
      placeholder: $t('resources.school.placeholder.schoolAbbr')
    }),
    englishName: createFormItem({
      label: $t('resources.school.label.englishName'),
      key: 'englishName',
      type: 'input',
      placeholder: $t('resources.school.placeholder.englishName')
    }),
    englishAbbr: createFormItem({
      label: $t('resources.school.label.englishAbbr'),
      key: 'englishAbbr',
      type: 'input',
      placeholder: $t('resources.school.placeholder.englishAbbr')
    }),
    address: createFormItem({
      label: $t('resources.school.label.address'),
      key: 'address',
      type: 'input',
      placeholder: $t('resources.school.placeholder.address')
    }),
    intro: createFormItem({
      label: $t('resources.school.label.intro'),
      key: 'intro',
      type: 'input',
      span: 24,
      props: {
        placeholder: $t('resources.school.placeholder.intro'),
        type: 'textarea',
        rows: 4
      }
    })
  }

  // 表单配置
  const formItems = computed(() => [
    baseFormItems.schoolCode,
    baseFormItems.schoolName,
    baseFormItems.schoolAbbr,
    baseFormItems.englishName,
    baseFormItems.englishAbbr,
    baseFormItems.address,
    baseFormItems.intro
  ])

  /**
   * 处理表单重置事件
   */
  const handleReset = (): void => {
    console.log('重置表单')
    emit('reset')
  }

  // 处理表单提交
  const handleSubmit = async (): Promise<void> => {
    // 1. 验证表单
    await formRef.value.validate()

    // 2. 调用后端接口（示例：POST 请求）
    const responseData = await fetchEditSchool(formData)

    // 可以在这里更新组件状态或触发其他逻辑
    emit('search', responseData) // 将接口返回数据传给父组件
  }
</script>

<style scoped lang="scss">
  .form-example {
    padding-bottom: 20px;

    .title {
      margin-bottom: 5px;
      font-size: 18px;
      font-weight: 500;

      &.m-15 {
        margin-top: 15px;
      }
    }

    .code {
      padding: 15px;
      margin-top: 15px;
      font-size: 14px;
      background-color: var(--art-main-bg-color);
      border: 1px solid var(--art-border-color);
      border-radius: var(--el-border-radius-base);
    }

    .button-group {
      margin-top: 15px;
    }
  }
</style>
