import { HtmlNode, HtmlNodeModel } from '@logicflow/core';
import { createApp, h } from 'vue';
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import CommentNode from './comment.vue';
import {
  NODE_DEFAULT_WIDTH,
  NODE_DEFAULT_HEIGHT,
} from '@src/pages/workflow/app-design/constant';
import { customNodeGetAnchorShape } from '@src/pages/workflow/app-design/utils';

class CommentHtmlNode extends HtmlNode {
  constructor(props) {
    super(props);
    this.isMounted = false;
    this.r = h(CommentNode, {
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
      this.r.component.props.model = this.props.model;
    }
  }

  componentWillUnmount() {
    this.app.unmount();
  }
}

class CommentHtmlNodeModel extends HtmlNodeModel {
  initNodeData(data) {
    super.initNodeData(data);
    this.text.draggable = false;
    this.text.editable = false;
    // 移除连线规则，因为注释节点不需要连线
    this.sourceRules = [];
    this.targetRules = [];

    this.resizable = true;
  }

  setAttributes() {
    const { width = NODE_DEFAULT_WIDTH, height = NODE_DEFAULT_HEIGHT } =
      this.properties;
    this.width = width;
    this.height = height;
  }

  getOutlineStyle() {
    const style = super.getOutlineStyle();

    style.stroke = 'none';
    style.strokeWidth = 0;
    return style;
  }

  getNodeStyle() {
    const style = super.getNodeStyle();
    style.fill = 'none';
    style.stroke = 'none';
    return style;
  }

  getDefaultAnchor() {
    return [];
  }
}

export default {
  type: 'comment-node',
  view: CommentHtmlNode,
  model: CommentHtmlNodeModel,
};
