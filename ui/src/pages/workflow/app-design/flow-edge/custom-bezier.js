import { BezierEdge, BezierEdgeModel } from '@logicflow/core';

class CustomEdge extends BezierEdge {}

class CustomEdgeModel extends BezierEdgeModel {
  // 设置边样式
  getEdgeStyle() {
    const style = super.getEdgeStyle();
    if (this.isSelected) {
      style.stroke = '#466dfd';
    } else {
      style.stroke = '#d1d5dd';
    }
    return style;
  }

  // 设置 hover 轮廓样式
  getOutlineStyle() {
    const style = super.getOutlineStyle();
    style.stroke = 'none';
    style.hover.stroke = 'none';
    return style;
  }

  /**
   * 给边自定义方案，使其支持基于锚点的位置更新边的路径
   */
  updatePathByAnchor() {
    // TODO
    const sourceNodeModel = this.graphModel.getNodeModelById(this.sourceNodeId);
    const sourceAnchor = sourceNodeModel
      ?.getDefaultAnchor()
      .find((anchor) => anchor.id === this.sourceAnchorId);
    const targetNodeModel = this.graphModel.getNodeModelById(this.targetNodeId);
    const targetAnchor = targetNodeModel
      ?.getDefaultAnchor()
      .find((anchor) => anchor.id === this.targetAnchorId);

    if (sourceAnchor) {
      const startPoint = {
        x: sourceAnchor?.x,
        y: sourceAnchor?.y,
      };
      this.updateStartPoint(startPoint);
    }
    if (targetAnchor) {
      const endPoint = {
        x: targetAnchor?.x,
        y: targetAnchor?.y,
      };
      this.updateEndPoint(endPoint);
    }
    // 这里需要将原有的pointsList设置为空，才能触发bezier的自动计算control点。
    this.pointsList = [];
    this.initPoints();
  }
}

export default {
  type: 'custom-bezier',
  view: CustomEdge,
  model: CustomEdgeModel,
};
