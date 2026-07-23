<script lang="js" setup>
import { nextTick, onMounted, onBeforeUnmount, ref } from 'vue';
import { useResizeObserver, watchPausable } from '@vueuse/core';
import { cloneDeep, isUndefined } from 'lodash-es';
import { nanoid } from 'nanoid';
import EventBus from '@src/utils/event-bus';
import {
  isEndpointNode,
  convertNodeType,
  generateComponentList,
  generateFormData,
  findComponentByType,
  generateFormFields,
  generateStaticFormFields,
  generateStaticFormData,
  mapFlowDataModelToRuleGoModel,
  mapRuleGoModelToFlowDataModel,
  generateStaticAnchors,
} from '@src/pages/workflow/app-design/utils';
import { NODE_TYPE_MAP } from '@src/pages/workflow/app-design/constant';
import { nodeUtils } from '@src/utils/flow-utils';
import { locales } from '@src/constant/node-component-data';
import FlowView from '@src/pages/workflow/app-design/flow-view.vue';
import RunDrawer from '@src/pages/workflow/app-design/run-drawer/run-drawer.vue';
import NodeList from '@src/pages/workflow/app-design/node-list/node-list.vue';
import NodeForm from '@src/pages/workflow/app-design/node-form/node-form.vue';

/**
 * remark:ReversalMinute
 * Control is carried out in a data-driven manner
 */
const props = defineProps({
  /**
   * ruleGo model
   */
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});
/**
 * ruleGo model
 */
const emit = defineEmits(['update:modelValue']);

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
  //   label: 'Name',
  //   component: 'input',
  //   componentProps: {
  //     type: 'textarea',
  //     placeholder: 'Please enter your full name',
  //   },
  //   rules: [{ required: true, message: 'Name cannot be empty' }],
  // },
  // age: {
  //   label: 'Age',
  //   component: 'number',
  //   disabled: () => !formData.value.name,
  // },
  // sex: {
  //   label: 'Gender',
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
      label: 'Start',
      nodeType: 'simple-node',
      components: [
        {
          type: 'start',
          category: 'start',
          fields: null,
          label: 'Start',
          desc: 'Start node.',
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
  if (!flowViewRef.value) return;

  // Clear the data
  nodes.value = [];
  edges.value = [];
  flowViewRef.value.getLf().clearData();
}

function rerenderFlowData() {
  if (!flowViewRef.value) return;
  const userData = cloneDeep(props.modelValue);
  const { nodes: newNodes, edges: newEdges } = mapRuleGoModelToFlowDataModel(
    userData,
    menuList.value,
  );

  // Update local data, just like generateFlowData
  nodes.value = newNodes;
  edges.value = newEdges;

  // Use the same rendering method as generateFlowData
  flowViewRef.value.lfRender();
}

function generateFlowData() {
  if (!flowViewRef.value) return;

  // Data requested by the interface
  const userData = cloneDeep(props.modelValue);
  const { nodes: tNodes, edges: tEdges } = mapRuleGoModelToFlowDataModel(
    userData,
    menuList.value,
  );

  nodes.value = tNodes;
  edges.value = tEdges;

  flowViewRef.value.lfRender();
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
  handleEmitUpdate();
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

function nodeListSelectedHandler(item) {
  const nodeType = item.type;
  let form = generateFormData(item);
  form = generateStaticFormData(form, item);
  let fields = generateFormFields(item.fields);
  const nodeView = findComponentByType(nodeType, menuList.value);
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

/**
 * Obtain the logical flow model
 * @returns {{nodes: Array, edges: Array}} Returns logical flow model objects, which include node arrays and edge arrays
 */
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

/**
 * Distribute update events
 */
function handleEmitUpdate() {
  const logicFlowData = getData();
  const ruleGoData = mapFlowDataModelToRuleGoModel(
    logicFlowData,
    props.modelValue,
  );
  emit('update:modelValue', ruleGoData);
}

useResizeObserver(containerRef, (entries) => {
  const entry = entries[0];
  const { width, height } = entry.contentRect;
  containerReact.value.width = width;
  containerReact.value.height = height;
  hideNodeList();
});

function handleKeyDown(e) {
  // Processes only when edited and a selected node is present
  if (!flowViewRef.value) return;

  if (e.key === 'Delete') {
    // const selectedNode = flowViewRef.value.getSelectedNode();
    // Do not delete the start node or endpoint node
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
//Delete the selected node or edge
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

  // Obtain the Comment component configuration
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

function getLf() {
  return flowViewRef.value.getLf();
}

function render() {
  if (!flowViewRef.value) return;
  rerenderFlowData();
  flowViewRef.value.updateAllNodePropertiesHeight();
}

onMounted(async () => {
  await initMenuList();
  generateFlowData();
  window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
  handleEmitUpdate(); // Emit an update when the component is unmounted
});

defineExpose({
  getData,
  getLf,
  clearFlowData,
  generateFlowData,
  rerenderFlowData,
  openDrawer,
  closeDrawer,
  render,
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
    />
    <node-list
      ref="nodeListRef"
      :rootReact="containerReact"
      :x="menuListX"
      :y="menuListY"
      :menu-list="menuList"
      @selected="nodeListSelectedHandler"
    />
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
      :chain-id="props.modelValue?.ruleChain?.id"
      @add="nodeFormAddHandler"
    />
    <run-drawer ref="runDrawerRef" :flow-data="props.modelValue" />
  </div>
</template>
