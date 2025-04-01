<script setup>
import { ref, computed } from 'vue';
import DivInput from '@src/components/config-form/custom-form-item/switch-node-form-item/div-input.vue';

const props = defineProps({
  /**
   * @type {Object}
   * @property {string} field 字段名
   * @property {string} value 字段值
   * @property {string} operator 操作符
   */
  form: {
    type: Object,
    default: () => ({}),
  },
  index: {
    type: Number,
    default: 0,
  },
  showDeleteBtn: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(['delete']);

const isHover = ref(false);
const dropdownMenus = ref([
  {
    label: '等于',
    value: '==',
  },
  {
    label: '不等于',
    value: '!=',
  },
  {
    label: '大于',
    value: '>',
  },
  {
    label: '大于等于',
    value: '>=',
  },
  {
    label: '小于',
    value: '<',
  },
  {
    label: '小于等于',
    value: '<=',
  },
  {
    label: '是',
    value: 'equal',
  },
  {
    label: '不是',
    value: 'notEqual',
  },
  {
    label: '包含',
    value: 'contains',
  },
  {
    label: '不包含',
    value: 'notContains',
  },
  {
    label: '开始是',
    value: 'startsWith',
  },
  {
    label: '结束是',
    value: 'endsWith',
  },
  {
    label: '为空',
    value: 'null',
  },
  {
    label: '不为空',
    value: 'notNull',
  },
]);
const showValueInput = computed(() => {
  return ['null', 'notNull'].includes(props.form.operator) ? false : true;
});
const operatorName = computed(() => {
  return dropdownMenus.value.find((item) => item.value === props.form.operator)
    ?.label;
});

function removeMouseenterHandler() {
  isHover.value = true;
}

function removeMouseleaveHandler() {
  isHover.value = false;
}

function dropdownCommandHandler(command) {
  props.form.operator = command;
}

function deleteHandler() {
  emit('delete', props.index);
}
</script>

<template>
  <div class="mb-1 flex last-of-type:mb-0">
    <div
      class="flex-grow rounded-lg bg-[#c8ceda40]"
      :class="isHover ? 'bg-[#fef3f2]' : ''"
    >
      <div class="flex items-center p-1">
        <div class="max-h-[100px] flex-grow overflow-y-auto px-1 py-1">
          <div-input v-model="form.field"></div-input>
        </div>
        <div class="mx-1 h-3 w-[1px] bg-[#10182814]"></div>
        <div class="flex items-center" data-state="closed">
          <el-dropdown trigger="click" @command="dropdownCommandHandler">
            <el-button
              style="--el-fill-color-light: #e9ebf1"
              size="small"
              :text="true"
            >
              <span class="mr-1">{{ operatorName }}</span>
              <el-icon>
                <el-icon-arrow-down-bold></el-icon-arrow-down-bold>
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="item in dropdownMenus"
                  :key="item.value"
                  :command="item.value"
                >
                  {{ item.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div
        v-if="showValueInput"
        class="max-h-[100px] overflow-y-auto border-t border-t-[#1018280a] px-2 py-1"
      >
        <div-input v-model="form.value"></div-input>
      </div>
    </div>
    <div
      v-if="props.showDeleteBtn"
      class="ml-1 mt-1 flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#676f83] hover:bg-[#fef3f2] hover:text-[#d92d20]"
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
    </div>
    <div
      v-if="!props.showDeleteBtn"
      class="invisible ml-1 mt-1 flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#676f83] hover:bg-[#fef3f2] hover:text-[#d92d20]"
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
    </div>
  </div>
</template>
