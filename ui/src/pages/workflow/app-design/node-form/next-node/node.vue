<script lang="js" setup>
import NodeItem from '@src/pages/workflow/app-design/node-form/next-node/node-item.vue';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  anchorCanConnectOnlyOneNode: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['add']);

function addNodeHandler(event) {
  emit('add', { data: props.data, event });
}
</script>

<template>
  <div class="pb-[8px] last:pb-0">
    <div class="space-y-0.5 rounded-[10px] bg-gray-100 p-0.5">
      <div
        v-if="data.anchorTitle"
        class="flex items-center truncate px-2 text-xs font-semibold text-slate-600"
        :title="data.anchorTitle"
      >
        {{ data.anchorTitle }}
      </div>
      <node-item
        v-for="item in data.nodes"
        :key="item.nodeId"
        :data="item"
      ></node-item>
      <div
        @click="addNodeHandler"
        v-if="
          props.anchorCanConnectOnlyOneNode === false || data.nodes.length === 0
        "
      >
        <div
          class="bg-dropzone-bg hover:bg-dropzone-bg-hover text-text-placeholder false false relative flex h-9 cursor-pointer items-center rounded-lg border border-dashed border-border px-2 text-xs"
        >
          <div
            class="mr-1.5 flex h-5 w-5 items-center justify-center rounded-[5px] bg-gray-200"
          >
            <el-icon><el-icon-plus /></el-icon>
          </div>
          <div class="flex items-center uppercase">
            {{ data.nodes.length ? '添加并行节点' : '选择下一个节点' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
