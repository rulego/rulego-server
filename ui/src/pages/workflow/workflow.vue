<script lang="js" setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { cloneDeep, findKey, uniqBy } from 'lodash-es';
import { ElMessage } from 'element-plus';
import * as Api from '@src/api';
import { WORKFLOW_MENU_KEY } from '@src/constant/workflow';
import {
  ENDPOINTS_NODE_TYPE_KEYS,
  NODE_TYPE_MAP,
} from '@src/pages/workflow/app-design/constant';
import {
  generateSwitchNodeFormCasesValue,
  isEndpointNode,
  mapFlowDataModelToRuleGoModel,
} from '@src/pages/workflow/app-design/utils';
import AppManage from '@src/pages/workflow/app-manage/app-manage.vue';
import AppDesign from '@src/pages/workflow/app-design/app-design.vue';
import AppSourceCode from '@src/pages/workflow/app-source-code/app-source-code.vue';
import AppSplitScreen from '@src/pages/workflow/app-split-screen/app-split-screen.vue';

const router = useRouter();
const route = useRoute();

const appDesignRef = ref();
const appSplitScreenRef = ref();
const menuList = ref([
  {
    key: WORKFLOW_MENU_KEY.APP_MANAGE,
    label: '应用管理',
  },
  {
    key: WORKFLOW_MENU_KEY.APP_DESIGN,
    label: '应用设计',
  },
  {
    key: WORKFLOW_MENU_KEY.APP_SOURCE_CODE,
    label: '源码模式',
  },
  {
    key: WORKFLOW_MENU_KEY.APP_SPLIT_SCREEN,
    label: '分屏模式',
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

function generateRouters(data, endpointsNode) {
  const routers = [];

  const params = cloneDeep(bakValue.value);
  const id = params.ruleChain.id;

  const endpointsNodeAllEdges = data.edges.filter((item) => {
    return item.sourceNodeId === endpointsNode.id;
  });
  const pFormData = endpointsNode.properties.formData;
  const fRouters = pFormData.routers || [];
  fRouters.forEach((item) => {
    const edge = endpointsNodeAllEdges.find(
      (edge) => edge.sourceAnchorId === item.path,
    );
    const toPath = edge ? `${id}:${edge.targetNodeId}` : id;
    const newItem = {
      id: item.id,
      params: [],
      from: {
        path: item.path,
        configuration: null,
        processors: item.fromProcessors,
      },
      to: {
        path: toPath,
        configuration: null,
        wait: false,
        processors: item.toProcessors,
      },
    };
    routers.push(newItem);
  });
  return routers;
}

function handelDesignToJson(){
  appSplitScreenRef.value.handelDesignToJson();
}

function handelJsonToDesign(){
  appSplitScreenRef.value.handelJsonToDesign();
}



async function saveFlowHandler() {
  let ruleGoModel;

  if(menuActiveKey.value === WORKFLOW_MENU_KEY.APP_DESIGN){
    const flow = appDesignRef.value.getData();
    ruleGoModel = mapFlowDataModelToRuleGoModel(flow,bakValue.value);
  }
  else if(menuActiveKey.value === WORKFLOW_MENU_KEY.APP_SOURCE_CODE){
    ruleGoModel = flowData.value;
  }
  else if(menuActiveKey.value === WORKFLOW_MENU_KEY.APP_SPLIT_SCREEN){
    ruleGoModel = flowData.value;
  }

  if(!ruleGoModel) {
    ElMessage.error('请先设计应用');
    return;
  }
  const id = ruleGoModel.ruleChain.id;
  await Api.setRules(id, ruleGoModel);
  await refreshFormState();

  ElMessage.success('保存成功');
}

function openDrawerHandler() {
  appDesignRef.value.openDrawer();
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
        <template v-if="menuActiveKey === WORKFLOW_MENU_KEY.APP_DESIGN">
          <el-button icon="el-icon-video-play" @click="openDrawerHandler">测试</el-button>
          <el-button icon="el-icon-setting" type="primary" @click="saveFlowHandler">保存</el-button>
        </template>
        <template v-if="menuActiveKey === WORKFLOW_MENU_KEY.APP_SOURCE_CODE">
          <div class="flex flex-row justify-end">
            <el-button icon="el-icon-upload-filled" type="primary" @click="saveFlowHandler">保存代码</el-button>
          </div>
        </template>
        <template v-if="menuActiveKey === WORKFLOW_MENU_KEY.APP_SPLIT_SCREEN">
          <div class="flex flex-row justify-end">
            <el-button @click="handelDesignToJson" type="primary">图->json</el-button>
            <el-button @click="handelJsonToDesign" type="primary">图<-json</el-button>
            <el-tooltip
              class="box-item"
              effect="dark"
              content="只会保存json,请把图同步到json中"
              placement="left"
            >
              <el-button icon="el-icon-upload-filled" type="primary" @click="saveFlowHandler">保存代码</el-button>
            </el-tooltip>
          </div>
        </template>
      </div>
    </div>
    <div class="flex-grow overflow-auto">
      <!-- 应用管理 -->
      <app-manage v-if="menuActiveKey === WORKFLOW_MENU_KEY.APP_MANAGE"
        :base-info-form-state="formState.baseInfoFormState" :variable-state="formState.variableState"
        @save="saveHandler"></app-manage>
      <!-- 应用设计 -->
      <app-design ref="appDesignRef" v-if="menuActiveKey === WORKFLOW_MENU_KEY.APP_DESIGN"
        :flow-data="flowData"></app-design>
      <!--源码模式-->
      <app-source-code v-model="flowData" v-if="menuActiveKey === WORKFLOW_MENU_KEY.APP_SOURCE_CODE" />
      <!-- 分屏模式 -->
      <app-split-screen ref="appSplitScreenRef" v-if="menuActiveKey === WORKFLOW_MENU_KEY.APP_SPLIT_SCREEN" v-model="flowData" />
    </div>
  </div>
</template>

<style scoped>
.workflow-menu {
  border-bottom: none;
}
</style>
