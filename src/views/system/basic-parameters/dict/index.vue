<!-- 角色管理页面 -->
<template>
  <div class="art-full-height">
    <ElCard class="art-table-card" shadow="never" :style="{ 'margin-top': '12px' }">
      <ul class="art-table-list">
        <li v-for="item in dictTypes" :key="item">
          {{ item }}
        </li>
      </ul>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { fetchGetDictTypes } from '@/api/system/dict'

  defineOptions({ name: 'Dict' })

  const dictTypes = ref<string[]>([])

  onMounted(() => {
    fetchGetDictTypes().then((res) => {
      dictTypes.value = res || []
    })
  })
</script>
