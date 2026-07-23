import { locales } from '@src/constant/node-component-data';
import { nanoid } from 'nanoid';

//Internationalization function
export const $t = (key, parentKey) => {
  if (key && parentKey) {
    let locale = locales[parentKey];
    if (locale) {
      return locale[key] || key;
    }
  } else if (key) {
    return locales[key] || key;
  }
  return key;
};
/* Find the byte length of the string */
export const getBytesLength = (word) => {
  if (!word) {
    return 0;
  }
  let totalLength = 0;
  for (let i = 0; i < word.length; i++) {
    const c = word.charCodeAt(i);
    if (word.match(/[A-Z]/)) {
      totalLength += 1.5;
    } else if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
      totalLength += 1;
    } else {
      totalLength += 1.8;
    }
  }
  return totalLength;
};

// Default component adapter that adds labels, background colors, grouping, and form validation
const adapterComponents = (componets, customLocales) => {
  //Merged custom internationalization
  deepAssign(locales, customLocales);
  //Deep copy
  let nodeGroups = JSON.parse(JSON.stringify(locales.category));
  //Handle endpoint components
  if (componets.endpoints) {
    componets.endpoints.forEach((item) => {
      adapterItem(componets.builtins, nodeGroups, item, true);
    });
  }
  if (!componets.nodes) {
    //Compatible with older versions
    componets.nodes = componets;
  }
  //Processing node components
  componets.nodes.forEach((item) => {
    adapterItem(componets.builtins, nodeGroups, item, false);
  });
  //Delete empty groups
  for (let key in nodeGroups) {
    let value = nodeGroups[key];
    if (
      !value.components ||
      (Array.isArray(value.components) && value.components.length === 0)
    ) {
      delete nodeGroups[key];
    }
  }
  return nodeGroups;
};

const adapterItem = (builtins, nodeGroups, item, isEndpoint) => {
  adapterComponentsLocal(item, isEndpoint);
  let _categoryName = '';
  if (isEndpoint && !nodeGroups[item.category]) {
    _categoryName = 'endpoints';
  } else {
    _categoryName = item.category.split('/')[0];
    let _fromTypeCategoryName = item.type.split('/')[0];
    if (nodeGroups[_fromTypeCategoryName]) {
      _categoryName = _fromTypeCategoryName;
    }
  }
  let category = nodeGroups[_categoryName];
  if (category) {
    item.background = item.background || category.background;
    if (category.components) {
      category.components.push(item);
    } else {
      category.components = [item];
    }
  } else {
    nodeGroups[_categoryName] = {
      label: _categoryName,
      background: '#86B4E5FF',
      components: [item],
    };
  }
  item.category = _categoryName;

  adapterBuiltins(builtins, item, _categoryName);
  adapterRules(item);
  item.nodeType =
    item.nodeType || (category && category.nodeType) || 'simple-node';
};

//Internationalization
const adapterComponentsLocal = (component, isEndpoint) => {
  let localComponent = {};
  if (isEndpoint) {
    localComponent = locales.component.endpoints[component.type];
  } else {
    localComponent = locales.component.nodes[component.type];
  }

  if (localComponent) {
    Object.assign(component, localComponent);
    component.relationTypes =
      localComponent.relationTypes ||
      adapterRelationTypeLabel(component.relationTypes);
    if ('disabled' in localComponent) {
      component.disabled = localComponent.disabled;
    }
    adapterComponentsLocalField(component, localComponent);
    if (isEndpoint) {
      component.router = localComponent.router || component.router;
    }
  } else {
    component.relationTypes = adapterRelationTypeLabel(component.relationTypes);
  }
  if (isEndpoint) {
    component.router = component.router || {};
    //By default, the endpoint node does not display the input endpoint
    if (!component.hasOwnProperty('notInput')) {
      component.notInput = true;
    }
  }
};
const adapterRelationTypeLabel = (relationTypes) => {
  if (relationTypes) {
    let newRelationTypes = [];
    relationTypes.forEach((item) => {
      let value =
        item.value !== undefined && item.value !== null ? item.value : item;
      let label =
        item.label !== undefined && item.label !== null ? item.label : item;
      newRelationTypes.push({
        value: value,
        label: $t(label, 'relationTypes'),
      });
    });
    return newRelationTypes;
  }
  return relationTypes;
};
const adapterComponentsLocalField = (component, localComponent) => {
  if (component.fields) {
    component.fields.forEach((item) => {
      let localField = localComponent[item.name];
      if (localField) {
        deepAssign(item, localField);
      }
      if (item.fields && localField) {
        adapterComponentsLocalField(item, localField);
      }
    });
  }
};

const adapterRules = (component) => {
  if (component.fields) {
    component.fields.forEach((item) => {
      if (item.type.indexOf('int') > -1 && !item.rules) {
        item.rules = [{ type: 'number', message: 'Must be a numeric value' }];
      } else if (item.type.indexOf('float') > -1 && !item.rules) {
        item.rules = [
          {
            pattern: /^-?\d+(\.\d+)?$/,
            message: 'Must be a floating-point value',
          },
        ];
      }
    });
  }
};

//Find nodes by ID
const getNodeByID = (nodes, id) => {
  let node = {};
  if (nodes) {
    nodes.forEach((item) => {
      if (item.id === id) {
        node = item;
      }
    });
  }
  return node;
};

//Searches for edges using the source Id and Destination Id
const getEdgeBySourceNodeIdAndTargetNodeId = (
  edges,
  sourceNodeId,
  targetNodeId,
) => {
  let edge = null;
  if (edges) {
    edges.forEach((item) => {
      if (
        item.sourceNodeId === sourceNodeId &&
        item.targetNodeId === targetNodeId
      ) {
        edge = item;
      }
    });
  }
  return edge;
};

//Create an edge
const createEdge = (initData, nodes, item) => {
  let edge = {
    id: 'edge_' + initData.edgeCount,
    type: 'flow-link',
    sourceNodeId: item.fromId,
    targetNodeId: item.toId,
    startPoint: {},
    endPoint: {},
    text: $t(item.type, 'relationTypes') || '',
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
};

//Obtain the node serial number
const getNodeSeq = (nodeId) => {
  let values = nodeId.split('_');
  if (values.length > 0) {
    let maxNodeIdNum = parseInt(values[values.length - 1]);
    return isNaN(maxNodeIdNum) ? 0 : maxNodeIdNum;
  }
};

//Get a list of routing options that have not yet been selected
const getRelationTypeOptionsFromRouters = (edges, nodeModel, currentEdgeId) => {
  let selectedRouterId = {};
  edges.forEach((edgeModel) => {
    let currentEdgeModel = edgeModel.properties.model || {};
    if (currentEdgeModel.routerId) {
      selectedRouterId[currentEdgeModel.routerId] = edgeModel.id;
    }
  });
  let options = [];
  if (nodeModel.routers) {
    nodeModel.routers.forEach((item) => {
      if (
        !selectedRouterId[item.id] ||
        selectedRouterId[item.id] === currentEdgeId
      ) {
        let path = toFromPath(item);
        options.push({ label: path, value: item.id || path });
      }
    });
  }
  return options;
};

//Dynamically obtain connection types
const getRelationTypeOptionsFromNode = (nodeView, nodeModel) => {
  let options = [];
  if (nodeView.type === 'switch') {
    if (nodeModel.configuration && nodeModel.configuration.cases) {
      nodeModel.configuration.cases.forEach((item) => {
        options.push({ label: item.then, value: item.then });
      });
    }
    options.push({ label: 'Default', value: 'Default' });
    options.push({ label: 'Failure', value: 'Failure' });
  }
  return options;
};

//Get the router ID and get the connection type label
const getRouterRelationTypeLabel = (nodeModel, routerId) => {
  let labels = [];
  if (nodeModel.routers) {
    nodeModel.routers.forEach((item) => {
      if (item.id === routerId) {
        let path = toFromPath(item);
        labels.push({ label: path, value: routerId });
      }
    });
  }
  return labels;
};

const getEndpointConnections = (fromId, endpointModel, firstNode) => {
  let connections = [];
  if (!firstNode) {
    return [];
  }
  if (endpointModel.routers && endpointModel.routers.length > 0) {
    endpointModel.routers.forEach((item) => {
      if (item.to && item.to.path) {
        //Format: chainId: nodeId1: nodeId2: nodeId3
        let values = item.to.path.split(':');
        let path = toFromPath(item);
        if (values.length <= 1) {
          connections.push({
            fromId: fromId,
            toId: firstNode.id,
            routerId: item.id,
            nodeType: 'endpoint-node',
            type: path,
          });
        } else {
          //Starting from 1, traverse the node ID
          for (let i = 1; i < values.length; i++) {
            connections.push({
              fromId: fromId,
              toId: values[i],
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
};

const updateEndpointRouterToPath = (
  endpointModel,
  ruleChainId,
  endpointConnections,
) => {
  endpointModel.routers = endpointModel.routers || [];
  endpointModel.routers.forEach((router) => {
    if (!router.to) {
      router.to = {};
    }
    router.to.path = ruleChainId;
  });
  endpointConnections.forEach((item) => {
    if (item.fromId === endpointModel.id) {
      if (endpointModel.routers) {
        endpointModel.routers.forEach((router) => {
          let path = toFromPath(router);
          if (router.id === item.type || path === item.type) {
            router.to.path = router.to.path + ':' + item.toId;
          }
        });
      }
    }
  });
};

const toFromPath = (item) => {
  if (!item.from) {
    return '';
  }
  let params = item.params ? item.params.join(' ') : '';
  return params + ' ' + (item.from && item.from.path);
};

//Generate a unique ID
const genId = (size) => {
  if (size) {
    return nanoid(size);
  } else {
    return nanoid(12);
  }
};

//Format built-in functions
const adapterBuiltins = (builtins, nodeItem, categoryName) => {
  //Handle endpoint routing dropdown options for preprocessor and postprocessor
  if (categoryName === 'endpoints') {
    let endpointsBuiltins = builtins['endpoints'];
    if (endpointsBuiltins && nodeItem.router) {
      nodeItem.router.options = {};
      Object.keys(endpointsBuiltins).forEach((key) => {
        nodeItem.router.options[key] = endpointsBuiltins[key];
      });
    }
  }
  //Handles the dropdown option for node shared pools
  let currentNodeTypeNodePool =
    builtins.nodePool && builtins.nodePool[nodeItem.type];
  if (currentNodeTypeNodePool) {
    if (nodeItem.fields) {
      let options = toNodePoolOptions(currentNodeTypeNodePool);
      nodeItem.fields.forEach((item) => {
        if (item.component && !item.component.options) {
          item.component.options = options;
        }
      });
    }
  }

  //Handling others
  Object.keys(builtins).forEach((key) => {
    if (nodeItem.type === key) {
      if (nodeItem.fields) {
        nodeItem.fields.forEach((item) => {
          if (builtins[key][item.name]) {
            item.component = item.component || {};
            item.component.options = builtins[key][item.name];
          }
        });
      }
    }
  });
};

// nodeDef structure
// [{
//     "id": "my_mqtt_client01",
//     "type": "mqttClient",
//     "name": "MQTT pushes data",
//     "debugMode": false,
//     "configuration": {
//     "Server": "127.0.0.1:1883",
//         "Topic": "/device/msg"
// }
// }]
//Options value is added at the beginning according to the rulego Shared Component Protocol ref://
function toNodePoolOptions(nodeDef) {
  let options = [];
  if (nodeDef) {
    nodeDef.forEach((item) => {
      options.push({
        label: item.name,
        value: `ref://${item.id}`,
      });
    });
  }
  return options;
}

//Deep merger
function deepAssign(target, ...sources) {
  if (target == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  const isObject = (obj) =>
    obj && typeof obj === 'object' && !Array.isArray(obj);

  for (const source of sources) {
    if (isObject(source)) {
      for (const key in source) {
        if (isObject(source[key]) && isObject(target[key])) {
          deepAssign(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
    }
  }
  return target;
}

const getSelectedLabels = (options, selectedValues, optionsType) => {
  return selectedValues
    .map((value) => {
      const option = options.find((item) =>
        item.value !== undefined && item.value !== null
          ? item.value === value
          : item === value,
      );
      return option && option.label ? option.label : $t(value, optionsType);
    })
    .filter((label) => label !== undefined);
};

//Copy to clipboard
const copyToClipboard = (text) => {
  return new Promise((resolve, reject) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(text)
        .then(() => resolve(true))
        .catch((err) => reject(err));
    } else {
      // If not in a secure context, use the old execCommand method
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          resolve(true);
        } else {
          reject('execCommand copy failed');
        }
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(textArea);
      }
    }
  });
};

const readFromClipboard = () => {
  return new Promise((resolve, reject) => {
    // Try using the Clipboard API to read clipboard contents
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .readText()
        .then((text) => resolve(text))
        .catch((err) => {
          // If the Clipboard API fails to read, try using execCommand
          fallbackReadClipboard().then(resolve, reject);
        });
    } else {
      // If the Clipboard API is not supported, use execCommand as a backup solution
      fallbackReadClipboard().then(resolve, reject);
    }
  });
};

// Backup solution: Use document.execCommand('paste') to read clipboard contents
function fallbackReadClipboard() {
  return new Promise((resolve, reject) => {
    let text = '';
    const textarea = document.createElement('textarea');
    textarea.style.position = 'fixed'; // Prevent it from being displayed on the page
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      const successful = document.execCommand('paste');
      if (successful) {
        text = textarea.value;
        resolve(text);
      } else {
        reject('execCommand paste failed');
      }
    } catch (err) {
      reject(err);
    } finally {
      document.body.removeChild(textarea);
    }
  });
}

function isNumeric(str) {
  return !isNaN(str) && !isNaN(parseFloat(str));
}

// Operator mapping table
const OPERATOR_MAP = {
  // Numeric comparison operator
  '==': function (field, value) {
    if (value === '' || isNumeric(value)) {
      return `${field}==${value}`;
    } else {
      return `${field}=="${value}"`;
    }
  },
  '!=': function (field, value) {
    if (value === '' || isNumeric(value)) {
      return `${field}!=${value}`;
    } else {
      return `${field}!="${value}"`;
    }
  },
  '>': function (field, value) {
    return `${field}>${value}`;
  },
  '>=': function (field, value) {
    return `${field}>=${value}`;
  },
  '<': function (field, value) {
    return `${field}<${value}`;
  },
  '<=': function (field, value) {
    return `${field}<=${value}`;
  },
  // String comparison operator
  equal: function (field, value) {
    return `${field}=="${value}"`;
  },
  notEqual: function (field, value) {
    return `${field}!="${value}"`;
  },
  contains: function (field, value) {
    return `${field} contains "${value}"`;
  },
  notContains: function (field, value) {
    return `!(${field} contains "${value}")`;
  },
  startsWith: function (field, value) {
    return `${field} startsWith "${value}"`;
  },
  endsWith: function (field, value) {
    return `${field} endsWith "${value}")`;
  },
  // Null check operator
  null: function (field, value) {
    return `${field} == nil`;
  },
  notNull: function (field, value) {
    return `${field} != nil`;
  },
};

/**
 * Convert a JSON array to an expression string.
 * Example:
 * Input:
 * [
 *   [
 *     {
 *       "field": "msg.name",
 *       "operator": "equal",
 *       "value": "aa"
 *     },
 *     {
 *       "field": "msg.age",
 *       "operator": ">",
 *       "value": "18"
 *     }
 *   ],
 *   [
 *     {
 *       "field": "msg.age",
 *       "operator": "=",
 *       "value": "10"
 *     }
 *   ]
 * ]
 *
 * Output:
 * (msg.name=="aa" && msg.age>18) || msg.name==10"
 *
 * @param {Array} jsonArray - JSON condition array
 * @returns {string} Converted expression string
 */
function json2expr(jsonArray) {
  if (!Array.isArray(jsonArray) || jsonArray.length === 0) {
    return '';
  }

  // Handle the outer OR relationship
  const orExpressions = jsonArray.map((andArray) => {
    if (!Array.isArray(andArray)) return '';

    // Handle the inner AND relationship
    const andExpressions = andArray.map((condition) => {
      const { field, operator, value } = condition;
      return OPERATOR_MAP[operator] ? OPERATOR_MAP[operator](field, value) : '';
    });

    // Combine the AND expressions
    return andExpressions.length > 1
      ? `(${andExpressions.join(' && ')})`
      : andExpressions[0];
  });

  // Combine the OR expressions
  return orExpressions.join(' || ');
}

function expr2json(expr) {
  // expr = expr.replace(/\s+/g, '');
  expr = expr.trim();

  // Split the OR expression
  const orParts = expr.split('||');

  return orParts.map((orPart) => {
    // Remove the outer parentheses
    orPart = orPart.replace(/^\(|\)$/g, '');

    // Split the AND expression
    const andParts = orPart.split('&&');

    return andParts.map((condition) => {
      condition = condition.trim();
      // Parse the condition
      let match;
      if (condition.includes('contains')) {
        condition += ' '; // Handle an empty value
        // Handle contains and does-not-contain operators
        match = condition.match(/(.+)\s+contains\s+"(.+)"/);
        if (!match) {
          return {
            field: '',
            operator: condition.startsWith('!') ? 'notContains' : 'contains',
            value: '',
          };
        } else {
          return {
            field: match[1].trim().replace(/^!\(|^\(/, ''),
            operator: condition.startsWith('!') ? 'notContains' : 'contains',
            value: match[2],
          };
        }
      } else if (condition.includes('==') || condition.includes('!=')) {
        condition += ' '; // Handle an empty value
        // Handle string equality
        match = condition.match(/(.+)(==|!=)(.+)/);
        if (!match) {
          let isStr = condition.endsWith('"');
          // Handle an empty condition value
          return {
            field: '',
            operator: isStr
              ? condition.startsWith('!')
                ? 'notEqual'
                : 'equal'
              : condition.startsWith('!')
                ? '!='
                : '==',
            value: '',
          };
        } else {
          let isStr = match[3].trim().startsWith('"');
          let operator = match[2];
          let value = match[3].replace(/"/g, '').trim();
          if (value === 'nil') {
            operator = operator === '!=' ? 'notNull' : 'null';
            value = '';
          }
          return {
            field: match[1].trim(),
            operator: isStr
              ? operator === '!='
                ? 'notEqual'
                : 'equal'
              : operator,
            value: value,
          };
        }
      } else {
        condition += ' '; // Handle an empty value
        // Handle ordinary operators
        match = condition.match(/(.+)(==|>=|<=|>|<|startsWith|endsWith)(.+)/);
        if (!match) {
          // Handle an empty condition value
          return {
            field: '',
            operator: condition,
            value: '',
          };
        } else {
          return {
            field: match[1].trim(),
            operator: match[2].trim() === '==' ? '=' : match[2].trim(),
            value: match[3].replace(/"/g, '').trim(),
          };
        }
      }
    });
  });
}
export const nodeUtils = {};
nodeUtils.getNodeSeq = getNodeSeq;
nodeUtils.adapterComponents = adapterComponents;
nodeUtils.getNodeByID = getNodeByID;
nodeUtils.getEdgeBySourceNodeIdAndTargetNodeId =
  getEdgeBySourceNodeIdAndTargetNodeId;
nodeUtils.createEdge = createEdge;
nodeUtils.getRelationTypeOptionsFromRouters = getRelationTypeOptionsFromRouters;
nodeUtils.getEndpointConnections = getEndpointConnections;
nodeUtils.updateEndpointRouterToPath = updateEndpointRouterToPath;
nodeUtils.toFromPath = toFromPath;
nodeUtils.getRouterRelationTypeLabel = getRouterRelationTypeLabel;
nodeUtils.genId = genId;
nodeUtils.getSelectedLabels = getSelectedLabels;
nodeUtils.copyToClipboard = copyToClipboard;
nodeUtils.readFromClipboard = readFromClipboard;
nodeUtils.getRelationTypeOptionsFromNode = getRelationTypeOptionsFromNode;
nodeUtils.json2expr = json2expr;
nodeUtils.expr2json = expr2json;
