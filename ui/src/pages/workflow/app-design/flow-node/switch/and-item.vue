<script setup>
import CaseItem from '@src/pages/workflow/app-design/flow-node/switch/case-item.vue';

const props = defineProps({
  showOrIcon: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <div class="rounded-[10px] px-2 pt-2 last:pb-2">
    <div class="relative" :class="props.data.length > 1 ? 'pl-[36px]' : ''">
      <div
        class="absolute bottom-0 left-0 top-0 w-[36px]"
        v-if="props.data.length > 1"
      >
        <div
          class="border-divider-deep absolute bottom-4 left-[22px] top-4 w-2.5 rounded-l-[8px] border border-r-0"
        ></div>
        <div
          class="absolute right-0 top-1/2 h-[29px] w-4 -translate-y-1/2 bg-white"
        ></div>
        <div
          class="shadow-xs absolute right-1 top-1/2 flex h-[21px] -translate-y-1/2 select-none items-center rounded-md border-[0.5px] border-[#10182824] bg-white px-1 text-[10px] font-semibold text-[#296dff]"
        >
          <span>AND</span>
        </div>
      </div>
      <case-item
        v-for="(item, index) in props.data"
        :key="index"
        :data="item"
        :has-and-icon="props.data.length > 1"
      ></case-item>
    </div>
    <div class="flex justify-center pt-2" v-if="props.showOrIcon">
      <div
        class="shadow-xs flex h-[21px] select-none items-center rounded-md border-[0.5px] border-[#10182824] bg-white px-1 text-[10px] font-semibold text-[#296dff]"
      >
        <span>OR</span>
      </div>
    </div>
  </div>
</template>
