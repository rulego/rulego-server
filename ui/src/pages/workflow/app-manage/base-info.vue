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
  name: [{ required: true, message: '应用名称不能为空', trigger: 'blur' }],
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
      <el-form-item label="应用名称" prop="name">
        <el-input v-model="formState.name" placeholder="应用名称" />
      </el-form-item>
      <el-form-item label="调试模式" prop="debugMode">
        <el-switch
          class="ml-2"
          v-model="formState.debugMode"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
        />
        <el-text class="mx-2" size="small">
          开启后会覆盖节点的调试模式配置，所有节点会打印调试日志
        </el-text>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input
          type="textarea"
          v-model="formState.description"
          :autosize="{ minRows: 4, maxRows: 4 }"
          resize="none"
          placeholder="应用描述"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="flex w-full justify-center">
      <el-button type="primary" @click="saveHandler">保存</el-button>
    </div>
  </div>
</template>
