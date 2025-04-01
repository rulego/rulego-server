# rulego-ipaas-ui

## 项目介绍

`rulego-ipaas-ui` 是一个基于 `Vue3`+`Logicflow`+`ElementPlus` rulego-ipaas平台前端，也是一个RuleGo规则链流程编排设计器。

`rulego-ipaas`是一个基于 `RuleGo` 的流程编排iPaaS平台。使用场景：大模型流程编排、智能体编排、动态API网关、API/工具市场、业务编排、异构平台联动、IoT以及边缘计算。

在线体验地址:[http://8.134.32.225:9090/rulego-ipaas-ui/](http://8.134.32.225:9090/rulego-ipaas-ui/)

## 项目特性

- 扩展简单：支持自定义节点和表单，也可以0代码，自动适配后端新增节点组件
- 完整支持RuleGo-Sever API
- 技术栈：[Vue3](https://cn.vuejs.org/) + [Logicflow](https://logicflow.antv.antgroup.com/zh/) + [ElementPlus](https://element-plus.org/zh-cn/)
- 后端：RuleGo

## 后端

后端基于 [RuleGo](https://gitee.com/rulego/rulego) ，后端代码仓库：

- [gitee](https://gitee.com/rulego/rulego/tree/main/examples/server)
- [github](https://github.com/rulego/rulego/tree/main/examples/server)
- [aip文档](https://apifox.com/apidoc/shared-d17a63fe-2201-4e37-89fb-f2e8c1cbaf40)

## 安装/运行

```base
npm install

npm run dev
```

## 新增自定义节点

所有自定义节点存放在 `src\pages\workflow\app-design\flow-node` 目录。

复制一份节点代码，更改好名字后，修改 `.js` 文件导出的
`type` 名字和 `.vue` 文件引入路径即可。

例如，现在新建一个名字为 `demo` 的自定义节点：

1. 在 `src\pages\workflow\app-design\flow-node` 目录下新建一个 `demo` 文件夹。

2. 创建对应的 `.js` 和 `.vue` 文件。

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
    this.text.draggable = false; // 不允许文本被拖动
    this.text.editable = false; // 不允许文本被编辑

    const inputOnlyAsTarget = {
      message: '只能连接输入锚点',
      validate: (sourceNode, targetNode, sourceAnchor, targetAnchor) => {
        const data = sourceNode.graphModel;
        return targetAnchor.type === 'input';
      },
    };
    const oneOnlyAsSource = {
      message: '每个锚点只能连接一个节点',
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
   * 节点属性(每个节点必定有的属性)
   * @type {Object}
   * @property {Object} formData 表单
   * @property {string} formData.description 描述
   * @property {string} formData.title 标题
   * @property {Object} status 状态
   * @property {boolean} status.isSelected 是否选中
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

`.vue` 文件的内容可以自行调整，入参有 `properties` 和 `model`，来自 `.js` 文件的 `VueHtmlNode` class 下的 `constructor` 传入，可自行扩展。

3. 在 `src\pages\workflow\app-design\flow-node\index.js` 文件导出对应的节点。

4. 在 `src\pages\workflow\app-design\constant.js` 文件增加节点映射。

## 新增自定义表单项

节点表单组件在 `src\components\config-form` 目录。

新增自定义表单组件后，只需在 `src\components\config-form\cache.js` 文件增加 `componentMaps` 的映射即可。

## 自动适配新节点

后端新增节点组件，如果前端找不到自定义的`flow-node`节点，会使用 `src\pages\workflow\app-design\flow-node\dynamic-node` 进行自动适配渲染。
只需在这个文件`src\constant\node-component-data.js`配置国际化即可。

## 贡献

本项目为社区驱动项目，欢迎任何形式的贡献，包括提交问题、建议、文档、测试或代码。

## 授权

如果商业使用，请先联系作者。欢迎使用RuleGo团队开发的另外一个规则链编辑器[RuleGo-Editor](https://app.rulego.cc/)
体验地址：[http://8.134.32.225:9090/editor/](http://8.134.32.225:9090/editor/)
