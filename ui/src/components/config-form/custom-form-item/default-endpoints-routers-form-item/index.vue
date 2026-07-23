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
  nodeView: {
    type: Object,
    default: () => {},
  },
});

const emit = defineEmits(['update:modelValue']);

const { formItem } = useFormItem();
const formRef = ref();
const dialogVisible = ref(false);
const dialogTitle = ref('Add Route'); // Add Route | Edit Route
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
  fromProcessors: [],
  toProcessors: [],
});
const rules = {
  path: [
    { required: true, message: 'Route is required', trigger: 'blur' },
    // It cannot be repeated
    {
      validator: (_, value, callback) => {
        if (isEdit()) {
          callback();
        } else if (dataList.value.some((item) => item.path === value)) {
          callback(new Error('Route already exists'));
        } else {
          callback();
        }
      },
      trigger: 'change',
    },
  ],
};
const fromProcessorsOptions = [
  { value: 'headersToMetadata', label: 'headersToMetadata' },
  { value: 'setJsonDataType', label: 'setJsonDataType' },
  { value: 'toHex', label: 'toHex' },
];
const toProcessorsOptions = [
  { value: 'responseToBody', label: 'responseToBody' },
  { value: 'metadataToHeaders', label: 'metadataToHeaders' },
];

function isEdit() {
  return dialogTitle.value === 'Edit Route';
}

function addRouteHandler() {
  dialogTitle.value = 'Add Route';
  openDialog();
}

function editRouteHandler(row) {
  dialogTitle.value = 'Edit Route';
  formState.value = { ...row };
  openDialog();
}

function deleteHandler(item) {
  ElMessageBox({
    title: 'Notice',
    message: `Are you sure you want to delete [${item.path}]?`,
    type: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
  })
    .then(() => {
      const index = dataList.value.findIndex((i) => i.id === item.id);
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
    let data = {
      ...formState.value,
    };
    if (isUndefined(data.id)) {
      data.id = nanoid();
      dataList.value.push(data);
    } else {
      const dataItem = dataList.value.find((item) => item.id === data.id);
      Object.assign(dataItem, data);
    }
    closeDialog();
    nextTick(() => {
      formItem?.validate?.('change');
    });
  } catch (error) {
    ElMessage.error('Form validation failed');
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
    <div class="font-semibold">Routing setup</div>
    <div>
      <div
        class="mb-2 rounded border border-solid border-gray-200 p-2 text-center text-gray-400 last:mb-0"
        v-if="dataList.length === 0"
      >
        There is no path
      </div>
      <div
        class="mb-2 rounded border border-solid border-gray-200 p-2 last:mb-0"
        v-for="(item, index) in dataList"
        :key="item.id"
      >
        <div>
          <div class="flex items-center justify-between">
            <div class="text-gray-400">
              {{
                props.nodeView?.router?.from?.path?.label ||
                'Subscription Topic'
              }}:
            </div>
            <div class="flex-none">
              <el-button
                type="primary"
                :link="true"
                @click="editRouteHandler(item)"
                >Edit</el-button
              >
              <el-button type="danger" :link="true" @click="deleteHandler(item)"
                >Delete</el-button
              >
            </div>
          </div>
          <div>{{ item.path }}</div>
        </div>
        <div v-if="item.fromProcessors.length">
          <div class="text-gray-400">Front Data Processor:</div>
          <div class="flex flex-wrap">
            <div
              class="mr-2 last:mr-0"
              v-for="p in item.fromProcessors"
              :key="p"
            >
              <el-tag>{{ p }}</el-tag>
            </div>
          </div>
        </div>
        <div v-if="item.toProcessors.length">
          <div class="text-gray-400">Rear Data Processor:</div>
          <div class="flex flex-wrap">
            <div class="mr-2 last:mr-0" v-for="p in item.toProcessors" :key="p">
              <el-tag>{{ p }}</el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pt-2">
      <el-button type="primary" class="w-full" @click="addRouteHandler"
        >Add Route</el-button
      >
    </div>
    <el-dialog
      v-model="dialogVisible"
      title="Add Route"
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
        <el-form-item
          :label="
            props.nodeView?.router?.from?.path?.label || 'Subscription Topic'
          "
          prop="path"
        >
          <el-input
            v-model="formState.path"
            :placeholder="
              props.nodeView?.router?.from?.path?.label || 'Subscription Topic'
            "
            :disabled="isEdit()"
          ></el-input>
          <el-text size="small">{{
            props.nodeView?.router?.from?.path?.desc || ''
          }}</el-text>
        </el-form-item>
        <el-form-item
          label="Preprocessor"
          prop="fromProcessors"
          v-if="!props.nodeView?.router?.from?.processors"
        >
          <el-select
            v-model="formState.fromProcessors"
            :multiple="true"
            placeholder="Preprocessor"
          >
            <el-option
              v-for="item in fromProcessorsOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-text size="small"
            >Choose the built-in pre-server data converter or processor</el-text
          >
        </el-form-item>
        <el-form-item
          label="Postprocessor"
          prop="toProcessors"
          v-if="!props.nodeView?.router?.to?.processors"
        >
          <el-select
            v-model="formState.toProcessors"
            :multiple="true"
            placeholder="Postprocessor"
          >
            <el-option
              v-for="item in toProcessorsOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-text size="small"
            >Choose the built-in rear data converter or processor</el-text
          >
        </el-form-item>
      </el-form>
      <template #footer>
        <div>
          <el-button @click="closeDialog">Cancel</el-button>
          <el-button type="primary" @click="addRouteSubmitHandler"
            >Confirm</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>
