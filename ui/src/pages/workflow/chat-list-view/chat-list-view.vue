<template>
  <div class="flex flex-col p-4">
    <BubbleList class="flex-1 " :list="list" />
    <Sender />
  </div>
</template>

<script lang="ts" setup>
import { BubbleList, Sender } from 'vue-element-plus-x'
const list = [
  {
    content: 'Hello, Element Plus X',
    role: 'user',
  },
]
</script>
<style scoped>
:deep(.el-bubble-list) {
  --el-bubble-list-max-height: auto !important;
}
</style>
