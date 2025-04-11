<script lang="js" setup>
import { ref, onMounted, computed, onBeforeUnmount, nextTick } from 'vue';
import { nanoid } from 'nanoid';
import { cloneDeep, isBoolean, uniqBy } from 'lodash-es';
import { useMouse } from '@vueuse/core';
import LogicFlow from '@logicflow/core';
import { MiniMap, Menu } from '@logicflow/extension';
import { register } from '@logicflow/vue-node-registry';
import { ElMessage } from 'element-plus';
import flowNodes from '@src/pages/workflow/app-design/flow-node';
import CustomBezierEdge from '@src/pages/workflow/app-design/flow-edge/custom-bezier';
import EventBus from '@src/utils/event-bus';
import {
  ENDPOINTS_NODE_TYPE_KEYS,
  ONLY_ONE_NEXT_NODES_TYPE_KEYS,
} from '@src/pages/workflow/app-design/constant';
import {
  isEndpointNode,
  generateSwitchNodeFormCasesValue,
} from '@src/pages/workflow/app-design/utils';

const props = defineProps({
  nodes: {
    type: Array,
    default: () => [],
  },
  edges: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits([
  'anchorClick',
  'selected',
  'updateNodeProperties',
  'addComment',
  'mouseup',
]);

const closeNodeFormBus = EventBus.closeNodeForm();
const showNodeMenuBus = EventBus.showNodeMenu();
const changeFlowNodeBus = EventBus.changeFlowNode();
const jumpToNodeBus = EventBus.jumpToNode();
const deleteFlowNodeByIdBus = EventBus.deleteFlowNodeById();
const logicflowNodeMouseUp = EventBus.logicflowNodeMouseUp();

let lf = null;
let miniMapOptions = {
  width: 107,
  height: 72,
  leftPosition: 16,
  bottomPosition: 16,
};
const flowContainerRef = ref();
const selectedNodeId = ref('');
const addNodeData = ref();
// 触发[变更节点]需要的数据
const changeNodeState = ref({
  oldNode: undefined,
});
const flowData = computed(() => {
  return {
    nodes: props.nodes,
    edges: props.edges,
  };
});
const { x: mouseX, y: mouseY } = useMouse();

function setSelectedNodeId(id) {
  selectedNodeId.value = id;
}

/**
 * Handles an event with the provided data.
 *
 * @param {{data:any,e:Event}} evt - The data associated with the event.
 */
function handleMouseup(evt) {
  logicflowNodeMouseUp.emit(evt);
  emit('mouseup', evt);
}

function flowNodeClickHandler({ data }) {
  if (data.type === 'comment-node') {
    updateNodePropertiesStatusIsSelectedById(data.id, true);
    return;
  }

  updateNodePropertiesNextNodesById(data.id);
  updateNodePropertiesStatusIsSelectedById(selectedNodeId.value, false);
  setSelectedNodeId(data.id);
  updateNodePropertiesStatusIsSelectedById(data.id, true);
  emitUpdateNodeProperties(data.id);
  emit('selected', lf.getNodeModelById(data.id));
}

function updateSelectedNodePropertiesNextNodes() {
  if (!selectedNodeId.value) return;
  updateNodePropertiesNextNodesById(selectedNodeId.value);
  emitUpdateNodeProperties(selectedNodeId.value);
}

function emitUpdateNodeProperties(nodeId) {
  const model = lf.getNodeModelById(nodeId);
  if (model) {
    emit('updateNodeProperties', cloneDeep(model.properties));
  }
}

function flowAnchorClickHandler({ clientX, clientY, model, anchorId }) {
  addNodeData.value = {
    sourceModel: model,
    sourceAnchorId: anchorId,
  };
  // 判断节点是否只能有一个下级节点相关处理
  updateNodePropertiesNextNodesById(model.id);
  const newModel = lf.getNodeModelById(model.id);
  const anchorCanConnectOnlyOneNode =
    newModel.properties?.status?.anchorCanConnectOnlyOneNode || false;
  const totalEdges = lf
    .getEdgeModels({
      sourceNodeId: model.id,
    })
    .filter((item) => {
      return item.sourceAnchorId === anchorId;
    });

  // 如果节点只能有一个下级节点，且已经有下级节点，不允许触发 anchorClick 事件
  if (anchorCanConnectOnlyOneNode && totalEdges.length > 0) {
    ElMessage({
      message: '该锚点只能有一个下级节点',
      type: 'warning',
    });
    return;
  }
  emit('anchorClick', { clientX, clientY });
}

function flowAnchorDropHandler() {
  updateSelectedNodePropertiesNextNodes();
}

/**
 * @description 根据 id 计算节点高度
 * @param nodeId string
 * @param move boolean 是否进行节点矫正
 */
function updateNodePropertiesHeightById(nodeId, move = true) {
  const model = lf.getNodeModelById(nodeId);
  const rootEl = model.graphModel.rootEl;
  const oHeight = model.height;
  if (rootEl) {
    setTimeout(() => {
      // Info: 克隆节点放到 body 里边，防止 logicflow 缩放时影响节点高度计算
      let containerParentEl = rootEl.querySelector(`#${nodeId}`);

      if (!containerParentEl) return;
      containerParentEl = containerParentEl.cloneNode(true);
      const containerEl = containerParentEl.children[0];
      if (!containerEl) {
        console.error('自定义节点 HTML 结构不正确');
        return;
      }
      containerParentEl.removeAttribute('id');
      containerParentEl.style.position = 'fixed';
      containerParentEl.style.top = '0';
      containerParentEl.style.left = '0';
      containerParentEl.style.backgroundColor = 'red';
      document.body.appendChild(containerParentEl);

      const { height } = containerEl.getBoundingClientRect();

      containerParentEl.remove();

      // 2 * 2 为上下边框的高度
      let nHeight = height + 2 * 2;

      lf.setProperties(nodeId, {
        height: nHeight,
      });

      if (move) {
        if (oHeight > nHeight) {
          model.move(0, (nHeight - oHeight) / 2);
        } else {
          model.move(0, -((oHeight - nHeight) / 2));
        }
      }
    }, 0);
  }
}

/**
 * @description 根据 id 生成节点[下一步]的数据
 * @param nodeId string
 */
function updateNodePropertiesNextNodesById(nodeId) {
  if (!lf || !nodeId) return;
  const model = lf.getNodeModelById(nodeId);
  const nodes = uniqBy(lf.getNodeOutgoingNode(nodeId), 'id');
  const edges = lf.getNodeOutgoingEdge(nodeId);
  const outputAnchors = model.anchors.filter((item) => item.type === 'output');

  let nextNodes = [];
  outputAnchors.forEach((anchor) => {
    const item = {
      anchorId: anchor.id,
      anchorTitle: '',
    };
    nextNodes.push(item);
  });

  nextNodes = nextNodes.map((item) => {
    const tempEdges = edges.filter(
      (edge) => edge.sourceAnchorId === item.anchorId,
    );
    const tempEdgesTargetNodeId = tempEdges.map((edge) => edge.targetNodeId);
    const tempNodes = nodes
      .filter((node) => tempEdgesTargetNodeId.includes(node.id))
      .map((node) => {
        return {
          nodeId: node.id,
          nodeTitle:
            node.properties?.formData?.title ||
            node.properties?.formData?.additionalInfo?.title ||
            '未命名',
        };
      });

    return {
      ...item,
      nodes: tempNodes,
    };
  });

  const properties = lf.getProperties(nodeId);
  lf.setProperties(nodeId, {
    nextNodes,
    status: {
      ...properties.status,
      anchorCanConnectOnlyOneNode: ONLY_ONE_NEXT_NODES_TYPE_KEYS.includes(
        model.type,
      ),
    },
  });
}

/**
 * @description 根据 id 更新节点的 properties.formData 数据
 * @param nodeId string
 * @param data object
 */
function updateNodePropertiesFormData(nodeId, data) {
  if (!lf || !data || !nodeId) return;
  lf.setProperties(nodeId, {
    formData: {
      ...data,
    },
  });
}

/**
 * @description 根据 id 计算节点锚点的 Y 值
 * @param nodeId string
 */
function updateNodePropertiesAnchorsYById(nodeId) {
  const model = lf.getNodeModelById(nodeId);
  const properties = model.properties;
  const rootEl = model.graphModel.rootEl;
  if (rootEl) {
    setTimeout(() => {
      // Info: 克隆节点放到 body 里边，防止 logicflow 缩放时影响节点高度计算
      let containerParentEl = rootEl.querySelector(`#${nodeId}`);

      if (!containerParentEl) return;
      containerParentEl = containerParentEl.cloneNode(true);
      containerParentEl.removeAttribute('id');
      containerParentEl.style.position = 'fixed';
      containerParentEl.style.top = '0';
      containerParentEl.style.left = '0';
      document.body.appendChild(containerParentEl);

      const anchorItems = containerParentEl.querySelectorAll('.anchor-item');
      const newAnchors = cloneDeep(properties.anchors);
      anchorItems.forEach((item) => {
        const anchorId = item.getAttribute('data-id');
        const anchor = newAnchors.find((anchor) => anchor.id === anchorId);
        if (anchor) {
          anchor.top = item.offsetTop;
        }
      });

      lf.setProperties(nodeId, {
        anchors: newAnchors,
      });

      containerParentEl.remove();
    }, 0);
  }
}

/**
 * @description 根据 id 更新节点 properties.status.isSelected
 * @param id string
 * @param isSelected boolean
 */
function updateNodePropertiesStatusIsSelectedById(id, isSelected) {
  if (!lf || !id || !isBoolean(isSelected)) return;
  const properties = lf.getProperties(id);
  lf.setProperties(id, {
    status: {
      ...properties.status,
      isSelected,
    },
  });
}

const updateNodePropertiesAnchorsMap = {
  endpoint: function (lf, id) {
    const properties = lf.getProperties(id);
    const formDataRoutes = properties?.formData?.routers || [];
    const staticAnchors =
      cloneDeep(
        properties?.anchors?.filter((item) => {
          return item.isStatic;
        }),
      ) || [];
    const newAnchors = [...staticAnchors];

    // 删除连接旧动态锚点的边
    const oldDynamicAnchors =
      cloneDeep(
        properties?.anchors?.filter((item) => {
          return !item.isStatic;
        }),
      ) || [];
    const allEdges = lf.getNodeEdges(id);
    if (oldDynamicAnchors.length > formDataRoutes.length) {
      oldDynamicAnchors.forEach((item) => {
        if (!formDataRoutes.find((route) => route.id === item.id)) {
          const edge = allEdges.find((edge) => edge.sourceAnchorId === item.id);
          if (edge) {
            lf.deleteEdge(edge.id);
          }
        }
      });
    }

    formDataRoutes.forEach((item) => {
      newAnchors.push({
        id: item.path,
        isStatic: false,
        name: item.path,
        top: 0,
        type: 'output',
      });
    });

    lf.setProperties(id, {
      anchors: newAnchors,
    });
  },
  'msg-type-switch': function (lf, id) {
    const properties = lf.getProperties(id);
    const formDataRoutes = properties?.formData?.routers || [];
    const staticAnchors =
      cloneDeep(
        properties?.anchors?.filter((item) => {
          return item.isStatic;
        }),
      ) || [];
    const newAnchors = [...staticAnchors];

    // 删除连接旧动态锚点的边
    const oldDynamicAnchors =
      cloneDeep(
        properties?.anchors?.filter((item) => {
          return !item.isStatic;
        }),
      ) || [];
    const allEdges = lf.getNodeEdges(id);
    if (oldDynamicAnchors.length > formDataRoutes.length) {
      oldDynamicAnchors.forEach((item) => {
        if (!formDataRoutes.find((route) => route.id === item.id)) {
          const edge = allEdges.find((edge) => edge.sourceAnchorId === item.id);
          if (edge) {
            lf.deleteEdge(edge.id);
          }
        }
      });
    }

    formDataRoutes.forEach((item) => {
      newAnchors.push({
        id: item,
        isStatic: false,
        name: item,
        top: 0,
        type: 'output',
      });
    });

    lf.setProperties(id, {
      anchors: newAnchors,
    });
  },
  switch: function (lf, id) {
    const properties = lf.getProperties(id);
    const formDataCases = properties?.formData?.cases || [];
    const cases = generateSwitchNodeFormCasesValue(formDataCases);
    const staticAnchors =
      cloneDeep(
        properties?.anchors?.filter((item) => {
          return item.isStatic;
        }),
      ) || [];
    const newAnchors = [...staticAnchors];

    // 删除连接旧动态锚点的边
    const oldDynamicAnchors =
      cloneDeep(
        properties?.anchors?.filter((item) => {
          return !item.isStatic;
        }),
      ) || [];
    const allEdges = lf.getNodeEdges(id);
    if (oldDynamicAnchors.length > formDataCases.length) {
      oldDynamicAnchors.forEach((item) => {
        if (
          !formDataCases.find((caseItem) => {
            return caseItem.then === item.id;
          })
        ) {
          const edge = allEdges.find((edge) => edge.sourceAnchorId === item.id);
          if (edge) {
            lf.deleteEdge(edge.id);
          }
        }
      });
    }

    formDataCases.forEach((item, index) => {
      newAnchors.push({
        id: `${item.label || 'CASE ' + (index + 1)}`,
        isStatic: false,
        name: cases.find((caseItem) => caseItem.then === item.label)?.case,
        top: 0,
        type: 'output',
      });
    });

    lf.setProperties(id, {
      anchors: newAnchors,
    });
  },
};
/**
 * @description 根据某个节点的 id，更新节点的 properties.anchors 数据
 */
function updateNodePropertiesAnchorsById(id) {
  if (!lf || !id) return;
  const nodeData = lf.getNodeDataById(id);
  const nodeType = nodeData.type;
  if (isEndpointNode(nodeType, nodeData.properties?.rawNodeType)) {
    updateNodePropertiesAnchorsMap.endpoint(lf, id);
    return;
  }

  if (updateNodePropertiesAnchorsMap[nodeType]) {
    updateNodePropertiesAnchorsMap[nodeType](lf, id);
  }
}

/**
 * @description 更新所有 edges 的位置
 */
function updateEdgesPosition() {
  setTimeout(() => {
    const currentNode = lf.getNodeModelById(selectedNodeId.value);

    currentNode.outgoing.edges.forEach((edge) => {
      edge.updatePathByAnchor();
    });
  }, 0);
}

function updateSelectedNodePropertiesFormData(data) {
  if (!selectedNodeId.value) return;
  updateNodePropertiesFormData(selectedNodeId.value, data);
  updateNodePropertiesAnchorsById(selectedNodeId.value);
  updateNodePropertiesHeightById(selectedNodeId.value);
  updateNodePropertiesAnchorsYById(selectedNodeId.value);
  updateSelectedNodePropertiesNextNodes();
  updateEdgesPosition();
}

function initFlow() {
  if (!flowContainerRef.value) return;
  lf = new LogicFlow({
    container: flowContainerRef.value,
    plugins: [MiniMap, Menu],
    background: {
      backgroundColor: '#f0f2f7',
    },
    pluginsOptions: {
      miniMap: miniMapOptions,
    },
    allowResize: true, // 允许自定义调整大小
  });

  lf.on('node:click', flowNodeClickHandler);
  lf.on('custom:anchor-click', flowAnchorClickHandler);
  lf.on('anchor:drop', flowAnchorDropHandler);
  lf.on('node:mouseup', handleMouseup);

  flowNodes.forEach((node) => {
    register(node, lf);
  });

  lf.register(CustomBezierEdge);
  lf.setDefaultEdgeType('custom-bezier');

  lf.extension.menu.setMenuConfig({
    nodeMenu: [
      {
        text: '删除节点',
        callback(node) {
          deleteNode(node.id);
        },
      },
    ],
    edgeMenu: [
      {
        text: '删除边',
        callback(edge) {
          deleteEdge(edge.id);
        },
      },
    ],
    graphMenu: [
      {
        text: '添加注释',
        callback: () => {
          const point = lf.getPointByClient({
            x: mouseX.value,
            y: mouseY.value,
          });

          emit('addComment', {
            x: mouseX.value,
            y: mouseY.value,
            canvasX: point.x,
            canvasY: point.y,
          });
        },
      },
    ],
  });

  [...ENDPOINTS_NODE_TYPE_KEYS, 'endpoint-node', 'start'].forEach((type) => {
    lf.extension.menu.setMenuByType({
      type: type,
      menu: [
        {
          text: '变更节点',
          callback(node) {
            closeNodeFormBus.emit();
            showNodeMenuBus.emit(mouseX.value, mouseY.value);
            changeNodeState.value.oldNode = node;
          },
        },
      ],
    });
  });

  lf.render(flowData.value);

  lf.extension.miniMap.show();

  jumpToNodeBus.on((nodeId) => {
    const node = lf.getNodeModelById(nodeId);
    if (node) {
      lf.focusOn({
        id: node.id,
      });
    }
  });

  deleteFlowNodeByIdBus.on((nodeId) => {
    deleteNode(nodeId);
  });
}

function lfGetGraphRawData() {
  if (!lf) return;
  return lf.getGraphData();
}

async function lfRender() {
  if (!lf) return;
  lf.clearData();
  await nextTick();
  flowData.value.nodes.forEach((item) => {
    lf.addNode(item);
  });
  const nodes = cloneDeep(flowData.value.nodes);
  nodes.forEach((item) => {
    updateNodePropertiesAnchorsById(item.id);
  });

  await nextTick();

  nodes.forEach((item) => {
    updateNodePropertiesHeightById(item.id);
  });

  await nextTick();

  nodes.forEach((item) => {
    updateNodePropertiesAnchorsYById(item.id);
  });

  await nextTick();

  setTimeout(() => {
    flowData.value.edges.forEach((item) => {
      lf.addEdge(item);
    });
  }, 0);
  const startNode = nodes.find((item) => {
    return (
      isEndpointNode(item.type, item.properties?.rawNodeType) ||
      item.type === 'start'
    );
    // return [...ENDPOINTS_NODE_TYPE_KEYS, 'start'].includes(item.type);
  });
  // 聚焦开始节点
  lf.focusOn({
    id: startNode.id,
  });
  // lf.fitView();
  lf.extension.miniMap.hide();
  lf.extension.miniMap.show();
}

function updateAllNodePropertiesHeight() {
  if (!lf) return;
  const data = lf.getGraphData();
  data.nodes.forEach((item) => {
    updateNodePropertiesHeightById(item.id);
  });
}

function addNodeByAnchor(node) {
  if (addNodeData.value === undefined) return;
  const sourceModel = addNodeData.value.sourceModel;
  const targetModel = lf.addNode({
    id: `node_${nanoid()}`,
    ...node,
  });

  let x = sourceModel.x + sourceModel.width + 100;
  let y = sourceModel.y - sourceModel.height / 2 + targetModel.height / 2;

  const nextNodes = lf.getNodeOutgoingNode(sourceModel.id);
  const lastNode = nextNodes[nextNodes.length - 1];
  if (lastNode) {
    x = lastNode.x;
    y = lastNode.y + lastNode.height / 2 + 50;
  }

  targetModel.moveTo(x, y);

  const anchors = targetModel.anchors;
  const inputAnchor = anchors.find((item) => item.type === 'input');
  if (inputAnchor) {
    lf.addEdge({
      type: 'custom-bezier',
      sourceNodeId: addNodeData.value.sourceModel.id,
      sourceAnchorId: addNodeData.value.sourceAnchorId,
      targetNodeId: targetModel.id,
      targetAnchorId: inputAnchor.id,
    });
  }
  updateNodePropertiesHeightById(targetModel.id);
  updateNodePropertiesNextNodesById(targetModel.id);
  updateNodePropertiesAnchorsById(targetModel.id);
  updateNodePropertiesAnchorsYById(targetModel.id);

  updateSelectedNodePropertiesNextNodes();

  return targetModel;
}

function addNodeByNext(node, anchorId) {
  if (!selectedNodeId.value) return;
  const sourceModel = lf.getNodeModelById(selectedNodeId.value);
  const targetModel = lf.addNode({
    id: `node_${nanoid()}`,
    ...node,
  });
  let x = sourceModel.x + sourceModel.width + 100;
  let y = sourceModel.y - sourceModel.height / 2 + targetModel.height / 2;

  const nextNodes = lf.getNodeOutgoingNode(sourceModel.id);
  const lastNode = nextNodes[nextNodes.length - 1];
  if (lastNode) {
    x = lastNode.x;
    y = lastNode.y + lastNode.height / 2 + 50;
  }

  targetModel.moveTo(x, y);

  const anchors = targetModel.anchors;
  const inputAnchor = anchors.find((item) => item.type === 'input');
  if (inputAnchor) {
    lf.addEdge({
      type: 'custom-bezier',
      sourceNodeId: sourceModel.id,
      sourceAnchorId: anchorId,
      targetNodeId: targetModel.id,
      targetAnchorId: inputAnchor.id,
    });
  }

  updateNodePropertiesHeightById(targetModel.id);
  updateNodePropertiesNextNodesById(targetModel.id);
  updateNodePropertiesAnchorsById(targetModel.id);
  updateNodePropertiesAnchorsYById(targetModel.id);

  updateSelectedNodePropertiesNextNodes();

  return targetModel;
}

function addCommentNode(node) {
  const commentNode = {
    id: `comment_${nanoid()}`,
    ...node,
  };

  const targetModel = lf.addNode(commentNode);

  let x = targetModel.x;
  let y = targetModel.y;

  targetModel.moveTo(x, y);

  updateNodePropertiesHeightById(targetModel.id);
  updateNodePropertiesNextNodesById(targetModel.id);
  updateNodePropertiesAnchorsById(targetModel.id);
  updateNodePropertiesAnchorsYById(targetModel.id);

  lf.focusOn({
    id: targetModel.id,
  });

  return targetModel;
}

function unselectedNode() {
  updateNodePropertiesStatusIsSelectedById(selectedNodeId.value, false);
  setSelectedNodeId('');
}

function changeFlowNodeHandler(newNode) {
  const { oldNode } = changeNodeState.value;
  const oldId = oldNode.id;
  const oldX = oldNode.x;
  const oldY = oldNode.y;

  const allOldNodeStartEdges = lf.getNodeOutgoingEdge(oldId);
  allOldNodeStartEdges.forEach((item) => {
    lf.deleteEdge(item.id);
  });
  lf.deleteNode(oldId);
  const targetModel = lf.addNode({
    ...newNode,
    id: `node_${nanoid()}`,
    x: oldX,
    y: oldY,
  });
  updateNodePropertiesHeightById(targetModel.id, false);
  updateNodePropertiesNextNodesById(targetModel.id);
  updateNodePropertiesAnchorsById(targetModel.id);
  updateNodePropertiesAnchorsYById(targetModel.id);

  updateSelectedNodePropertiesNextNodes();
}

/**
 * @description 删除节点
 */
function deleteNode(nodeId) {
  if (!nodeId || !lf) return;
  if (nodeId === selectedNodeId.value) {
    unselectedNode();
    closeNodeFormBus.emit();
  }

  lf.deleteNode(nodeId);
  updateSelectedNodePropertiesNextNodes();
}
/**
 * @description 删除节点
 */
function deleteEdge(edgeId) {
  if (!edgeId || !lf) return;

  lf.deleteEdge(edgeId);
}

// 获取lf实例
function getLf() {
  return lf;
}

changeFlowNodeBus.on(changeFlowNodeHandler);

const getSelectedNode = () => {
  return lf.getNodeModelById(selectedNodeId.value);
};

onMounted(() => {
  initFlow();
  updateAllNodePropertiesHeight();
});

onBeforeUnmount(() => {
  changeFlowNodeBus.off(changeFlowNodeHandler);
  lf.destroy();
  lf = null;
});

defineExpose({
  addNodeByAnchor,
  addNodeByNext,
  unselectedNode,
  updateSelectedNodePropertiesFormData,
  lfRender,
  lfGetGraphRawData,
  deleteNode,
  selectedNodeId,
  getSelectedNode,
  addCommentNode,
  getLf,
  updateAllNodePropertiesHeight,
});
</script>

<template>
  <div
    class="flow-container h-full w-full overflow-hidden"
    ref="flowContainerRef"
  ></div>
</template>

<style>
.flow-container .lf-mini-map {
  padding: 8px;
  background: #f6f6f6;
  border-radius: 8px;
}
.flow-container .lf-mini-map-graph {
  position: relative;
}
.flow-container .lf-minimap-viewport {
  background: rgba(1, 1, 1, 0.1);
  position: absolute;
}

.flow-container .lf-bezier-adjust {
  display: none;
}

.lf-menu {
  border-radius: 8px !important;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) !important;
}
</style>
