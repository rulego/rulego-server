<script setup>
import { ref } from 'vue';
import { nanoid } from 'nanoid';
import InputItem from '@src/components/config-form/custom-form-item/switch-node-form-item/input-item.vue';

const props = defineProps({
  showDeleteBtn: {
    type: Boolean,
    default: true,
  },
  showOrIcon: {
    type: Boolean,
    default: false,
  },
  parentDeleteHover: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Array,
    default: () => [],
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

function deleteInputItemHandler(index) {
  props.data.splice(index, 1);
}

function addInputItemHandler() {
  props.data.push({
    id: nanoid(),
    field: '',
    value: '',
    operator: '==',
  });
}

function deleteHandler() {
  emit('delete', props.index);
}
</script>

<template>
  <div
    class="rounded-[10px] py-2"
    :class="isHover || props.parentDeleteHover ? 'bg-[#fef3f2]' : 'bg-white'"
  >
    <div class="relative pl-[60px]">
      <div
        class="absolute bottom-0 left-0 top-0 w-[60px]"
        v-if="props.data.length > 1"
      >
        <div
          class="border-divider-deep absolute bottom-4 left-[46px] top-4 w-2.5 rounded-l-[8px] border border-r-0"
        ></div>
        <div
          class="absolute right-0 top-1/2 h-[29px] w-4 -translate-y-1/2"
          :class="
            isHover || props.parentDeleteHover ? 'bg-[#fef3f2]' : 'bg-white'
          "
        ></div>
        <div
          class="shadow-xs absolute right-1 top-1/2 flex h-[21px] -translate-y-1/2 select-none items-center rounded-md border-[0.5px] border-[#10182824] bg-white px-1 text-[10px] font-semibold text-[#296dff]"
        >
          <span>AND</span>
        </div>
      </div>
      <input-item
        v-for="(item, index) in props.data"
        :key="item.id"
        :form="item"
        :index="index"
        :show-delete-btn="props.data.length > 1"
        @delete="deleteInputItemHandler"
      ></input-item>
    </div>
    <div class="flex items-center justify-between pl-[60px] pr-[30px] pt-2">
      <el-button size="small" @click="addInputItemHandler">
        <el-icon>
          <el-icon-plus></el-icon-plus>
        </el-icon>
        <span>添加 AND 条件</span>
      </el-button>
      <el-button
        v-if="showDeleteBtn"
        size="small"
        @mouseenter="removeMouseenterHandler"
        @mouseleave="removeMouseleaveHandler"
        @click="deleteHandler"
      >
        <el-icon>
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            class="remixicon h-4 w-4"
          >
            <path
              d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"
            ></path>
          </svg>
        </el-icon>
        <span>移除</span>
      </el-button>
    </div>
    <div class="flex justify-center" v-if="props.showOrIcon">
      <div
        class="shadow-xs flex h-[21px] select-none items-center rounded-md border-[0.5px] border-[#10182824] bg-white px-1 text-[10px] font-semibold text-[#296dff]"
      >
        <span>OR</span>
      </div>
    </div>
  </div>
</template>
