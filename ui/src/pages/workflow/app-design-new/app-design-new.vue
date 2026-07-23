<script setup>
import {
  onMounted,
  onBeforeUnmount,
  ref,
  watch,
  nextTick,
  reactive,
} from 'vue';
import AppDesign from '@src/pages/workflow/app-design/app-design.vue';
import AppSourceCode from '@src/pages/workflow/app-source-code/app-source-code.vue';
import { mapFlowDataModelToRuleGoModel } from '@src/pages/workflow/app-design/utils';
import { cloneDeep } from 'lodash-es';
import EventBus from '@src/utils/event-bus';
import ChatListView from '@src/pages/workflow/chat-list-view/chat-list-view.vue';
import ToolButtons from '@src/pages/workflow/app-design-new/tool-buttons.vue';
//import Assistant from '@src/assets/assistant.svg';
import AiChatDrawer from '@src/pages/workflow/chat-list-view/ai-chat-drawer.vue';

const props = defineProps({
  modelValue: {
    type: [String, Number, Object],
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);
const logicflowNodeMouseUp = EventBus.logicflowNodeMouseUp();

const val = ref(cloneDeep(props.modelValue));
const appDesignRef = ref(null);
const appSourceCodeRef = ref(null);
const toolButtons = ref({
  isFlowVisible: true,
  isSourceCodeVisible: false,
});
const isAiVisible = ref(false);

function handelDesignToJson() {
  const flowData = appDesignRef.value.getData();
  const ruleGoModel = mapFlowDataModelToRuleGoModel(flowData, val.value);
  val.value = ruleGoModel;
}

let jsonToDocTimer = 0;
function handelJsonToDesign() {
  //Do not frequently update the image by entering code continuously.
  if (jsonToDocTimer) {
    clearTimeout(jsonToDocTimer);
  }
  jsonToDocTimer = setTimeout(async () => {
    appDesignRef.value.render();
  }, 500);
}

function getData() {
  return this.val.value;
}

/**
 * Handling code updates
 * @param {string} newVal
 */
function handelSourceCodeUpdate(newVal) {
  val.value = newVal;
  emit('update:modelValue', val.value);
  handelJsonToDesign();
}

/**
 * Processing diagram updates
 * @param {string} newVal
 */
function handleDesignUpdate(newVal) {
  val.value = newVal;
  emit('update:modelValue', val.value);
}

watch(
  () => props.modelValue,
  (newVal) => {
    val.value = newVal; // Synchronize val when the parent updates modelValue
  },
  { deep: true },
);

onMounted(() => {
  logicflowNodeMouseUp.on(handelDesignToJson);
});

onBeforeUnmount(() => {
  logicflowNodeMouseUp.off(handelDesignToJson);
});

defineExpose({
  getData,
  handelDesignToJson,
  handelJsonToDesign,
});
</script>
<template>
  <div class="relative flex h-full flex-row">
    <div v-if="toolButtons.isFlowVisible" class="flex-1 overflow-hidden">
      <app-design
        :model-value="val"
        @update:model-value="handleDesignUpdate"
        ref="appDesignRef"
      />
    </div>
    <div v-if="toolButtons.isSourceCodeVisible" class="flex-1 overflow-hidden">
      <app-source-code
        :model-value="val"
        @update:model-value="handelSourceCodeUpdate"
        ref="appSourceCodeRef"
      />
    </div>
    <div v-if="false" class="flex flex-1 overflow-hidden">
      <chat-list-view class="flex-1" />
    </div>
    <tool-buttons v-model="toolButtons" class="absolute right-4 top-4" />
    <!--20250507 temporarily comment out the AI assistant-->
    <!-- <div @click="isAiVisible = true" class="absolute bottom-24 right-10 size-[50px] flex justify-center items-center rounded-full bg-white cursor-pointer border">
      <el-icon :size="28">
        <Assistant />
      </el-icon>
    </div> -->
    <ai-chat-drawer v-model="isAiVisible" />
  </div>
</template>
<style scoped>
.app-split-screen {
  display: flex;
  flex-direction: column;
}
</style>
