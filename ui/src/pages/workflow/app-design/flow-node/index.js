import StartNode from '@src/pages/workflow/app-design/flow-node/start/start';
import EndpointNode from '@src/pages/workflow/app-design/flow-node/endpoint-node/endpoint-node';
import ForkNode from '@src/pages/workflow/app-design/flow-node/fork/fork';
import GroupFilterNode from '@src/pages/workflow/app-design/flow-node/group-filter/group-filter';
import JsSwitchNode from '@src/pages/workflow/app-design/flow-node/js-switch/js-switch';
import MsgTypeSwitchNode from '@src/pages/workflow/app-design/flow-node/msg-type-switch/msg-type-switch';
import SwitchNode from '@src/pages/workflow/app-design/flow-node/switch/switch';
import CommentNode from '@src/pages/workflow/app-design/flow-node/comment/comment';
import ForNode from '@src/pages/workflow/app-design/flow-node/for/for';
import GroupActionNode from '@src/pages/workflow/app-design/flow-node/group-action/group-action';
import DefaultNode from '@src/pages/workflow/app-design/flow-node/default/default';
import DynamicNode from '@src/pages/workflow/app-design/flow-node/dynamic-node/dynamic-node';

export default [
  StartNode,
  DefaultNode,
  EndpointNode,
  ForkNode,
  GroupFilterNode,
  JsSwitchNode,
  MsgTypeSwitchNode,
  SwitchNode,
  CommentNode,
  ForNode,
  GroupActionNode,
  DynamicNode,
];
