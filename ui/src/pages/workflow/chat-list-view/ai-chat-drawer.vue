<template>
  <transport to="body">
    <div v-if="props.modelValue" class="fixed flex flex-col right-0 top-0 h-full w-[400px] bg-white shadow-lg" :style="computedStyle">
      <div class="flex flex-row p-4 justify-between">
        <span>AI 助手</span>
        <el-icon :size="28" @click="handleVisibleChange(false)">
          <Close />
        </el-icon>
      </div>
      <chat-list-view class="flex-1 overflow-hidden" />
    </div>
  </transport>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import ChatListView from './chat-list-view.vue'
import { Close } from '@element-plus/icons-vue'
import { useZIndex } from 'element-plus'
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue'])

function handleVisibleChange(isVisible: boolean) {
  emit('update:modelValue', isVisible)
}
const { nextZIndex } = useZIndex()

const computedStyle = computed(() => {
  return {
    zIndex: nextZIndex(),
  }
})
</script>