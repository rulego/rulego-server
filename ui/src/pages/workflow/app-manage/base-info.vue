<script lang="js" setup>
import { ref } from 'vue';

const props = defineProps({
  formState: {
    type: Object,
    default: () => ({
      id: '',
      name: '',
      description: '',
      root: false,
      debugMode: true,
    }),
  },
});

const emit = defineEmits(['save']);

const formRef = ref();
const rules = ref({
  name: [
    {
      required: true,
      message: 'Application names cannot be empty',
      trigger: 'blur',
    },
  ],
});

async function saveHandler() {
  try {
    formRef.value.validate();
    emit('save');
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <div class="px-4">
    <el-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      label-position="top"
    >
      <el-form-item label="ID" prop="id">{{ formState.id }}</el-form-item>
      <el-form-item label="Application Name" prop="name">
        <el-input v-model="formState.name" placeholder="Application Name" />
      </el-form-item>
      <el-form-item label="Debug Mode" prop="debugMode">
        <el-switch
          class="ml-2"
          v-model="formState.debugMode"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
        />
        <el-text class="mx-2" size="small">
          When enabled, it overrides the node's debug mode configuration, and
          all nodes print debug logs
        </el-text>
      </el-form-item>
      <el-form-item label="Description" prop="description">
        <el-input
          type="textarea"
          v-model="formState.description"
          :autosize="{ minRows: 4, maxRows: 4 }"
          resize="none"
          placeholder="Application Description"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="flex w-full justify-center">
      <el-button type="primary" @click="saveHandler">Save</el-button>
    </div>
  </div>
</template>
