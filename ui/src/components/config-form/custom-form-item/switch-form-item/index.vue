<script lang="js" setup>
import { computed, watch } from 'vue';
import { useFormItem } from 'element-plus';

const props = defineProps({
  modelValue: {
    type: [Boolean, String, Number],
    default: false,
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
  <div class="relative flex w-full items-center">
    <el-switch class="mr-2" v-model="modelValue" v-bind="$attrs"></el-switch>
    <el-text v-if="props.desc" size="small" type="info">
      {{ props.desc }}
    </el-text>
  </div>
</template>
