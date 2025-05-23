<script lang="js" setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { cloneDeep } from 'lodash-es';
import { ElMessage } from 'element-plus';
import * as Api from '@src/api';
import { WORKFLOW_MENU_KEY } from '@src/constant/workflow';
import AppManage from '@src/pages/workflow/app-manage/app-manage.vue';
import AppDesignNew from '@src/pages/workflow/app-design-new/app-design-new.vue';
import RunDrawer from '@src/pages/workflow/app-design/run-drawer/run-drawer.vue';
const router = useRouter();
const route = useRoute();

const appDesignNewRef = ref();
const runDrawerRef = ref();

const menuList = ref([
  {
    key: WORKFLOW_MENU_KEY.APP_MANAGE,
    label: '应用管理',
  },
  {
    key: WORKFLOW_MENU_KEY.APP_DESIGN,
    label: '应用设计',
  },
]);
const menuActiveKey = ref(WORKFLOW_MENU_KEY.APP_MANAGE);
const formState = ref({
  baseInfoFormState: {
    id: '',
    name: '',
    description: '',
    root: false,
    debugMode: true,
  },
  variableState: [],
});
const bakValue = ref();
const flowData = ref();

function setMenuActiveKey(key) {
  menuActiveKey.value = key;
}

function menuSelectHandler(key) {
  setMenuActiveKey(key);
}

function initPageState() {
  const query = { ...route.query };
  if (!query.id) {
    exitHandler();
    return;
  }
  if (query.tab) {
    setMenuActiveKey(query.tab);
    delete query.tab;
    router.replace({
      query: {
        ...query,
      },
    });
  }
}

async function refreshFormState() {
  const id = route.query.id;
  const res = await Api.getRulesDetail(id);
  bakValue.value = cloneDeep(res);
  flowData.value = cloneDeep(res);
  const { ruleChain } = res;
  formState.value.baseInfoFormState = {
    id: ruleChain.id,
    name: ruleChain.name,
    description: ruleChain.additionalInfo.description,
    root: ruleChain.root,
    debugMode: ruleChain.debugMode,
  };
  const configuration = ruleChain?.configuration;
  if (configuration) {
    formState.value.variableState = Object.keys(configuration.vars).map(
      (key) => {
        return {
          key,
          value: configuration.vars[key],
        };
      },
    );
  }
}

function exitHandler() {
  router.replace({
    path: '/workflow-list',
  });
}

async function saveHandler() {
  try {
    const params = cloneDeep(bakValue.value.ruleChain);
    params.name = formState.value.baseInfoFormState.name;
    params.additionalInfo.description =
      formState.value.baseInfoFormState.description;
    params.debugMode = formState.value.baseInfoFormState.debugMode;
    params.configuration = params.configuration || {};
    params.configuration.vars = params.configuration.vars || {};
    formState.value.variableState.forEach((item) => {
      params.configuration.vars[item.key] = item.value;
    });
    await Api.setRulesBase(params.id, params);
    await refreshFormState();
    ElMessage.success('修改成功');
  } catch (error) {
    console.error(error);
    ElMessage.error('修改失败');
  }
}

async function saveFlowHandler() {
  const ruleGoModel =flowData.value;
  const id = ruleGoModel.ruleChain.id;
  await Api.setRules(id, ruleGoModel);
  await refreshFormState();

  ElMessage.success('保存成功');
}

function openDrawerHandler() {
  runDrawerRef.value.open();
}

onMounted(() => {
  initPageState();
  refreshFormState();
});
</script>

<template>
  <div class="flex h-screen w-screen flex-col overflow-auto">
    <div class="flex flex-none items-center border-b border-[var(--el-border-color)]">
      <div class="flex-none pl-2">
        <el-button icon="el-icon-arrow-left-bold" :text="true" @click="exitHandler">
          退出
        </el-button>
      </div>
      <el-divider direction="vertical" />
      <div class="flex-none">
        <el-menu class="workflow-menu" :default-active="menuActiveKey" mode="horizontal" :ellipsis="false"
          @select="menuSelectHandler">
          <el-menu-item v-for="item in menuList" :key="item.key" :index="item.key">
            {{ item.label }}
          </el-menu-item>
        </el-menu>
      </div>
      <div class="flex flex-grow items-center justify-center overflow-auto">
        {{ bakValue?.ruleChain?.name || '应用名称' }}
      </div>
      <div class="min-w-[204px] flex-none px-4">
        <template v-if="[WORKFLOW_MENU_KEY.APP_DESIGN].includes(menuActiveKey)">
          <el-button icon="el-icon-video-play" @click="openDrawerHandler">测试</el-button>
          <el-button icon="el-icon-upload-filled" type="primary" @click="saveFlowHandler">保存</el-button>
        </template>
      </div>
    </div>
    <div class="flex-grow overflow-auto">
      <!-- 应用管理 -->
      <app-manage v-if="menuActiveKey === WORKFLOW_MENU_KEY.APP_MANAGE"
        :base-info-form-state="formState.baseInfoFormState" :variable-state="formState.variableState"
        @save="saveHandler"/>
      <!-- 应用设计 -->
      <app-design-new ref="appDesignNewRef" v-if="menuActiveKey === WORKFLOW_MENU_KEY.APP_DESIGN"
        v-model="flowData"/>
    </div>
    <run-drawer ref="runDrawerRef" :flow-data="flowData" />
  </div>
</template>

<style scoped>
.workflow-menu {
  border-bottom: none;
}
</style>
