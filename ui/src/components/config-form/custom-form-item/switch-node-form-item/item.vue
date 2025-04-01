<script lang="js" setup>
import { ref } from 'vue';
import { nanoid } from 'nanoid';
import AndItem from '@src/components/config-form/custom-form-item/switch-node-form-item/and-item.vue';

const props = defineProps({
  showDeleteBtn: {
    type: Boolean,
    default: true,
  },
  showDelBtn: {
    type: Boolean,
    default: true,
  },
  data: {
    type: Object,
    default: () => {},
  },
  index: {
    type: Number,
    default: 0,
  },
});
const emit = defineEmits(['delete']);

const isHover = ref(false);

function removeMouseenterHandler() {
  isHover.value = true;
}

function removeMouseleaveHandler() {
  isHover.value = false;
}

function deleteAndItemHandler(index) {
  props.data.caseList.splice(index, 1);
}

function addAndItemHandler() {
  props.data.caseList.push({
    id: nanoid(),
    value: [
      {
        id: nanoid(),
        field: '',
        value: '',
        operator: '==',
      },
    ],
  });
}

function deleteHandler() {
  emit('delete', props.index);
}
</script>

<template>
  <div>
    <div
      class="group relative min-h-[40px] rounded-[10px] px-3 py-1"
      :class="isHover ? 'bg-[#fef3f2]' : 'bg-white'"
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
        <div>{{ data.name }}</div>
        <div class="text-[10px] font-medium text-[#676f83]">
          {{ data.label }}
        </div>
      </div>
      <and-item
        v-for="(item, index) in props.data.caseList"
        :key="item.id"
        :parent-delete-hover="isHover"
        :show-or-icon="index < props.data.caseList.length - 1"
        :data="item.value"
        :index="index"
        @delete="deleteAndItemHandler"
      ></and-item>
      <div class="flex items-center justify-between pl-[60px] pr-[30px] pt-2">
        <el-button size="small" class="w-full" @click="addAndItemHandler">
          <span>添加 OR 条件</span>
        </el-button>
      </div>
      <div
        v-if="props.showDelBtn"
        class="flex items-center justify-between pl-[60px] pr-[30px] pt-2"
      >
        <el-button
          size="small"
          class="w-full"
          @mouseenter="removeMouseenterHandler"
          @mouseleave="removeMouseleaveHandler"
          @click="deleteHandler"
        >
          <span>删除 CASE</span>
        </el-button>
      </div>
    </div>
    <div class="mx-3 my-2 h-[1px] bg-[#1018280a]"></div>
  </div>
</template>
