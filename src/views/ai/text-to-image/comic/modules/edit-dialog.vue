<template>
  <ElDialog
    v-model="localVisible"
    :title="dialogTitle"
    width="80%"
    destroy-on-close
    @close="handleClose"
  >
    <ElForm ref="formRef" :model="formData" :rules="rules" label-width="100px" class="art-form">
      <!-- 基本信息 -->
      <ElCard class="mb-4" shadow="never" header="基本信息">
        <ElRow :gutter="20">
          <ElCol :span="8">
            <ElFormItem label="漫画类型" prop="comicType">
              <ElInput v-model="formData.comicType" placeholder="请输入漫画类型" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="语言" prop="language">
              <ElSelect v-model="formData.language" placeholder="请选择语言">
                <ElOption label="中文" value="chinese" />
                <ElOption label="英文" value="english" />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="风格" prop="style">
              <ElInput v-model="formData.style" placeholder="请输入漫画风格" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="配色方案" prop="colorScheme">
              <ElInput v-model="formData.colorScheme" placeholder="请输入配色方案" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="背景风格" prop="backgroundStyle">
              <ElInput v-model="formData.backgroundStyle" placeholder="请输入背景风格" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="合集" prop="collection">
              <ElSelect v-model="formData.collection" placeholder="请选择合集">
                <!-- 这里可以根据实际需求动态加载合集列表 -->
                <ElOption label="科普系列" value="science" />
                <ElOption label="童话系列" value="fairy_tale" />
                <ElOption label="历史系列" value="history" />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="24">
            <ElFormItem label="漫画名称" prop="comicName">
              <ElInput v-model="formData.comicName" placeholder="请输入漫画名称" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="24">
            <ElFormItem label="备注" prop="remark">
              <ElInput
                v-model="formData.remark"
                type="textarea"
                :rows="3"
                placeholder="请输入备注信息"
              />
            </ElFormItem>
          </ElCol>
        </ElRow>
      </ElCard>

      <!-- 角色信息 -->
      <ElCard class="mb-4" shadow="never" header="角色信息">
        <ElTable v-model:data="formData.characters" border style="width: 100%">
          <ElTableColumn prop="name" label="角色名称" width="150">
            <template #default="scope">
              <ElInput v-model="scope.row.name" placeholder="请输入角色名称" />
            </template>
          </ElTableColumn>
          <ElTableColumn prop="appearance" label="外观描述" width="300">
            <template #default="scope">
              <ElInput
                v-model="scope.row.appearance"
                type="textarea"
                :rows="2"
                placeholder="请输入外观描述"
              />
            </template>
          </ElTableColumn>
          <ElTableColumn prop="personality" label="性格特点" width="300">
            <template #default="scope">
              <ElInput
                v-model="scope.row.personality"
                type="textarea"
                :rows="2"
                placeholder="请输入性格特点"
              />
            </template>
          </ElTableColumn>
          <ElTableColumn label="操作" width="100" fixed="right">
            <template #default="scope">
              <ElButton type="danger" size="small" @click="removeCharacter(scope.$index)">
                删除
              </ElButton>
            </template>
          </ElTableColumn>
        </ElTable>
        <ElButton type="primary" plain @click="addCharacter" class="mt-2">
          <ArtSvgIcon icon="ri:add-line" class="mr-1" />添加角色
        </ElButton>
      </ElCard>

      <!-- 漫画面板 -->
      <ElCard shadow="never" header="漫画面板">
        <div v-for="(panel, index) in formData.panels" :key="index" class="mb-4 p-4 border rounded">
          <h4 class="mb-3">面板 {{ index + 1 }}</h4>
          <ElRow :gutter="20">
            <ElCol :span="24">
              <ElFormItem :label="'描述'">
                <ElInput
                  v-model="panel.description"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入面板描述"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="24">
              <ElFormItem :label="'场景'">
                <ElInput
                  v-model="panel.scene"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入场景描述"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="24">
              <ElFormItem :label="'动作'">
                <ElInput
                  v-model="panel.action"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入动作描述，用逗号分隔"
                  @change="handleListInputChange()"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="24">
              <ElFormItem :label="'表情'">
                <ElInput
                  v-model="panel.expression"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入表情描述，用逗号分隔"
                  @change="handleListInputChange()"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="24">
              <ElFormItem :label="'细节'">
                <ElInput
                  v-model="panel.details"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入细节描述"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="24">
              <ElFormItem :label="'对话文本'">
                <ElInput
                  v-model="panel.text"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入对话文本"
                />
              </ElFormItem>
            </ElCol>
          </ElRow>
          <ElButton type="danger" size="small" @click="removePanel(index)" class="mt-2">
            删除面板
          </ElButton>
        </div>
        <ElButton type="primary" plain @click="addPanel" class="mt-2">
          <ArtSvgIcon icon="ri:add-line" class="mr-1" />添加面板
        </ElButton>
      </ElCard>
    </ElForm>

    <template #footer>
      <ElSpace>
        <ElButton @click="handleClose">取消</ElButton>
        <ElButton type="primary" @click="handleSubmit"> 提交 </ElButton>
      </ElSpace>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import { ref, reactive, watch, computed, nextTick } from 'vue'
  import { ElMessage } from 'element-plus'
  import { DialogType } from '@/types'

  interface Character {
    name: string
    appearance: string
    personality: string
  }

  interface Panel {
    description: string
    scene: string
    action: string
    expression: string
    details: string
    text: string
  }

  // 用于提交的数据接口，action 和 expression 为数组类型
  interface SubmitPanel {
    description: string
    scene: string
    action: string[]
    expression: string[]
    details: string
    text: string
  }

  interface SubmitData {
    comicType: string
    language: string
    style: string
    colorScheme: string
    characters: Character[]
    backgroundStyle: string
    collection: string
    comicName: string
    remark: string
    panels: SubmitPanel[]
  }

  interface FormData {
    comicType: string
    language: string
    style: string
    colorScheme: string
    characters: Character[]
    backgroundStyle: string
    collection: string
    comicName: string
    remark: string
    panels: Panel[]
  }

  const props = defineProps<{
    visible: boolean
    type: DialogType
    editData?: Partial<FormData>
  }>()

  const emit = defineEmits<{
    'update:visible': [value: boolean]
    submit: [data: SubmitData]
  }>()

  const formRef = ref()
  const localVisible = ref(false)
  const formData = reactive<FormData>({
    comicType: '',
    language: 'chinese',
    style: '',
    colorScheme: '',
    characters: [],
    backgroundStyle: '',
    collection: '',
    comicName: '',
    remark: '',
    panels: []
  })

  const rules = reactive({
    comicType: [{ required: true, message: '请输入漫画类型', trigger: 'blur' }],
    language: [{ required: true, message: '请选择语言', trigger: 'change' }],
    style: [{ required: true, message: '请输入漫画风格', trigger: 'blur' }],
    collection: [{ required: true, message: '请选择合集', trigger: 'change' }],
    colorScheme: [{ required: true, message: '请输入配色方案', trigger: 'blur' }],
    comicName: [{ required: true, message: '请输入漫画名称', trigger: 'blur' }],
    characters: [{ required: true, message: '请至少添加一个角色', trigger: 'change' }],
    panels: [{ required: true, message: '请至少添加一个面板', trigger: 'change' }]
  })

  const dialogTitle = computed(() => {
    return props.type === 'add' ? '新增漫画' : '编辑漫画'
  })

  // 监听可见性
  watch(
    () => props.visible,
    (newVal) => {
      localVisible.value = newVal
      if (newVal) {
        nextTick(() => {
          if (props.type === 'edit' && props.editData) {
            // 复制编辑数据
            Object.assign(formData, props.editData)
            // 确保数组类型正确
            if (!Array.isArray(formData.characters)) {
              formData.characters = []
            }
            if (!Array.isArray(formData.panels)) {
              formData.panels = []
            }
          } else {
            // 重置表单
            resetForm()
          }
        })
      }
    },
    { immediate: true }
  )

  // 重置表单
  const resetForm = () => {
    formData.comicType = ''
    formData.language = 'chinese'
    formData.style = ''
    formData.colorScheme = ''
    formData.characters = []
    formData.backgroundStyle = ''
    formData.collection = ''
    formData.comicName = ''
    formData.remark = ''
    formData.panels = []
  }

  // 关闭弹窗
  const handleClose = () => {
    emit('update:visible', false)
  }

  // 提交表单
  const handleSubmit = async () => {
    if (!formRef.value) return

    try {
      await formRef.value.validate()

      // 处理面板数据 - 创建新的提交数据对象，避免类型冲突
      const submitData = {
        ...formData,
        panels: formData.panels.map((panel) => ({
          ...panel,
          // 将action和expression从字符串转换为数组
          action: panel.action
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
          expression: panel.expression
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
        }))
      }

      emit('submit', submitData)
      emit('update:visible', false)
      ElMessage.success(props.type === 'add' ? '新增成功' : '编辑成功')
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  // 添加角色
  const addCharacter = () => {
    formData.characters.push({
      name: '',
      appearance: '',
      personality: ''
    })
  }

  // 删除角色
  const removeCharacter = (index: number) => {
    formData.characters.splice(index, 1)
  }

  // 添加面板
  const addPanel = () => {
    formData.panels.push({
      description: '',
      scene: '',
      action: '',
      expression: '',
      details: '',
      text: ''
    })
  }

  // 删除面板
  const removePanel = (index: number) => {
    formData.panels.splice(index, 1)
  }

  // 处理列表类型输入变化 - 移除数组转换，保持字符串类型
  const handleListInputChange = () => {
    // 输入已直接作为字符串存储，无需转换
  }
</script>

<style scoped>
  .art-form {
    max-height: 60vh;
    overflow-y: auto;
  }

  .mb-4 {
    margin-bottom: 16px;
  }

  .mt-2 {
    margin-top: 8px;
  }
</style>
