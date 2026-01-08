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
  import { fetchGetComicCollectionList } from '@/api/ai/comic'
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
  // 动态 options
  const collectionOptions = ref<Api.Common.OptionItem[]>([])
  // 获取合集列表
  onMounted(async () => {
    collectionOptions.value = await fetchGetComicCollectionList()
  })
  // 表单配置
  const formItems = computed(() => [
    {
      label: '漫画名称',
      key: 'comicName',
      type: 'input',
      placeholder: '请输入漫画名称',
      clearable: true
    },
    {
      label: '合集',
      key: 'collectionId',
      type: 'select',
      placeholder: '请选择合集',
      clearable: true,
      props: {
        options: collectionOptions.value
      }
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
    console.log('表单数据', formData.value)
  }
</script>
