<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import JsonEditor from '@src/components/json-editor/json-editor.vue';

const props = defineProps({
  modelValue: {
    type: [String, Number, Object],
    default: '',
  }
});
const emit = defineEmits(["update:modelValue"]);

const val = ref(props.modelValue);
const jsonEditorRef = ref(null);
const scrollPosition = ref({ x: 0, y: 0 }); // 保存滚动位置

watch(() => props.modelValue, async (newValue) => {
  console.log('newValue', newValue);
  const editor = jsonEditorRef.value;
  // 保存当前滚动位置
  scrollPosition.value = editor.getScrollInfo();
  val.value = newValue;
  // 等待 DOM 更新完成后恢复滚动位置
  await nextTick();
  const { x, y } = scrollPosition.value;
  console.log('scrollTo', x, y);
  editor.scrollTo(x, y);

}, { immediate: true });

watch(val, (newValue) => {
  emit("update:modelValue", newValue);
});

const computedValue = computed(() => {
  if (typeof val.value === 'string') {
    return val.value;
  } else if (typeof val.value === 'object') {
    try {
      return JSON.stringify(val.value, null, 2);
    } catch (e) {
      return val.value;
    }
  } else {
    return val.value;
  }
});

function handelUpdate(updatedValue) {
  try {
    val.value = JSON.parse(updatedValue);
  } catch (e) {
    console.error("Invalid JSON:", e);
  }
}

defineExpose({
  getData() {
    return computedValue.value;
  }
});

</script>
<template>
  <json-editor ref="jsonEditorRef" :modelValue="computedValue" @update:modelValue="handelUpdate" />
</template>
<style scoped>
.app-source-code {
  display: flex;
  flex-direction: column;
}
</style>