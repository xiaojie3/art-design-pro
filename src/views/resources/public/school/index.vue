<!-- 表单示例 -->
<template>
  <div class="pb-5 art-full-height">
    <ElCard shadow="never" class="art-card-xs">
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
  import { ref, computed, onMounted } from 'vue'
  import { $t } from '@/locales'
  import { useI18n } from 'vue-i18n'
  import { fetchGetDictData } from '@/api/system/dict'
  import { fetchGetSchool, fetchEditSchool } from '@/api/resources/school'
  import { ElMessage } from 'element-plus'
  interface Emits {
    (e: 'update:modelValue', value: Record<string, any>): void
    (e: 'search', params: Record<string, any>): void
    (e: 'reset'): void
  }

  const emit = defineEmits<Emits>()

  const formRef = ref()
  const provinceOptions = ref<Api.Common.OptionItem[]>([])
  const getDictOptions = async (): Promise<void> => {
    const dictMap = await fetchGetDictData(['province'])
    provinceOptions.value = dictMap.province
    console.log(provinceOptions.value)
  }
  /**
   * 表单数据 - 从baseFormItems动态生成
   */
  const formData = ref<Api.ResourcesManage.SchoolListItem>({
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
      formData.value = responseData
      await getDictOptions()
    } catch (error) {
      console.error('加载初始数据失败:', error)
      // 如果加载失败，至少确保有默认值
      initFormDefaultValues()
    }
  }

  // 组件挂载后执行加载（阻塞字典已在顶层处理，这里仅加载数据）
  onMounted(() => {
    loadInitialData()
  })
  const { t } = useI18n()
  /**
   * 表单校验规则 - 从baseFormItems动态生成
   */
  const formRules = computed(() => ({
    schoolCode: [
      {
        required: true,
        message: t('resources.public.school.placeholder.schoolCode'),
        trigger: 'blur'
      }
    ]
  }))

  const labelWidth = ref(80)
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

  // 基础表单项配置 - 包含默认值和验证规则
  const baseFormItems = {
    schoolCode: createFormItem({
      label: $t('resources.public.school.label.schoolCode'),
      key: 'schoolCode',
      type: 'input',
      placeholder: $t('resources.public.school.placeholder.schoolCode'),
      clearable: true
    }),
    schoolName: createFormItem({
      label: $t('resources.public.school.label.schoolName'),
      key: 'schoolName',
      type: 'input',
      placeholder: $t('resources.public.school.placeholder.schoolName')
    }),
    schoolAbbr: createFormItem({
      label: $t('resources.public.school.label.schoolAbbr'),
      key: 'schoolAbbr',
      type: 'input',
      placeholder: $t('resources.public.school.placeholder.schoolAbbr')
    }),
    englishName: createFormItem({
      label: $t('resources.public.school.label.englishName'),
      key: 'englishName',
      type: 'input',
      placeholder: $t('resources.public.school.placeholder.englishName')
    }),
    englishAbbr: createFormItem({
      label: $t('resources.public.school.label.englishAbbr'),
      key: 'englishAbbr',
      type: 'input',
      placeholder: $t('resources.public.school.placeholder.englishAbbr')
    }),
    province: createFormItem({
      label: $t('resources.public.school.label.province'),
      key: 'province',
      type: 'select'
    }),
    address: createFormItem({
      label: $t('resources.public.school.label.address'),
      key: 'address',
      type: 'input',
      placeholder: $t('resources.public.school.placeholder.address')
      // address字段不需要验证，所以没有rules配置
    }),
    intro: createFormItem({
      label: $t('resources.public.school.label.intro'),
      key: 'intro',
      type: 'input',
      span: 24,
      props: {
        placeholder: $t('resources.public.school.placeholder.intro'),
        type: 'textarea',
        rows: 4
      }
      // intro字段不需要验证，所以没有rules配置
    })
  }

  // 表单配置 - 自动包含baseFormItems中的所有字段
  const formItems = computed(() => [
    baseFormItems.schoolCode,
    baseFormItems.schoolName,
    baseFormItems.schoolAbbr,
    baseFormItems.englishName,
    baseFormItems.englishAbbr,
    {
      ...baseFormItems.province,
      props: {
        clearable: true,
        filterable: true,
        placeholder: t('resources.public.school.placeholder.province'),
        options: provinceOptions.value
      }
    },
    baseFormItems.address,
    baseFormItems.intro
  ])

  /**
   * 处理表单重置事件
   */
  const handleReset = (): void => {
    emit('reset')
    ElMessage.success('重置成功')
  }

  /**
   * 处理表单提交事件
   */
  const handleSubmit = async (): Promise<void> => {
    await formRef.value.validate()
    await fetchEditSchool(formData.value)
    emit('search', formData.value)
    ElMessage.success('更新成功')
  }
</script>
