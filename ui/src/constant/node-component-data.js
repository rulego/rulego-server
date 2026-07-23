// Get the nodes that can be selected from the current rule chain, excluding the current node
function loadSelectNodes(lf, currentNodeModel, field, query) {
  let options = [];
  try {
    let ruleChainDSL = lf.getGraphData();
    ruleChainDSL?.metadata?.nodes.forEach((item) => {
      if (item.id && item.id !== currentNodeModel.id) {
        options.push({ value: item.id, label: item.name });
      }
    });
  } catch (e) {
  } finally {
    field.component.options = options;
  }
  return options;
}

export const locales = {
  category: {
    endpoints: {
      label: 'Endpoints',
      // background:'#E6E0F8FF',
      background: '#A6BBCFFF',
      nodeType: 'endpoint-node',
    },
    filter: {
      label: 'Filters',
      // background:'#E2D96EFF',
      background: '#f1e861',
      nodeType: 'simple-node',
    },
    transform: {
      label: 'Transformers',
      // background:'#FDD0A2FF',
      background: '#79cef1',
      nodeType: 'simple-node',
    },
    action: {
      label: 'Actions',
      // background:'#f1c84e',
      background: '#f1928f',
      nodeType: 'simple-node',
    },
    external: {
      label: 'External',
      // background:'#E6E0F8FF',
      background: '#fbc766',
      nodeType: 'simple-node',
    },
    ai: {
      label: 'AI',
      background: '#7cbaf8',
      nodeType: 'simple-node',
    },
    ci: {
      label: 'CI/CD',
      background: '#9ec9c9',
      nodeType: 'simple-node',
    },
    iot: {
      label: 'IoT',
      background: '#FFA500',
      nodeType: 'simple-node',
    },
    flow: {
      label: 'Sub-rule Chains',
      // background:'#E6E0F8FF',
      background: '#E6E0F8FF',
      nodeType: 'simple-node',
    },
  },
  component: {
    endpoints: {
      'endpoint/beanstalkdTubeset': {
        notInput: true,
        label: 'Beanstalkd',
        icon: '/images/endpoint/beanstalkd.svg',
        desc: '<ul><li>Beanstalkd subscription endpoint</li><li>Connect to the Beanstalkd Server, subscribe to messages, receive messages, and pass them to the next node for processing.</li><a href="https://rulego.cc/pages/endpoint-beanstalkd" target="_blank">Documentation</a></ul>',
        server: {
          label: 'Beanstalkd Server address',
          rules: [{ required: true, message: 'This field is required' }],
          desc: 'Example: 127.0.0.1:11300. If there are multi-node operation messages in the process and the state changes, you should use multi-node connections (ref://)',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        tubesets: {
          label: 'Tube list',
          desc: '',
          rules: [{ required: true, message: 'This field is required' }],
        },
        timeout: {
          label: 'Job subscription timeout, measured in seconds',
          desc: '',
        },
        router: {
          hide: true,
        },
      },
      'endpoint/mqtt': {
        notInput: true,
        label: 'MQTT',
        icon: '/images/endpoint/mqtt.svg',
        desc: '<ul><li>MQTT subscription endpoint</li><li>Connect to MQTT Server and trigger the rule chain by subscribing to a given topic via subscription</li><a href="https://rulego.cc/pages/2b0760/" target="_blank">Documentation</a></ul>',
        server: {
          label: 'MQTT Server address',
          rules: [{ required: true, message: 'This field is required' }],
          desc: '',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        username: {
          label: 'Username',
          desc: '',
        },
        password: {
          label: 'Password',
          desc: '',
        },
        maxReconnectInterval: {
          label: 'Reconnection interval, unit seconds',
          desc: '',
        },
        qOS: {
          label: 'QOS',
          desc: '',
        },
        router: {
          from: {
            path: {
              label: 'Subscription Topic',
              rules: [{ required: true, message: 'This field is required' }],
              desc: 'Subscribe to topic data triggers, for example: devices/msg',
            },
          },
        },
      },
      'endpoint/net': {
        notInput: true,
        label: 'TCP/UDP',
        icon: '/images/endpoint/net.svg',
        desc: '<ul><li>TCP/UDP server endpoint.</li><li>Start the TCP/UPD server and trigger the rule chain by routing data via regular expressions.</li><a href="https://rulego.cc/pages/b7050c/" target="_blank">Documentation</a></ul>',
        protocol: {
          label: 'Protocol',
          desc: 'tcp/udp',
          rules: [{ required: true, message: 'Protocol is required' }],
          component: {
            type: 'select',
            filterable: true,
            allowCreate: false,
            multiple: false,
            options: [
              {
                label: 'TCP',
                value: 'tcp',
              },
              {
                label: 'UDP',
                value: 'udp',
              },
            ],
          },
        },
        server: {
          label: 'Listening address',
          rules: [{ required: true, message: 'This field is required' }],
          desc: 'Example: :6335',
        },
        readTimeout: {
          label: 'Read Timeout (in seconds)',
          desc: '',
        },
        encode: {
          label: 'Encoding',
          desc: 'Convert the byte stream to hex or base64; no conversion is applied by default',
          rules: [],
          component: {
            type: 'select',
            filterable: true,
            allowCreate: false,
            multiple: false,
            clearable: true,
            options: [
              {
                label: 'None',
                value: 'none',
              },
              {
                label: 'hex',
                value: 'hex',
              },
              {
                label: 'base64',
                value: 'base64',
              },
            ],
          },
        },
        router: {
          from: {
            path: {
              label: 'Route regular expression',
              rules: [{ required: true, message: 'This field is required' }],
              desc: 'Triggered by matching data that meets the condition through regular expressions; * indicates matching all of them',
            },
          },
        },
      },
      'endpoint/http': {
        notInput: true,
        label: 'HTTP',
        icon: '/images/endpoint/http.svg',
        desc: '<ul><li>HTTP server endpoint.</li><li>Start the HTTP server, process the routing of the given URL request, and route the request data to the rule chain.</li><a href="https://rulego.cc/pages/691dd3/" target="_blank">Documentation</a></ul>',
        server: {
          label: 'Listening address',
          rules: [{ required: true, message: 'This field is required' }],
          desc: 'Example: :6335',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        allowCors: {
          label: 'Allow Cross-Origin Requests',
        },
        certFile: {
          label: 'Certificate file path',
          desc: 'Used for HTTPS',
        },
        certKeyFile: {
          label: 'Key file path',
          desc: 'Used for HTTPS',
        },
        router: {
          from: {
            path: {
              label: 'Path',
              rules: [{ required: true, message: 'This field is required' }],
              desc: 'The client requests this URL to trigger, for example: /api/v1/msg',
            },
          },
        },
      },
      'endpoint/ws': {
        notInput: true,
        label: 'Websocket',
        icon: '/images/endpoint/websocket.svg',
        desc: '<ul><li>WebSocket server endpoint.</li><li>Start the Websocket server, process the routing of the given URL request, and route the request data to the rule chain.</li><a href="https://rulego.cc/pages/e36f41/" target="_blank">Documentation</a></ul>',
        server: {
          label: 'Listening address',
          rules: [{ required: true, message: 'This field is required' }],
          desc: 'Example: :6335',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        allowCors: {
          label: 'Allow Cross-Origin Requests',
        },
        certFile: {
          label: 'Certificate file path',
          desc: 'Used for HTTPS',
        },
        certKeyFile: {
          label: 'Key file path',
          desc: 'Used for HTTPS',
        },
        router: {
          from: {
            path: {
              label: 'Path',
              rules: [{ required: true, message: 'This field is required' }],
              desc: 'The client requests this URL to trigger, for example: /api/ms/ws',
            },
          },
        },
      },
      'endpoint/schedule': {
        notInput: true,
        label: 'Scheduled Trigger',
        icon: '/images/endpoint/schedule.svg',
        desc: '<ul><li>Scheduled trigger endpoint</li><li>Trigger the rule chain by routing a given Cron expression cycle</li><a href="https://rulego.cc/pages/4c4e4c/" target="_blank">Documentation</a></ul>',
        router: {
          from: {
            path: {
              label: 'Cron Expression',
              rules: [
                {
                  required: true,
                  message: 'Enter a Cron expression such as: */10 * * * * *',
                },
              ],
              desc: 'Triggers on a Cron schedule, such as: */10 * * * * *',
            },
            processors: {
              hide: true,
            },
          },
          to: {
            processors: {
              hide: true,
            },
          },
        },
      },
      'endpoint/kafka': {
        notInput: true,
        label: 'Kafka',
        icon: '/images/endpoint/kafka.svg',
        desc: '<ul><li>Kafka subscription endpoint</li><li>Connect to the Kafka server and trigger a chain of rules by subscribing to a given topic for a route</li><a href="https://rulego.cc/pages/07ad50/" target="_blank">Documentation</a></ul>',
        server: {
          label: 'Kafka server address',
          desc: 'Multiple addresses are separated by commas, such as: 127.0.0.1:9092, 127.0.0.2:9092',
          rules: [
            { required: true, message: 'The server address is required' },
          ],
        },
        groupId: {
          label: 'Consumer group ID',
          desc: 'Default rulego',
        },
        router: {
          from: {
            path: {
              label: 'Subscription Topic',
              rules: [{ required: true, message: 'This field is required' }],
              desc: 'Subscribe to topic data triggers, for example: devices/msg',
            },
          },
        },
      },
      'endpoint/nats': {
        notInput: true,
        label: 'Nats',
        icon: '/images/endpoint/nats.svg',
        desc: '<ul><li>NATS subscription endpoint</li><li>Connect to the Nats server and trigger a chain of rules by subscribing to a given topic</li><a href="https://rulego.cc/pages/0a7ad4/" target="_blank">Documentation</a></ul>',
        server: {
          label: 'NATS service address',
          rules: [{ required: true, message: 'This field is required' }],
          desc: 'Example: nats://127.0.0.1:4222',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        username: {
          label: 'Username',
          desc: '',
        },
        password: {
          label: 'Password',
          desc: '',
        },
        router: {
          from: {
            path: {
              label: 'Subscription Topic',
              rules: [{ required: true, message: 'This field is required' }],
              desc: 'Subscribe to topic data triggers, for example: devices/msg',
            },
          },
        },
      },
      'endpoint/redis': {
        notInput: true,
        label: 'Redis',
        icon: '/images/endpoint/redis.svg',
        desc: '<ul><li>Redis subscription endpoint</li><li>Connect to the Redis server and trigger the rule chain through subscription routing to a given subscription channel</li><a href="https://rulego.cc/pages/c96eb4/" target="_blank">Documentation</a></ul>',
        server: {
          label: 'Redis service address',
          rules: [{ required: true, message: 'This field is required' }],
          desc: 'Example: 127.0.0.1:6379',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        password: {
          label: 'Password',
          desc: '',
        },
        db: {
          label: 'Database number',
          rules: [
            { required: true, message: 'This field is required' },
            { type: 'integer', required: true, message: 'Must be an integer' },
          ],
          desc: 'Default is 0',
        },
        router: {
          from: {
            path: {
              label: 'Subscribe to Redis channels',
              rules: [{ required: true, message: 'This field is required' }],
              desc: 'Multiple channels are separated by commas, for example: devices/msg, devices/msg2',
            },
          },
        },
      },
      'endpoint/redis/stream': {
        notInput: true,
        label: 'Redis flow',
        icon: '/images/endpoint/redis_stream.svg',
        desc: '<ul><li>Redis Stream endpoint</li><li>Connect to the Redis server and trigger the rule chain by subscribing to the given stream name through subscription</li><a href="https://rulego.cc/pages/c96eb5/" target="_blank">Documentation</a></ul>',
        server: {
          label: 'Redis service address',
          rules: [{ required: true, message: 'This field is required' }],
          desc: 'Example: 127.0.0.1:6379',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        password: {
          label: 'Password',
          desc: '',
        },
        db: {
          label: 'Database number',
          rules: [
            { required: true, message: 'This field is required' },
            { type: 'integer', required: true, message: 'Must be an integer' },
          ],
          desc: 'Default is 0',
        },
        groupId: {
          label: 'Consumer group ID',
          desc: 'Default rulego',
        },
        router: {
          from: {
            path: {
              label: 'Subscribe to the stream name',
              rules: [{ required: true, message: 'This field is required' }],
              desc: 'Multiple streams are separated by commas, for example: devices/msg, devices/msg2',
            },
          },
        },
      },
      'endpoint/rabbitmq': {
        notInput: true,
        label: 'RabbitMQ',
        icon: '/images/endpoint/rabbitmq.svg',
        desc: '<ul><li>RabbitMQ subscription endpoint</li><li>Supports AMQP</li><li>Connects to RabbitMQ and triggers the rule chain for a subscribed routing key</li><li>Declares the exchange automatically if it does not exist</li><a href="https://rulego.cc/pages/endpoint-rabbitmq/" target="_blank">Documentation</a></ul>',
        server: {
          label: 'Service address',
          rules: [{ required: true, message: 'This field is required' }],
          desc: 'Format: amqp://[username:password]@host/[virtual-host]',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        exchange: {
          label: 'Exchange Name',
          desc: '',
        },
        exchangeType: {
          label: 'Exchange Type',
          desc: 'direct/fanout/headers/topic',
        },
        durable: {
          label: 'Durable',
          desc: '',
        },
        autoDelete: {
          label: 'Auto-Delete',
          desc: '',
        },
        router: {
          from: {
            path: {
              label: 'Routing Key',
              rules: [{ required: true, message: 'This field is required' }],
              desc: '',
            },
          },
        },
      },
      'endpoint/mysql_cdc': {
        notInput: true,
        label: 'MYSQL CDC',
        icon: '/images/endpoint/mysql_cdc.svg',
        desc: '<ul><li>Monitor MySQL table data changes to trigger.</li></li><a href="https://rulego.cc/pages/mysql-cdc/" target="_blank">Documentation</a></ul>',
        server: {
          label: 'MYSQL address',
          rules: [{ required: true, message: 'This field is required' }],
          desc: 'Example: 127.0.0.1:3306',
        },
        user: {
          label: 'Username',
        },
        password: {
          label: 'Password',
          desc: '',
        },
        fromOldest: {
          label: 'Is it fully synchronized?',
          desc: 'After activation, each service restart synchronizes data from the first row; otherwise, only incremental data is synchronized',
        },
        dbs: {
          label: 'Listen on the database, and if empty, include all tables',
          desc: 'For example: test',
        },
        includeTables: {
          label: 'Contains table names; if empty, contains all tables',
          desc: 'For example: test.users, supports regular expressions such as:.*\\.canal or test.*',
        },
        excludeTables: {
          label: 'Excluding table names',
          desc: 'For example: mysql.component. Supports regular expressions such as mysql\\..*',
        },
        executionPath: {
          label: 'mysqldump execution path',
          desc: 'For example: mysqldump or /usr/bin/mysqldump',
        },
        charset: {
          label: 'Character set',
          desc: 'For example: utf8',
        },
        flavor: {
          label: 'Database type',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
            options: [
              {
                label: 'mysql',
                value: 'mysql',
              },
              {
                label: 'mariadb',
                value: 'mariadb',
              },
            ],
          },
        },
        heartbeat: {
          label: 'Heartbeat Interval (seconds)',
        },
        readTimeout: {
          label: 'Read Timeout (seconds)',
        },
        limit: {
          label: 'Limit the number of synchronized entries',
          desc: 'Used for batch operations; does not process data exceeding the limit. 0: No limit. Other: Does not process data exceeding this value',
        },
        router: {
          from: {
            path: {
              label: 'Route Table Name',
              rules: [{ required: true, message: 'This field is required' }],
              desc: 'According to the table name routing, the table name format is: dbName.tableName, e.g., test.users. * indicates all tables',
            },
            processors: {
              hide: true,
            },
          },
          to: {
            processors: {
              hide: true,
            },
          },
        },
      },
      'endpoint/opcua': {
        category: 'iot',
        notInput: true,
        nodeType: 'endpoint-node',
        label: 'OPC_UA subscribe',
        icon: '/images/endpoint/opcua.svg',
        desc: '<ul><li>Data is read regularly from the OPC UA server.</li><a href="https://rulego.cc/pages/endpoint-opcua/" target="_blank">Documentation</a></ul>',
        server: {
          label: 'Server address',
          rules: [{ required: true, message: 'This field is required' }],
          desc: 'Example: opc.tcp://localhost:4840',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        interval: {
          label: 'Read task time configuration',
          desc: 'Example: @every 1m (every 1 minute) 0 0 0 * * * (triggered at midnight)',
          rules: [{ required: true, message: 'This field is required' }],
        },
        nodeIds: {
          label: 'Node ID list',
          desc: 'Example: ns=3; i=1003',
          rules: [{ required: true, message: 'This field is required' }],
        },
        auth: {
          label: 'Authorization method',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
            options: [
              {
                label: 'Anonymous',
                value: 'anonymous',
              },
              {
                label: 'Username',
                value: 'username',
              },
              {
                label: 'Certificate',
                value: 'certificate',
              },
            ],
          },
        },
        username: {
          label: 'Username',
          desc: 'If the authorization method is a username, you need to fill it in',
        },
        password: {
          label: 'Password',
          desc: 'If the authorization method is a username, you need to fill it in',
        },
        certFile: {
          label: 'Certificate file path',
          desc: 'If the authorization method is a certificate, it needs to be filled in',
        },
        certKeyFile: {
          label: 'Key file path',
          desc: 'If the authorization method is a certificate, it needs to be filled in',
        },
        mode: {
          label: 'Pattern',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
            options: [
              {
                label: 'Auto',
                value: 'auto',
              },
              {
                label: 'None',
                value: 'none',
              },
              {
                label: 'Sign',
                value: 'sign',
              },
              {
                label: 'Signandencrypt',
                value: 'signandencrypt',
              },
            ],
          },
        },
        policy: {
          label: 'Strategy',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
            options: [
              {
                label: 'Auto',
                value: 'auto',
              },
              {
                label: 'None',
                value: 'none',
              },
              {
                label: 'Basic128Rsa15',
                value: 'Basic128Rsa15',
              },
              {
                label: 'Basic256',
                value: 'Basic256',
              },
              {
                label: 'Basic256Sha256',
                value: 'Basic256Sha256',
              },
              {
                label: 'Aes128_Sha256_RsaOaep',
                value: 'Aes128_Sha256_RsaOaep',
              },
              {
                label: 'Aes256_Sha256_RsaPss',
                value: 'Aes256_Sha256_RsaPss',
              },
            ],
          },
        },
        router: {
          hide: true,
        },
      },
      'endpoint/grpc/stream': {
        label: 'gRPC stream client',
        icon: '/images/grpc.svg',
        desc: '<ul><li>Receive gRPC server push data and forward it to the rule chain for processing</li></ul><a href="https://rulego.cc/pages/endpoint-grpc-stream/" target="_blank">Documentation</a>',
        server: {
          label: 'gRPC service address',
          desc: 'Format: Hostname: Port',
          rules: [{ required: true, message: 'A service address is required' }],
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        service: {
          label: 'Service name',
          desc: 'Example: helloworld.Greeter',
          rules: [{ required: true, message: 'The service name is required' }],
        },
        method: {
          label: 'Method name',
          desc: 'Example: SayHello',
          rules: [{ required: true, message: 'The method name is required' }],
        },
        request: {
          label: 'Request parameter content (allow null)',
          desc: 'Example: {"name":"lala"}',
          component: {
            type: 'textarea',
          },
        },
        headers: {
          label: 'Request Headers',
          desc: '',
        },
        checkInterval: {
          label: 'Service inspection interval, unit: milliseconds',
          desc: '',
        },
        router: {
          hide: true,
        },
      },
      'endpoint/wukongim': {
        label: 'WuKongIM Receiver',
        icon: '/images/endpoint/wukongim.svg',
        desc: '<ul><li>Receive WuKongIM push data and forward it to the rule chain for processing</li></ul><a href="https://rulego.cc/pages/endpoint-wukongim/" target="_blank">Documentation</a>',
        server: {
          label: 'Server address',
          rules: [{ required: true, message: 'This field is required' }],
          desc: 'Example: tcp://175.27.245.108:15100',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        uID: {
          label: 'User ID',
          rules: [{ required: true, message: 'This field is required' }],
        },
        token: {
          label: 'Login Password',
          desc: '',
        },
        connectTimeout: {
          label: 'Connection timeout, measured in seconds',
          desc: '',
        },
        protoVersion: {
          label: 'Protocol version',
          desc: 'Example: 3',
        },
        pingInterval: {
          label: 'Heartbeat intervals, measured in seconds',
          desc: 'Example: 30',
        },
        reconnect: {
          label: 'Whether automatic reconnection is required',
          desc: '',
        },
        autoAck: {
          label: 'Whether messages are automatically acknowledged',
          desc: '',
        },
        router: {
          hide: true,
        },
      },
    },
    nodes: {
      comment: {
        notInput: true,
        notOutput: true,
        label: 'Comment',
        icon: '/images/comment.svg',
        desc: 'Display node names as annotation content on the canvas',
        nodeType: 'comment-node',
      },
      delay: {
        label: 'Delay',
        icon: '/images/delay.svg',
        desc: '<a href="https://rulego.cc/pages/5f5612/" target="_blank">Documentation</a>',
        periodInSeconds: {
          label: 'Delay time (seconds)',
          desc: '',
        },
        maxPendingMsgs: {
          label: 'Maximum Pending Messages',
          desc: 'If override mode is enabled, this parameter becomes invalid',
        },
        periodInSecondsPattern: {
          label: 'Delay Expression (seconds)',
          desc: 'Read the delay from ${metadata.key} or ${msg.key}. This value takes precedence when present.',
        },
        overwrite: {
          label: 'Overwrite Mode',
          desc: 'If enabled, only one message can be suspended per cycle, and new messages will overwrite the previous one',
        },
      },
      log: {
        label: 'Log',
        icon: '/images/log.svg',
        desc: '<a href="https://rulego.cc/pages/020050/" target="_blank">Documentation</a>',
        jsScript: {
          label: 'function String(msg, metadata, msgType) {',
          desc: '}',
        },
      },
      for: {
        label: 'for',
        icon: '/images/for.svg',
        desc: '<a href="https://rulego.cc/pages/7db1de/" target="_blank">Documentation</a>',
        range: {
          label: 'Iterative value expression',
          desc: 'For example: msg.items; 1..3; If empty, traverse the entire msg',
        },
        do: {
          label: 'Process node ID',
          rules: [{ required: true, message: 'This field is required' }],
          desc: 'Handles the starting node ID of the chain',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: false,
            multiple: false,
            loadData: loadSelectNodes,
          },
        },
        mode: {
          label: 'Execution mode',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
            options: [
              {
                label: 'Synchronous; do not merge results',
                value: 0,
              },
              {
                label: 'Synchronous; merge results',
                value: 1,
              },
              {
                label: 'Synchronous; overwrite results',
                value: 2,
              },
              {
                label: 'Asynchronous; do not merge results',
                value: 3,
              },
            ],
          },
        },
        // nodeType: 'group-node',
      },
      functions: {
        label: 'Function',
        desc: '<a href="https://rulego.cc/pages/b7edde/" target="_blank">Documentation</a>',
        functionName: {
          label: 'Function name',
          rules: [{ required: true, message: 'This field is required' }],
          desc: '',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            placeholder: 'Please select or enter the function name',
          },
        },
      },
      'x/beanstalkdWorker': {
        label: 'Beanstalkd Worker',
        icon: '/images/beanstalkd_worker.svg',
        category: 'external',
        desc: '<ul><li>Beanstalkd consumer side, supports the following operations: Delete, Release, Bury, KickJob, Touch, Peek, ReserveJob, StatsJob, Stats, ListTubes.</li><a href="https://rulego.cc/pages/x-beanstalkd-worker/" target="_blank">Documentation</a></ul>',
        server: {
          label: 'Beanstalkd Server address',
          rules: [{ required: true, message: 'This field is required' }],
          desc: 'Example: 127.0.0.1:11300. If there are multi-node operation messages in the process and the state changes, you should use multi-node connections (ref://)',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        tube: {
          label: 'Tube name',
          desc: 'TubeName Allows the use of ${} placeholder variables',
          rules: [{ required: true, message: 'This field is required' }],
        },
        cmd: {
          label: 'Order name',
          desc: 'Command names, supports Delete Release Bury KickJob Touch Peek ReserveJob StatsJob StatsListTubes',
          rules: [{ required: true, message: 'This field is required' }],
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
            options: [
              {
                label: 'Delete',
                value: 'Delete',
              },
              {
                label: 'Release',
                value: 'Release',
              },
              {
                label: 'Bury',
                value: 'Bury',
              },
              {
                label: 'KickJob',
                value: 'KickJob',
              },
              {
                label: 'Touch',
                value: 'Touch',
              },
              {
                label: 'Peek',
                value: 'Peek',
              },
              {
                label: 'ReserveJob',
                value: 'ReserveJob',
              },
              {
                label: 'StatsJob',
                value: 'StatsJob',
              },
              {
                label: 'Stats',
                value: 'Stats',
              },
              {
                label: 'ListTubes',
                value: 'ListTubes',
              },
            ],
          },
        },
        jobId: {
          label: 'JobId',
          desc: 'JobId is optional by command and allows the use of ${} placeholder variables, Delete, Release, Bury, KickJob, Touch, Peek, ReserveJob, and StatsJob command parameters',
        },
        pri: {
          label: 'Priority',
          desc: 'Priority: pri allows the use of ${} placeholder variables, Release, Bury command parameters',
        },
        delay: {
          label: 'Delay time',
          desc: 'Delay time: delay allows the use of ${} placeholder variable, Release command parameter, formatted as "30s", "5m", etc.',
        },
      },
      'x/beanstalkdTube': {
        label: 'Beanstalkd Tube',
        icon: '/images/beanstalkd_tube.svg',
        category: 'external',
        desc: '<ul><li>Beanstalkd Tube supports the following operations: Put, PeekReady, PeekDelayed, PeekBuried, Kick, Stat, Pause.</li><a href="https://rulego.cc/pages/x-beanstalkd-tube/" target="_blank">Documentation</a></ul>',
        server: {
          label: 'Beanstalkd Server address',
          rules: [{ required: true, message: 'This field is required' }],
          desc: 'Example: 127.0.0.1:11300. If there are multi-node operation messages in the process and the state changes, you should use multi-node connections (ref://)',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        tube: {
          label: 'Tube name',
          desc: 'TubeName Allows the use of ${} placeholder variables',
          rules: [{ required: true, message: 'This field is required' }],
        },
        cmd: {
          label: 'Order name',
          desc: 'Command names, supporting Put, PeekReady, PeekDelayed, PeekBuried, Kick, Stat, Pause',
          rules: [{ required: true, message: 'This field is required' }],
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
            options: [
              {
                label: 'Put',
                value: 'Put',
              },
              {
                label: 'PeekReady',
                value: 'PeekReady',
              },
              {
                label: 'PeekDelayed',
                value: 'PeekDelayed',
              },
              {
                label: 'PeekBuried',
                value: 'PeekBuried',
              },
              {
                label: 'Kick',
                value: 'Kick',
              },
              {
                label: 'Stat',
                value: 'Stat',
              },
              {
                label: 'Pause',
                value: 'Pause',
              },
            ],
          },
        },
        body: {
          label: 'body',
          desc: 'body can be selected according to the command, allowing the use of the ${} placeholder variable and the Put command parameter',
        },
        pri: {
          label: 'Priority',
          desc: 'Priority: pri allows the use of ${} placeholder variables and Put command parameters',
        },
        delay: {
          label: 'Delay time',
          desc: 'Delay time: delay allows the use of ${} placeholder variable, Put command parameter, formatted as "30s", "5m", etc.',
        },
        ttr: {
          label: 'Maximum execution seconds for a job',
          desc: 'Maximum execution seconds: ttr allows the use of ${} placeholder variables and Put command parameters',
        },
        kickBound: {
          label: 'Maximum number of Jobs to be awakened',
          desc: 'The Kick command parameter bound allows the use of ${} placeholder variables',
        },
        pauseTime: {
          label: 'Pause time',
          desc: 'The Pause command parameter time allows the use of ${} placeholder variables, with formats such as: "30s", "5m",',
        },
      },
      dbClient: {
        label: 'Database',
        icon: '/images/db.svg',
        desc: '<a href="https://rulego.cc/pages/32683d/" target="_blank">Documentation</a>',
        sql: {
          label: 'SQL statements',
          rules: [{ required: true, message: 'This field is required' }],
          desc: 'You can use ${metadata.key} or ${msg.key} variables, and SQL parameters allow the use of? placeholders',
          component: {
            type: 'textarea',
            rows: 4,
          },
        },
        params: {
          label: 'Placeholder parameter list',
          desc: 'You can use ${metadata.key} to read variables from metadata or ${msg.key} to read variables from message payloads to replace them',
        },
        getOne: {
          label: 'Return a record',
          desc: '',
        },
        poolSize: {
          label: 'Connection pool size',
          desc: '',
        },
        driverName: {
          label: 'Database driver name',
          rules: [{ required: true, message: 'This field is required' }],
          desc: 'MySQL or Postgres; if other database types are needed, the corresponding database driver must be introduced',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
            options: [
              {
                label: 'mysql',
                value: 'mysql',
              },
              {
                label: 'postgres',
                value: 'postgres',
              },
            ],
          },
        },
        dsn: {
          label: 'Database connection',
          rules: [{ required: true, message: 'This field is required' }],
          desc: 'MySQL configuration example: username:password@tcp(127.0.0.1:3306)/db Postgres configuration example: postgres://username:password@127.0.0.1:5432/db?sslmode=disabled',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
      },
      mqttClient: {
        label: 'MQTT',
        icon: '/images/mqtt.svg',
        desc: '<a href="https://rulego.cc/pages/44aa9a/" target="_blank">Documentation</a>',
        topic: {
          label: 'Publish Topic',
          rules: [{ required: true, message: 'This field is required' }],
          desc: 'You can use ${metadata.key} to read variables from metadata or ${msg.key} to read variables from message payloads to replace them',
        },
        server: {
          label: 'MQTT server address',
          rules: [{ required: true, message: 'This field is required' }],
          desc: 'Example: 127.0.0.1:1883. Allows selection of connection pools for connections',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        username: {
          label: 'Username',
          desc: '',
        },
        password: {
          label: 'Password',
          desc: '',
        },
        maxReconnectInterval: {
          label: 'Reconnection interval, unit seconds',
          desc: '',
        },
        qOS: {
          label: 'QoS',
          desc: '',
        },
        clientID: {
          label: 'Client ID',
          desc: '',
        },
        cleanSession: {
          label: 'Clear the conversation',
          desc: '',
        },
        cAFile: {
          label: 'Certificate Issuing Authority (CA) documents',
          desc: '',
        },
        certFile: {
          label: 'Certificate documents',
          desc: '',
        },
        certKeyFile: {
          label: 'Certificate key file',
          desc: '',
        },
      },
      restApiCall: {
        label: 'REST',
        icon: '/images/rest.svg',
        desc: '<a href="https://rulego.cc/pages/f3a3d5/" target="_blank">Documentation</a>',
        restEndpointUrlPattern: {
          label: 'HTTP URL address',
          rules: [{ required: true, message: 'This field is required' }],
          desc: 'You can use ${metadata.key} to read variables from metadata or ${msg.key} to read variables from message payloads to replace them',
        },
        requestMethod: {
          label: 'Request method',
          rules: [{ required: true, message: 'This field is required' }],
          component: {
            type: 'select',
            filterable: true,
            allowCreate: false,
            multiple: false,
            options: [
              {
                label: 'POST',
                value: 'POST',
              },
              {
                label: 'GET',
                value: 'GET',
              },
              {
                label: 'DELETE',
                value: 'DELETE',
              },
              {
                label: 'PUT',
                value: 'PUT',
              },
              {
                label: 'PATCH',
                value: 'PATCH',
              },
              {
                label: 'HEAD',
                value: 'HEAD',
              },
            ],
          },
          desc: 'POST/GET/DELETE/PUT/PATCH/HEAD',
        },
        withoutRequestBody: {
          label: 'Do not transmit the request body',
          desc: 'Do not pass message payloads to configured service addresses',
        },
        headers: {
          label: 'Request Headers',
          desc: 'You can use ${metadata.key} to read variables from metadata or ${msg.key} to read variables from message payloads to replace them',
        },
        readTimeoutMs: {
          label: 'Timeout, unit: milliseconds. Default: 0',
          desc: '0 means no timeout',
        },
        insecureSkipVerify: {
          label: 'Disable certificate verification',
          desc: 'The self-visa certificate requires enabling disabled certificate verification',
        },
        maxParallelRequestsCount: {
          label: 'Maximum concurrency size',
          desc: '0 means no restrictions',
        },
        enableProxy: {
          label: 'Activate the agency',
          desc: '',
        },
        useSystemProxyProperties: {
          label: 'Use system proxy configuration',
          desc: '',
        },
        proxyScheme: {
          label: 'Proxy Protocol',
          desc: '',
        },
        proxyHost: {
          label: 'Proxy Host',
          desc: '',
        },
        proxyPort: {
          label: 'Proxy port',
          desc: '',
        },
        proxyUser: {
          label: 'Username',
          desc: '',
        },
        proxyPassword: {
          label: 'Password',
          desc: '',
        },
      },
      sendEmail: {
        label: 'Send an email',
        icon: '/images/email.svg',
        desc: '<a href="https://rulego.cc/pages/70c37d/" target="_blank">Documentation</a>',
        smtpHost: {
          label: 'SMTP host address',
          rules: [{ required: true, message: 'This field is required' }],
          desc: '',
        },
        smtpPort: {
          label: 'SMTP host port',
          rules: [{ required: true, message: 'This field is required' }],
          desc: '',
        },
        username: {
          label: 'Username',
          rules: [{ required: true, message: 'This field is required' }],
          desc: '',
        },
        password: {
          label: 'Authorization code',
          rules: [{ required: true, message: 'This field is required' }],
          desc: '',
        },
        enableTls: {
          label: 'Enable TLS',
          desc: '',
        },
        email: {
          label: 'Email content',
          desc: '',
          from: {
            label: 'From',
            desc: 'Separate multiple addresses with commas',
          },
          to: {
            label: 'To',
            desc: 'Separate multiple addresses with commas',
          },
          cc: {
            label: 'CC',
            desc: 'Separate multiple addresses with commas',
          },
          bcc: {
            label: 'BCC',
            desc: 'Separate multiple addresses with commas',
          },
          subject: {
            label: 'Email subject',
            desc: 'You can use ${metadata.key} to read variables from metadata or ${msg.key} to read variables from message payloads to replace them',
          },
          body: {
            label: 'Email content',
            desc: 'You can use ${metadata.key} to read variables from metadata or ${msg.key} to read variables from message payloads to replace them',
          },
        },
        connectTimeout: {
          label: 'Connection timeout, unit: seconds. Default: 10',
          desc: '',
        },
      },
      ssh: {
        label: 'SSH',
        icon: '/images/ssh.svg',
        desc: '<a href="https://rulego.cc/pages/fa62c1/" target="_blank">Documentation</a>',
        host: {
          label: 'SSH host address',
          rules: [{ required: true, message: 'This field is required' }],
          desc: '',
        },
        port: {
          label: 'SSH host port',
          rules: [{ required: true, message: 'This field is required' }],
          desc: '',
        },
        username: {
          label: 'ssh login username',
          desc: '',
        },
        password: {
          label: 'SSH login password',
          desc: '',
        },
        cmd: {
          label: 'shell command',
          rules: [{ required: true, message: 'This field is required' }],
          desc: 'You can use ${metadata.key} to read variables from metadata or ${msg.key} to read variables from message payloads to replace them',
        },
      },
      fieldFilter: {
        label: 'Field filtering',
        desc: '<a href="https://rulego.cc/pages/502031/" target="_blank">Documentation</a>',
        checkAllKeys: {
          label: 'Require All Field Keys',
          desc: '',
        },
        dataNames: {
          label: 'msg data field key',
          desc: 'Multiple are separated by commas',
        },
        metadataNames: {
          label: 'metadata field key',
          desc: 'Multiple are separated by commas',
        },
      },
      jsFilter: {
        label: 'JavaScript filtering',
        icon: '/images/jsFilter.svg',
        desc: '<a href="https://rulego.cc/pages/8269e5/" target="_blank">Documentation</a>',
        jsScript: {
          label: 'function Filter(msg, metadata, msgType) {',
          desc: '}',
        },
      },
      jsSwitch: {
        label: 'JS routing',
        desc: '<a href="https://rulego.cc/pages/bd9a27/" target="_blank">Documentation</a>',
        jsScript: {
          label: 'function Switch(msg, metadata, msgType) {',
          desc: '}',
        },
      },
      msgTypeSwitch: {
        label: 'Message Type Routing',
        icon: '/images/msgTypeSwitch.svg',
        desc: '<a href="https://rulego.cc/pages/09b453/" target="_blank">Documentation</a>',
      },
      exprFilter: {
        label: 'Expression filtering',
        icon: '/images/exp.svg',
        desc: '<ul><li>Use expr expressions to filter messages</li><li>Access the message body through `msg` variables. For example, `msg.temperature`</li><li>Access message metadata through `metadata` variables. For example, `metadata.customerName`</li><li>Access message types via `type` variables</li><li>Data types are accessed through `dataType` variables</li><a href="https://rulego.cc/pages/c8fe75/" target="_blank">Documentation</a></ul>',
        expr: {
          label: 'Filter expressions',
          desc: 'For example: msg.temperature>50, the return value must be of Boolean type',
          rules: [{ required: true, message: 'Filter expression is required' }],
        },
      },
      switch: {
        label: 'Conditional branch',
        icon: '/images/msgTypeSwitch.svg',
        desc: '<a href="https://rulego.cc/pages/switch/" target="_blank">Documentation</a>',
        cases: {
          label: 'Condition list',
          desc: 'Match the condition list in order. If matched, execute subsequent nodes according to routing; if not, execute the Default chain',
          component: {
            type: 'switchNode',
          },
        },
        relationTypeDynamics: true,
      },
      exprTransform: {
        label: 'Expression conversion',
        icon: '/images/exp.svg',
        desc: '<ul><li>Use expr expressions to convert or create new msg</li><li>Access the message body through `msg` variables. For example, `msg.temperature`</li><li>Access message metadata through `metadata` variables. For example, `metadata.customerName`</li><li>Access message types via `type` variables</li><li>Data types are accessed through `dataType` variables</li><a href="https://rulego.cc/pages/3769cc/" target="_blank">Documentation</a></ul>',
        expr: {
          label: 'Convert expressions',
          desc: 'For example: msg.name. If a field has a value, it is used first.',
        },
        mapping: {
          label: 'Field-Expression Mapping List (Create a new MSG)',
          desc: 'Key: Field name, Value: Expression. If the field has a value, create a new MSG based on the specified field and the transformation expression',
        },
      },
      metadataTransform: {
        label: 'Metadata transformation',
        icon: '/images/metadata.svg',
        desc: '<ul><li>Use expr expressions to transform or create new metadata</li><li>Access the message body through `msg` variables. For example, `msg.temperature`</li><li>Access message metadata through `metadata` variables. For example, `metadata.customerName`</li><li>Access message types via `type` variables</li><li>Data types are accessed through `dataType` variables</li><a href="https://rulego.cc/pages/316efe/" target="_blank">Documentation</a></ul>',
        mapping: {
          label: 'Field-Expression Mapping List',
          desc: "Key: Field name, Value: Transform expression. If not an expression, use single quotes, e.g., 'xx'",
        },
        isNew: {
          label: 'Create New Metadata',
          desc: 'true: creates a new metadata list; false: updates the corresponding metadata key',
        },
      },
      jsTransform: {
        label: 'JavaScript conversion',
        desc: '<a href="https://rulego.cc/pages/794696/" target="_blank">Documentation</a>',
        jsScript: {
          label: 'function Transform(msg, metadata, msgType) {',
          desc: '}',
        },
      },
      net: {
        label: 'TCP/UDP',
        icon: '/images/net.svg',
        desc: '<a href="https://rulego.cc/pages/c1af87/" target="_blank">Documentation</a>',
        protocol: {
          label: 'Protocol',
          desc: 'tcp/udp',
          rules: [{ required: true, message: 'Protocol is required' }],
          component: {
            type: 'select',
            filterable: true,
            allowCreate: false,
            multiple: false,
            options: [
              {
                label: 'TCP',
                value: 'tcp',
              },
              {
                label: 'UDP',
                value: 'udp',
              },
            ],
          },
        },
        server: {
          label: 'Service address',
          rules: [{ required: true, message: 'A service address is required' }],
          desc: 'Example: 127.0.0.1:6335',
        },
        connectTimeout: {
          label: 'Connection timeout, unit seconds, default 60',
        },
        heartbeatInterval: {
          label:
            'Heartbeat interval, measured in seconds, zero does not send heartbeats',
        },
      },
      flow: {
        label: 'Sub-rule Chains',
        desc: '<a href="https://rulego.cc/pages/e27cec/" target="_blank">Documentation</a>',
        targetId: {
          label: 'Subrule chain ID',
          desc: '',
          rules: [
            { required: true, message: 'The subrule chain ID is required' },
          ],
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
            loadData: async function (lf, currentNodeModel, field, query) {
              if (!query) {
                let options = [];
                try {
                  const { data } = await getWorkflowList(
                    false,
                    '',
                    1,
                    500,
                    false,
                  );
                  // let data=  await fetch(   lf.getEditorSetting()?.url+'/api/v1/rules?root=false').then(response => response.json())
                  data?.items.forEach((item) => {
                    options.push({
                      value: item.ruleChain.id,
                      label: item.ruleChain.name,
                    });
                  });
                } catch (e) {
                } finally {
                  field.component.options = options;
                }
              }
            },
          },
        },
        extend: {
          label: 'Inheritance model',
          desc: 'If enabled, do not merge the sub-rule chain output relationships and messages',
          rules: [
            { required: true, message: 'The subrule chain ID is required' },
          ],
        },
      },
      ref: {
        label: 'Node reference',
        icon: '/images/ref.svg',
        relationTypeAllowCreate: true,
        relationTypes: [
          { label: 'Success', value: 'Success' },
          { label: 'Failure', value: 'Failure' },
          { label: 'True', value: 'True' },
          { label: 'False', value: 'False' },
        ],
        desc: '<a href="https://rulego.cc/pages/ref_node/" target="_blank">Documentation</a>',
        targetId: {
          label: 'Node ID',
          desc: 'References other nodes in this rule chain',
          rules: [{ required: true, message: 'Node ID is required' }],
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
            loadData: loadSelectNodes,
          },
        },
      },
      groupFilter: {
        label: 'Filter group',
        icon: '/images/groupFilter.svg',
        desc: '<a href="https://rulego.cc/pages/b14e3b/" target="_blank">Documentation</a>',
        allMatches: {
          label: 'Is full matching necessary?',
          desc: '',
        },
        nodeIds: {
          label: 'List of node IDs within the group',
          desc: '',
          rules: [
            {
              required: true,
              message: 'The node ID within the group is required',
            },
          ],
          component: {
            type: 'select',
            filterable: true,
            allowCreate: false,
            multiple: true,
            loadData: loadSelectNodes,
          },
        },
        timeout: {
          label:
            'Executes timeout within the group, measured in seconds, default 0',
          desc: 'Default 0 means no timeout',
        },
      },
      groupAction: {
        label: 'Node groups',
        desc: '<ul><li>Asynchronously executing multiple nodes, merging all node results and sending them to the next node</li><li>If the matched number of nodes all specify the relationship type, the data is sent to the `Success` chain; otherwise, it is sent to the `Failure` chain</li><a href="https://rulego.cc/pages/bf06e2/" target="_blank">Documentation</a></ul>',
        icon: '/images/groupAction.svg',
        matchRelationType: {
          label: 'Match relationships, default is Success',
          desc: '',
        },
        matchNum: {
          label:
            'Matches the number of nodes that meet the requirements, default is 0',
          desc: 'By default, 0 means all nodes satisfy the specified relationship',
        },
        nodeIds: {
          label: 'List of node IDs within the group',
          desc: '',
          rules: [
            {
              required: true,
              message: 'The node ID within the group is required',
            },
          ],
          component: {
            type: 'select',
            filterable: true,
            allowCreate: false,
            multiple: true,
            loadData: loadSelectNodes,
          },
        },
        timeout: {
          label:
            'Executes timeout within the group, measured in seconds, default 0',
          desc: 'Default 0 means no timeout',
        },
      },
      iterator: {
        label: 'Iterator',
        desc: '<ul><li>Deprecated; use the for component instead</li><li>Iterates over msg or a selected field and sends each item to the next node. The value must be an `array` or `{key:value}` object</li><li>If an item matches jsScript, it is sent through the `True` chain; otherwise, it is sent through the `False` chain</li><li>If the field is missing, the script fails, or the value is not an `array` or `{key:value}` object, the error is sent through the `Failure` chain</li><li>After iteration, the original msg is sent through the `Success` chain</li><a href="https://rulego.cc/pages/5898a0/" target="_blank">Documentation</a></ul>',
        icon: '/images/iterator.svg',
        fieldName: {
          label: 'Traverse the field',
          desc: 'If empty, traverse the entire msg and support nested methods to obtain the msg field values, such as items.value, items',
        },
        jsScript: {
          label: 'function Filter(item,index,metadata) {',
          desc: '} Match the JS script for the item, optional; if empty, iterate through all items',
        },
      },
      join: {
        label: 'Join',
        desc: '<ul><li>Merge the execution results of multiple asynchronous nodes</li><a href="https://rulego.cc/pages/join/" target="_blank">Documentation</a></ul>',
        icon: '/images/join.svg',
        timeout: {
          label:
            'Executes timeout within the group, measured in seconds, default 0',
          desc: 'Default 0 means no timeout',
        },
      },
      fork: {
        label: 'Parallel gateway',
        desc: '<ul><li>Split the stream into multiple parallel execution paths</li><a href="https://rulego.cc/pages/fork/" target="_blank">Documentation</a></ul>',
        icon: '/images/fork.svg',
      },
      'text/template': {
        label: 'Template conversion',
        icon: '/images/template.svg',
        desc: '<a href="https://rulego.cc/pages/3ffde3/" target="_blank">Documentation</a>',
        template: {
          label: 'Template content or file path',
          desc: 'Prefix template file paths with file:',
          component: {
            type: 'codeEditor',
          },
        },
      },
      exec: {
        label: 'Command line',
        icon: '/images/ssh.svg',
        desc: '<ul><li>Only executes commands from the system whitelist</li><a href="https://rulego.cc/pages/413ea9/" target="_blank">Documentation</a></ul>',
        cmd: {
          label: 'Execute the command',
          desc: '',
          rules: [{ required: true, message: 'Command is required' }],
        },
        args: {
          label: 'Parameters',
          desc: 'You can use ${metadata.key} to read variables from metadata or ${msg.key} to read variables from message payloads to replace them',
        },
        log: {
          label: 'Print standard output',
          desc: '',
        },
        replaceData: {
          label: 'Replace Data',
          desc: 'Replace Data with standard output, default is false',
        },
      },
      'x/redisClient': {
        label: 'Redis',
        icon: '/images/redis.svg',
        desc: '<a href="https://rulego.cc/pages/de062b/" target="_blank">Documentation</a>',
        server: {
          label: 'Redis server address',
          desc: '',
          rules: [
            { required: true, message: 'The Redis server address is required' },
          ],
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        password: {
          label: 'Password',
          desc: '',
        },
        poolSize: {
          label: 'Connection pool size',
          desc: '',
        },
        db: {
          label: 'Database Index',
          rules: [
            { required: true, message: 'This field is required' },
            { type: 'integer', required: true, message: 'Must be an integer' },
          ],
          desc: 'Default is 0',
        },
        cmd: {
          label: 'Execute commands such as SET/GET/DEL/HMSET/HMGET',
          desc: 'Supports reading metadata ${metadata.key} placeholders, reading specified key data from message payload ${msg.key} placeholders, and ${data} obtaining original message payload',
          rules: [{ required: true, message: 'Command is required' }],
        },
        paramsExpr: {
          label: 'Command dynamic parameters',
          desc: 'Supports Expr expressions. For example: ["myhash2", "field1", "value1"], or using variables to take values such as: msg represents message payload. Command dynamic parameters and static command parameters: priority is given to dynamic command parameters.',
        },
        params: {
          label: 'Command static parameters',
          desc: 'Supports reading metadata ${metadata.key} placeholders, reading specified key data from message payload ${msg.key} placeholders, and ${data} obtaining original message payload',
        },
      },
      'x/redisPub': {
        label: 'Redis Publish',
        icon: '/images/redis.svg',
        desc: '<a href="https://rulego.cc/pages/x_redis_pub/" target="_blank">Documentation</a>',
        server: {
          label: 'Redis server address',
          desc: '',
          rules: [
            { required: true, message: 'The Redis server address is required' },
          ],
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        password: {
          label: 'Password',
          desc: '',
        },
        poolSize: {
          label: 'Connection pool size',
          desc: '',
        },
        db: {
          label: 'Database Index',
          rules: [
            { required: true, message: 'This field is required' },
            { type: 'integer', required: true, message: 'Must be an integer' },
          ],
          desc: 'Default is 0',
        },
        channel: {
          label: 'Publish Channel',
          desc: 'Supports reading metadata ${metadata.key} placeholders and ${msg.key} placeholders to read message payload specified key data',
          rules: [{ required: true, message: 'Publish channel is required' }],
        },
      },
      'x/kafkaProducer': {
        label: 'Kafka',
        icon: '/images/kafka.svg',
        desc: '<a href="https://rulego.cc/pages/fa986d/" target="_blank">Documentation</a>',
        server: {
          label: 'Kafka server address',
          desc: 'Multiple server addresses are separated by commas, such as: 127.0.0.1:9092, 127.0.0.2:9092',
          rules: [
            { required: true, message: 'The server address is required' },
          ],
        },
        topic: {
          label: 'Publish Topic',
          desc: 'You can use ${metadata.key} to read variables from metadata or ${msg.key} to read variables from message payloads to replace them',
          rules: [{ required: true, message: 'Topic is required' }],
        },
        key: {
          label: 'Partition key',
          desc: 'You can use ${metadata.key} to read variables from metadata or ${msg.key} to read variables from message payloads to replace them',
        },
        partition: {
          label: 'Partition Number',
          desc: '',
        },
      },
      'x/luaFilter': {
        label: 'Lua script filtering',
        icon: '/images/lua.svg',
        desc: '<ul><li>Use Lua scripts to filter msg, metadata, and msgType. Routes to True or False chains based on the script\'s return values.</li><li>You can also use LUA scripts to perform advanced operations such as encryption and decryption, I/O, networking, and file operations</li><a href="https://rulego.cc/pages/5d61cc/" target="_blank">Documentation</a></ul>',
        script: {
          label: 'Script function body or script file path',
          desc: "You only need to provide the function body content; if it's a file path, you need to provide the full script function",
        },
      },
      'x/luaTransform': {
        label: 'Lua script conversion',
        icon: '/images/lua.svg',
        desc: '<ul><li>Lua script converter. Lua scripts can be used to convert or enhance msg, metadata, and msgType.</li><li>You can also use LUA scripts to perform advanced operations such as encryption and decryption, I/O, networking, and file operations</li><a href="https://rulego.cc/pages/bf0eaf/" target="_blank">Documentation</a></ul>',
        script: {
          label: 'Script function body or script file path',
          desc: "You only need to provide the function body content; if it's a file path, you need to provide the full script function",
        },
      },
      'x/natsClient': {
        label: 'NATS',
        icon: '/images/nats.svg',
        desc: '<a href="https://rulego.cc/pages/9e177d/" target="_blank">Documentation</a>',
        topic: {
          label: 'Publish Topic',
          rules: [{ required: true, message: 'This field is required' }],
          desc: 'You can use ${metadata.key} to read variables from metadata or ${msg.key} to read variables from message payloads to replace them',
        },
        server: {
          label: 'NATS service address',
          rules: [{ required: true, message: 'This field is required' }],
          desc: 'Example: nats://127.0.0.1:4222',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        username: {
          label: 'Username',
          desc: '',
        },
        password: {
          label: 'Password',
          desc: '',
        },
      },
      'x/rabbitmqClient': {
        label: 'RabbitMQ',
        icon: '/images/rabbitmq.svg',
        desc: '<ul><li>Send message payloads to the RabbitMQ queue</li><li>Supports AMQP protocol</li><li><a href="https://rulego.cc/pages/rabbitmq-client/" target="_blank">Documentation</li></ul></a>',
        server: {
          label: 'Service address',
          rules: [{ required: true, message: 'This field is required' }],
          desc: 'Format: amqp://[username:password]@host/[virtual-host]',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        key: {
          label: 'Routing Key',
          desc: 'You can use ${metadata.key} to read variables from metadata or ${msg.key} to read variables from message payloads to replace them',
        },
        exchange: {
          label: 'Exchange Name',
          desc: '',
        },
        exchangeType: {
          label: 'Exchange Type',
          desc: 'Optional types: direct/fanout/headers/topic',
        },
        durable: {
          label: 'Durable',
          desc: '',
        },
        autoDelete: {
          label: 'Auto-Delete',
          desc: '',
        },
      },
      'x/opengeminiWrite': {
        label: 'OpenGemini Write',
        icon: '/images/opengemini-write.svg',
        desc: '<a href="https://rulego.cc/pages/opengemini-write/" target="_blank">Documentation</a>',
        server: {
          label: 'OpenGemini service address',
          desc: 'Format: Hostname: Port, multiple service addresses separated by commas',
          rules: [
            { required: true, message: 'The server address is required' },
          ],
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        database: {
          label: 'Database',
          desc: 'Allows the use of ${} placeholder variables, such as: ${metadata.key}, ${msg.key}',
          rules: [{ required: true, message: 'Database is required' }],
        },
        username: {
          label: 'Username',
          desc: '',
        },
        password: {
          label: 'Password',
          desc: '',
        },
        token: {
          label: 'Token',
          desc: 'If the token is not empty, use token authentication',
        },
      },
      'x/opengeminiQuery': {
        label: 'OpenGemini Query',
        icon: '/images/opengemini.svg',
        desc: '<a href="https://rulego.cc/pages/opengemini-query/" target="_blank">Documentation</a>',
        server: {
          label: 'OpenGemini service address',
          desc: 'Format: Hostname: Port, multiple service addresses separated by commas',
          rules: [{ required: true, message: 'A service address is required' }],
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        database: {
          label: 'Database',
          desc: 'Allows the use of ${} placeholder variables, such as: ${metadata.key}, ${msg.key}',
          rules: [{ required: true, message: 'Database is required' }],
        },
        username: {
          label: 'Username',
          desc: '',
        },
        password: {
          label: 'Password',
          desc: '',
        },
        token: {
          label: 'Token',
          desc: 'If the token is not empty, use token authentication',
        },
        command: {
          label: 'query statement',
          desc: 'Allows the use of ${} placeholder variables, such as: ${metadata.key}, ${msg.key}',
          rules: [
            { required: true, message: 'The server address is required' },
          ],
        },
      },
      'x/grpcClient': {
        label: 'gRPC client',
        icon: '/images/grpc.svg',
        desc: '<ul><li>Dynamically invoke gRPC services</li></li></ul><a href="https://rulego.cc/pages/grpc-client/" target="_blank">Documentation</a>',
        server: {
          label: 'gRPC service address',
          desc: 'Format: Hostname: Port',
          rules: [{ required: true, message: 'A service address is required' }],
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        service: {
          label: 'Service name',
          desc: 'Example: helloworld.Greeter. Supports ${} placeholder variables',
          rules: [{ required: true, message: 'The service name is required' }],
        },
        method: {
          label: 'Method name',
          desc: 'Example: SayHello. Allows the use of ${} placeholder variables',
          rules: [{ required: true, message: 'The method name is required' }],
        },
        request: {
          label: 'Request parameter content',
          desc: 'Example: {"name":"lala"}. If empty, use the current message payload. Parameters use JSON encoding and must match service/method requirements. Allows the use of ${} placeholder variables',
          component: {
            type: 'textarea',
          },
        },
        headers: {
          label: 'Request Headers',
          desc: 'Allows the use of ${} placeholder variables',
        },
      },
      'x/mongodbClient': {
        label: 'MongoDB',
        icon: '/images/mongodb.svg',
        desc: '<ul><li>MongoDB client</li></li></ul><a href="https://rulego.cc/pages/mongodb-client/" target="_blank">Documentation</a>',
        server: {
          label: 'MongoDB service address',
          rules: [{ required: true, message: 'This field is required' }],
          desc: 'Allows selection of connection pools for connection',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        database: {
          label: 'Database',
          desc: 'Allows the use of ${} placeholder variables',
          rules: [{ required: true, message: 'This field is required' }],
        },
        collection: {
          label: 'Assembly',
          desc: 'Allows the use of ${} placeholder variables',
          rules: [{ required: true, message: 'This field is required' }],
        },
        opType: {
          label: 'Operation type',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: false,
            multiple: false,
            options: [
              {
                label: 'Insert',
                value: 'INSERT',
              },
              {
                label: 'Inquiry',
                value: 'QUERY',
              },
              {
                label: 'Update',
                value: 'UPDATE',
              },
              {
                label: 'Delete',
                value: 'DELETE',
              },
            ],
          },
          rules: [{ required: true, message: 'This field is required' }],
          desc: '',
        },
        filter: {
          label: 'Filtration conditions',
          desc: 'The query can be null. Allow the Expr expression, for example: {"age"": {"$gte": 18 }.',
        },
        doc: {
          label: 'Update/Insert Documents',
          desc: 'Queries or deletions can be empty. Allow Expr expressions, for example: {"name":"test","age":18}.',
        },
        one: {
          label: 'Whether to operate one record',
          desc: '',
        },
      },
      'ai/createImage': {
        label: 'AI image generation',
        icon: '/images/generate-image.svg',
        desc: '<ul><li>Generate images through prompts</li><a href="https://rulego.cc/pages/b0e537/" target="_blank">Documentation</a></ul>',
        url: {
          label: 'API address',
          rules: [{ required: true, message: 'This field is required' }],
          desc: '',
        },
        key: {
          label: 'Authorization key',
          desc: '',
        },
        model: {
          label: 'Model',
          desc: 'Allows manual model input',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
            options: [
              {
                label: 'dall-e-3',
                value: 'dall-e-3',
              },
              {
                label: 'dall-e-2',
                value: 'dall-e-2',
              },
            ],
          },
        },
        prompt: {
          label: 'Image generation prompts',
          desc: '',
          rules: [{ required: true, message: 'This field is required' }],
          component: {
            type: 'textarea',
          },
        },
        n: {
          label: 'The number of generated images',
          desc: '',
          component: {
            type: 'slider',
            showInput: true,
            showTooltip: true,
            min: 1,
            max: 10,
            step: 1,
          },
        },
        responseFormat: {
          label: 'Response format',
          desc: 'Default: url',
          rules: [{ required: true, message: 'This field is required' }],
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
            options: [
              {
                label: 'url',
                value: 'url',
              },
              {
                label: 'b64_json',
                value: 'b64_json',
              },
            ],
          },
        },
        quality: {
          label: 'Image quality',
          desc: 'Default: standard',
          rules: [{ required: true, message: 'This field is required' }],
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
            options: [
              {
                label: 'standard',
                value: 'standard',
              },
              {
                label: 'hd',
                value: 'hd',
              },
            ],
          },
        },
        size: {
          label: 'Image size',
          desc: 'Default: 1024x1024',
          rules: [{ required: true, message: 'This field is required' }],
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
            options: [
              {
                label: '256x256',
                value: '256x256',
              },
              {
                label: '512x512',
                value: '512x512',
              },
              {
                label: '1024x1024',
                value: '1024x1024',
              },
              {
                label: '1792x1024',
                value: '1792x1024',
              },
              {
                label: '1024x1792',
                value: '1024x1792',
              },
            ],
          },
        },
        style: {
          label: 'Image style',
          desc: 'Default: vivid',
          rules: [{ required: true, message: 'This field is required' }],
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
            options: [
              {
                label: 'vivid',
                value: 'vivid',
              },
              {
                label: 'natural',
                value: 'natural',
              },
            ],
          },
        },
      },
      'ai/llm': {
        label: 'AI text generation',
        icon: '/images/generate-text.svg',
        desc: '<ul><li>Generate text through prompts</li><a href="https://rulego.cc/pages/a43229/" target="_blank">Documentation</a></ul>',
        url: {
          label: 'API address',
          desc: '',
        },
        key: {
          label: 'Authorization key',
          desc: '',
        },
        model: {
          label: 'Model',
          desc: 'Allows manual model input',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
            options: [
              {
                label: 'DeepSeek-R1-Distill-Qwen-32B',
                value: 'DeepSeek-R1-Distill-Qwen-32B',
              },
              {
                label: 'DeepSeek-R1',
                value: 'DeepSeek-R1',
              },
              {
                label: 'Qwen2-7B-Instruct',
                value: 'Qwen2-7B-Instruct',
              },
              {
                label: 'Qwen2-VL-72B',
                value: 'Qwen2-VL-72B',
              },
              {
                label: 'o1-mini',
                value: 'o1-mini',
              },
              {
                label: 'gpt-4o',
                value: 'gpt-4o',
              },
              {
                label: 'gpt-4o-mini',
                value: 'gpt-4o-mini',
              },
            ],
          },
        },
        systemPrompt: {
          label: 'System notification',
          desc: 'The basic behavioral framework and response style for predefining the model. You can use ${} placeholder variables',
          component: {
            type: 'textarea',
          },
        },
        messages: {
          label: 'Context/user message list',
          desc: '',
          rules: [{ required: true, message: 'This field is required' }],
          component: {
            type: 'table',
            options: [
              {
                name: 'role',
                label: 'Role',
                type: 'string',
                rules: [{ required: true, message: 'This field is required' }],
                component: {
                  type: 'select',
                  multiple: false,
                  options: [
                    {
                      label: 'USER',
                      value: 'user',
                    },
                    {
                      label: 'ASSISTANT',
                      value: 'assistant',
                    },
                  ],
                },
              },
              {
                name: 'content',
                label: 'News content',
                type: 'string',
                rules: [{ required: true, message: 'This field is required' }],
                desc: 'USER role: Provides commands, queries, or any text-based input to the model. ASSISTANT role: Model replies based on user messages',
                component: {
                  type: 'textarea',
                },
              },
            ],
          },
        },
        images: {
          label: 'Vision',
          desc: 'The image URL list will be answered by the large model based on its understanding of the image content. This feature requires large model API support (Qwen2-VL-72B supports vision). You can use ${} placeholder variables',
        },
        params: {
          label: 'Large model parameters',
          desc: '',
          temperature: {
            label: 'Temperature',
            desc: 'Sampling temperature controls the randomness of the output. The temperature value is within the range of [0.0, 2.0]; the higher the value, the more random and creative the output; The lower the value, the more stable the output.',
            component: {
              type: 'slider',
              showInput: true,
              showTooltip: true,
              min: 0.0,
              max: 2.0,
              step: 0.1,
            },
          },
          topP: {
            label: 'Top P',
            desc: 'Diversity is controlled by core sampling: 0.5 means half of all probability-weighted options are considered. Value range: [0.0, 1.0]',
            component: {
              type: 'slider',
              showInput: true,
              showTooltip: true,
              min: 0.0,
              max: 1.0,
              step: 0.1,
            },
          },
          presencePenalty: {
            label: 'There is punishment',
            desc: 'A penalty is applied to the logarithmic probability of existing markers in the text',
            component: {
              type: 'slider',
              showInput: true,
              showTooltip: true,
              min: 0.0,
              max: 1.0,
              step: 0.1,
            },
          },
          frequencyPenalty: {
            label: 'Frequent penalties',
            desc: 'A penalty is applied to the logarithmic probability of the marker appearing in the text. Value range [0.0, 1.0]',
            component: {
              type: 'slider',
              showInput: true,
              showTooltip: true,
              min: 0.0,
              max: 1.0,
              step: 0.1,
            },
          },
          maxTokens: {
            label: 'Maximum output length',
            desc: '',
            component: {
              type: 'input-number',
              min: 0,
              max: 1000000,
              step: 10,
            },
          },
          stop: {
            label: 'Marker when the model stops output',
            desc: '',
          },
          responseFormat: {
            label: 'Format of output results',
            desc: 'Values: text, json_object, json_schema. The default is text.',
            component: {
              type: 'select',
              multiple: false,
              options: [
                {
                  label: 'text',
                  value: 'text',
                },
                {
                  label: 'json_object',
                  value: 'json_object',
                },
                {
                  label: 'json_schema',
                  value: 'json_schema',
                },
              ],
            },
          },
          jsonSchema: {
            label: 'JSON Schema',
            desc: '',
            component: {
              type: 'codeEditor',
            },
          },
          keepThink: {
            label: 'Whether to retain the output of the thought process',
            desc: 'It only applies to text response formats',
          },
        },
      },
      'ci/exec': {
        label: 'Command line',
        icon: '/images/ssh.svg',
        desc: '<ul><li>Only executes commands from the system whitelist</li></ul>',
        command: {
          label: 'Execute the command',
          desc: '',
        },
        args: {
          label: 'Parameters',
          desc: 'You can use ${metadata.key} to read variables from metadata or ${msg.key} to read variables from message payloads to replace them',
        },
        log: {
          label: 'Print standard output',
          desc: '',
        },
        replaceData: {
          label: 'Replace Data',
          desc: 'Replace Data with standard output, default is false',
        },
      },
      'ci/gitClone': {
        label: 'Git pull',
        icon: '/images/git.svg',
        desc: '<ul><li>Git cloning or pulling repository code</li><a href="https://rulego.cc/pages/ci-git-clone/" target="_blank">Documentation</a></ul>',
        repository: {
          label: 'Warehouse address',
          desc: 'Example: https://github.com/rulego/rulego.git',
        },
        directory: {
          label: 'Clone to the local directory',
          desc: 'By default, it takes the workDir value from the metadata',
        },
        reference: {
          label: 'Quoting names',
          desc: 'Can be branch names, tag names, or full reference names. For example: refs/heads/main. By default, the ref value from the metadata is taken',
        },
        authType: {
          label: 'Types of certification',
          desc: 'It can be: ssh/password/token',
        },
        authUser: {
          label: 'Username',
          desc: '',
        },
        authPassword: {
          label: 'Password or token',
          desc: 'Password or token',
        },
        authPemFile: {
          label: 'Key file path',
          desc: '',
        },
        proxyUrl: {
          label: 'Proxy URL',
          desc: '',
        },
        proxyUsername: {
          label: 'Proxy usernames',
          desc: '',
        },
        proxyPassword: {
          label: 'Proxy password',
          desc: '',
        },
      },
      'ci/gitPush': {
        label: 'Git push',
        icon: '/images/git-push.svg',
        desc: '<ul><li>Git push</li><a href="https://rulego.cc/pages/ci-git-push/" target="_blank">Documentation</a></ul>',
        repository: {
          label: 'Warehouse address',
          desc: 'Example: https://github.com/rulego/rulego.git',
        },
        directory: {
          label: 'Local directory',
          desc: 'By default, it takes the workDir value from the metadata',
        },
        refSpecs: {
          label: 'Mapping between local branches and remote branches',
          desc: 'For example: refs/heads/your-branch:refs/heads/your-branch. Separate multiple mappings with commas.',
        },
        authType: {
          label: 'Types of certification',
          desc: 'It can be: ssh/password/token',
        },
        authUser: {
          label: 'Username',
          desc: '',
        },
        authPassword: {
          label: 'Password or token',
          desc: 'Password or token',
        },
        authPemFile: {
          label: 'Key file path',
          desc: '',
        },
        proxyUrl: {
          label: 'Agent address',
          desc: '',
        },
        proxyUsername: {
          label: 'Proxy usernames',
          desc: '',
        },
        proxyPassword: {
          label: 'Proxy password',
          desc: '',
        },
      },
      'ci/gitCommit': {
        label: 'Git submission',
        icon: '/images/git-commit.svg',
        desc: '<ul><li>git submission; if the file hasn\'t changed, it is forwarded to the failed chain</li><a href="https://rulego.cc/pages/ci-git-commit/" target="_blank">Documentation</a></ul>',
        directory: {
          label: 'Local directory',
          desc: 'By default, it takes the workDir value from the metadata',
        },
        pattern: {
          label: 'Added file matching mode',
          desc: 'The current workspace must be relative to the directory. For example: /example/*.go',
          rules: [
            {
              required: true,
              message: 'The added file matching pattern is required',
            },
          ],
        },
        message: {
          label: 'Git submission',
          desc: '',
          rules: [{ required: true, message: 'Committing messages is a must' }],
        },
        signature: {
          label: 'Author information',
          desc: '',
          authorName: {
            label: 'Author name',
            desc: '',
          },
          authorEmail: {
            label: "Author's email",
            desc: '',
          },
        },
      },
      'ci/gitCreateTag': {
        label: 'Git creates tags',
        icon: '/images/git-tag.svg',
        desc: '<ul><li>git submission; if the file hasn\'t changed, it is forwarded to the failed chain</li><a href="https://rulego.cc/pages/ci-git-create-tag/" target="_blank">Documentation</a></ul>',
        directory: {
          label: 'Local directory',
          desc: 'By default, it takes the workDir value from the metadata',
        },
        tag: {
          label: 'Label name',
          desc: '',
          rules: [{ required: true, message: 'The label name is required' }],
        },
        message: {
          label: 'Label messages',
          desc: '',
          rules: [{ required: true, message: 'Label messages are a must' }],
        },
        signature: {
          label: 'Author information',
          desc: '',
          authorName: {
            label: 'Author name',
            desc: '',
          },
          authorEmail: {
            label: "Author's email",
            desc: '',
          },
        },
      },
      'ci/gitLog': {
        label: 'Get the Git log',
        icon: '/images/git-log.svg',
        desc: '<ul><li>Retrieve the git commit log</li><a href="https://rulego.cc/pages/ci-git-log/" target="_blank">Documentation</a></ul>',
        directory: {
          label: 'Local directory',
          desc: 'Allows ${msg.xx} to obtain via variables. Defaults to ${metadata.workDir} value',
        },
        limit: {
          label: 'Maximum log count',
          desc: '',
          rules: [],
        },
        startTime: {
          label: 'Initial submission time',
          desc: 'Allows ${msg.xx} to obtain via variable. yyyy-MM-dd or yyyy-MM-dd HH:mm:ss format example: 2006-01-02 15:04:05',
        },
        endTime: {
          label: 'End of submission period',
          desc: 'Allows ${msg.xx} to obtain via variable. yyyy-MM-dd or yyyy-MM-dd HH:mm:ss format example: 2006-01-02 15:04:05',
        },
      },
      'ci/ps': {
        label: 'Server metrics',
        icon: '/images/ps.svg',
        desc: 'Used to monitor server CPU, memory, disk, and other metrics.<a href="https://rulego.cc/pages/ci-ps/" target="_blank">Documentation</a>',
        options: {
          label: 'List of indicators',
          desc: 'If it is empty, query all metrics',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: true,
            options: [
              { label: 'Host information', value: 'host/info' },
              { label: 'CPU information', value: 'cpu/info' },
              {
                label: 'Virtual memory information',
                value: 'mem/virtualMemory',
              },
              { label: 'Exchange memory information', value: 'mem/swapMemory' },
              { label: 'Disk usage', value: 'disk/usage' },
              {
                label: 'Disk IO counter information',
                value: 'disk/ioCounters',
              },
              {
                label: 'Network IO counter information',
                value: 'net/ioCounters',
              },
              {
                label: 'Network interface information',
                value: 'net/interfaces',
              },
            ],
            placeholder: 'Please select the query indicator',
          },
        },
      },
      'x/opcuaRead': {
        label: 'OPC_UA read',
        icon: '/images/opcua_read.svg',
        category: 'iot',
        desc: '<ul><li>Retrieves the list of node location data for message payload and moves to the next node via the Success chain.</li><a href="https://rulego.cc/pages/x-opcua-read/" target="_blank">Documentation</a></ul>',
        server: {
          label: 'Server address',
          rules: [{ required: true, message: 'This field is required' }],
          desc: 'Example: opc.tcp://localhost:4840',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        auth: {
          label: 'Authorization method',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
            options: [
              {
                label: 'Anonymous',
                value: 'anonymous',
              },
              {
                label: 'Username',
                value: 'username',
              },
              {
                label: 'Certificate',
                value: 'certificate',
              },
            ],
          },
        },
        username: {
          label: 'Username',
          desc: 'If the authorization method is a username, you need to fill it in',
        },
        password: {
          label: 'Password',
          desc: 'If the authorization method is a username, you need to fill it in',
        },
        certFile: {
          label: 'Certificate file path',
          desc: 'If the authorization method is a certificate, it needs to be filled in',
        },
        certKeyFile: {
          label: 'Key file path',
          desc: 'If the authorization method is a certificate, it needs to be filled in',
        },
        mode: {
          label: 'Pattern',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
            options: [
              {
                label: 'Auto',
                value: 'auto',
              },
              {
                label: 'None',
                value: 'none',
              },
              {
                label: 'Sign',
                value: 'sign',
              },
              {
                label: 'Signandencrypt',
                value: 'signandencrypt',
              },
            ],
          },
        },
        policy: {
          label: 'Strategy',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
            options: [
              {
                label: 'Auto',
                value: 'auto',
              },
              {
                label: 'None',
                value: 'none',
              },
              {
                label: 'Basic128Rsa15',
                value: 'Basic128Rsa15',
              },
              {
                label: 'Basic256',
                value: 'Basic256',
              },
              {
                label: 'Basic256Sha256',
                value: 'Basic256Sha256',
              },
              {
                label: 'Aes128_Sha256_RsaOaep',
                value: 'Aes128_Sha256_RsaOaep',
              },
              {
                label: 'Aes256_Sha256_RsaPss',
                value: 'Aes256_Sha256_RsaPss',
              },
            ],
          },
        },
      },
      'x/opcuaWrite': {
        label: 'OPC_UA write',
        icon: '/images/opcua_write.svg',
        category: 'iot',
        desc: '<ul><li>Write the message payload point data list into the OPC UA server.</li><a href="https://rulego.cc/pages/x-opcua-write/" target="_blank">Documentation</a></ul>',
        server: {
          label: 'Server address',
          rules: [{ required: true, message: 'This field is required' }],
          desc: 'Example: opc.tcp://localhost:4840',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        auth: {
          label: 'Authorization method',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
            options: [
              {
                label: 'Anonymous',
                value: 'anonymous',
              },
              {
                label: 'Username',
                value: 'username',
              },
              {
                label: 'Certificate',
                value: 'certificate',
              },
            ],
          },
        },
        username: {
          label: 'Username',
          desc: 'If the authorization method is a username, you need to fill it in',
        },
        password: {
          label: 'Password',
          desc: 'If the authorization method is a username, you need to fill it in',
        },
        certFile: {
          label: 'Certificate file path',
          desc: 'If the authorization method is a certificate, it needs to be filled in',
        },
        certKeyFile: {
          label: 'Key file path',
          desc: 'If the authorization method is a certificate, it needs to be filled in',
        },
        mode: {
          label: 'Pattern',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
            options: [
              {
                label: 'Auto',
                value: 'auto',
              },
              {
                label: 'None',
                value: 'none',
              },
              {
                label: 'Sign',
                value: 'sign',
              },
              {
                label: 'Signandencrypt',
                value: 'signandencrypt',
              },
            ],
          },
        },
        policy: {
          label: 'Strategy',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
            options: [
              {
                label: 'Auto',
                value: 'auto',
              },
              {
                label: 'None',
                value: 'none',
              },
              {
                label: 'Basic128Rsa15',
                value: 'Basic128Rsa15',
              },
              {
                label: 'Basic256',
                value: 'Basic256',
              },
              {
                label: 'Basic256Sha256',
                value: 'Basic256Sha256',
              },
              {
                label: 'Aes128_Sha256_RsaOaep',
                value: 'Aes128_Sha256_RsaOaep',
              },
              {
                label: 'Aes256_Sha256_RsaPss',
                value: 'Aes256_Sha256_RsaPss',
              },
            ],
          },
        },
      },
      'x/otel': {
        label: 'OpenTelemetry',
        icon: '/images/otel.svg',
        desc: '<ul><li>Metrics are sent to backend systems via the OTLP protocol, such as Prometheus, Datadog, InfluxDB, etc</li><a href="https://rulego.cc/pages/x-otel/" target="_blank">Documentation</a></ul>',
        server: {
          label: 'OTLP backend system address',
          rules: [{ required: true, message: 'This field is required' }],
          desc: 'Example: localhost:4318',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        protocol: {
          label: 'Transport Protocol',
          rules: [{ required: true, message: 'Protocol is required' }],
          component: {
            type: 'select',
            filterable: true,
            allowCreate: false,
            multiple: false,
            options: [
              {
                label: 'HTTP',
                value: 'HTTP',
              },
              {
                label: 'gRPC',
                value: 'GRPC',
              },
            ],
          },
        },
        metricExpr: {
          label: 'Metric Configuration Expression',
          desc: 'Example: ${msg.metrics}. The expression and table configuration can be used together.',
        },
        metrics: {
          label: 'Metric Configuration',
          rules: [],
          component: {
            type: 'table',
            options: [
              {
                name: 'metricName',
                label: 'Metric Name',
                type: 'string',
                rules: [{ required: true, message: 'This field is required' }],
              },

              {
                name: 'unit',
                label: 'Unit',
                type: 'string',
                component: {
                  type: 'select',
                  filterable: true,
                  allowCreate: true,
                  multiple: false,
                  options: [
                    {
                      label: 'ms',
                      value: 'ms',
                    },
                    {
                      label: 's',
                      value: 's',
                    },
                    {
                      label: 'B',
                      value: 'B',
                    },
                    {
                      label: 'KB',
                      value: 'KB',
                    },
                    {
                      label: 'MB',
                      value: 'MB',
                    },
                    {
                      label: 'G',
                      value: 'G',
                    },
                    {
                      label: '1',
                      value: '1',
                    },
                    {
                      label: '%',
                      value: '%',
                    },
                  ],
                },
              },
              {
                name: 'opType',
                label: 'Operation type',
                type: 'string',
                component: {
                  type: 'select',
                  filterable: true,
                  allowCreate: false,
                  multiple: false,
                  options: [
                    {
                      label: 'Counter',
                      value: 'COUNTER',
                    },
                    {
                      label: 'Gauge',
                      value: 'GAUGE',
                    },
                    {
                      label: 'Histogram',
                      value: 'HISTOGRAM',
                    },
                  ],
                },
              },
              {
                name: 'description',
                label: 'Metric Description',
                type: 'string',
                component: {
                  type: 'textarea',
                },
              },
              {
                name: 'value',
                label: 'Value expression',
                desc: 'For example: ${msg.ipCount}',
                type: 'string',
              },
              {
                name: 'labels',
                label: 'Label expressions',
                desc: 'For example: ${msg.labels}',
                type: 'string',
              },
            ],
          },
        },
      },
      'x/wukongimSender': {
        label: 'WuKongIM Sender',
        icon: '/images/wukongim.svg',
        desc: '<ul><li>Send message payloads to designated channels or users on WuKongIM</li><a href="https://rulego.cc/pages/x-wukongim/" target="_blank">Documentation</a></ul>',
        server: {
          label: 'Server address',
          rules: [{ required: true, message: 'This field is required' }],
          desc: 'Example: tcp://175.27.245.108:15100',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        uID: {
          label: 'User ID',
          rules: [{ required: true, message: 'This field is required' }],
        },
        token: {
          label: 'Login Password',
          desc: '',
        },
        connectTimeout: {
          label: 'Connection timeout, measured in seconds',
          desc: '',
        },
        protoVersion: {
          label: 'Protocol version',
          desc: 'Example: 3',
        },
        pingInterval: {
          label: 'Heartbeat intervals, measured in seconds',
          desc: 'Example: 30',
        },
        reconnect: {
          label: 'Auto-Reconnect',
          desc: '',
        },
        autoAck: {
          label: 'Auto-Acknowledge Messages',
          desc: '',
        },
        channelType: {
          label: 'Channel type',
          desc: '',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
            options: [
              {
                label: 'Personal channel',
                value: '1',
              },
              {
                label: 'Group channels',
                value: '2',
              },
              {
                label: 'Customer Service Channel',
                value: '3',
              },
              {
                label: 'Community channel',
                value: '4',
              },
              {
                label: 'Community topic channel',
                value: '5',
              },
              {
                label: 'Information channel',
                value: '6',
              },
              {
                label: 'Data channel',
                value: '7',
              },
            ],
          },
        },
        channelID: {
          label: 'Channel ID',
          desc: 'Allow the use of ${} placeholder variables. If it is a personal channel, enter the user ID',
        },
        noPersist: {
          label: 'Do Not Persist',
          desc: '',
        },
        syncOnce: {
          label: 'Sync Once',
          desc: '',
        },
        redDot: {
          label: 'Show Notification Dot',
          desc: '',
        },
        noEncrypt: {
          label: 'Disable Encryption',
          desc: '',
        },
      },
      'x/modbus': {
        label: 'Modbus read/write',
        icon: '/images/modbus.svg',
        category: 'iot',
        desc: "<ul><li>Retrieves the list of node location data for message payload and moves to the next node via the Success chain.</li><a href='https://rulego.cc/pages/x-modbus/' target='_blank'>Documentation</a></ul>",
        server: {
          label: 'Server address',
          rules: [
            {
              required: true,
              message: 'This field is required',
            },
          ],
          desc: 'Server address, format:<mode>://<serial device or host:port>Example: tcp://hostname-or-ip-address:502; rtu:///dev/ttyUSB0',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        cmd: {
          label: 'The name of the Modbus method',
          desc: 'Modbus command name',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: false,
            multiple: false,
            options: [
              {
                label: 'Read the coil status',
                value: 'ReadCoils',
              },
              {
                label: 'Read the status of a single coil',
                value: 'ReadCoil',
              },
              {
                label: 'Read discrete input status',
                value: 'ReadDiscreteInputs',
              },
              {
                label: 'Read the status of a single discrete input',
                value: 'ReadDiscreteInput',
              },
              {
                label: 'Read register',
                value: 'ReadRegisters',
              },
              {
                label: 'Read a single register',
                value: 'ReadRegister',
              },
              {
                label: 'Read unsigned 32-bit integers',
                value: 'ReadUint32s',
              },
              {
                label: 'Read a single unsigned 32-bit integer',
                value: 'ReadUint32',
              },
              {
                label: 'Reads 32 floating-point bits',
                value: 'ReadFloat32s',
              },
              {
                label: 'Reads a single floating-point number of 32 bits',
                value: 'ReadFloat32',
              },
              {
                label: 'Read unsigned 64-bit integers',
                value: 'ReadUint64s',
              },
              {
                label: 'Read a single unsigned 64-bit integer',
                value: 'ReadUint64',
              },
              {
                label: 'Reads 64-bit floating-point numbers',
                value: 'ReadFloat64s',
              },
              {
                label: 'Reads a single floating-point number of 64 bits',
                value: 'ReadFloat64',
              },
              {
                label: 'Read byte data',
                value: 'ReadBytes',
              },
              {
                label: 'Read the raw byte data',
                value: 'ReadRawBytes',
              },
              {
                label: 'Write the coil state',
                value: 'WriteCoil',
              },
              {
                label: 'Write multiple coil states',
                value: 'WriteCoils',
              },
              {
                label: 'Write to the register',
                value: 'WriteRegister',
              },
              {
                label: 'Write to multiple registers',
                value: 'WriteRegisters',
              },
              {
                label: 'Write unsigned 32-bit integers',
                value: 'WriteUint32',
              },
              {
                label: 'Write multiple unsigned 32-bit integers',
                value: 'WriteUint32s',
              },
              {
                label: 'Writes 32 floating-point bits',
                value: 'WriteFloat32',
              },
              {
                label: 'Writes multiple floating-point 32-bit numbers',
                value: 'WriteFloat32s',
              },
              {
                label: 'Write unsigned 64-bit integers',
                value: 'WriteUint64',
              },
              {
                label: 'Write multiple unsigned 64-bit integers',
                value: 'WriteUint64s',
              },
              {
                label: 'Writes 64 floating-point bits',
                value: 'WriteFloat64',
              },
              {
                label: 'Writes multiple floating-point 64-bits',
                value: 'WriteFloat64s',
              },
              {
                label: 'Write byte data',
                value: 'WriteBytes',
              },
              {
                label: 'Write the original byte data',
                value: 'WriteRawBytes',
              },
            ],
          },
        },
        unitId: {
          label: 'Slave number',
          desc: 'The unit number used (slave number) is format: uint8, example: 1',
          rules: [
            {
              required: true,
              message: 'This field is required',
            },
          ],
        },
        address: {
          label: 'Register address',
          desc: 'Register address, allowing the use of ${} placeholder variables, format: uint16, example: 50 or 0x32',
        },
        quantity: {
          label: 'Number of registers',
          desc: 'Number of registers, allowing the use of ${} placeholder variables, example: 1',
        },
        value: {
          label: 'Register value',
          desc: 'Register value, allowing the use of ${} placeholder variables. Read does not need to be provided if multiple writes are separated by commas, for example: 0x01, 0x01 true 51, 52',
        },
        regType: {
          label: 'Register type',
          desc: 'Register type',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: false,
            multiple: false,
            options: [
              {
                label: 'Keep the register 0x3',
                value: '0',
              },
              {
                label: 'Input register 0x4',
                value: '1',
              },
            ],
          },
        },
        encodingConfig: {
          label: 'Encoding configuration',
          desc: '',
          endianness: {
            label: 'Byte order',
            desc: 'Byte order of the register',
            component: {
              type: 'select',
              filterable: true,
              allowCreate: false,
              multiple: false,
              options: [
                {
                  label: 'The Grand Duanxu Preface',
                  value: 1,
                },
                {
                  label: 'The small order is arranged',
                  value: 2,
                },
              ],
            },
          },
          wordOrder: {
            label: 'courtesy name Xu',
            desc: '32-bit register word order',
            component: {
              type: 'select',
              filterable: true,
              allowCreate: false,
              multiple: false,
              options: [
                {
                  label: "with the character 'Gao' placed in front",
                  value: 1,
                },
                {
                  label: "The character 'low' is placed first",
                  value: 2,
                },
              ],
            },
          },
        },
        rtuConfig: {
          label: 'RTU configuration',
          desc: '',
          parity: {
            label: 'Check bit',
            desc: 'Serial link validation mode (RTU mode only)',
            component: {
              type: 'select',
              filterable: true,
              allowCreate: false,
              multiple: false,
              options: [
                {
                  label: 'No verification',
                  value: 0,
                },
                {
                  label: 'Occasionally verified',
                  value: 1,
                },
                {
                  label: 'Marvelous verification and verification',
                  value: 2,
                },
              ],
            },
          },
          speed: {
            label: 'Serial baud rate',
            desc: 'Set serial link baud rate (RTU mode only)',
            component: {
              type: 'select',
              filterable: true,
              allowCreate: true,
              multiple: false,
              options: [
                {
                  label: '38400',
                  value: 38400,
                },
                {
                  label: '19200',
                  value: 19200,
                },
                {
                  label: '9600',
                  value: 9600,
                },
                {
                  label: '4800',
                  value: 4800,
                },
              ],
            },
          },
          dataBits: {
            label: 'Data bits',
            desc: 'Set the number of bits for serial characters (RTU mode only)',
          },
          stopBits: {
            label: 'Stop position',
            desc: 'Set serial stop bits (RTU mode only)',
          },
        },
        tcpConfig: {
          label: 'TCP configuration',
          desc: '',
          timeout: {
            label: 'Timeout',
            desc: 'Set the request timeout value, measured in seconds',
          },
          certPath: {
            label: 'Certificate path',
            desc: 'Certificate file path',
          },
          keyPath: {
            label: 'Key path',
            desc: 'Key file path',
          },
          caPath: {
            label: 'CA certificate path',
            desc: 'CA certificate file path',
          },
        },
      },
    },
  },
  Input: 'Input',
  relationTypes: {
    Success: 'Success',
    Failure: 'Failure',
    True: 'True',
    False: 'False',
  },
};
