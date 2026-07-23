<script setup>
import DefaultNode from '@src/pages/workflow/app-design/flow-node/components/default-node.vue';

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
  <default-node :properties="props.properties" :model="props.model">
  </default-node>
</template>
