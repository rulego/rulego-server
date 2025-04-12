<script setup>
import NodesGraph from '@src/assets/nodes-graph.svg'
import SplitScreen from '@src/assets/split-screen.svg'

const props = defineProps({
  modelValue: {
    type: Object,
    default: {
      isFlowVisible: true,
      isSourceCodeVisible: false,
    },
  },
})
const emit = defineEmits(['update:modelValue'])

/**
 * 
 * @param {string} propertyName 
 */
function handleToggleButton(propertyName) {
  props.modelValue[propertyName] = !props.modelValue[propertyName]
  emit('update:modelValue', props.modelValue)
}
</script>
<template>
  <div class="flex flex-row gap-4 p-4 bg-[var(--el-overlay-color-lighter)] rounded">
    <el-icon :color="modelValue.isFlowVisible ? '#aaa' : 'white'" @click="handleToggleButton('isFlowVisible')"
      class="cursor-pointer">
      <NodesGraph />
    </el-icon>
    <el-icon :color="modelValue.isSourceCodeVisible ? '#aaa' : 'white'" @click="handleToggleButton('isSourceCodeVisible')"
      class="cursor-pointer">
      <SplitScreen />
    </el-icon>
  </div>
</template>
