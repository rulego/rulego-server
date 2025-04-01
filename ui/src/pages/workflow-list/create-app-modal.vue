<script lang="js" setup>
import { ref } from 'vue';
import { nanoid } from 'nanoid';
import * as Api from '@src/api';

const emit = defineEmits(['success']);

const formRef = ref();
const dialogVisible = ref(false);
const formState = ref({
  name: '',
  description: '',
});
const rules = ref({
  name: [{ required: true, message: '应用名称不能为空', trigger: 'blur' }],
});

function open() {
  dialogVisible.value = true;
}

function close() {
  formRef.value.resetFields();
  dialogVisible.value = false;
}

async function createHandler() {
  try {
    await formRef.value.validate();
    const params = {
      id: nanoid(12),
      name: formState.value.name,
      root: true,
      additionalInfo: {
        description: formState.value.description,
      },
    };
    await Api.setRulesBase(params.id, params);
    emit('success', params.id);
  } finally {
    close();
  }
}

defineExpose({
  open,
  close,
});
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="创建应用"
    width="500px"
    :close-on-click-modal="false"
  >
    <el-form ref="formRef" :model="formState" :rules="rules">
      <el-form-item prop="name">
        <el-input v-model="formState.name" placeholder="应用名称" />
      </el-form-item>
      <el-form-item prop="description">
        <el-input
          type="textarea"
          v-model="formState.description"
          :autosize="{ minRows: 4, maxRows: 4 }"
          resize="none"
          placeholder="应用描述"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">关闭</el-button>
        <el-button type="primary" @click="createHandler">创建</el-button>
      </div>
    </template>
  </el-dialog>
</template>
