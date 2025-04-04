<script lang="js" setup>
import { nextTick, onMounted, onBeforeUnmount, ref } from 'vue';
import { useResizeObserver, watchPausable } from '@vueuse/core';
import { cloneDeep, isEmpty, isUndefined, merge, unionBy } from 'lodash-es';
import { nanoid } from 'nanoid';
import EventBus from '@src/utils/event-bus';
import {
  isEndpointNode,
  convertNodeType,
  generateComponentList,
  generateDefaultPropertiesStatus,
  generateFormFields,
  generateStaticFormFields,
  generateStaticFormData,
} from '@src/pages/workflow/app-design/utils';
import {
  NODE_DEFAULT_HEIGHT,
  NODE_DEFAULT_WIDTH,
  NODE_TYPE_MAP,
} from '@src/pages/workflow/app-design/constant';
import { nodeUtils } from '@src/utils/flow-utils';
import { locales } from '@src/constant/node-component-data';
import FlowView from '@src/pages/workflow/app-design/flow-view.vue';
import RunDrawer from '@src/pages/workflow/app-design/run-drawer/run-drawer.vue';
import NodeList from '@src/pages/workflow/app-design/node-list/node-list.vue';
import NodeForm from '@src/pages/workflow/app-design/node-form/node-form.vue';

const props = defineProps({
  flowData: {
    type: Object,
    default: () => ({}),
  },
});

const closeNodeFormBus = EventBus.closeNodeForm();
const showNodeMenuBus = EventBus.showNodeMenu();
const changeFlowNodeBus = EventBus.changeFlowNode();
const refreshNodeLogBus = EventBus.refreshNodeLog();
const clearNodeFormValidateBus = EventBus.clearNodeFormValidate();

const flowViewRef = ref();
const containerRef = ref();
const nodeListRef = ref();
const nodeFormRef = ref();
const runDrawerRef = ref();
const EXTEND_NODE_TYPE_MAP = {
  ...NODE_TYPE_MAP,
  start: 'start',
};
const menuListX = ref(0);
const menuListY = ref(0);
const menuList = ref({});
const bakMenuList = ref({});
const addType = ref('anchor'); // anchor | next | change-node
const currentAnchorId = ref(null);
const containerReact = ref({
  width: 0,
  height: 0,
});
const nodes = ref([]);
const edges = ref([]);
const formData = ref({});
const fields = ref({
  // name: {
  //   label: '姓名',
  //   component: 'input',
  //   componentProps: {
  //     type: 'textarea',
  //     placeholder: '请输入您的大名',
  //   },
  //   rules: [{ required: true, message: '姓名不能为空' }],
  // },
  // age: {
  //   label: '年龄',
  //   component: 'number',
  //   disabled: () => !formData.value.name,
  // },
  // sex: {
  //   label: '性别',
  //   component: 'select',
  //   hidden: () => !formData.value.name,
  // },
});
const nextNodes = ref([]);
const selectedNodeModel = ref(undefined);
const anchorCanConnectOnlyOneNode = ref(false);
const { pause, resume } = watchPausable(
  () => formData.value,
  () => {
    if (flowViewRef.value) {
      flowViewRef.value.updateSelectedNodePropertiesFormData(
        cloneDeep(formData.value),
      );
    }
  },
  { deep: true },
);

async function initMenuList() {
  menuList.value = await generateComponentList();
  bakMenuList.value = cloneDeep(menuList.value);
}

function generateStartMenuItem() {
  return {
    start: {
      background: '#ffffff',
      label: '开始',
      nodeType: 'simple-node',
      components: [
        {
          type: 'start',
          category: 'start',
          fields: null,
          label: '开始',
          desc: '开始节点。',
          icon: '/images/comment.svg',
          background: '#f1928f',
          notInput: true,
          notOutput: false,
          nodeType: 'comment-node',
        },
      ],
    },
  };
}

function clearFlowData() {
  nodes.value = [];
  edges.value = [];
  flowViewRef.value?.getLf().clearData();
}

function generateFlowData() {
  if (!flowViewRef.value) return;

  // 接口请求的数据
  const userData = cloneDeep(props.flowData);
  let tNodes = [];
  let tEdges = [];

  // 转换逻辑

  let ruleChainAdditionalInfo = {};
  //规则链Id名称等数据
  if (userData.ruleChain) {
    ruleChainAdditionalInfo = userData.ruleChain.additionalInfo || {};
  }
  //默认数据
  let initData = {
    //开始节点ID
    startNodeId: 'start',
    startNodeText: '开始',
    startNodeType: 'start',
    nodeCount: 0,
    edgeCount: 0,
    nodeWidth: 200,
  };
  //开始节点
  const options = {
    startX: 280,
    startY: 280,
  };
  let referenceX =
    parseInt(ruleChainAdditionalInfo.layoutX || options.startX) ||
    options.startX;
  let referenceY =
    parseInt(ruleChainAdditionalInfo.layoutY || options.startY) ||
    options.startY;
  let hasEndpoint = userData?.metadata?.endpoints?.length > 0;
  //如果没有endpoint节点，添加start固定节点
  if (!hasEndpoint) {
    tNodes.push({
      id: initData.startNodeId,
      type: initData.startNodeType,
      x: referenceX,
      y: referenceY,
      text: initData.startNodeText,
    });
  }

  //第一个普通节点(非endpoint节点)
  let firstNode = null;
  //最大节点Id序号
  let maxNodeIdSeq = 0;
  let firstNodeIndex =
    (userData.metadata && userData.metadata.firstNodeIndex) || 0;
  //转换节点
  if (userData && userData.metadata && userData.metadata.nodes) {
    userData.metadata.nodes.forEach((item, index) => {
      initData.nodeCount++;
      //获取节点类型
      let nodeType = item.type;

      if (firstNodeIndex === index) {
        firstNode = item;
      }
      referenceX = referenceX + 150;
      let additionalInfo = item.additionalInfo || {};
      let x = additionalInfo.layoutX || referenceX;
      let y = additionalInfo.layoutY || referenceY;

      tNodes.push({
        id: item.id,
        type: nodeType,
        x: x,
        y: y,
        text: item.name,
        properties: {
          // view: nodeComponents[item.type],
          model: item,
        },
      });
    });
  }
  //转换输入端节点
  if (hasEndpoint) {
    userData.metadata.endpoints.forEach((item, index) => {
      referenceX = referenceX + 150;
      let additionalInfo = item.additionalInfo || {};
      let x = additionalInfo.layoutX || referenceX;
      let y = additionalInfo.layoutY || referenceY;
      tNodes.push({
        id: item.id,
        type: item.type,
        x: x,
        y: y,
        text: item.name,
        properties: {
          // view: nodeComponents[item.type],
          model: item,
        },
      });
    });
  }
  //输入端节点连接列表
  let endpointConnections = [];
  //如果没有endpoint节点，添加start节点和第一个节点连线
  if (!hasEndpoint && firstNode) {
    endpointConnections = [
      { fromId: initData.startNodeId, toId: firstNode.id },
    ];
  }

  //处理输入端节点连线
  if (userData.metadata && userData.metadata.endpoints) {
    userData.metadata.endpoints.forEach((item, index) => {
      endpointConnections = endpointConnections.concat(
        getEndpointConnections(item.id, item, firstNode),
      );
    });
  }

  let connections = endpointConnections;
  //转换其他节点边连线
  if (userData && userData.metadata && userData.metadata.connections) {
    connections = connections.concat(userData.metadata.connections);
  }
  //渲染边
  connections.forEach((item) => {
    initData.edgeCount++;
    let edge = createEdge(initData, tNodes, item);
    tEdges.push(edge);
  });

  tNodes = tNodes.map((item) => {
    return generateFlowNode(item, connections);
  });

  tEdges = tEdges.map((item) => {
    return generateFlowEdge(item);
  });

  nodes.value = tNodes;
  edges.value = tEdges;

  flowViewRef.value.lfRender();
}
//创建边
function createEdge(initData, nodes, item) {
  let edge = {
    id: 'edge_' + initData.edgeCount,
    type: 'custom-bezier',
    sourceNodeId: item.fromId,
    targetNodeId: item.toId,
    startPoint: {},
    endPoint: {},
    text: item.label || '',
    properties: {
      model: { ...item },
    },
  };
  let sourceNode = getNodeByID(nodes, edge.sourceNodeId);
  let targetNode = getNodeByID(nodes, edge.targetNodeId);
  if (sourceNode) {
    edge.startPoint.x = sourceNode.x + initData.nodeWidth / 2;
    edge.startPoint.y = sourceNode.y;
  }
  if (targetNode) {
    edge.endPoint.x = targetNode.x - initData.nodeWidth / 2 - 10;
    edge.endPoint.y = targetNode.y;
  }
  return edge;
}
//通过id查找节点
function getNodeByID(nodes, id) {
  let node = {};
  if (nodes) {
    nodes.forEach((item) => {
      if (item.id === id) {
        node = item;
      }
    });
  }
  return node;
}
//获取endpoint连线
function getEndpointConnections(fromId, endpointModel, firstNode) {
  let connections = [];
  if (!firstNode) {
    return [];
  }
  if (endpointModel.routers && endpointModel.routers.length > 0) {
    endpointModel.routers.forEach((item) => {
      if (item.to && item.to.path) {
        //格式:chainId:nodeId1:nodeId2:nodeId3
        let values = item.to.path.split(':');
        let path = toFromPath(item).trim();
        if (values.length <= 1) {
          connections.push({
            fromId: fromId,
            toId: firstNode.id,
            routerId: item.id,
            nodeType: 'endpoint-node',
            type: path,
          });
        } else {
          //从1开始遍历节点ID
          for (let i = 1; i < values.length; i++) {
            connections.push({
              fromId: fromId,
              toId: values[i].trim(),
              nodeType: 'endpoint-node',
              routerId: item.id,
              type: path,
            });
          }
        }
      }
    });
  }
  return connections;
}

function toFromPath(item) {
  if (!item.from) {
    return '';
  }
  let params = item.params ? item.params.join(' ') : '';
  return params + ' ' + (item.from && item.from.path);
}

function findComponentByType(type) {
  if (isEmpty(menuList.value)) {
    return undefined;
  }
  const allComponents = Object.keys(menuList.value)
    .map((key) => {
      return menuList.value[key]?.components || [];
    })
    .flat();
  const component = allComponents.find((item) => item.type === type);
  return component;
}

function generateFlowNode(config, connections) {
  const configType = config.type;
  const configAdditionalInfo = config?.properties?.model?.additionalInfo || {};
  const configConfiguration = config?.properties?.model?.configuration || {};
  let routers = config?.properties?.model?.routers || [];
  const configName = config.text;
  let flowNodeType = convertNodeType(configType);
  let flowNodeX = config.x || 0;
  let flowNodeY = config.y || 0;
  if (configType !== 'start') {
    flowNodeX = configAdditionalInfo.layoutX
      ? Number(configAdditionalInfo.layoutX)
      : 0;
    flowNodeY = configAdditionalInfo.layoutY
      ? Number(configAdditionalInfo.layoutY)
      : 0;
  }

  if (!flowNodeType) return undefined;

  const defaultNode = findComponentByType(configType);
  let defaultNodeForm = generateFormData(defaultNode);
  // defaultNodeForm = merge(defaultNodeForm, configConfiguration);
  defaultNodeForm = configConfiguration;
  // defaultNodeForm.title = configName;
  defaultNodeForm.additionalInfo = configAdditionalInfo || {};
  defaultNodeForm.additionalInfo.title =
    config?.properties?.model?.name || configName;

  let defaultNodeFields = generateFormFields(defaultNode?.fields);
  defaultNodeFields = generateStaticFormFields(
    defaultNodeFields,
    config,
    defaultNode,
  );
  let defaultAnchors = generateStaticAnchors(defaultNode);
  routers = routers.map((item) => {
    return {
      id: item.id,
      path: item.from.path,
      fromProcessors: item.from.processors,
      toProcessors: item.to.processors,
    };
  });

  const flowNode = {
    id: config.id,
    type: flowNodeType,
    properties: {
      formData: { ...defaultNodeForm },
      fields: defaultNodeFields,
      nextNodes: [],
      anchors: defaultAnchors,
      status: generateDefaultPropertiesStatus(),
      width: configAdditionalInfo.width || NODE_DEFAULT_WIDTH,
      height: configAdditionalInfo.height || NODE_DEFAULT_HEIGHT,
      rawNodeType: configType,
    },
    width: configAdditionalInfo.width || NODE_DEFAULT_WIDTH,
    height: configAdditionalInfo.height || NODE_DEFAULT_HEIGHT,
    x: flowNodeX,
    y: flowNodeY,
  };
  if (flowNodeType) {
    flowNode.properties.formData = {
      ...flowNode.properties.formData,
      routers,
    };
  } else {
    delete flowNode.properties.formData.routers;
  }

  if (flowNodeType === 'msg-type-switch') {
    const msgTypeSwitchConnections = (connections || []).filter((item) => {
      return item.fromId === flowNode.id;
    });
    const msgTypeSwitchAnchors = msgTypeSwitchConnections.map((item) => {
      return {
        id: item.type,
        type: 'output',
        name: item.type,
        isStatic: false,
        top: 0,
      };
    });
    let routers = msgTypeSwitchConnections.map((item) => item.type);
    routers = unionBy(routers);
    routers = configAdditionalInfo?.routers || routers;
    flowNode.properties.anchors = msgTypeSwitchAnchors;
    flowNode.properties.formData.routers = routers;
  }

  if (flowNodeType === 'switch') {
    flowNode.properties.anchors.push({
      x: 0,
      y: 0,
      id: 'Default',
      type: 'output',
      name: 'Default',
      isStatic: true,
    });
    flowNode.properties.formData.cases = generateSwitchNodeFormValue(
      flowNode?.properties?.formData?.cases || [],
    );
  }

  return flowNode;
}

function generateFlowEdge(config) {
  const id = config.id || `edge:${nanoid()}`;
  const type = config?.properties?.model?.type;
  const sourceNodeId = config.sourceNodeId;
  const sourceAnchorId = type;
  const targetNodeId = config.targetNodeId;
  const targetAnchorId = `${targetNodeId}_input`;
  return {
    id,
    type: 'custom-bezier',
    sourceNodeId,
    sourceAnchorId,
    targetNodeId,
    targetAnchorId,
    text: config.text,
  };
}

function anchorClickHandler({ clientX, clientY }) {
  addType.value = 'anchor';
  let m = cloneDeep(bakMenuList.value);
  Object.keys(m).forEach((key) => {
    m[key].components = m[key].components.filter(
      (comp) =>
        !comp.disabled &&
        comp.nodeType !== 'endpoint-node' &&
        comp.nodeType !== 'comment-node',
    );
  });

  menuList.value = m;
  delete menuList.value.endpoints;
  menuListX.value = clientX;
  menuListY.value = clientY;
  showNodeList();
}

function flowNodeUpdateNodePropertiesHandler(data) {
  pause();
  anchorCanConnectOnlyOneNode.value =
    data?.status?.anchorCanConnectOnlyOneNode || false;
  formData.value = data.formData;
  fields.value = data.fields;
  nextNodes.value = data.nextNodes;
  setTimeout(() => {
    resume();
  }, 0);
}

function hideNodeList() {
  if (nodeListRef.value) nodeListRef.value.hide();
}

function showNodeList() {
  if (nodeListRef.value) nodeListRef.value.show();
}

function generateSwitchNodeFormValue(val) {
  return val.map((item, index) => {
    let caseList = nodeUtils.expr2json(item.case);
    let then = item.then;
    caseList = caseList.map((item) => {
      return {
        id: nanoid(),
        value: item.map((cItem) => {
          return {
            ...cItem,
            id: nanoid(),
          };
        }),
      };
    });
    return {
      id: nanoid(),
      name: index > 0 ? 'ELSE IF' : 'IF',
      label: `${then || 'CASE ' + (index + 1)}`,
      caseList,
    };
  });
}

function generateFormData(config) {
  if (!config) return {};
  let form = {
    // title: config.label,
    additionalInfo: {
      title: config.label,
      description: '',
    },
  };
  (config.fields || []).forEach((field) => {
    let value = cloneDeep(field.defaultValue);
    form[field.name] = value;
  });

  return form;
}

function generateStaticAnchors(config) {
  let anchors = [];
  if (!config) return anchors;
  const relationTypes = config.relationTypes || [];
  relationTypes.forEach((relationType) => {
    return anchors.push({
      type: 'output',
      id: relationType.value,
      name: relationType.label,
      top: 0,
      isStatic: true,
    });
  });

  return anchors;
}

function nodeListSelectedHandler(item) {
  const nodeType = item.type;
  let form = generateFormData(item);
  form = generateStaticFormData(form, item);
  let fields = generateFormFields(item.fields);
  const nodeView = findComponentByType(nodeType);
  fields = generateStaticFormFields(fields, item, nodeView);
  let anchors = generateStaticAnchors(item);
  if (nodeFormRef.value) {
    nextTick(() => {
      clearNodeFormValidateBus.emit();
    });
  }

  if (nodeType === 'switch') {
    form.cases = generateSwitchNodeFormValue(form.cases);
  }
  let flowNodeType = convertNodeType(nodeType);
  const node = {
    type: flowNodeType,
    properties: {
      formData: { ...form },
      fields,
      nextNodes: [],
      anchors,
      rawNodeType: nodeType,
    },
  };

  if (isUndefined(node.type)) {
    node.type = 'dynamic-node';
  }

  if (addType.value === 'anchor') {
    flowViewRef.value.addNodeByAnchor(node);
  }

  if (addType.value === 'next' && currentAnchorId.value) {
    flowViewRef.value.addNodeByNext(node, currentAnchorId.value);
  }

  if (addType.value === 'change-node') {
    changeFlowNodeBus.emit(node);
  }
}

function setSelectedNodeModel(nodeModel) {
  selectedNodeModel.value = nodeModel;
  nextTick(() => {
    refreshNodeLogBus.emit();
  });
  setTimeout(() => {
    clearNodeFormValidateBus.emit();
  }, 0);
}

function nodeFormAddHandler({ data, event }) {
  addType.value = 'next';
  let m = cloneDeep(bakMenuList.value);

  Object.keys(m).forEach((key) => {
    m[key].components = m[key].components.filter(
      (comp) =>
        !comp.disabled &&
        comp.nodeType !== 'endpoint-node' &&
        comp.nodeType !== 'comment-node',
    );
  });

  menuList.value = m;
  delete menuList.value.endpoints;
  currentAnchorId.value = data.anchorId;
  menuListX.value = event.clientX;
  menuListY.value = event.clientY;
  showNodeList();
}

function nodeFormCloseHandler() {
  if (!flowViewRef.value) return;
  flowViewRef.value.unselectedNode();
  setSelectedNodeModel(undefined);
}

function showNodeMenuHandler(clientX, clientY) {
  addType.value = 'change-node';
  let m = cloneDeep(bakMenuList.value);
  Object.keys(m).forEach((key) => {
    m[key].components = m[key].components.filter(
      (comp) => !comp.disabled && comp.nodeType === 'endpoint-node',
    );
  });
  menuList.value = {
    ...generateStartMenuItem(),
    ...m,
  };
  menuListX.value = clientX;
  menuListY.value = clientY;
  showNodeList();
}

function getData() {
  if (!flowViewRef.value) {
    return {
      nodes: [],
      edges: [],
    };
  }
  return flowViewRef.value.lfGetGraphRawData();
}

closeNodeFormBus.on(nodeFormCloseHandler);
showNodeMenuBus.on(showNodeMenuHandler);

useResizeObserver(containerRef, (entries) => {
  const entry = entries[0];
  const { width, height } = entry.contentRect;
  containerReact.value.width = width;
  containerReact.value.height = height;
  hideNodeList();
});

function handleKeyDown(e) {
  // 只在编辑状态且有选中节点时处理
  if (!flowViewRef.value) return;

  if (e.key === 'Delete') {
    // const selectedNode = flowViewRef.value.getSelectedNode();
    // 不删除start节点或endpoint节点
    // if (
    //   selectedNode.type === 'start' ||
    //   isEndpointNode(selectedNode.type, selectedNode.properties?.rawNodeType)
    // ) {
    //   return;
    // }
    deleteSelects();
    // flowViewRef.value.deleteNode(flowViewRef.value.selectedNodeId);
  }
}
//删除选中的节点或者边
const deleteSelects = () => {
  const { nodes, edges } = flowViewRef.value.getLf().getSelectElements();
  if (edges) {
    edges.forEach((item) => {
      flowViewRef.value.getLf().deleteEdge(item.id);
    });
  }
  if (nodes) {
    nodes.forEach((item) => {
      if (
        item.type !== 'start' &&
        !isEndpointNode(item.type, item.properties?.rawNodeType)
      ) {
        flowViewRef.value.deleteNode(item.id);
      }
    });
  }
};
function handleAddComment({ x, y }) {
  if (!flowViewRef.value) return;

  // 获取Comment组件配置
  const item = locales.component.nodes.comment;

  let form = generateFormData(item);
  form = generateStaticFormData(form, item);
  let fields = generateFormFields(item.fields);
  fields = generateStaticFormFields(fields, item);
  let anchors = generateStaticAnchors(item);

  const node = {
    type: item.nodeType,
    x: x,
    y: y,
    properties: {
      formData: { ...form },
      fields,
      nextNodes: [],
      anchors,
    },
  };

  return flowViewRef.value.addCommentNode(node);
}

function openDrawer() {
  runDrawerRef.value.open();
}

function closeDrawer() {
  runDrawerRef.value.close();
}

onMounted(async () => {
  await initMenuList();
  generateFlowData();
  window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

defineExpose({
  getData,
  clearFlowData,
  generateFlowData,
  openDrawer,
  closeDrawer,
});
</script>

<template>
  <div class="relative h-full w-full overflow-hidden" ref="containerRef">
    <flow-view
      ref="flowViewRef"
      :nodes="nodes"
      :edges="edges"
      @anchorClick="anchorClickHandler"
      @update-node-properties="flowNodeUpdateNodePropertiesHandler"
      @selected="setSelectedNodeModel"
      @addComment="handleAddComment"
    ></flow-view>
    <node-list
      ref="nodeListRef"
      :rootReact="containerReact"
      :x="menuListX"
      :y="menuListY"
      :menu-list="menuList"
      @selected="nodeListSelectedHandler"
    ></node-list>
    <node-form
      v-if="selectedNodeModel"
      ref="nodeFormRef"
      :key="selectedNodeModel.id"
      :nodeType="selectedNodeModel.type"
      :model="formData"
      :fields="fields"
      :next-data="nextNodes"
      :anchor-can-connect-only-one-node="anchorCanConnectOnlyOneNode"
      :selected-node-id="selectedNodeModel.id"
      :chain-id="props.flowData?.ruleChain?.id"
      @add="nodeFormAddHandler"
    ></node-form>
    <run-drawer ref="runDrawerRef" :flow-data="props.flowData"></run-drawer>
  </div>
</template>
