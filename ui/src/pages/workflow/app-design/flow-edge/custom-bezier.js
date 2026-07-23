import { BezierEdge, BezierEdgeModel } from '@logicflow/core';

class CustomEdge extends BezierEdge {}

class CustomEdgeModel extends BezierEdgeModel {
  // Set edge styles
  getEdgeStyle() {
    const style = super.getEdgeStyle();
    if (this.isSelected) {
      style.stroke = '#466dfd';
    } else {
      style.stroke = '#d1d5dd';
    }
    return style;
  }

  // Set the hover outline style
  getOutlineStyle() {
    const style = super.getOutlineStyle();
    style.stroke = 'none';
    style.hover.stroke = 'none';
    return style;
  }

  /**
   * Define edge schemes to support updating edge paths based on anchor positions
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
    // Here, you need to set the original pointsList to empty to trigger bezier's automatic calculation of control points.
    this.pointsList = [];
    this.initPoints();
  }
}

export default {
  type: 'custom-bezier',
  view: CustomEdge,
  model: CustomEdgeModel,
};
