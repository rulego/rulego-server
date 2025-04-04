<script setup>
import { ref, watch, nextTick } from 'vue'
import AppDesign from '@src/pages/workflow/app-design/app-design.vue';
import AppSourceCode from '@src/pages/workflow/app-source-code/app-source-code.vue';
import { mapFlowDataModelToRuleGoModel } from '@src/pages/workflow/app-design/utils';
import { cloneDeep, findKey, uniqBy } from 'lodash-es';

const props = defineProps({
  modelValue: {
    type: [String, Number, Object],
    default: '',
  },
});

const emit = defineEmits(["update:modelValue"]);

const val = ref(cloneDeep(props.modelValue));
const appDesignRef = ref(null);
const appSourceCodeRef = ref(null);


function handelDesignToJson() {
  const flowData = appDesignRef.value.getData();
  const ruleGoModel = mapFlowDataModelToRuleGoModel(flowData, val.value);
  val.value = ruleGoModel;
}

function handelJsonToDesign() {
  appDesignRef.value.clearFlowData();
  appDesignRef.value.generateFlowData();
}

function getData() {
  return this.val.value;
}

function handelSourceCodeUpdate(newVal) {
  val.value = newVal;
  emit("update:modelValue", val.value);
}

watch(
  () => props.modelValue,
  (newVal) => {
    val.value = newVal; // 当父组件更新 modelValue 时，同步更新 val
  },
  { deep: true }
);

defineExpose({
  getData,
  handelDesignToJson,
  handelJsonToDesign
});

</script>
<template>
  <div class="flex flex-row h-full">
    <div class="flex-1 overflow-hidden">
      <app-design :flow-data="val" ref="appDesignRef" />
    </div>
    <div class="flex-1 overflow-hidden">
      <app-source-code :model-value="val" @update:model-value="handelSourceCodeUpdate" ref="appSourceCodeRef" />
    </div>
  </div>
</template>
<style scoped>
.app-split-screen {
  display: flex;
  flex-direction: column;
}
</style>