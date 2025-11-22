<template>
  <ElDialog
    v-model="dialogVisible"
    :title="dialogType === 'add' ? '添加用户' : '编辑用户'"
    width="60%"
    align-center
  >
    <ArtForm
      ref="formRef"
      v-model="formData"
      :items="formItems"
      :rules="formRules"
      :span="12"
      :defaultExpanded="true"
      @submit="handleSubmit"
    >
    </ArtForm>
  </ElDialog>
</template>

<script setup lang="ts">
  // 移除mock数据导入，改为导入API
  import { fetchRoleCascaderOptionsList } from '@/api/system-manage'
  import type { FormInstance } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import { ref, computed, reactive, watch } from 'vue'

  interface Props {
    visible: boolean
    type: string
    userData?: Partial<Api.SystemManage.UserListItem>
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'submit'): void
  }
  const roleOptions = ref<Api.Common.CascaderOptionsItem[]>([])
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
  const formData = reactive({
    username: '',
    phone: '',
    gender: '1',
    role: []
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

  /**
   * 性别选项
   */
  interface OptionItem {
    label: string
    value: string
    disabled?: boolean
  }
  const GENDER_OPTIONS: OptionItem[] = [
    { label: '男', value: '1' },
    { label: '女', value: '2' }
  ]

  // 基础表单项配置
  const baseFormItems = {
    account: createFormItem({
      label: '账号',
      key: 'account',
      type: 'input',
      placeholder: '请输入账号',
      clearable: true
    }),
    password: createFormItem({
      label: '密码',
      key: 'password',
      type: 'input',
      placeholder: '请输入密码',
      clearable: true
    }),
    username: createFormItem({
      label: '用户名',
      key: 'username',
      type: 'input',
      placeholder: '请输入用户名',
      clearable: true
    }),
    phone: createFormItem({
      label: '手机号',
      key: 'phone',
      type: 'input',
      props: { placeholder: '请输入手机号', maxlength: '11' }
    }),
    email: createFormItem({
      label: '邮箱',
      key: 'email',
      type: 'input',
      props: { placeholder: '请输入邮箱', maxlength: '50' }
    }),
    gender: createFormItem({
      label: '性别',
      key: 'gender',
      type: 'radiogroup',
      props: {
        options: GENDER_OPTIONS
      }
    })
  }

  const formItems = computed(() => [
    baseFormItems.account,
    baseFormItems.password,
    baseFormItems.username,
    baseFormItems.phone,
    baseFormItems.email,
    baseFormItems.gender,
    // 级联选择
    {
      label: '角色',
      key: 'roles',
      type: 'cascader',
      span: 24,
      props: {
        placeholder: '请选择角色',
        clearable: true,
        style: { width: '100%' },
        collapseTags: true,
        maxCollapseTags: 4,
        props: { multiple: true },
        options: roleOptions.value
      }
    }
  ])

  // 表单验证规则
  const formRules = {
    account: [
      { required: true, message: '请输入账号', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    phone: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
    ],
    gender: [{ required: true, message: '请选择性别', trigger: 'blur' }],
    roles: [{ required: true, message: '请选择角色', trigger: 'blur' }]
  }

  /**
   * 初始化表单数据
   * 根据对话框类型（新增/编辑）填充表单
   */
  const initFormData = () => {
    const isEdit = props.type === 'edit' && props.userData
    const row = props.userData

    Object.assign(formData, {
      account: isEdit && row ? row.account || '' : '',
      password: isEdit && row ? row.password || '' : '',
      username: isEdit && row ? row.username || '' : '',
      phone: isEdit && row ? row.phone || '' : '',
      email: isEdit && row ? row.email || '' : '',
      gender: isEdit && row ? row.gender || '1' : '1',
      role: isEdit && row ? (Array.isArray(row.roles) ? row.roles : []) : []
    })
  }

  const loadRoleOptions = async () => {
    const data = await fetchRoleCascaderOptionsList()
    roleOptions.value = data.map((item) => ({
      label: item.label || '',
      value: item.value || '',
      children: item.children || []
    }))
  }

  /**
   * 监听对话框状态变化
   * 当对话框打开时初始化表单数据并清除验证状态
   */
  watch(
    () => [props.visible, props.type, props.userData],
    ([visible]) => {
      if (visible) {
        // 每次对话框打开时重新获取角色列表
        loadRoleOptions()
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

    await formRef.value.validate((valid) => {
      if (valid) {
        ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功')
        dialogVisible.value = false
        emit('submit')
      }
    })
  }
</script>
