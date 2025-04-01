<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  /**
   * @type {Object}
   * @property {string} field 字段名
   * @property {string} value 字段值
   * @property {string} operator 操作符
   */
  data: {
    type: Object,
    default: () => ({}),
  },
  hasAndIcon: {
    type: Boolean,
    default: false,
  },
});

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
  return ['null', 'notNull'].includes(props.data.operator) ? false : true;
});
const operatorName = computed(() => {
  return dropdownMenus.value.find((item) => item.value === props.data.operator)
    ?.label;
});
</script>

<template>
  <div class="mb-1 flex w-full last-of-type:mb-0">
    <div class="flex-grow rounded-lg bg-[#c8ceda40]">
      <div class="flex items-center justify-between p-1">
        <div
          class="flex-none overflow-auto truncate px-1 py-1 font-mono text-[12px]"
          :class="props.hasAndIcon ? 'w-[116px]' : 'w-[150px]'"
          :title="data.field"
        >
          {{ data.field }}
        </div>
        <div class="flex w-[60px] flex-none items-center">
          <div class="mx-1 h-3 w-[1px] flex-none bg-[#10182814]"></div>
          <div class="flex w-[54px] flex-none items-center justify-center">
            <span class="mr-1 text-[12px]">{{ operatorName }}</span>
          </div>
        </div>
      </div>
      <div
        v-if="showValueInput"
        class="min-h-[26px] overflow-y-auto break-all border-t border-t-[#1018280a] px-2 py-1 font-mono text-[12px]"
        :title="data.value"
      >
        {{ data.value }}
      </div>
    </div>
  </div>
</template>
