<script lang="js" setup>
import { ref } from 'vue';
import { useResizeObserver } from '@vueuse/core';
import CustomNode from '@src/pages/workflow/app-design/node-form/next-node/node.vue';

const props = defineProps({
  nextData: {
    type: Array,
    default: () => [],
  },
  anchorCanConnectOnlyOneNode: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['add']);

const nodeListRef = ref();
const baseHeight = 18;
const nodesHeight = ref([]);
const svgHeight = ref(0);

function calcAnchorPosition(numberList) {
  let totalHeight = baseHeight;
  let newList = [];

  numberList.forEach((item, index) => {
    totalHeight += item;
    newList.push(totalHeight);
  });

  return newList;
}

function addHandler(data) {
  emit('add', data);
}

useResizeObserver(nodeListRef, (entries) => {
  const entry = entries[0];
  const target = entry.target;
  const { height } = entry.contentRect;
  svgHeight.value = height;
  if (target.children) {
    nodesHeight.value = [];
    for (let i = 0; i < target.children.length; i += 1) {
      nodesHeight.value.push(target.children[i].offsetHeight);
    }
    nodesHeight.value.pop();
    nodesHeight.value = calcAnchorPosition(nodesHeight.value);
  }
});
</script>

<template>
  <div v-if="props.nextData.length">
    <div class="border-t-[0.5px] border-border p-4">
      <div class="mb-1 flex items-center font-semibold">下一步</div>
      <div class="mb-2 text-sm text-slate-400">
        添加此工作流程中的下一个节点
      </div>
      <div class="flex py-1">
        <div
          class="shadow-xs relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-[0.5px] border-border bg-background"
        >
          <div
            class="shadow-xs flex h-5 w-5 items-center justify-center rounded-md border-[0.5px] border-border bg-blue-500 text-white"
          >
            <!-- 图标占位 -->
          </div>
        </div>
        <svg class="w-6 shrink-0" :style="`height: ${svgHeight}px`">
          <g>
            <path
              d="M0,18 L24,18"
              stroke-width="1"
              fill="none"
              class="stroke-border"
            ></path>
            <rect x="0" y="16" width="1" height="4" class="stroke-black"></rect>
            <rect
              x="23"
              y="16"
              width="1"
              height="4"
              class="stroke-black"
            ></rect>
          </g>
          <g v-for="(y, index) in nodesHeight" :key="index">
            <path
              :d="`M0,18 Q12,18 12,28 L12,${y - 10} Q12,${y} 24,${y + 2}`"
              stroke-width="1"
              fill="none"
              class="stroke-border"
            ></path>
            <rect
              x="23"
              :y="y"
              width="1"
              height="4"
              class="stroke-black"
            ></rect>
          </g>
        </svg>

        <div class="flex-grow overflow-auto">
          <div ref="nodeListRef">
            <custom-node
              v-for="item in props.nextData"
              :key="item.anchorId"
              :data="item"
              :anchor-can-connect-only-one-node="anchorCanConnectOnlyOneNode"
              @add="addHandler"
            ></custom-node>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
