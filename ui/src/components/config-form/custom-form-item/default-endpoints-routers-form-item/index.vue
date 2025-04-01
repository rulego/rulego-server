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
const dialogTitle = ref('新增路由'); // 新增路由 | 编辑路由
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
    { required: true, message: '路由不能为空', trigger: 'blur' },
    // 不能重复
    {
      validator: (_, value, callback) => {
        if (isEdit()) {
          callback();
        } else if (dataList.value.some((item) => item.path === value)) {
          callback(new Error('路由重复'));
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
  return dialogTitle.value === '编辑路由';
}

function addRouteHandler() {
  dialogTitle.value = '新增路由';
  openDialog();
}

function editRouteHandler(row) {
  dialogTitle.value = '编辑路由';
  formState.value = { ...row };
  openDialog();
}

function deleteHandler(item) {
  ElMessageBox({
    title: '提示',
    message: `确定要删除[${item.path}]吗?`,
    type: 'warning',
    showCancelButton: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
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
            <div class="text-gray-400">
              {{ props.nodeView?.router?.from?.path?.label || '订阅主题' }}:
            </div>
            <div class="flex-none">
              <el-button
                type="primary"
                :link="true"
                @click="editRouteHandler(item)"
                >编辑</el-button
              >
              <el-button type="danger" :link="true" @click="deleteHandler(item)"
                >删除</el-button
              >
            </div>
          </div>
          <div>{{ item.path }}</div>
        </div>
        <div v-if="item.fromProcessors.length">
          <div class="text-gray-400">前置数据处理器：</div>
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
          <div class="text-gray-400">后置数据处理器：</div>
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
        <el-form-item
          :label="props.nodeView?.router?.from?.path?.label || '订阅主题'"
          prop="path"
        >
          <el-input
            v-model="formState.path"
            :placeholder="
              props.nodeView?.router?.from?.path?.label || '订阅主题'
            "
            :disabled="isEdit()"
          ></el-input>
          <el-text size="small">{{
            props.nodeView?.router?.from?.path?.desc || ''
          }}</el-text>
        </el-form-item>
        <el-form-item
          label="前置数据处理器"
          prop="fromProcessors"
          v-if="!props.nodeView?.router?.from?.processors"
        >
          <el-select
            v-model="formState.fromProcessors"
            :multiple="true"
            placeholder="前置数据处理器"
          >
            <el-option
              v-for="item in fromProcessorsOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-text size="small">选择内置的前置数据转换器或者处理器</el-text>
        </el-form-item>
        <el-form-item
          label="后置数据处理器"
          prop="toProcessors"
          v-if="!props.nodeView?.router?.to?.processors"
        >
          <el-select
            v-model="formState.toProcessors"
            :multiple="true"
            placeholder="后置数据处理器"
          >
            <el-option
              v-for="item in toProcessorsOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-text size="small">选择内置的后置数据转换器或者处理器</el-text>
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
