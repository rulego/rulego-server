<script setup>
import DefaultEndpointNode from '@src/pages/workflow/app-design/flow-node/components/default-endpoint-node.vue';

const props = defineProps({
  /**
   * 节点属性(每个节点必定有的属性)
   * @type {Object}
   * @property {Object} formData 表单
   * @property {string} formData.description 描述
   * @property {string} formData.title 标题
   * @property {Object} status 状态
   * @property {boolean} status.isSelected 是否选中
   */
  properties: Object,
  model: Object,
});
</script>

<template>
  <default-endpoint-node
    :properties="props.properties"
    :model="props.model"
  ></default-endpoint-node>
</template>
