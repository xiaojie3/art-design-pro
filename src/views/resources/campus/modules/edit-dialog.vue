<template>
  <ElDialog
    v-model="visible"
    :title="dialogType === 'add' ? '新增校区' : '编辑校区'"
    width="30%"
    align-center
    @close="handleClose"
  >
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="120px">
      <ElFormItem label="校区名称" prop="campusName">
        <ElInput v-model="form.campusName" placeholder="请输入校区名称" />
      </ElFormItem>
      <ElFormItem label="校区编码" prop="campusCode">
        <ElInput v-model="form.campusCode" placeholder="请输入校区编码" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="handleClose">取消</ElButton>
        <ElButton type="primary" @click="handleSubmit">提交</ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import type { FormInstance, FormRules } from 'element-plus'
  import { fetchAddCampus, fetchEditCampus } from '@/api/resource-manage'

  type CampusListItem = Api.ResourceManage.CampusListItem

  interface Props {
    modelValue: boolean
    dialogType: 'add' | 'edit'
    campusData?: CampusListItem
  }

  interface Emits {
    (e: 'update:modelValue', value: boolean): void
    (e: 'success'): void
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    dialogType: 'add',
    campusData: undefined
  })

  const emit = defineEmits<Emits>()

  const formRef = ref<FormInstance>()

  /**
   * 弹窗显示状态双向绑定
   */
  const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })

  /**
   * 表单验证规则
   */
  const rules = reactive<FormRules>({
    campusName: [
      { required: true, message: '请输入校区名称', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    campusCode: [
      { required: true, message: '请输入校区编码', trigger: 'blur' },
      { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
    ],
    description: [{ required: true, message: '请输入校区描述', trigger: 'blur' }]
  })

  /**
   * 表单数据
   */
  const form = reactive<CampusListItem>({
    id: '',
    campusCode: '',
    campusName: '',
    schoolId: '',
    englishName: '',
    address: '',
    principal: '',
    phone: '',
    intro: '',
    createTime: ''
  })

  /**
   * 监听弹窗打开，初始化表单数据
   */
  watch(
    () => props.modelValue,
    (newVal) => {
      if (newVal) initForm()
    }
  )

  /**
   * 监听角色数据变化，更新表单
   */
  watch(
    () => props.campusData,
    (newData) => {
      if (newData && props.modelValue) initForm()
    },
    { deep: true }
  )

  /**
   * 初始化表单数据
   * 根据弹窗类型填充表单或重置表单
   */
  const initForm = () => {
    if (props.dialogType === 'edit' && props.campusData) {
      Object.assign(form, props.campusData)
    } else {
      Object.assign(form, {
        id: '',
        campusCode: '',
        campusName: '',
        schoolId: '',
        englishName: '',
        address: '',
        principal: '',
        phone: '',
        intro: '',
        createTime: ''
      })
    }
  }

  /**
   * 关闭弹窗并重置表单
   */
  const handleClose = () => {
    visible.value = false
    formRef.value?.resetFields()
  }

  /**
   * 提交表单
   * 验证通过后调用接口保存数据
   */
  const handleSubmit = async () => {
    if (!formRef.value) return

    try {
      await formRef.value.validate()
      // TODO: 调用新增/编辑接口
      if (props.dialogType === 'add') {
        await fetchAddCampus(form)
      } else {
        await fetchEditCampus(form)
      }
      const message = props.dialogType === 'add' ? '新增成功' : '修改成功'
      ElMessage.success(message)
      emit('success')
      handleClose()
    } catch (error) {
      console.log('表单验证失败:', error)
    }
  }
</script>

<style lang="scss" scoped>
  .dialog-footer {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  }
</style>
