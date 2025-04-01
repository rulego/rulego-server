<script setup>
import DefaultNode from '@src/pages/workflow/app-design/flow-node/components/default-node.vue';
import { computed } from 'vue';

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

const anchors = computed(() => props.properties.anchors || []);
</script>

<template>
  <default-node :properties="props.properties" :model="props.model">
    <div class="relative pb-2" v-if="anchors.length">
      <div
        class="anchor-item"
        v-for="anchor in anchors"
        :key="anchor.id"
        :data-id="anchor.id"
      >
        <div
          class="flex h-[20px] items-center justify-end px-2 text-[12px] font-semibold"
        >
          <div class="truncate text-gray-400" :title="anchor.name">
            {{ anchor.name }}
          </div>
        </div>
      </div>
    </div>
  </default-node>
</template>
