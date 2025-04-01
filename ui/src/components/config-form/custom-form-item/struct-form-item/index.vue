<script lang="js" setup>
import { ref } from 'vue';
import ConfigForm from '@src/components/config-form/config-form.vue';
import { generateFormFields } from '@src/pages/workflow/app-design/utils';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  label: {
    type: String,
    default: '',
  },
  fields: {
    type: Array,
    default: () => [],
  },
  desc: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const formFields = ref(generateFormFields(props.fields));
</script>

<template>
  <div class="struct-form-item relative w-full">
    <el-collapse>
      <el-collapse-item :title="props.label" name="email">
        <config-form
          :model="props.modelValue"
          :fields="formFields"
        ></config-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
