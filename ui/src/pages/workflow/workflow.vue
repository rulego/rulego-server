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
} from '@src/pages/workflow/app-design/utils';
import AppManage from '@src/pages/workflow/app-manage/app-manage.vue';
import AppDesign from '@src/pages/workflow/app-design/app-design.vue';

const router = useRouter();
const route = useRoute();

const appDesignRef = ref();
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

async function saveFlowHandler() {
  if (!appDesignRef.value) return;
  const data = appDesignRef.value.getData();

  const params = cloneDeep(bakValue.value);
  const id = params.ruleChain.id;

  const endpointsNodeIndex = data.nodes.findIndex((item) => {
    return isEndpointNode(item.type, item.properties?.rawNodeType);
  });
  console.info(endpointsNodeIndex);
  const endpointsNode = data.nodes[endpointsNodeIndex];
  if (endpointsNodeIndex !== -1) {
    params.metadata.endpoints = [endpointsNode] || [];
    params.metadata.endpoints = params.metadata.endpoints.map((item) => {
      let type = findKey(NODE_TYPE_MAP, (o) => o === item.type);
      if (!type) {
        type = item.properties?.rawNodeType;
      }
      const formData = item.properties.formData;
      const routers = generateRouters(data, item);
      let nodeData = {
        id: item.id,
        type,
        name: formData.title || formData.additionalInfo?.title,
        debugMode: false,
        routers,
        configuration: cloneDeep(formData),
        additionalInfo: {
          description:
            formData.description || formData.additionalInfo?.description,
          layoutX: item.x,
          layoutY: item.y,
          width: item.properties.width,
          height: item.properties.height,
          icon: '',
          background: '',
        },
      };
      delete nodeData.configuration.additionalInfo;
      delete nodeData.configuration.routers;
      return nodeData;
    });
    data.nodes.splice(endpointsNodeIndex, 1);
  }

  let startNode = cloneDeep(endpointsNode);

  if (!endpointsNode) {
    startNode = data.nodes.find((item) => item.type === 'start');
  }

  params.ruleChain.additionalInfo.layoutX = startNode.x;
  params.ruleChain.additionalInfo.layoutY = startNode.y;
  params.ruleChain.additionalInfo.width = startNode.properties.width;
  params.ruleChain.additionalInfo.height = startNode.properties.height;
  params.ruleChain.additionalInfo.title = startNode.properties.formData.title;

  const startEdge = data.edges.find((item) => item.sourceNodeId === 'start');
  if (startEdge) {
    const firstNodeIndex = data.nodes.findIndex(
      (item) => item.id === startEdge.targetNodeId,
    );
    const firstNode = cloneDeep(data.nodes[firstNodeIndex]);
    data.nodes.slice(firstNodeIndex, 1);
    data.nodes.unshift(firstNode);
  }
  const nodes = data.nodes.filter((item) => item.id !== 'start');
  const edges = data.edges.filter((item) => item.sourceNodeId !== 'start');

  params.metadata.nodes = nodes.map((item) => {
    const type =
      findKey(NODE_TYPE_MAP, (o) => o === item.type) ||
      item?.properties?.rawNodeType;
    const formData = cloneDeep(item.properties.formData);
    if (formData.routers) {
      delete formData.routers;
    }
    if (type === 'switch') {
      formData.cases = generateSwitchNodeFormCasesValue(formData.cases);
      formData.cases = formData.cases.filter((item) => item.case);
    }
    let newNode = {
      id: item.id,
      type,
      name: formData.title || formData.additionalInfo?.title,
      debugMode: false,
      configuration: formData,
      additionalInfo: {
        description:
          formData.description || formData.additionalInfo?.description,
        layoutX: item.x,
        layoutY: item.y,
        width: item.properties.width,
        height: item.properties.height,
        icon: '',
        background: '',
      },
    };

    if (item.type === 'msg-type-switch') {
      newNode.additionalInfo.routers =
        item?.properties?.formData?.routers || [];
    }
    delete newNode.configuration.additionalInfo;
    return newNode;
  });
  params.metadata.nodes = uniqBy(params.metadata.nodes, 'id');
  params.metadata.connections = uniqBy(
    edges,
    (item) =>
      `${item.sourceNodeId}-${item.sourceAnchorId}-${item.targetNodeId}-${item.targetAnchorId}`,
  ).map((item) => {
    const text = item?.text?.value || '';
    return {
      fromId: item.sourceNodeId,
      toId: item.targetNodeId,
      type: item.sourceAnchorId,
      label: text,
    };
  });

  await Api.setRules(id, params);
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
    <div
      class="flex flex-none items-center border-b border-[var(--el-border-color)]"
    >
      <div class="flex-none pl-2">
        <el-button
          icon="el-icon-arrow-left-bold"
          :text="true"
          @click="exitHandler"
        >
          退出
        </el-button>
      </div>
      <el-divider direction="vertical" />
      <div class="flex-none">
        <el-menu
          class="workflow-menu"
          :default-active="menuActiveKey"
          mode="horizontal"
          :ellipsis="false"
          @select="menuSelectHandler"
        >
          <el-menu-item
            v-for="item in menuList"
            :key="item.key"
            :index="item.key"
          >
            {{ item.label }}
          </el-menu-item>
        </el-menu>
      </div>
      <div class="flex flex-grow items-center justify-center overflow-auto">
        {{ bakValue?.ruleChain?.name || '应用名称' }}
      </div>
      <div class="w-[204px] flex-none px-4">
        <template v-if="menuActiveKey === WORKFLOW_MENU_KEY.APP_DESIGN">
          <el-button icon="el-icon-video-play" @click="openDrawerHandler"
            >测试</el-button
          >
          <el-button
            icon="el-icon-setting"
            type="primary"
            @click="saveFlowHandler"
            >保存</el-button
          >
        </template>
      </div>
    </div>
    <div class="flex-grow overflow-auto">
      <!-- 应用管理 -->
      <app-manage
        v-if="menuActiveKey === WORKFLOW_MENU_KEY.APP_MANAGE"
        :base-info-form-state="formState.baseInfoFormState"
        :variable-state="formState.variableState"
        @save="saveHandler"
      ></app-manage>
      <!-- 应用设计 -->
      <app-design
        ref="appDesignRef"
        v-if="menuActiveKey === WORKFLOW_MENU_KEY.APP_DESIGN"
        :flow-data="flowData"
      ></app-design>
    </div>
  </div>
</template>

<style scoped>
.workflow-menu {
  border-bottom: none;
}
</style>
