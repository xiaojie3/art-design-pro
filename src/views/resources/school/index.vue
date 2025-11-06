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
  import { ref, reactive, computed, onMounted } from 'vue'
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
   * 表单数据 - 从baseFormItems动态生成
   */
  const formData = reactive<Partial<Api.ResourceManage.SchoolListItem>>({
    id: '',
    createTime: ''
  })

  // 初始化表单默认值
  const initFormDefaultValues = () => {
    Object.values(baseFormItems).forEach((item) => {
      if (item.key && item.defaultValue !== undefined) {
        formData[item.key as keyof typeof formData] = item.defaultValue
      }
    })
  }

  // 加载初始数据的函数
  const loadInitialData = async () => {
    try {
      const responseData = await fetchGetSchool()
      // 后端返回的数据结构与 FormData 一致，直接赋值
      Object.assign(formData, responseData) // 使用 Object.assign 逐个属性赋值，避免重新赋值常量
    } catch (error) {
      console.error('加载初始数据失败:', error)
      // 如果加载失败，至少确保有默认值
      initFormDefaultValues()
    }
  }

  // 组件挂载后执行加载
  onMounted(() => {
    // 先设置默认值，然后加载数据
    initFormDefaultValues()
    loadInitialData()
  })
  const { t } = useI18n()
  /**
   * 表单校验规则 - 从baseFormItems动态生成
   */
  const formRules = computed(() => {
    const rules: Record<string, any[]> = {}
    // 遍历所有表单项，提取包含rules配置的项
    Object.values(baseFormItems).forEach((item) => {
      if (item.rules && item.rules.length > 0) {
        rules[item.key] = item.rules
      }
    })
    return rules
  })

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
    defaultValue?: any
    placeholder?: string
    props?: Record<string, any>
    rules?: Array<{
      required?: boolean
      message?: string
      trigger?: string
      [key: string]: any
    }>
    span?: number
    clearable?: boolean
    [key: string]: any
  }

  /**
   * 创建表单项的工厂函数
   */
  const createFormItem = (config: FormItemConfig): FormItemConfig => config

  // 基础表单项配置 - 包含默认值和验证规则
  const baseFormItems = {
    schoolCode: createFormItem({
      label: $t('resources.school.label.schoolCode'),
      key: 'schoolCode',
      type: 'input',
      defaultValue: '',
      placeholder: $t('resources.school.placeholder.schoolCode'),
      clearable: true,
      rules: [
        {
          required: true,
          message: t('resources.school.placeholder.schoolCode'),
          trigger: 'blur'
        }
      ]
    }),
    schoolName: createFormItem({
      label: $t('resources.school.label.schoolName'),
      key: 'schoolName',
      type: 'input',
      defaultValue: '',
      placeholder: $t('resources.school.placeholder.schoolName'),
      rules: [
        {
          required: true,
          message: t('resources.school.placeholder.schoolName'),
          trigger: 'blur'
        }
      ]
    }),
    schoolAbbr: createFormItem({
      label: $t('resources.school.label.schoolAbbr'),
      key: 'schoolAbbr',
      type: 'input',
      defaultValue: '',
      placeholder: $t('resources.school.placeholder.schoolAbbr'),
      rules: [
        {
          required: true,
          message: t('resources.school.placeholder.schoolAbbr'),
          trigger: 'blur'
        }
      ]
    }),
    englishName: createFormItem({
      label: $t('resources.school.label.englishName'),
      key: 'englishName',
      type: 'input',
      defaultValue: '',
      placeholder: $t('resources.school.placeholder.englishName'),
      rules: [
        {
          required: true,
          message: t('resources.school.placeholder.englishName'),
          trigger: 'blur'
        }
      ]
    }),
    englishAbbr: createFormItem({
      label: $t('resources.school.label.englishAbbr'),
      key: 'englishAbbr',
      type: 'input',
      defaultValue: '',
      placeholder: $t('resources.school.placeholder.englishAbbr'),
      rules: [
        {
          required: true,
          message: t('resources.school.placeholder.englishAbbr'),
          trigger: 'blur'
        }
      ]
    }),
    address: createFormItem({
      label: $t('resources.school.label.address'),
      key: 'address',
      type: 'input',
      defaultValue: '',
      placeholder: $t('resources.school.placeholder.address')
      // address字段不需要验证，所以没有rules配置
    }),
    intro: createFormItem({
      label: $t('resources.school.label.intro'),
      key: 'intro',
      type: 'input',
      defaultValue: '',
      span: 24,
      props: {
        placeholder: $t('resources.school.placeholder.intro'),
        type: 'textarea',
        rows: 4
      }
      // intro字段不需要验证，所以没有rules配置
    })
  }

  // 表单配置 - 自动包含baseFormItems中的所有字段
  const formItems = computed(() => Object.values(baseFormItems))

  /**
   * 处理表单重置事件
   */
  const handleReset = (): void => {
    console.log('重置表单')
    // 重置为默认值
    initFormDefaultValues()
    emit('reset')
  }

  // 处理表单提交
  const handleSubmit = async (): Promise<void> => {
    // 1. 验证表单
    await formRef.value.validate()

    // 2. 调用后端接口（示例：POST 请求）
    // 确保 id 必传且为 string
    const payload: Api.ResourceManage.SchoolListItem = {
      ...formData,
      id: formData.id || '' // 若 id 为空则兜底为空字符串，满足后端必填要求
    } as Api.ResourceManage.SchoolListItem
    const responseData = await fetchEditSchool(payload)

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
