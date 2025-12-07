<template>
  <ArtSearchBar
    ref="searchBarRef"
    v-model="formData"
    :items="formItems"
    :rules="rules"
    @reset="handleReset"
    @search="handleSearch"
  >
  </ArtSearchBar>
</template>

<script setup lang="ts">
  import { fetchGetCollegeList } from '@/api/resources/college'
  import { fetchGetMajorList } from '@/api/resources/major'
  interface Props {
    modelValue: Record<string, any>
  }
  interface Emits {
    (e: 'update:modelValue', value: Record<string, any>): void
    (e: 'search', params: Record<string, any>): void
    (e: 'reset'): void
  }
  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()
  const collegeList = ref<Api.Common.OptionItem[]>([])
  const majorList = ref<Api.Common.OptionItem[]>([])

  // 表单数据双向绑定
  const searchBarRef = ref()
  const formData = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
  })

  // 校验规则
  const rules = {
    // userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
  }

  onMounted(async () => {
    collegeList.value = await fetchGetCollegeList()
    majorList.value = await fetchGetMajorList({})
  })

  // 表单配置
  const formItems = computed(() => [
    {
      label: '学院',
      key: 'collegeId',
      type: 'select',
      clearable: true,
      props: {
        placeholder: '请选择学院',
        options: collegeList.value,
        onChange: async (val: any) => {
          majorList.value = await fetchGetMajorList({ collegeId: val })
          formData.value.majorId = majorList.value[0]?.value
        }
      }
    },
    {
      label: '专业',
      key: 'majorId',
      type: 'select',
      clearable: true,
      props: {
        placeholder: '请选择专业',
        options: majorList.value
      }
    },
    {
      label: '班级',
      key: 'className',
      type: 'input',
      clearable: true,
      placeholder: '请输入班级名称'
    }
  ])

  // 事件
  function handleReset() {
    console.log('重置表单')
    emit('reset')
  }

  async function handleSearch() {
    await searchBarRef.value.validate()
    emit('search', formData.value)
  }
</script>
