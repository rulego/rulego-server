<script lang="js" setup>
import { computed, watch } from 'vue';
import { useFormItem } from 'element-plus';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  desc: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const { formItem } = useFormItem();
const modelValue = computed({
  get: () => {
    return props.modelValue;
  },
  set: (value) => {
    emit('update:modelValue', value);
  },
});

watch(
  () => props.modelValue,
  () => {
    formItem?.validate?.('change');
  },
);
</script>

<template>
  <div class="relative w-full">
    <div>
      <el-slider v-model="modelValue" v-bind="$attrs"></el-slider>
    </div>
    <div v-if="props.desc">
      <el-text size="small" type="info">
        {{ props.desc }}
      </el-text>
    </div>
  </div>
</template>
