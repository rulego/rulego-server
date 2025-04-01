import { HtmlNode, HtmlNodeModel, h as lfh } from '@logicflow/core';
import { createApp, h } from 'vue';
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import VueNode from '@src/pages/workflow/app-design/flow-node/dynamic-node/dynamic-node.vue';
import { NODE_TITLE_HEIGHT } from '@src/pages/workflow/app-design/constant';

const defaultWidth = 240;
const defaultHeight = 40;

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
    this.resizable = false;
  }

  setAttributes() {
    super.setAttributes();
    const { width, height } = this.properties;
    this.width = width || defaultWidth;
    this.height = height || defaultHeight;
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
  type: 'dynamic-node',
  model: VueHtmlNodeModel,
  view: VueHtmlNode,
  defaultWidth,
  defaultHeight,
};
