import { useEventBus } from '@vueuse/core';

export default {
  // 用于 flow 编辑器
  updateNodeProperties: () => useEventBus('updateNodeProperties'),
  closeNodeForm: () => useEventBus('closeNodeForm'),
  showNodeMenu: () => useEventBus('showNodeMenu'),
  changeFlowNode: () => useEventBus('changeFlowNode'),
  jumpToNode: () => useEventBus('jumpToNode'),
  deleteFlowNodeById: () => useEventBus('deleteFlowNodeById'),
  refreshNodeLog: () => useEventBus('refreshNodeLog'),
  clearNodeFormValidate: () => useEventBus('clearNodeFormValidate'),
};
