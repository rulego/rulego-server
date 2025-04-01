<script lang="js" setup>
import { computed, watch, onMounted } from 'vue';
import { useFormItem } from 'element-plus';
import { first } from 'lodash-es';

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Object, Array],
    default: '',
  },
  options: {
    type: Array,
    default: () => [],
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

function initValue() {
  const firstValue = first(props.options)?.value;
  const hasModelValue = props.options.some(
    (item) => item.value === props.modelValue,
  );
  modelValue.value = hasModelValue ? props.modelValue : firstValue;
}

watch(
  () => props.modelValue,
  () => {
    formItem?.validate?.('change');
  },
);

onMounted(() => {
  initValue();
});
</script>

<template>
  <div class="relative w-full">
    <div>
      <el-select v-model="modelValue" v-bind="$attrs">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div v-if="props.desc">
      <el-text size="small" type="info">
        {{ props.desc }}
      </el-text>
    </div>
  </div>
</template>
