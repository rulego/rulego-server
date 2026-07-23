<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  /**
   * @type {Object}
   * @property {string} field name
   * @property {string} value field
   * @property {string} operator
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
    label: 'Equals',
    value: '==',
  },
  {
    label: 'Does Not Equal',
    value: '!=',
  },
  {
    label: 'Greater Than',
    value: '>',
  },
  {
    label: 'Greater Than or Equal To',
    value: '>=',
  },
  {
    label: 'Less Than',
    value: '<',
  },
  {
    label: 'Less Than or Equal To',
    value: '<=',
  },
  {
    label: 'Is',
    value: 'equal',
  },
  {
    label: 'Is Not',
    value: 'notEqual',
  },
  {
    label: 'Contains',
    value: 'contains',
  },
  {
    label: 'Does Not Contain',
    value: 'notContains',
  },
  {
    label: 'Starts With',
    value: 'startsWith',
  },
  {
    label: 'Ends With',
    value: 'endsWith',
  },
  {
    label: 'Is Empty',
    value: 'null',
  },
  {
    label: 'Is Not Empty',
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
