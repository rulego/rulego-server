<script lang="js" setup>
import { ref, onBeforeUnmount } from 'vue';
import { isUndefined } from 'lodash-es';
import EventBus from '@src/utils/event-bus';
import ConfigForm from '@src/components/config-form/config-form.vue';
import BaseInfo from '@src/pages/workflow/app-design/node-form/base-info.vue';
import NextNode from '@src/pages/workflow/app-design/node-form/next-node/next-node.vue';
import LogView from '@src/pages/workflow/app-design/node-form/log.vue';

const props = defineProps({
  model: {
    type: Object,
    default: () => ({}),
  },
  nodeType: {
    type: String,
    default: () => '',
  },
  fields: {
    type: Object,
    default: () => ({}),
  },
  nextData: {
    type: Array,
    default: () => [],
  },
  anchorCanConnectOnlyOneNode: {
    type: Boolean,
    default: false,
  },
  selectedNodeId: {
    type: [Number, String],
  },
  chainId: {
    type: [Number, String],
  },
});

const emit = defineEmits(['add', 'tabChange']);

const clearNodeFormValidateBus = EventBus.clearNodeFormValidate();

const configFormRef = ref();
const tabActiveName = ref('config');

function clearValidate() {
  return configFormRef.value?.clearValidate();
}

function addHandler(data) {
  emit('add', data);
}

clearNodeFormValidateBus.on(clearValidate);

onBeforeUnmount(() => {
  clearNodeFormValidateBus.off(clearValidate);
});

defineExpose({
  clearValidate,
});
</script>

<template>
  <div class="absolute right-0 top-0 h-full p-4">
    <div class="h-full w-[520px]">
      <div class="flex h-full flex-col rounded-xl bg-white shadow-md">
        <div class="flex-none">
          <base-info
            :model="props.model"
            :nodeType="props.nodeType"
          ></base-info>
        </div>
        <div
          class="flex-none"
          v-if="nodeType !== 'start' && nodeType !== 'endpoint-node'"
        >
          <div class="px-2">
            <el-tabs v-model="tabActiveName">
              <el-tab-pane label="配置" name="config"></el-tab-pane>
              <el-tab-pane label="调试日志" name="log"></el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <div class="flex-grow overflow-auto">
          <el-scrollbar class="h-full">
            <div v-if="tabActiveName === 'config'">
              <div v-if="Object.keys(props.fields).length" class="p-4">
                <config-form
                  ref="configFormRef"
                  :model="props.model"
                  :fields="props.fields"
                ></config-form>
              </div>
              <next-node
                :next-data="props.nextData"
                :anchor-can-connect-only-one-node="anchorCanConnectOnlyOneNode"
                @add="addHandler"
              ></next-node>
            </div>
            <log-view
              v-if="tabActiveName === 'log'"
              :selected-node-id="props.selectedNodeId"
              :chain-id="props.chainId"
            ></log-view>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>
