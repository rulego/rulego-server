<script lang="js" setup>
import { ref, computed, inject, onMounted } from 'vue';

const props = defineProps(['props']);

const getModel = inject('getModel');
const getConfig = inject('getConfig');

const componentMaps = ref({});
const defaultProps = ref({});
const formItems = ref([]);
const model = ref({});
const formItem = computed(() => {
  return formItems.value.find((item) => item.prop === props.prop);
});

onMounted(() => {
  let { componentMaps, defaultProps, formItems } = getConfig();
  componentMaps.value = componentMaps;
  defaultProps.value = defaultProps;
  formItems.value = formItems;

  model.value = getModel();
});
</script>

<template>
  <component
    v-if="formItem"
    :is="componentMaps['formItem']"
    :prop="prop"
    :label="formItem.label"
  >
    <template slot="label">
      <slot name="label">{{ formItem.label }}</slot>
    </template>
    <slot>
      <component
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
        v-on="formItem.componentEvents"
        v-model="model[formItem.prop]"
        :disabled="
          typeof formItem.disabled === 'function'
            ? formItem.disabled(model)
            : !!formItem.disabled
        "
      ></component>
    </slot>
  </component>
</template>
