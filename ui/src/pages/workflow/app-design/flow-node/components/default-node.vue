<script setup>
import { computed } from 'vue';
import NodeTitle from '@src/pages/workflow/app-design/flow-node/components/node-title.vue';

const props = defineProps({
  /**
   * 节点属性(每个节点必定有的属性)
   * @type {Object}
   * @property {Object} formData 表单
   * @property {string} formData.additionalInfo.description 描述
   * @property {string} formData.additionalInfo.title 标题
   * @property {Object} status 状态
   * @property {boolean} status.isSelected 是否选中
   */
  properties: Object,
  model: Object,
});

const isSelected = computed(
  () => props?.properties?.status?.isSelected || false,
);
const formData = computed(() => props?.properties?.formData || {});
</script>

<template>
  <div
    :id="model.id"
    class="box-border rounded-2xl border-2 border-solid border-transparent bg-white"
    :style="[
      isSelected
        ? { border: '2px solid #4669fc' }
        : { border: '2px solid #ffffff' },
      {
        width: `${properties.width || 240}px`,
        height: `${properties.height || 40}px`,
      },
    ]"
  >
    <div class="container">
      <node-title :title="formData.additionalInfo?.title"></node-title>
      <slot></slot>
      <div
        v-show="formData.additionalInfo?.description"
        class="whitespace-pre-line break-words break-all px-2 pb-2 pt-1 text-sm text-gray-500"
      >
        {{ formData.additionalInfo.description }}
      </div>
    </div>
  </div>
</template>
