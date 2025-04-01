<script lang="js" setup>
import { isUndefined } from 'lodash-es';
import EventBus from '@src/utils/event-bus';

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
});

const closeNodeFormBus = EventBus.closeNodeForm();
</script>

<template>
  <div class="rounded-t-xl border-b border-solid border-border bg-white">
    <div class="flex items-center px-4 pt-4">
      <div class="h-[24px] w-[24px] flex-none rounded-md bg-blue-500"></div>
      <div class="flex-grow overflow-auto pl-2">
        <input
          v-model="model.additionalInfo.title"
          class="focus:shadow-xs mr-2 h-6 min-w-0 grow appearance-none rounded-lg border border-transparent px-1 text-base font-semibold text-gray-900 caret-[#295EFF] outline-none hover:bg-gray-50 focus:border-gray-300 focus:bg-white"
          placeholder="添加标题..."
          value="开始"
        />
      </div>
      <el-divider class="flex-none" direction="vertical" />
      <el-button
        class="flex-none"
        icon="el-icon-close"
        :text="true"
        @click="closeNodeFormBus.emit()"
      ></el-button>
    </div>
    <div class="p-2">
      <el-input
        v-if="nodeType !== 'start'"
        v-model="model.additionalInfo.description"
        :autosize="{ minRows: 2, maxRows: 2 }"
        resize="none"
        type="textarea"
        placeholder="添加描述..."
      />
    </div>
  </div>
</template>
