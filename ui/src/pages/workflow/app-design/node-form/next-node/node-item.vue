<script lang="js" setup>
import { ref } from 'vue';
import EventBus from '@src/utils/event-bus';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});

const jumpToNodeBus = EventBus.jumpToNode();
const deleteFlowNodeByIdBus = EventBus.deleteFlowNodeById();

const dropdownVisible = ref(false);

function visibleChangeHandler(visible) {
  dropdownVisible.value = visible;
}

function jumpToNodeHandler() {
  jumpToNodeBus.emit(props.data.nodeId);
}

function dropdownMenuCommandHandler(command) {
  if (command === 'delete') {
    deleteFlowNodeByIdBus.emit(props.data.nodeId);
  }
}
</script>

<template>
  <div
    class="border-divider-regular shadow-xs text-text-secondary group relative flex h-9 cursor-pointer items-center rounded-lg border-[0.5px] bg-white px-2 text-xs last-of-type:mb-0 hover:bg-gray-50"
  >
    <div
      class="shadow-xs mr-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-[0.5px] border-border bg-blue-500 text-white"
    >
      <!-- 图标占位 -->
    </div>
    <div
      class="system-xs-medium text-text-secondary grow truncate"
      :title="data.nodeTitle"
    >
      {{ data.nodeTitle }}
    </div>
    <div class="mr-1 hidden shrink-0 group-hover:flex">
      <el-button size="small" @click="jumpToNodeHandler">跳转到节点</el-button>
    </div>
    <div
      class="shrink-0 items-center group-hover:flex"
      :class="[dropdownVisible ? 'flex' : 'hidden']"
    >
      <el-dropdown
        trigger="click"
        @visible-change="visibleChangeHandler"
        @command="dropdownMenuCommandHandler"
      >
        <el-button size="small" icon="el-icon-more"></el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="delete">删除</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
