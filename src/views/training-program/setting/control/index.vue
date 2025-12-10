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
        :labelWidth="200"
        :span="12"
        :labelPosition="labelPosition"
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
  import { fetchGetControl, fetchEditControl } from '@/api/training-program'
  import { ElMessage } from 'element-plus'
  interface Emits {
    (e: 'update:modelValue', value: Record<string, any>): void
    (e: 'search', params: Record<string, any>): void
    (e: 'reset'): void
  }

  const emit = defineEmits<Emits>()
  const formRef = ref()
  type Item = Api.TrainingProgram.ControlItem
  /**
   * 表单数据 - 从baseFormItems动态生成
   */
  const formData = ref<Item>({
    id: '',
    controlStartTime: '',
    controlEndTime: '',
    isTotalClassHourModifiable: false,
    isWeeklyClassHourModifiable: false,
    isCreditModifiable: false,
    isCourseInfoModifiable: false,
    isCourseNatureModifiable: false,
    isCourseAttributeModifiable: false
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
      const responseData = await fetchGetControl()
      // 后端返回的数据结构与 FormData 一致，直接赋值
      formData.value = responseData
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
  /**
   * 表单校验规则 - 从baseFormItems动态生成
   */
  const formRules = computed(() => ({
    controlStartTime: [
      {
        required: true,
        message: $t('trainingProgram.setting.control.placeholder.controlStartTime'),
        trigger: 'blur'
      }
    ],
    controlEndTime: [
      {
        required: true,
        message: $t('trainingProgram.setting.control.placeholder.controlEndTime'),
        trigger: 'blur'
      }
    ]
  }))
  const labelPosition = ref<'right' | 'left' | 'top'>('right')

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
    controlStartTime: createFormItem({
      label: $t('trainingProgram.setting.control.label.controlStartTime'),
      key: 'controlStartTime',
      type: 'datetime',
      props: {
        type: 'datetime',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        placeholder: $t('form.placeholder.selectDatetime')
      }
    }),
    controlEndTime: createFormItem({
      label: $t('trainingProgram.setting.control.label.controlEndTime'),
      key: 'controlEndTime',
      type: 'datetime',
      props: {
        type: 'datetime',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        placeholder: $t('form.placeholder.selectDatetime')
      }
    }),
    isTotalClassHourModifiable: createFormItem({
      label: $t('trainingProgram.setting.control.label.isTotalClassHourModifiable'),
      key: 'isTotalClassHourModifiable',
      type: 'switch',
      props: {
        activeValue: true,
        inactiveValue: false
      }
    }),
    isWeeklyClassHourModifiable: createFormItem({
      label: $t('trainingProgram.setting.control.label.isWeeklyClassHourModifiable'),
      key: 'isWeeklyClassHourModifiable',
      type: 'switch',
      props: {
        activeValue: true,
        inactiveValue: false
      }
    }),
    isCreditModifiable: createFormItem({
      label: $t('trainingProgram.setting.control.label.isCreditModifiable'),
      key: 'isCreditModifiable',
      type: 'switch',
      props: {
        activeValue: true,
        inactiveValue: false
      }
    }),
    isCourseInfoModifiable: createFormItem({
      label: $t('trainingProgram.setting.control.label.isCourseInfoModifiable'),
      key: 'isCourseInfoModifiable',
      type: 'switch',
      props: {
        activeValue: true,
        inactiveValue: false
      }
    }),
    isCourseNatureModifiable: createFormItem({
      label: $t('trainingProgram.setting.control.label.isCourseNatureModifiable'),
      key: 'isCourseNatureModifiable',
      type: 'switch',
      props: {
        activeValue: true,
        inactiveValue: false
      }
    }),
    isCourseAttributeModifiable: createFormItem({
      label: $t('trainingProgram.setting.control.label.isCourseAttributeModifiable'),
      key: 'isCourseAttributeModifiable',
      type: 'switch',
      props: {
        activeValue: true,
        inactiveValue: false
      }
    })
  }

  // 表单配置 - 自动包含baseFormItems中的所有字段
  const formItems = computed(() => [
    baseFormItems.controlStartTime,
    baseFormItems.controlEndTime,
    baseFormItems.isTotalClassHourModifiable,
    baseFormItems.isWeeklyClassHourModifiable,
    baseFormItems.isCreditModifiable,
    baseFormItems.isCourseInfoModifiable,
    baseFormItems.isCourseNatureModifiable,
    baseFormItems.isCourseAttributeModifiable
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
    if (new Date(formData.value.controlStartTime) >= new Date(formData.value.controlEndTime)) {
      ElMessage.error('结束时间必须晚于开始时间')
      return
    }
    await fetchEditControl(formData.value)
    emit('search', formData.value)
    ElMessage.success('更新成功')
  }
</script>
