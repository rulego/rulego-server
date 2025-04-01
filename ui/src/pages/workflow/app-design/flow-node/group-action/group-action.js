import { HtmlNode, HtmlNodeModel } from '@logicflow/core';
import { createApp, h } from 'vue';
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import VueNode from '@src/pages/workflow/app-design/flow-node/group-action/group-action.vue';
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
    this.resizable = false; //不允许缩放

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
  type: 'group-action',
  model: VueHtmlNodeModel,
  view: VueHtmlNode,
};
