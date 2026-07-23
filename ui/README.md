# rulego-ipaas-ui

## Project Introduction

`rulego-ipaas-ui` is a front-end platform based on `Vue3` + `Logicflow` + `ElementPlus` rulego-ipaas and also a RuleGo rule chain process orchestration designer.

`rulego-ipaas` is a `RuleGo`-based process orchestration iPaaS platform. Use cases: large model process orchestration, agent orchestration, dynamic API gateways, API/ tool marketplaces, business orchestration, heterogeneous platform integration, IoT, and edge computing.

Online experience link: [http://8.134.32.225:9090/rulego-ipaas-ui/](http://8.134.32.225:9090/rulego-ipaas-ui/)

## Project Characteristics

- Simple extension: supports custom nodes and forms, can also be zero-code, and automatically adapts to new node components added on the backend
- Full support for RuleGo-Sever API
- Technology Stack: [Vue3](https://cn.vuejs.org/) + [Logicflow](https://logicflow.antv.antgroup.com/zh/) + [ElementPlus](https://element-plus.org/zh-cn/)
- Backend: RuleGo

## Backend

The backend is based on [RuleGo](https://gitee.com/rulego/rulego), and the backend code repository:

- [gitee](https://gitee.com/rulego/rulego/tree/main/examples/server)
- [github](https://github.com/rulego/rulego/tree/main/examples/server)
- [aip Document](https://apifox.com/apidoc/shared-d17a63fe-2201-4e37-89fb-f2e8c1cbaf40)

## Installation/Operation

```base
npm install

npm run dev
```

## Add custom nodes

All custom nodes are stored in the `src\pages\workflow\app-design\flow-node` directory.

Copy a node code, change the name, and then modify the export from the `.js` file
`type` name and `.vue` file to import the path.

For example, now create a custom node named `demo`:

1. Create a new `demo` folder in the `src\pages\workflow\app-design\flow-node` directory.

2. Create the corresponding `.js` and `.vue` files.

```js
// demo.js
import { HtmlNode, HtmlNodeModel } from '@logicflow/core';
import { createApp, h } from 'vue';
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import VueNode from '@src/pages/workflow/app-design/flow-node/demo/demo.vue';
import {
  NODE_TITLE_HEIGHT,
  NODE_DEFAULT_WIDTH,
  NODE_DEFAULT_HEIGHT,
} from '@src/pages/workflow/app-design/constant';
import { customNodeGetAnchorShape } from '@src/pages/workflow/app-design/utils';

class VueHtmlNode extends HtmlNode {
  constructor(props) {
    super(props);
    this.isMounted = false;
    this.r = h(VueNode, {
      properties: props.model.properties,
      model: props.model,
    });
    this.app = createApp({
      render: () => this.r,
    });
    this.app.use(ElementPlus);
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      this.app.component(`ElIcon${key}`, component);
    }
  }

  getAnchorShape(anchorData) {
    return customNodeGetAnchorShape.call(this, anchorData);
  }

  setHtml(rootEl) {
    if (!this.isMounted) {
      this.isMounted = true;
      const node = document.createElement('div');
      rootEl.appendChild(node);
      this.app.mount(node);
    } else {
      this.r.component.props.properties = this.props.model.getProperties();
    }
  }

  componentWillUnmount() {
    this.app.unmount();
  }
}

class VueHtmlNodeModel extends HtmlNodeModel {
  initNodeData(data) {
    super.initNodeData(data);
    this.text.draggable = false; // Text is not allowed to be dragged
    this.text.editable = false; // Text editing is not allowed

    const inputOnlyAsTarget = {
      message: 'Can only connect to an input anchor',
      validate: (sourceNode, targetNode, sourceAnchor, targetAnchor) => {
        const data = sourceNode.graphModel;
        return targetAnchor.type === 'input';
      },
    };
    const oneOnlyAsSource = {
      message: 'Each anchor can only connect to one node',
      validate: (sourceNode, targetNode, sourceAnchor, targetAnchor) => {
        const outgoingEdgesSourceAnchorId = sourceNode.outgoing.edges.map(
          (item) => item.sourceAnchorId,
        );
        return !outgoingEdgesSourceAnchorId.includes(sourceAnchor.id);
      },
    };
    this.sourceRules.push(inputOnlyAsTarget);
    this.sourceRules.push(oneOnlyAsSource);
  }

  setAttributes() {
    super.setAttributes();
    const { width, height } = this.properties;
    this.width = width || NODE_DEFAULT_WIDTH;
    this.height = height || NODE_DEFAULT_HEIGHT;
  }

  getNodeStyle() {
    const style = super.getNodeStyle();

    return style;
  }

  getOutlineStyle() {
    const style = super.getOutlineStyle();
    style.stroke = 'none';
    style.hover.stroke = 'none';
    return style;
  }

  getDefaultAnchor() {
    const { id, x, y, width, height, properties } = this;
    const anchors = [];

    anchors.push({
      x: x - width / 2,
      y: y - height / 2 + NODE_TITLE_HEIGHT / 2 + 2,
      id: `${id}_input`,
      type: 'input',
    });

    const pAnchors = properties.anchors || [];
    pAnchors.forEach((anchor) => {
      anchors.push({
        x: x + width / 2,
        y: y - height / 2 + NODE_TITLE_HEIGHT + anchor.top + 10 + 2,
        id: anchor.id,
        type: anchor.type,
        name: anchor.name,
        isStatic: anchor.isStatic,
      });
    });

    return anchors;
  }
}

export default {
  type: 'demo',
  model: VueHtmlNodeModel,
  view: VueHtmlNode,
};
```

```vue
<!-- demo.vue -->
<script setup>
import DefaultEndpointNode from '@src/pages/workflow/app-design/flow-node/components/default-endpoint-node.vue';

const props = defineProps({
  /**
   * Node properties (present on every node)
   * @type {Object}
   * @property {Object} formData Form data
   * @property {string} formData.description Description
   * @property {string} formData.title Title
   * @property {Object} status Status
   * @property {boolean} status.isSelected Whether the node is selected
   */
  properties: Object,
  model: Object,
});
</script>

<template>
  <default-endpoint-node
    :properties="props.properties"
    :model="props.model"
  ></default-endpoint-node>
</template>
```

`.vue` file content can be adjusted freely, with `properties` and `model` for entry, and `constructor` input from the `VueHtmlNode` class of `.js` file, which can be expanded as desired.

3. Export the corresponding node in the `src\pages\workflow\app-design\flow-node\index.js` file.

4. Add node mappings to the `src\pages\workflow\app-design\constant.js` file.

## Added custom form items

The node form component is in the `src\components\config-form` directory.

After adding a custom form component, you only need to add the `componentMaps` mapping to the `src\components\config-form\cache.js` file.

## Automatic adaptation to new nodes

A new node component is added on the backend. If the frontend cannot find a custom `flow-node` node, it uses `src\pages\workflow\app-design\flow-node\dynamic-node` for automatic adaptation and rendering.
Simply configure internationalization in this file `src\constant\node-component-data.js`.

## Contribution

This project is community-driven and welcomes contributions of any form, including submitted questions, suggestions, documentation, tests, or code.

## Authorization

For commercial use, please contact the author first. Welcome to the RuleGo team's other rule chain editor [RuleGo-Editor](https://app.rulego.cc/)
Experience link: [http://8.134.32.225:9090/editor/](http://8.134.32.225:9090/editor/)
