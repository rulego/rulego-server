export const NODE_TITLE_HEIGHT = 36;
export const NODE_DEFAULT_WIDTH = 240;
export const NODE_DEFAULT_HEIGHT = 40;

export const NODE_TYPE_MAP = {
  // 'endpoint/grpc/stream': 'endpoint-grpc-stream',
  // 'endpoint/kafka': 'endpoints-kafka',
  // 'endpoint/nats': 'endpoints-nats',
  // 'endpoint/opcua': 'endpoint-opcua',
  // 'endpoint/rabbitmq': 'endpoints-rabbitmq',
  // 'endpoint/redis': 'endpoints-redis',
  // 'endpoint/redis/stream': 'endpoints-redis-stream',
  // 'endpoint/mysql_cdc': 'endpoint-mysql-cdc',
  // 'endpoint/mqtt': 'endpoint-mqtt',
  // 'endpoint/net': 'endpoint-net',
  // 'endpoint/http': 'endpoint-http',
  // 'endpoint/schedule': 'endpoint-schedule',
  // 'endpoint/ws': 'endpoint-ws',
  fork: 'fork',
  groupFilter: 'group-filter',
  jsSwitch: 'js-switch',
  msgTypeSwitch: 'msg-type-switch',
  switch: 'switch',
  comment: 'comment-node',
  for: 'for',
  groupAction: 'group-action',
};

export const NODE_TYPE_KEYS = Object.keys(NODE_TYPE_MAP);

export const ENDPOINTS_NODE_TYPE_KEYS = [
  // 'endpoint-grpc-stream',
  // 'endpoints-kafka',
  // 'endpoints-nats',
  // 'endpoint-opcua',
  // 'endpoints-rabbitmq',
  // 'endpoints-redis',
  // 'endpoints-redis-stream',
  // 'endpoint-mysql-cdc',
  // 'endpoint-mqtt',
  // 'endpoint-net',
  // 'endpoint-http',
  // 'endpoint-schedule',
  // 'endpoint-ws',
];

export const ONLY_ONE_NEXT_NODES_TYPE_KEYS = [
  'start',
  ...ENDPOINTS_NODE_TYPE_KEYS,
];
