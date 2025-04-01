<script lang="js" setup>
import { NODE_TITLE_HEIGHT } from '@src/pages/workflow/app-design/constant';

const props = defineProps({
  icon: {
    type: String,
    default: 'el-icon-menu',
  },
  title: {
    type: String,
    default: '未命名节点',
  },
});
</script>

<template>
  <div
    class="flex items-center px-2"
    :style="{ height: `${NODE_TITLE_HEIGHT}px` }"
  >
    <div class="mr-2 flex flex-none items-center">
      <el-icon>
        <component :is="props.icon"></component>
      </el-icon>
    </div>
    <div class="flex-grow overflow-auto truncate">
      {{ props.title }}
    </div>
  </div>
</template>
