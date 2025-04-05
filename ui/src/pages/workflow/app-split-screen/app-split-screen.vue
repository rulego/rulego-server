<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import AppDesign from '@src/pages/workflow/app-design/app-design.vue';
import AppSourceCode from '@src/pages/workflow/app-source-code/app-source-code.vue';
import { mapFlowDataModelToRuleGoModel } from '@src/pages/workflow/app-design/utils';
import { cloneDeep, } from 'lodash-es';
import EventBus from '@src/utils/event-bus';

const props = defineProps({
  modelValue: {
    type: [String, Number, Object],
    default: '',
  },
});

const emit = defineEmits(["update:modelValue"]);
const logicflowNodeMouseUp = EventBus.logicflowNodeMouseUp();


const val = ref(cloneDeep(props.modelValue));
const appDesignRef = ref(null);
const appSourceCodeRef = ref(null);


function handelDesignToJson() {
  const flowData = appDesignRef.value.getData();
  const ruleGoModel = mapFlowDataModelToRuleGoModel(flowData, val.value);
  val.value = ruleGoModel;
}

function handelJsonToDesign() {
  appDesignRef.value.rerenderFlowData();
}

function getData() {
  return this.val.value;
}

let updateFlowTimeout = null;
function handelSourceCodeUpdate(newVal) {
  val.value = newVal;
  emit("update:modelValue", val.value);

  //跳过连续输入
  if (updateFlowTimeout) {
    clearTimeout(updateFlowTimeout);
  }
  updateFlowTimeout = setTimeout(() => {
    handelJsonToDesign();
  }, 500);
}

let updateCodeTimeout = null;
function handleDesignUpdate(newVal) {
  val.value = newVal;

  //跳过连续变化
  if (updateFlowTimeout) {
    clearTimeout(updateCodeTimeout);
  }

  updateCodeTimeout = setTimeout(() => {
    emit("update:modelValue", val.value);
  }, 500);
}

watch(
  () => props.modelValue,
  (newVal) => {
    val.value = newVal; // 当父组件更新 modelValue 时，同步更新 val
  },
  { deep: true }
);

onMounted(() => {
  logicflowNodeMouseUp.on(handelDesignToJson);
})

onBeforeUnmount(() => {
  logicflowNodeMouseUp.off(handelDesignToJson);
  if (updateFlowTimeout) {
    clearTimeout(updateFlowTimeout);
  }
  if (updateCodeTimeout) {
    clearTimeout(updateCodeTimeout);
  }
});

defineExpose({
  getData,
  handelDesignToJson,
  handelJsonToDesign
});

</script>
<template>
  <div class="flex flex-row h-full">
    <div class="flex-1 overflow-hidden">
      <app-design :model-value="val" @update:model-value="handleDesignUpdate" ref="appDesignRef" />
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