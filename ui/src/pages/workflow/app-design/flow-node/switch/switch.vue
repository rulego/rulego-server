<script setup>
import { ref, computed } from 'vue';
import { cloneDeep } from 'lodash-es';
import { nodeUtils } from '@src/utils/flow-utils';
import DefaultNode from '@src/pages/workflow/app-design/flow-node/components/default-node.vue';
import AndItem from '@src/pages/workflow/app-design/flow-node/switch/and-item.vue';

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

const anchors = computed(() => {
  const val = (props?.properties?.anchors || []).map((item) => {
    return {
      ...item,
      andItem: item.id === 'Default' ? [] : nodeUtils.expr2json(item.name),
    };
  });
  const defaultAnchorIndex = val.findIndex((item) => item.id === 'Default');
  if (defaultAnchorIndex !== -1) {
    const defaultAnchor = cloneDeep(val[defaultAnchorIndex]);
    val.splice(defaultAnchorIndex, 1);
    val.push(defaultAnchor);
  }
  return val;
});
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
          <div class="truncate text-gray-400" :title="anchor.id">
            {{ anchor.id === 'Default' ? anchor.name : anchor.id }}
          </div>
        </div>
        <and-item
          v-for="(item, index) in anchor.andItem"
          :key="index"
          :data="item"
          :show-or-icon="index < anchor.andItem.length - 1"
        ></and-item>
        <!-- <div
          class="break-all px-1 text-[12px] text-gray-400"
          :title="anchor.name"
        >
          {{ anchor.name }}
        </div> -->
      </div>
    </div>
  </default-node>
</template>
