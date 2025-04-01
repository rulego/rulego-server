<script lang="js" setup>
import { ref, computed, watch, nextTick } from 'vue';
import { ElMessage, ElMessageBox, useFormItem } from 'element-plus';
import { nanoid } from 'nanoid';
import { isUndefined } from 'lodash-es';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  desc: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const { formItem } = useFormItem();
const formRef = ref();
const dialogVisible = ref(false);
const dialogTitle = ref('新增路由');
const dataList = computed({
  get: () => {
    return props.modelValue;
  },
  set: (value) => {
    emit('update:modelValue', value);
  },
});
const formState = ref({
  path: '',
});
const rules = {
  path: [
    { required: true, message: '路由不能为空', trigger: 'blur' },
    // 不能重复
    {
      validator: (_, value, callback) => {
        if (dataList.value.some((item) => item === value)) {
          callback(new Error('路由名称重复'));
        } else {
          callback();
        }
      },
      trigger: 'change',
    },
  ],
};

function addRouteHandler() {
  dialogTitle.value = '新增路由';
  openDialog();
}

function deleteHandler(item) {
  ElMessageBox({
    title: '提示',
    message: `确定要删除[${item}]吗?`,
    type: 'warning',
    showCancelButton: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })
    .then(() => {
      const index = dataList.value.findIndex((i) => i === item);
      dataList.value.splice(index, 1);
    })
    .finally(() => {
      nextTick(() => {
        formItem?.validate?.('change');
      });
    });
}

function openDialog() {
  dialogVisible.value = true;
}

function closeDialog() {
  formRef.value.resetFields();
  dialogVisible.value = false;
}

async function addRouteSubmitHandler() {
  try {
    await formRef.value.validate();
    dataList.value.push(formState.value.path);
    closeDialog();
    nextTick(() => {
      formItem?.validate?.('change');
    });
  } catch (error) {
    ElMessage.error('表单验证失败');
  }
}

watch(
  () => props.modelValue,
  () => {
    formItem?.validate?.('change');
  },
);
</script>

<template>
  <div class="relative w-full">
    <div class="font-semibold">路由设置</div>
    <div>
      <div
        class="mb-2 rounded border border-solid border-gray-200 p-2 text-center text-gray-400 last:mb-0"
        v-if="dataList.length === 0"
      >
        无路由
      </div>
      <div
        class="mb-2 rounded border border-solid border-gray-200 p-2 last:mb-0"
        v-for="(item, index) in dataList"
        :key="item.id"
      >
        <div>
          <div class="flex items-center justify-between">
            <div class="text-gray-400">路由名称：</div>
            <div class="flex-none">
              <el-button type="danger" :link="true" @click="deleteHandler(item)"
                >删除</el-button
              >
            </div>
          </div>
          <div>{{ item }}</div>
        </div>
      </div>
    </div>
    <div class="pt-2">
      <el-button type="primary" class="w-full" @click="addRouteHandler"
        >添加路由</el-button
      >
    </div>
    <el-dialog
      v-model="dialogVisible"
      title="添加路由"
      width="500"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <el-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        label-position="top"
      >
        <el-form-item label="路由名称" prop="path">
          <el-input v-model="formState.path" placeholder="路由名称"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div>
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="addRouteSubmitHandler"
            >确认</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>
