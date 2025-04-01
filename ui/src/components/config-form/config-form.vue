<script lang="js" setup>
import { ref, computed, provide } from 'vue';
import { getCache } from '@src/components/config-form/cache.js';

const props = defineProps({
  model: {
    type: Object,
    default: () => ({}),
  },
  fields: {
    type: Object,
    default: () => ({}),
  },
});
provide('getConfig', getConfig);
provide('getModel', getModel);

const form = ref();
const configFormOptions = ref(getCache('options'));
const componentMaps = computed(
  () => configFormOptions.value['componentMaps'] || {},
);
const defaultProps = computed(
  () => configFormOptions.value['defaultProps'] || {},
);
const formItems = computed(() => {
  return Object.keys(props.fields).map((key) => {
    let { rules, ...others } = props.fields[key];
    return {
      prop: key,
      ...others,
    };
  });
});
const rules = computed(() => {
  return Object.keys(props.fields).reduce((allRules, key) => {
    let { rules, ...others } = props.fields[key];
    if (rules) {
      allRules[key] = [...rules];
    }
    return allRules;
  }, {});
});

function getConfig() {
  return {
    componentMaps: componentMaps.value,
    defaultProps: defaultProps.value,
    formItems: formItems.value,
    rules: rules.value,
  };
}

function getModel() {
  return props.model;
}

function validate() {
  return form.value.validate();
}

function clearValidate() {
  return form.value.clearValidate();
}

defineExpose({
  validate,
  clearValidate,
});
</script>

<template>
  <component
    ref="form"
    :is="componentMaps['form'] || 'el-form'"
    :model="model"
    :rules="rules"
    class="config-form"
    v-bind="{ ...defaultProps['form'], ...$attrs }"
  >
    <slot>
      <template v-for="formItem in formItems" :key="formItem.prop">
        <component
          v-if="
            typeof formItem.hidden === 'function'
              ? !formItem.hidden(model)
              : !formItem.hidden
          "
          :is="componentMaps['formItem'] || 'el-form-item'"
          v-bind="{ ...defaultProps['formItem'], ...formItem.formItemProps }"
          :prop="formItem.prop"
          :label="formItem.label"
        >
          <template v-if="$slots[`${formItem.prop}-label`]" slot="label">
            <slot :name="`${formItem.prop}-label`">{{ formItem.label }}</slot>
          </template>
          <template v-if="$slots[`${formItem.prop}`]">
            <slot :name="`${formItem.prop}`"></slot>
          </template>
          <component
            v-else
            :is="
              typeof formItem.component === 'string'
                ? componentMaps[formItem.component]
                : formItem.component
            "
            v-bind="{
              ...(typeof formItem.component === 'string'
                ? defaultProps[formItem.component]
                : {}),
              ...formItem.componentProps,
            }"
            v-on="formItem.componentEvents || {}"
            v-model="model[formItem.prop]"
            :disabled="
              typeof formItem.disabled === 'function'
                ? formItem.disabled(model)
                : !!formItem.disabled || formItem.componentProps?.disabled
            "
          ></component>
        </component>
      </template>
    </slot>
  </component>
</template>
