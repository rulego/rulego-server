<script setup>
import { onMounted, onBeforeUnmount, ref, watch , nextTick } from 'vue'
import AppDesign from '@src/pages/workflow/app-design/app-design.vue';
import AppSourceCode from '@src/pages/workflow/app-source-code/app-source-code.vue';
import { mapFlowDataModelToRuleGoModel } from '@src/pages/workflow/app-design/utils';
import { cloneDeep, } from 'lodash-es';
import EventBus from '@src/utils/event-bus';
import ChatListView from "@src/pages/workflow/chat-list-view/chat-list-view.vue";

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

let jsonToDocTimer = 0;
function handelJsonToDesign() {

  //连续输入code不要频繁更新图。
  if(jsonToDocTimer) {
    clearTimeout(jsonToDocTimer);
  }
  jsonToDocTimer = setTimeout(async () => {
    appDesignRef.value.clearFlowData();
    await nextTick();
    appDesignRef.value.generateFlowData();
  }, 500);
}

function getData() {
  return this.val.value;
}

function handelSourceCodeUpdate(newVal) {
  val.value = newVal;
  emit("update:modelValue", val.value);
  // handelJsonToDesign();
}

function handleDesignUpdate(newVal) {
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

onMounted(() => {
  logicflowNodeMouseUp.on(handelDesignToJson);
})

onBeforeUnmount(() => {
  logicflowNodeMouseUp.off(handelDesignToJson);
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
    <div class="flex flex-1 overflow-hidden">
      <chat-list-view class="flex-1" />
    </div>
  </div>
</template>
<style scoped>
.app-split-screen {
  display: flex;
  flex-direction: column;
}
</style>