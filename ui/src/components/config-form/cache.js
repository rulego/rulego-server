import { shallowRef } from 'vue';
import DefaultEndpointsRoutersFormItem from '@src/components/config-form/custom-form-item/default-endpoints-routers-form-item/index.vue';
import SimpleRoutersFormItem from '@src/components/config-form/custom-form-item/simple-routers-form-item/index.vue';
import SwitchFormItem from '@src/components/config-form/custom-form-item/switch-form-item/index.vue';
import MapFormItem from '@src/components/config-form/custom-form-item/map-form-item/index.vue';
import ArrayFormItem from '@src/components/config-form/custom-form-item/array-form-item/index.vue';
import StructFormItem from '@src/components/config-form/custom-form-item/struct-form-item/index.vue';
import StringFormItem from '@src/components/config-form/custom-form-item/string-form-item/index.vue';
import ScriptFormItem from '@src/components/config-form/custom-form-item/script-form-item/index.vue';
import SelectFormItem from '@src/components/config-form/custom-form-item/select-form-item/index.vue';
import TextareaFormItem from '@src/components/config-form/custom-form-item/textarea-form-item/index.vue';
import TableFormItem from '@src/components/config-form/custom-form-item/table-form-item/index.vue';
import SwitchNodeFormItem from '@src/components/config-form/custom-form-item/switch-node-form-item/index.vue';
import SliderFormItem from '@src/components/config-form/custom-form-item/slider-form-item/index.vue';

const cache = {
  options: {
    componentMaps: {
      form: 'el-form',
      formItem: 'el-form-item',
      number: 'el-input-number',
      switch: shallowRef(SwitchFormItem),
      defaultEndpointsRoutersFormItem: shallowRef(
        DefaultEndpointsRoutersFormItem,
      ),
      simpleRoutersFormItem: shallowRef(SimpleRoutersFormItem),
      map: shallowRef(MapFormItem),
      array: shallowRef(ArrayFormItem),
      struct: shallowRef(StructFormItem),
      string: shallowRef(StringFormItem),
      script: shallowRef(ScriptFormItem),
      select: shallowRef(SelectFormItem),
      textarea: shallowRef(TextareaFormItem),
      table: shallowRef(TableFormItem),
      switchNode: shallowRef(SwitchNodeFormItem),
      slider: shallowRef(SliderFormItem),
    },
    defaultProps: {
      form: {
        size: 'default',
        labelWidth: '80px',
        labelPosition: 'top',
      },
      number: {
        style: 'width: 300px;',
      },
    },
  },
};

export function setCache(key, data) {
  cache[key] = data;
}

export function getCache(key) {
  return cache[key];
}
