<script lang="js" setup>
import { ref } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['save']);

const formRef = ref();
const dialogVisible = ref(false);
const dialogTitle = ref('新增变量');
const formState = ref({
  key: '',
  value: '',
});
const rules = ref({
  key: [
    {
      required: true,
      message: '变量名称不能为空',
      trigger: ['blur', 'change'],
    },
    // 不能以数字开头
    {
      pattern: /^[^\d].*$/,
      message: '变量名称不能以数字开头',
      trigger: ['blur', 'change'],
    },
    // 只能使用字母、数字、下划线
    {
      pattern: /^[a-zA-Z0-9_]+$/,
      message: '变量名称只能使用字母、数字、下划线',
      trigger: ['blur', 'change'],
    },
    // 不能重复
    {
      validator: (_, value, callback) => {
        if (isEdit()) {
          callback();
        } else if (props.data.some((item) => item.key === value)) {
          callback(new Error('变量名称重复'));
        } else {
          callback();
        }
      },
      trigger: ['blur', 'change'],
    },
  ],
});

function isEdit() {
  return dialogTitle.value === '编辑变量';
}

function setDialogTitle(title) {
  dialogTitle.value = title;
}

function addHandler() {
  setDialogTitle('新增变量');
  open();
}

function editHandler(key, value) {
  setDialogTitle('编辑变量');
  formState.value.key = key;
  formState.value.value = value;
  open();
}

function deleteHandler(key) {
  const index = props.data.findIndex((item) => item.key === key);
  props.data.splice(index, 1);
  emit('save');
}

function close() {
  formRef.value.resetFields();
  dialogVisible.value = false;
}

function open() {
  dialogVisible.value = true;
}

async function submitHandler() {
  try {
    await formRef.value.validate();
    if (isEdit() === false) {
      props.data.push({
        key: formState.value.key,
        value: formState.value.value,
      });
    }
    if (isEdit()) {
      const item = props.data.find((item) => item.key === formState.value.key);
      item.value = formState.value.value;
    }
    emit('save');
    close();
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <div class="px-4">
    <div class="flex justify-end pb-2">
      <el-button type="primary" @click="addHandler">新增变量</el-button>
    </div>
    <el-table size="small" :data="props.data" :border="true">
      <el-table-column prop="key" label="名称" width="180" />
      <el-table-column prop="value" label="值" />
      <el-table-column prop="action" label="操作" width="90" align="center">
        <template #default="scope">
          <el-space>
            <el-button
              :link="true"
              type="primary"
              size="small"
              @click.prevent="editHandler(scope.row.key, scope.row.value)"
            >
              编辑
            </el-button>
            <el-button
              :link="true"
              type="primary"
              size="small"
              @click.prevent="deleteHandler(scope.row.key)"
            >
              删除
            </el-button>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗表单 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="300px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        label-position="top"
      >
        <el-form-item label="变量名称" prop="key">
          <el-input
            v-model="formState.key"
            :disabled="isEdit()"
            placeholder="变量名称"
          />
        </el-form-item>
        <el-form-item label="变量值" prop="value">
          <el-input v-model="formState.value" placeholder="变量值"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="close">关闭</el-button>
          <el-button type="primary" @click="submitHandler">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
