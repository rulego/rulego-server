<script lang="js" setup>
import { ref } from 'vue';
import BaseInfo from '@src/pages/workflow/app-manage/base-info.vue';
import VariableTable from '@src/pages/workflow/app-manage/variable.vue';
import AppIntegration from '@src/pages/workflow/app-manage/app-integration.vue';

const props = defineProps({
  baseInfoFormState: {
    type: Object,
    default: () => ({
      id: '',
      name: '',
      description: '',
      root: false,
      debugMode: true,
    }),
  },
  variableState: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['save']);

const APP_MANAGE_MENU_KEY = {
  BASE_INFO: 'base-info',
  VARIABLE: 'variable',
  RUN_LOG: 'run-log',
  APP_INTEGRATION: 'app-integration',
};

const menuList = ref([
  {
    key: APP_MANAGE_MENU_KEY.BASE_INFO,
    label: '基础信息',
    icon: 'el-icon-menu',
  },
  {
    key: APP_MANAGE_MENU_KEY.VARIABLE,
    label: '变量',
    icon: 'el-icon-menu',
  },
  {
    key: APP_MANAGE_MENU_KEY.RUN_LOG,
    label: '运行日志',
    icon: 'el-icon-menu',
  },
  {
    key: APP_MANAGE_MENU_KEY.APP_INTEGRATION,
    label: '应用集成',
    icon: 'el-icon-menu',
  },
]);
const activeKey = ref(APP_MANAGE_MENU_KEY.BASE_INFO);

function setActiveKey(key) {
  if (activeKey.value === key) return;
  activeKey.value = key;
}
</script>

<template>
  <div class="flex h-full justify-center pt-12">
    <div class="w-52 flex-none">
      <div
        class="mb-2 flex items-center rounded-xl px-4 py-2 hover:cursor-pointer hover:bg-[var(--el-menu-hover-bg-color)]"
        :class="[
          activeKey === item.key ? 'bg-[var(--el-menu-hover-bg-color)]' : '',
        ]"
        v-for="item in menuList"
        :key="item.key"
        @click="setActiveKey(item.key)"
      >
        <div class="flex flex-none items-center pr-2">
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
        </div>
        <div class="flex-grow overflow-auto">{{ item.label }}</div>
      </div>
    </div>
    <div class="h-full w-[600px]">
      <base-info
        v-if="activeKey === APP_MANAGE_MENU_KEY.BASE_INFO"
        :form-state="props.baseInfoFormState"
        @save="emit('save')"
      ></base-info>
      <variable-table
        v-if="activeKey === APP_MANAGE_MENU_KEY.VARIABLE"
        :data="props.variableState"
        @save="emit('save')"
      ></variable-table>
      <app-integration
        v-if="activeKey === APP_MANAGE_MENU_KEY.APP_INTEGRATION"
        :form-state="props.baseInfoFormState"
      ></app-integration>
    </div>
  </div>
</template>
