<script lang="js" setup>
import { watch } from 'vue';
import { useFormItem } from 'element-plus';
import { nanoid } from 'nanoid';
import ListItem from '@src/components/config-form/custom-form-item/switch-node-form-item/item.vue';

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

function addListItemHandler() {
  props.modelValue.push({
    id: nanoid(),
    name: 'ELSE IF',
    label: `CASE ${props.modelValue.length + 1}`,
    caseList: [
      {
        id: nanoid(),
        value: [
          {
            id: nanoid(),
            field: '',
            value: '',
            operator: '==',
          },
        ],
      },
    ],
  });
}

function deleteListItemHandler(index) {
  props.modelValue.splice(index, 1);
}

watch(
  () => props.modelValue,
  () => {
    emit('update:modelValue', props.modelValue);
    formItem?.validate?.('change');
  },
);
</script>

<template>
  <div class="relative w-full">
    <list-item
      v-for="(item, index) in props.modelValue"
      :key="item.id"
      :data="item"
      :show-del-btn="index !== 0"
      :index="index"
      @delete="deleteListItemHandler"
    ></list-item>
    <div class="w-full px-4 py-2">
      <div
        class="flex cursor-pointer items-center justify-center rounded-[10px] bg-[#f2f4f7] text-center hover:bg-[#e9ebf0]"
        @click="addListItemHandler"
      >
        <el-icon>
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            class="remixicon mr-1 h-4 w-4"
          >
            <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
          </svg>
        </el-icon>
        <div>ELIF</div>
      </div>
    </div>
    <div>
      <div
        class="group relative min-h-[40px] rounded-[10px] bg-white px-3 py-1"
      >
        <!-- 拖拽图标 -->
        <!-- <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        class="remixicon handle text-text-quaternary absolute left-1 top-4 hidden h-3 w-3 cursor-pointer group-hover:block"
      >
        <path
          d="M8.5 7C9.32843 7 10 6.32843 10 5.5C10 4.67157 9.32843 4 8.5 4C7.67157 4 7 4.67157 7 5.5C7 6.32843 7.67157 7 8.5 7ZM8.5 13.5C9.32843 13.5 10 12.8284 10 12C10 11.1716 9.32843 10.5 8.5 10.5C7.67157 10.5 7 11.1716 7 12C7 12.8284 7.67157 13.5 8.5 13.5ZM10 18.5C10 19.3284 9.32843 20 8.5 20C7.67157 20 7 19.3284 7 18.5C7 17.6716 7.67157 17 8.5 17C9.32843 17 10 17.6716 10 18.5ZM15.5 7C16.3284 7 17 6.32843 17 5.5C17 4.67157 16.3284 4 15.5 4C14.6716 4 14 4.67157 14 5.5C14 6.32843 14.6716 7 15.5 7ZM17 12C17 12.8284 16.3284 13.5 15.5 13.5C14.6716 13.5 14 12.8284 14 12C14 11.1716 14.6716 10.5 15.5 10.5C16.3284 10.5 17 11.1716 17 12ZM15.5 20C16.3284 20 17 19.3284 17 18.5C17 17.6716 16.3284 17 15.5 17C14.6716 17 14 17.6716 14 18.5C14 19.3284 14.6716 20 15.5 20Z"
        ></path>
      </svg> -->
        <div
          class="absolute left-4 top-3 text-[13px] font-semibold leading-normal text-[#354052]"
        >
          <div>ELSE</div>
          <div class="font-medium text-[#676f83]">
            用于定义当 if 条件不满足时应执行的逻辑。
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
