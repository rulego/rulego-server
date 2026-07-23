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
  name: [
    {
      required: true,
      message: 'Application names cannot be empty',
      trigger: 'blur',
    },
  ],
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
    close();
  } catch (error) {
    console.error(error);
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
    title="Create Application"
    width="500px"
    :close-on-click-modal="false"
  >
    <el-form ref="formRef" :model="formState" :rules="rules">
      <el-form-item prop="name">
        <el-input v-model="formState.name" placeholder="Application Name" />
      </el-form-item>
      <el-form-item prop="description">
        <el-input
          type="textarea"
          v-model="formState.description"
          :autosize="{ minRows: 4, maxRows: 4 }"
          resize="none"
          placeholder="Application Description"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">Close</el-button>
        <el-button type="primary" @click="createHandler">Established</el-button>
      </div>
    </template>
  </el-dialog>
</template>
