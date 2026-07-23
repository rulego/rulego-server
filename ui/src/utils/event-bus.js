import { useEventBus } from '@vueuse/core';

export default {
  // Used for the Flow editor
  updateNodeProperties: () => useEventBus('updateNodeProperties'),
  closeNodeForm: () => useEventBus('closeNodeForm'),
  showNodeMenu: () => useEventBus('showNodeMenu'),
  changeFlowNode: () => useEventBus('changeFlowNode'),
  jumpToNode: () => useEventBus('jumpToNode'),
  deleteFlowNodeById: () => useEventBus('deleteFlowNodeById'),
  refreshNodeLog: () => useEventBus('refreshNodeLog'),
  clearNodeFormValidate: () => useEventBus('clearNodeFormValidate'),
  logicflowNodeMouseUp: () => useEventBus('logicflowNodeMouseUp'),
};
