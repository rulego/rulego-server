<script lang="js" setup>
import { nextTick, ref, watch } from 'vue';
import { useFormItem } from 'element-plus';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  desc: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const { formItem } = useFormItem();
const dataList = ref([]);

function generateDataList() {
  if (!props.modelValue) {
    return;
  }
  dataList.value = Object.keys(props.modelValue).map((key) => {
    return {
      key,
      value: props.modelValue[key],
    };
  });
}

function removeHandler(index) {
  dataList.value.splice(index, 1);
}

function addHandler() {
  dataList.value.push({
    key: '',
    value: '',
  });
}

generateDataList();
watch(
  () => dataList.value,
  () => {
    let newValue = {};
    dataList.value
      .filter((item) => item.key)
      .forEach((item) => {
        newValue[item.key] = item.value;
      });
    emit('update:modelValue', newValue);
    nextTick(() => {
      formItem?.validate?.('change');
    });
  },
  { deep: true },
);
</script>

<template>
  <div class="relative w-full">
    <div class="overflow-hidden rounded-lg border border-[#10182814]">
      <div class="flex h-7 items-center uppercase leading-7 text-[#676f83]">
        <div class="h-full w-1/2 border-r border-[#10182814] pl-3">键</div>
        <div class="h-full w-1/2 border-r border-[#10182814] pl-3">值</div>
      </div>
      <div
        class="h-min-7 group flex border-t border-gray-200"
        v-for="(item, index) in dataList"
        :key="index"
      >
        <div class="w-1/2 shrink-0 border-r border-[#10182814]">
          <div class="px-3">
            <input v-model="item.key" />
          </div>
        </div>
        <div class="w-1/2">
          <div class="flex items-center px-3">
            <div class="flex-grow overflow-auto">
              <input class="w-full" v-model="item.value" />
            </div>
            <div
              class="flex flex-none items-center hover:cursor-pointer hover:text-[var(--el-color-primary)]"
              @click="removeHandler(index)"
            >
              <el-icon>
                <el-icon-delete />
              </el-icon>
            </div>
          </div>
        </div>
      </div>
      <div class="h-min-7 group flex border-t border-gray-200">
        <div
          class="w-full overflow-hidden bg-[var(--el-color-primary)] text-center text-white hover:cursor-pointer hover:bg-[var(--el-color-primary-light-3)]"
          @click="addHandler"
        >
          添加
        </div>
      </div>
    </div>
  </div>
</template>
