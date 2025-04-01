<script lang="js" setup>
import { nextTick, ref, watch } from 'vue';
import { useFormItem } from 'element-plus';

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
const dataList = ref([]);

function generateDataList() {
  const value = props.modelValue || [];
  dataList.value = [...value].map((item) => {
    return {
      value: item,
    };
  });
}

function removeHandler(index) {
  dataList.value.splice(index, 1);
}

function addHandler() {
  dataList.value.push({
    value: '',
  });
}

generateDataList();
watch(
  () => dataList.value,
  () => {
    let newValue = dataList.value
      .filter((item) => item.value)
      .map((item) => {
        return item.value;
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
      <div
        class="h-min-7 group flex border-t border-gray-200"
        v-for="(item, index) in dataList"
        :key="index"
      >
        <div class="w-full">
          <div class="flex items-center px-3">
            <div class="flex-grow overflow-auto pr-3">
              <input class="w-full" v-model="item.value" placeholder="请输入" />
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
      <div
        class="h-min-7 w-full border-t border-gray-200 text-center text-gray-400 first:border-t-0"
        v-if="dataList.length === 0"
      >
        无
      </div>
      <div class="h-min-7 group flex border-t border-gray-200">
        <div
          class="w-full overflow-hidden bg-[var(--el-color-primary)] text-center text-white hover:cursor-pointer hover:bg-[var(--el-color-primary-light-3)]"
          @click="addHandler"
        >
          添加
        </div>
      </div>
      <div v-if="props.desc">
        <el-text size="small" type="info">
          {{ props.desc }}
        </el-text>
      </div>
    </div>
  </div>
</template>
