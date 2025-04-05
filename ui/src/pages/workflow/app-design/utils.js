import { Component, h as lfh } from '@logicflow/core';
import * as Api from '@src/api';
import { nodeUtils } from '@src/utils/flow-utils';
import {
  ENDPOINTS_NODE_TYPE_KEYS,
  NODE_DEFAULT_HEIGHT,
  NODE_DEFAULT_WIDTH,
  NODE_TYPE_MAP,
} from '@src/pages/workflow/app-design/constant';

const EXTEND_NODE_TYPE_MAP = {
  ...NODE_TYPE_MAP,
  start: 'start',
};
import { cloneDeep, isEmpty, findKey, unionBy,uniqBy } from 'lodash-es';

export async function generateComponentList() {
  try {
    const components = await Api.getComponents();
    const locales = await Api.getLocales();
    return nodeUtils.adapterComponents(components, locales);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export function generateDefaultPropertiesStatus() {
  return {
    isSelected: false,
    anchorCanConnectOnlyOneNode: false,
  };
}

/**
 * @description 是否是 endpoint 节点
 */
export function isEndpointNode(nodeType, rawNodeType) {
  return (
    ENDPOINTS_NODE_TYPE_KEYS.includes(nodeType) ||
    rawNodeType?.startsWith('endpoint/')
  );
}

/**
 * @description 从config 节点类型生成lf节点类型
 * @param {*} rawNodeType
 */
export function convertNodeType(rawNodeType) {
  let convertedNodeType = EXTEND_NODE_TYPE_MAP[rawNodeType] || 'dynamic-node';
  const isEndpoint = isEndpointNode(convertedNodeType, rawNodeType);
  if (isEndpoint) {
    convertedNodeType = 'endpoint-node';
  }
  return convertedNodeType;
}

/**
 * @description 生成静态表单字段
 */
export function generateStaticFormFields(fields, config, nodeView) {
  let newFields = { ...fields };
  const transformatNodeType = EXTEND_NODE_TYPE_MAP[config.type] || 'default';
  if (isEndpointNode(transformatNodeType, config.type)) {
    if (newFields.routers !== undefined) {
      console.error('动态字段已经设置了 routers 字段，请更换字段名');
    } else {
      newFields.routers = {
        component: 'defaultEndpointsRoutersFormItem',
        componentProps: {
          nodeView: nodeView,
        },
        rules: [
          {
            type: 'array',
            required: true,
            message: '路由不能为空',
            trigger: 'change',
          },
        ],
      };
    }
  }

  if (transformatNodeType === 'msg-type-switch') {
    if (newFields.routers !== undefined) {
      console.error('动态字段已经设置了 routers 字段，请更换字段名');
    } else {
      newFields.routers = {
        component: 'simpleRoutersFormItem',
        rules: [
          {
            type: 'array',
            required: true,
            message: '路由不能为空',
            trigger: 'change',
          },
        ],
      };
    }
  }

  return newFields;
}
/**
 * @description 生成动态表单字段
 */
export function generateFormFields(configFields) {
  let fields = {};
  if (!configFields) return fields;
  (configFields || []).forEach((field) => {
    let fieldItem = {
      label: field.label,
      rules: field.rules || [],
      component: 'string',
      componentProps: {},
    };
    if (field.type === 'string') {
      fieldItem.component = 'string';
      fieldItem.componentProps.desc = field.desc;
    }
    if (['Boolean', 'bool'].includes(field.type)) {
      fieldItem.component = 'switch';
      fieldItem.componentProps.desc = field.desc;
    }
    if (field.type === 'map') {
      fieldItem.component = 'map';
      fieldItem.componentProps.desc = field.desc;
    }
    if (field.type === 'array') {
      fieldItem.component = 'array';
      fieldItem.componentProps.desc = field.desc;
    }
    if (field.type === 'struct' || field.type === 'object') {
      fieldItem.component = 'struct';
      fieldItem.label = '';
      fieldItem.componentProps.label = field.label;
      fieldItem.componentProps.fields = field.fields;
      fieldItem.componentProps.desc = field.desc;
    }
    if (field.type.indexOf('int') > -1 || field.type === 'number') {
      fieldItem.component = 'number';
      fieldItem.componentProps.precision = field?.component?.precision;
      fieldItem.componentProps.min = field?.component?.min || 0;
      fieldItem.componentProps.max = field?.component?.max;
      fieldItem.componentProps.step = field?.component?.step || 1;
      fieldItem.componentProps.desc = field.desc;
    }
    if (
      ['jsScript', 'JsScript', 'script'].includes(field.name) ||
      (field.component && field.component.type === 'codeEditor')
    ) {
      fieldItem.component = 'script';
      fieldItem.label = '';
      fieldItem.componentProps.label = field.label;
      fieldItem.componentProps.desc = field.desc;
    }
    if (field.component && field.component.type === 'select') {
      fieldItem.component = 'select';
      fieldItem.componentProps.options = field.component.options || [];
      fieldItem.componentProps.allowCreate = field.component.allowCreate;
      fieldItem.componentProps.filterable = field.component.filterable;
      fieldItem.componentProps.multiple = field.component.multiple;
      fieldItem.componentProps.desc = field.desc;
    }
    if (field.component && field.component.type === 'textarea') {
      fieldItem.component = 'textarea';
      fieldItem.componentProps.rows = field?.component?.rows || 2;
      fieldItem.componentProps.desc = field.desc;
    }
    if (field.component && field.component.type === 'table') {
      fieldItem.component = 'table';
      fieldItem.componentProps.options = field.component.options || [];
      fieldItem.componentProps.desc = field.desc;
    }
    if (field.component && field.component.type === 'switchNode') {
      fieldItem.component = 'switchNode';
      fieldItem.componentProps.desc = field.desc;
    }
    if (field.component && field.component.type === 'slider') {
      fieldItem.component = 'slider';
      fieldItem.componentProps.showInput = field.component?.showInput;
      fieldItem.componentProps.min = field.component?.min || 0;
      fieldItem.componentProps.max = field.component?.max;
      fieldItem.componentProps.step = field.component?.step || 1;
      fieldItem.componentProps.showTooltip = field.component?.showTooltip;
      fieldItem.componentProps.desc = field.desc;
    }
    fields[field.name] = fieldItem;
  });
  return fields;
}

export function generateStaticFormData(form, config) {
  const newForm = { ...form };
  const transformatNodeType = EXTEND_NODE_TYPE_MAP[config.type] || 'default';
  const isEndpoints = isEndpointNode(transformatNodeType, config.type);
  if (isEndpoints || transformatNodeType === 'msg-type-switch') {
    if (newForm.routers !== undefined) {
      console.error('动态字段已经设置了 routers 字段，请更换字段名');
    } else {
      newForm.routers = [];
    }
  }

  return newForm;
}

/**
 * @description json 转换成 switch 节点的 cases 表单值
 */
export function generateSwitchNodeFormCasesValue(arr) {
  const newVal = arr.map((item) => {
    const caseList = item.caseList.map((caseItem) => {
      const caseItemValue = caseItem.value.map((caseItemValueItem) => {
        const newCaseItemValueItem = caseItemValueItem;
        delete newCaseItemValueItem.id;
        return newCaseItemValueItem;
      });
      return caseItemValue;
    });
    return {
      case: nodeUtils.json2expr(caseList),
      then: item.label,
    };
  });
  return newVal;
}

// 自定义节点相关
/**
 * @description 自定义节点的锚点自定义样式方法
 */
export function customNodeGetAnchorShape(anchorData) {
  const { x, y, type, id } = anchorData;

  const addIcon = [
    lfh('path', {
      d: 'M24 16V32',
      stroke: '#FFFFFF',
      'stroke-width': 4,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    }),
    lfh('path', {
      d: 'M16 24L32 24',
      stroke: '#FFFFFF',
      'stroke-width': 4,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    }),
  ];

  const inputAnchor = [
    lfh(
      'div',
      {
        id: 'wrapper',
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'center',
        },
      },
      [
        lfh(
          'svg',
          {
            viewBox: '0 0 48 48',
            width: 16,
            height: 16,
          },
          [
            lfh('path', {
              d: 'M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z',
              fill: '#395aed',
              stroke: '#395aed',
              'stroke-width': 4,
              'stroke-linejoin': 'round',
            }),
          ],
        ),
      ],
    ),
  ];

  const outputAnchor = [
    lfh(
      'div',
      {
        id: 'wrapper',
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'center',
        },
        onClick: (e) => {
          e.stopPropagation();
          const { graphModel, model } = this.props;
          const [clientX, clientY] =
            graphModel.transformModel.CanvasPointToHtmlPoint([x, y]);
          graphModel.eventCenter.emit('custom:anchor-click', {
            clientX,
            clientY,
            model,
            anchorId: id,
          });
        },
      },
      [
        lfh(
          'svg',
          {
            viewBox: '0 0 48 48',
            width: 16,
            height: 16,
            className: 'lf-custom-anchor-point',
          },
          [
            lfh('path', {
              d: 'M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z',
              fill: '#395aed',
              stroke: '#395aed',
              'stroke-width': 4,
              'stroke-linejoin': 'round',
            }),
            addIcon,
          ],
        ),
      ],
    ),
  ];

  return lfh(
    'foreignObject',
    {
      width: 20,
      height: 20,
      x: x - 10,
      y: y - 10,
    },
    [type === 'input' ? inputAnchor : outputAnchor],
  );
}

/**
 * 将图的数据转换为规则引擎的规则链数据
 * @description 将图的数据转换为规则引擎的规则链数据
 * @param {*} flowData 图的数据
 * @param {*} oldRuleGoModel 规则引擎的规则链数据
 * @returns newRuleGoModel 更新后的规则引擎的规则链数据
 */
export function mapFlowDataModelToRuleGoModel(flowData, oldRuleGoModel) {
  const data = flowData;
  const params = cloneDeep(oldRuleGoModel);

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
  return params;
}

/**
 *
 * @param {*} ruleGoModel 规则引擎的规则链数据
 * @param {*} menuList 菜单列表
 * @description 将规则引擎的规则链数据转换为图的数据
 * @returns { { nodes:[],edges:[] }} data 图的数据
 */
export function mapRuleGoModelToFlowDataModel(ruleGoModel, menuList) {
  let tNodes = [];
  let tEdges = [];
  const userData = cloneDeep(ruleGoModel);

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
    return generateFlowNode(item, connections, menuList);
  });

  tEdges = tEdges.map((item) => {
    return generateFlowEdge(item);
  });
  return {
    nodes: tNodes,
    edges: tEdges,
  };
}

/**
 * 创建边
 * @param {*} initData
 * @param {*} nodes
 * @param {*} item
 * @returns
 */
export function createEdge(initData, nodes, item) {
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
export function getNodeByID(nodes, id) {
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

export function generateStaticAnchors(config) {
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

//获取endpoint连线
export function getEndpointConnections(fromId, endpointModel, firstNode) {
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

export function toFromPath(item) {
  if (!item.from) {
    return '';
  }
  let params = item.params ? item.params.join(' ') : '';
  return params + ' ' + (item.from && item.from.path);
}

/**
 *
 * @param {string} type
 * @param {Object} menuList
 * @returns {Component}
 */
export function findComponentByType(type, menuList) {
  if (isEmpty(menuList)) {
    return undefined;
  }
  const allComponents = Object.keys(menuList)
    .map((key) => {
      return menuList[key]?.components || [];
    })
    .flat();
  const component = allComponents.find((item) => item.type === type);
  return component;
}

export function generateFormData(config) {
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

export function generateFlowNode(config, connections, menuList) {
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

  const defaultNode = findComponentByType(configType, menuList);
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

export function generateFlowEdge(config) {
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
