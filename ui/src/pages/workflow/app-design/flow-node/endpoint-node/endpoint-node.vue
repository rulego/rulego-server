<script setup>
import DefaultEndpointNode from '@src/pages/workflow/app-design/flow-node/components/default-endpoint-node.vue';

const props = defineProps({
  /**
   * Node attributes (attributes that every node must have)
   * @type {Object}
   * @property {Object} formData form
   * @property {string} formData.description description
   * @property {string} formData.title title
   * @property {Object} status
   * @property {boolean} status.isSelected. Whether it is selected
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
