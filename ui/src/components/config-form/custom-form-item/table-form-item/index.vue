<script lang="js" setup>
import { ref, watch, nextTick, computed } from 'vue';
import { useFormItem } from 'element-plus';
import ConfigForm from '@src/components/config-form/config-form.vue';
import { generateFormFields } from '@src/pages/workflow/app-design/utils';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  options: {
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
const isEdit = ref(false);
const formRef = ref();
const tableData = ref([]);
const tableColumns = ref([]);
const dialogVisible = ref(false);
const formState = ref({});
const fields = ref(generateFormFields(props.options));
const editIndex = ref(-1);
const dialogVisibleTitle = computed(() => {
  return isEdit.value ? '编辑' : '新增';
});

function generateFormState() {
  const form = {};
  props.options.forEach((item) => {
    let value = '';
    form[item.name] = value;
  });
  return form;
}

function generateTableData() {
  const arr = [];
  (props.modelValue || []).forEach((item) => {
    arr.push({
      ...generateFormState(),
      ...item,
    });
  });
  tableData.value = arr;
}

function generateTableColumns() {
  const minWidth = 200;
  tableColumns.value = props.options.map((item) => {
    const width = item.label.length * 20;
    return {
      label: item.label,
      prop: item.name,
      width: width < minWidth ? minWidth : width,
    };
  });
}

function openDialog() {
  dialogVisible.value = true;
  nextTick(() => {
    formState.value = generateFormState();
    formRef.value?.clearValidate();
  });
}

function closeDialog() {
  dialogVisible.value = false;
}

function addHandler() {
  isEdit.value = false;
  openDialog();
}

async function addSubmitHandler() {
  try {
    await formRef.value.validate();
    if (isEdit.value) {
      tableData.value[editIndex.value] = {
        ...tableData.value[editIndex.value],
        ...formState.value,
      };
    } else {
      tableData.value.push({
        ...formState.value,
      });
    }
    emit('update:modelValue', tableData.value);
    closeDialog();
  } catch (error) {
    console.error(error);
  }
}

function editHandler(row, index) {
  isEdit.value = true;
  editIndex.value = index;
  openDialog();
  nextTick(() => {
    formState.value = { ...row };
  });
}

function deleteHandler(index) {
  tableData.value.splice(index, 1);
  emit('update:modelValue', tableData.value);
}

watch(
  () => props.modelValue,
  () => {
    generateTableData();
    generateTableColumns();
    formItem?.validate?.('change');
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <div class="relative w-full">
    <div>
      <el-table :data="tableData" :border="true" size="small" v-bind="$attrs">
        <el-table-column
          v-for="item in tableColumns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :resizable="false"
        />
        <el-table-column
          label="操作"
          :resizable="false"
          :fixed="'right'"
          width="100"
        >
          <template #default="scope">
            <el-button
              :link="true"
              size="small"
              type="primary"
              @click="editHandler(scope.row, scope.$index)"
              >编辑</el-button
            >
            <el-button
              :link="true"
              size="small"
              type="primary"
              @click="deleteHandler(scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-button
          class="w-full"
          type="primary"
          size="small"
          @click="addHandler"
          >添加</el-button
        >
      </div>
    </div>
    <el-dialog
      v-model="dialogVisible"
      :title="dialogVisibleTitle"
      width="500"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <config-form
        ref="formRef"
        :model="formState"
        :fields="fields"
      ></config-form>
      <template #footer>
        <div>
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="addSubmitHandler">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
