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

watch(() => props.modelValue, async (newValue) => {
  val.value = newValue;
}, { deep: true });

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
    emit("update:modelValue", val.value);
  } catch (e) {
    console.error("Invalid JSON:", e);
  }
}

function setValue(value) {
  val.value = value;
}

function getData() {
  return computedValue.value;
}

defineExpose({
  setValue,
  getData
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