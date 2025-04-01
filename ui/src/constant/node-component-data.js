// 获取当前规则链可以选择的节点，排除当前节点
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
      label: '输入端',
      // background:'#E6E0F8FF',
      background: '#A6BBCFFF',
      nodeType: 'endpoint-node',
    },
    filter: {
      label: '过滤器',
      // background:'#E2D96EFF',
      background: '#f1e861',
      nodeType: 'simple-node',
    },
    transform: {
      label: '转换器',
      // background:'#FDD0A2FF',
      background: '#79cef1',
      nodeType: 'simple-node',
    },
    action: {
      label: '动作',
      // background:'#f1c84e',
      background: '#f1928f',
      nodeType: 'simple-node',
    },
    external: {
      label: '外部的',
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
      label: '子规则链',
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
        desc: '<ul><li>Beanstalkd订阅接入端</li><li>连接Beanstalkd Server，订阅消息，获取消息信传递下个节点处理,</li><a href="https://rulego.cc/pages/endpoint-beanstalkd" target="_blank">帮助文档</a></ul>',
        server: {
          label: 'Beanstalkd Server地址',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '示例：127.0.0.1:11300，如果流程中存在多节点操作消息并改变状态时，应使用复用连接（ref://）',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        tubesets: {
          label: 'tube列表',
          desc: '',
          rules: [{ required: true, message: '该项是必须的' }],
        },
        timeout: {
          label: '订阅Job超时时间，单位秒',
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
        desc: '<ul><li>MQTT订阅接入端</li><li>连接MQTT Server，通过订阅路由给定主题触发规则链</li><a href="https://rulego.cc/pages/2b0760/" target="_blank">帮助文档</a></ul>',
        server: {
          label: 'MQTT Server地址',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        username: {
          label: '用户名',
          desc: '',
        },
        password: {
          label: '密码',
          desc: '',
        },
        maxReconnectInterval: {
          label: '重连间隔，单位秒',
          desc: '',
        },
        qOS: {
          label: 'QOS',
          desc: '',
        },
        router: {
          from: {
            path: {
              label: '订阅主题',
              rules: [{ required: true, message: '该项是必须的' }],
              desc: '订阅主题数据触发，例如: devices/msg',
            },
          },
        },
      },
      'endpoint/net': {
        notInput: true,
        label: 'TCP/UDP',
        icon: '/images/endpoint/net.svg',
        desc: '<ul><li>TCP/UDP服务器接入端。</li><li>启动TCP/UPD服务器，通过正则表达式路由数据触发规则链。</li><a href="https://rulego.cc/pages/b7050c/" target="_blank">帮助文档</a></ul>',
        protocol: {
          label: '协议',
          desc: 'tcp/udp',
          rules: [{ required: true, message: '协议是必须的' }],
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
          label: '监听地址',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '示例: :6335',
        },
        readTimeout: {
          label: '读超时(单位秒)',
          desc: '',
        },
        encode: {
          label: '编码',
          desc: '把字节流转换成hex/base64，默认不转换',
          rules: [],
          component: {
            type: 'select',
            filterable: true,
            allowCreate: false,
            multiple: false,
            clearable: true,
            options: [
              {
                label: '无',
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
              label: '路由正则表达式',
              rules: [{ required: true, message: '该项是必须的' }],
              desc: '通过正则表达式匹配满足条件的数据触发，*表示匹配所有',
            },
          },
        },
      },
      'endpoint/http': {
        notInput: true,
        label: 'HTTP',
        icon: '/images/endpoint/http.svg',
        desc: '<ul><li>HTTP服务器接入端。</li><li>启动HTTP服务器，处理路由给定URL请求，把请求数据路路由到规则链。</li><a href="https://rulego.cc/pages/691dd3/" target="_blank">帮助文档</a></ul>',
        server: {
          label: '监听地址',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '示例: :6335',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        allowCors: {
          label: '是否允许跨域',
        },
        certFile: {
          label: '证书文件路径',
          desc: 'https使用',
        },
        certKeyFile: {
          label: '密钥文件路径',
          desc: 'https使用',
        },
        router: {
          from: {
            path: {
              label: 'Path',
              rules: [{ required: true, message: '该项是必须的' }],
              desc: '客户端请求该URL触发，如:/api/v1/msg',
            },
          },
        },
      },
      'endpoint/ws': {
        notInput: true,
        label: 'Websocket',
        icon: '/images/endpoint/websocket.svg',
        desc: '<ul><li>Websocket服务器接入端。</li><li>启动Websocket服务器，处理路由给定URL请求，把请求数据路路由到规则链。</li><a href="https://rulego.cc/pages/e36f41/" target="_blank">帮助文档</a></ul>',
        server: {
          label: '监听地址',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '示例: :6335',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        allowCors: {
          label: '是否允许跨域',
        },
        certFile: {
          label: '证书文件路径',
          desc: 'https使用',
        },
        certKeyFile: {
          label: '密钥文件路径',
          desc: 'https使用',
        },
        router: {
          from: {
            path: {
              label: 'Path',
              rules: [{ required: true, message: '该项是必须的' }],
              desc: '客户端请求该URL触发，如:/api/ms/ws ',
            },
          },
        },
      },
      'endpoint/schedule': {
        notInput: true,
        label: '定时调度',
        icon: '/images/endpoint/schedule.svg',
        desc: '<ul><li>定时调度接入端</li><li>通过路由给定Cron表达式周期触发规则链</li><a href="https://rulego.cc/pages/4c4e4c/" target="_blank">帮助文档</a></ul>',
        router: {
          from: {
            path: {
              label: 'cron表达式',
              rules: [
                {
                  required: true,
                  message: '请输入cron表达式如: */10 * * * * *',
                },
              ],
              desc: '通过cron表达式周期触发，如: */10 * * * * *',
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
        desc: '<ul><li>Kafka订阅接入端</li><li>连接Kafka服务器，通过订阅路由给定主题触发规则链</li><a href="https://rulego.cc/pages/07ad50/" target="_blank">帮助文档</a></ul>',
        server: {
          label: 'kafka服务器地址',
          desc: '多个地址用逗号隔开，如: 127.0.0.1:9092,127.0.0.2:9092',
          rules: [{ required: true, message: '服务器地址是必须的' }],
        },
        groupId: {
          label: '消费者组ID',
          desc: '默认rulego',
        },
        router: {
          from: {
            path: {
              label: '订阅主题',
              rules: [{ required: true, message: '该项是必须的' }],
              desc: '订阅主题数据触发，例如: devices/msg',
            },
          },
        },
      },
      'endpoint/nats': {
        notInput: true,
        label: 'Nats',
        icon: '/images/endpoint/nats.svg',
        desc: '<ul><li>Nats订阅接入端</li><li>连接Nats服务器，通过订阅路由给定主题触发规则链</li><a href="https://rulego.cc/pages/0a7ad4/" target="_blank">帮助文档</a></ul>',
        server: {
          label: 'NATS服务地址',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '示例: nats://127.0.0.1:4222',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        username: {
          label: '用户名',
          desc: '',
        },
        password: {
          label: '密码',
          desc: '',
        },
        router: {
          from: {
            path: {
              label: '订阅主题',
              rules: [{ required: true, message: '该项是必须的' }],
              desc: '订阅主题数据触发，例如: devices/msg',
            },
          },
        },
      },
      'endpoint/redis': {
        notInput: true,
        label: 'Redis',
        icon: '/images/endpoint/redis.svg',
        desc: '<ul><li>Redis订阅接入端</li><li>连接Redis服务器，通过订阅路由给定订阅通道触发规则链</li><a href="https://rulego.cc/pages/c96eb4/" target="_blank">帮助文档</a></ul>',
        server: {
          label: 'Redis服务地址',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '示例: 127.0.0.1:6379',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        password: {
          label: '密码',
          desc: '',
        },
        db: {
          label: '数据库编号',
          rules: [
            { required: true, message: '该项是必须的' },
            { type: 'integer', required: true, message: '必须是整型' },
          ],
          desc: '默认0',
        },
        router: {
          from: {
            path: {
              label: '订阅Redis通道',
              rules: [{ required: true, message: '该项是必须的' }],
              desc: '多个通道与逗号分割，例如: devices/msg,devices/msg2',
            },
          },
        },
      },
      'endpoint/redis/stream': {
        notInput: true,
        label: 'Redis流',
        icon: '/images/endpoint/redis_stream.svg',
        desc: '<ul><li>Redis Steam接入端</li><li>连接Redis服务器，通过订阅路由给定流名称触发规则链</li><a href="https://rulego.cc/pages/c96eb5/" target="_blank">帮助文档</a></ul>',
        server: {
          label: 'Redis服务地址',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '示例: 127.0.0.1:6379',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        password: {
          label: '密码',
          desc: '',
        },
        db: {
          label: '数据库编号',
          rules: [
            { required: true, message: '该项是必须的' },
            { type: 'integer', required: true, message: '必须是整型' },
          ],
          desc: '默认0',
        },
        groupId: {
          label: '消费者组ID',
          desc: '默认rulego',
        },
        router: {
          from: {
            path: {
              label: '订阅流名称',
              rules: [{ required: true, message: '该项是必须的' }],
              desc: '多个流与逗号分割，例如: devices/msg,devices/msg2',
            },
          },
        },
      },
      'endpoint/rabbitmq': {
        notInput: true,
        label: 'RabbitMQ',
        icon: '/images/endpoint/rabbitmq.svg',
        desc: '<ul><li>rabbitmq订阅接入端</li><li>支持AMQP协议</li><li>连接rabbitmq服务器，通过订阅路由给定路由键触发规则链</li><li>如果交换机不存在则自动声明</li><a href="https://rulego.cc/pages/endpoint-rabbitmq/" target="_blank">帮助文档</a></ul>',
        server: {
          label: '服务地址',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '格式:amqp://[用户名:密码]@host/[虚拟机名称]',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        exchange: {
          label: '交换机名称',
          desc: '',
        },
        exchangeType: {
          label: '交换机类型',
          desc: 'direct/fanout/headers/topic',
        },
        durable: {
          label: '是否持久化',
          desc: '',
        },
        autoDelete: {
          label: '是否自动删除',
          desc: '',
        },
        router: {
          from: {
            path: {
              label: '路由键',
              rules: [{ required: true, message: '该项是必须的' }],
              desc: '',
            },
          },
        },
      },
      'endpoint/mysql_cdc': {
        notInput: true,
        label: 'MYSQL CDC',
        icon: '/images/endpoint/mysql_cdc.svg',
        desc: '<ul><li>监听mysql表数据变化触发。</li></li><a href="https://rulego.cc/pages/mysql-cdc/" target="_blank">帮助文档</a></ul>',
        server: {
          label: 'MYSQL地址',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '示例: 127.0.0.1:3306',
        },
        user: {
          label: '用户名',
        },
        password: {
          label: '密码',
          desc: '',
        },
        fromOldest: {
          label: '是否全量同步',
          desc: '开启后，每次重启服务都会从第一行开始同步数据，否则只同步增量数据',
        },
        dbs: {
          label: '监听数据库，如果空则包含所有表',
          desc: '如：test',
        },
        includeTables: {
          label: '包含表名，如果空则包含所有表',
          desc: '如：test.users，支持正则表达式，如：.*\\.canal或test.*',
        },
        excludeTables: {
          label: '排除表名',
          desc: '如：mysql.component，支持正则表达式，如：mysql\\..*',
        },
        executionPath: {
          label: 'mysqldump执行路径',
          desc: '如：mysqldump或者/usr/bin/mysqldump',
        },
        charset: {
          label: '字符集',
          desc: '如：utf8',
        },
        flavor: {
          label: '数据库类型',
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
          label: '心跳时间，单位秒',
        },
        readTimeout: {
          label: '读超时，单位秒',
        },
        limit: {
          label: '限制同步条数',
          desc: '用于批量操作，不处理超过限制数据。0:不限制。其他:超过该值则不处理',
        },
        router: {
          from: {
            path: {
              label: '路由表名',
              rules: [{ required: true, message: '该项是必须的' }],
              desc: '根据表名路由，表名格式：dbName.tableName，如:test.users。*表示所有表',
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
        label: 'OPC_UA订阅',
        icon: '/images/endpoint/opcua.svg',
        desc: '<ul><li>定时从OPCUA服务器读取数据。</li><a href="https://rulego.cc/pages/endpoint-opcua/" target="_blank">帮助文档</a></ul>',
        server: {
          label: '服务器地址',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '示例: opc.tcp://localhost:4840',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        interval: {
          label: '读任务时间配置',
          desc: '示例: @every 1m (每隔1分钟) 0 0 0 * * * (凌晨12点触发)',
          rules: [{ required: true, message: '该项是必须的' }],
        },
        nodeIds: {
          label: '节点ID列表',
          desc: '示例:ns=3;i=1003',
          rules: [{ required: true, message: '该项是必须的' }],
        },
        auth: {
          label: '授权方式',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
            options: [
              {
                label: '匿名',
                value: 'anonymous',
              },
              {
                label: '用户名',
                value: 'username',
              },
              {
                label: '证书',
                value: 'certificate',
              },
            ],
          },
        },
        username: {
          label: '用户名',
          desc: '如果授权方式是用户名需要填写',
        },
        password: {
          label: '密码',
          desc: '如果授权方式是用户名需要填写',
        },
        certFile: {
          label: '证书文件路径',
          desc: '如果授权方式是证书需要填写',
        },
        certKeyFile: {
          label: '密钥文件路径',
          desc: '如果授权方式是证书需要填写',
        },
        mode: {
          label: '模式',
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
          label: '策略',
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
        label: 'gRPC流客户端',
        icon: '/images/grpc.svg',
        desc: '<ul><li>接收gRPC服务器推送数据，并转发到规则链处理</li></ul><a href="https://rulego.cc/pages/endpoint-grpc-stream/" target="_blank">帮助文档</a>',
        server: {
          label: 'gRPC服务地址',
          desc: '格式: 主机名:端口',
          rules: [{ required: true, message: '服务地址是必须的' }],
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        service: {
          label: '服务名称',
          desc: '示例：helloworld.Greeter',
          rules: [{ required: true, message: '服务名称是必须的' }],
        },
        method: {
          label: '方法名称',
          desc: '示例：SayHello',
          rules: [{ required: true, message: '方法名称是必须的' }],
        },
        request: {
          label: '请求参数内容(允许空)',
          desc: '示例：{"name":"lala"}',
          component: {
            type: 'textarea',
          },
        },
        headers: {
          label: '请求头',
          desc: '',
        },
        checkInterval: {
          label: '服务检查间隔,单位:毫秒',
          desc: '',
        },
        router: {
          hide: true,
        },
      },
      'endpoint/wukongim': {
        label: 'WuKongIM收',
        icon: '/images/endpoint/wukongim.svg',
        desc: '<ul><li>接收WuKongIM推送数据，并转发到规则链处理</li></ul><a href="https://rulego.cc/pages/endpoint-wukongim/" target="_blank">帮助文档</a>',
        server: {
          label: '服务器地址',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '示例: tcp://175.27.245.108:15100',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        uID: {
          label: '用户ID',
          rules: [{ required: true, message: '该项是必须的' }],
        },
        token: {
          label: '登录密码',
          desc: '',
        },
        connectTimeout: {
          label: '连接超时，单位秒',
          desc: '',
        },
        protoVersion: {
          label: '协议版本',
          desc: '示例:3',
        },
        pingInterval: {
          label: '心跳间隔，单位秒',
          desc: '示例:30',
        },
        reconnect: {
          label: '是否自动重连',
          desc: '',
        },
        autoAck: {
          label: '是否自动确认消息',
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
        label: '注释',
        icon: '/images/comment.svg',
        desc: '把节点名称作为注释内容显示在画布上',
        nodeType: 'comment-node',
      },
      delay: {
        label: '延迟',
        icon: '/images/delay.svg',
        desc: '<a href="https://rulego.cc/pages/5f5612/" target="_blank">帮助文档</a>',
        periodInSeconds: {
          label: '延迟时间(秒)',
          desc: '',
        },
        maxPendingMsgs: {
          label: '最大允许挂起消息的数量',
          desc: '如果启用覆盖模式，该参数失效',
        },
        periodInSecondsPattern: {
          label: '延迟时间表达式(秒)',
          desc: '通过 ${metadata.key} 从元数据变量中获取或者通过 ${msg.key} 从消息负荷中获取，延迟时间，如果该值有值，优先取该值。',
        },
        overwrite: {
          label: '覆盖模式',
          desc: '如果启用，周期内只允许挂起一条消息，新消息会覆盖上一条消息',
        },
      },
      log: {
        label: '日志',
        icon: '/images/log.svg',
        desc: '<a href="https://rulego.cc/pages/020050/" target="_blank">帮助文档</a>',
        jsScript: {
          label: 'function String(msg, metadata, msgType) {',
          desc: '}',
        },
      },
      for: {
        label: 'for',
        icon: '/images/for.svg',
        desc: '<a href="https://rulego.cc/pages/7db1de/" target="_blank">帮助文档</a>',
        range: {
          label: '迭代值表达式',
          desc: '例如:msg.items;1..3;如果空则遍历整个msg',
        },
        do: {
          label: '处理节点ID',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '处理链的起始节点ID',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: false,
            multiple: false,
            loadData: loadSelectNodes,
          },
        },
        mode: {
          label: '执行模式',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
            options: [
              {
                label: '同步不合并执行结果',
                value: 0,
              },
              {
                label: '同步合并执行结果',
                value: 1,
              },
              {
                label: '同步覆盖执行结果',
                value: 2,
              },
              {
                label: '异步不合并执行结果',
                value: 3,
              },
            ],
          },
        },
        // nodeType: 'group-node',
      },
      functions: {
        label: '函数',
        desc: '<a href="https://rulego.cc/pages/b7edde/" target="_blank">帮助文档</a>',
        functionName: {
          label: '函数名称',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            placeholder: '请选择或者输入函数名',
          },
        },
      },
      'x/beanstalkdWorker': {
        label: 'Beanstalkd Worker',
        icon: '/images/beanstalkd_worker.svg',
        category: 'external',
        desc: '<ul><li>Beanstalkd消费端，支持以下操作Delete、Release、Bury、KickJob、Touch、Peek、ReserveJob、StatsJob、Stats、ListTubes。</li><a href="https://rulego.cc/pages/x-beanstalkd-worker/" target="_blank">帮助文档</a></ul>',
        server: {
          label: 'Beanstalkd Server地址',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '示例：127.0.0.1:11300，如果流程中存在多节点操作消息并改变状态时，应使用复用连接（ref://）',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        tube: {
          label: 'Tube名称',
          desc: 'Tube名称 允许使用 ${} 占位符变量',
          rules: [{ required: true, message: '该项是必须的' }],
        },
        cmd: {
          label: '命令名称',
          desc: '命令名称，支持Delete Release Bury KickJob Touch Peek ReserveJob  StatsJob Stats  ListTubes',
          rules: [{ required: true, message: '该项是必须的' }],
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
          desc: 'JobId根据命令选填，允许使用 ${} 占位符变量,Delete、Release、Bury、KickJob、Touch、Peek、ReserveJob、StatsJob命令参数',
        },
        pri: {
          label: '优先级',
          desc: '优先级: pri 允许使用 ${} 占位符变量,Release、Bury命令参数',
        },
        delay: {
          label: '延迟时间',
          desc: '延迟时间: delay 允许使用 ${} 占位符变量,Release命令参数，格式如：“30s”、“5m”',
        },
      },
      'x/beanstalkdTube': {
        label: 'Beanstalkd Tube',
        icon: '/images/beanstalkd_tube.svg',
        category: 'external',
        desc: '<ul><li>Beanstalkd Tube，支持以下操作Put、PeekReady、PeekDelayed、PeekBuried、Kick、Stat、Pause。</li><a href="https://rulego.cc/pages/x-beanstalkd-tube/" target="_blank">帮助文档</a></ul>',
        server: {
          label: 'Beanstalkd Server地址',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '示例：127.0.0.1:11300，如果流程中存在多节点操作消息并改变状态时，应使用复用连接（ref://）',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        tube: {
          label: 'Tube名称',
          desc: 'Tube名称 允许使用 ${} 占位符变量',
          rules: [{ required: true, message: '该项是必须的' }],
        },
        cmd: {
          label: '命令名称',
          desc: '命令名称，支持Put、PeekReady、PeekDelayed、PeekBuried、Kick、Stat、Pause',
          rules: [{ required: true, message: '该项是必须的' }],
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
          desc: 'body根据命令选填，允许使用 ${} 占位符变量,Put命令参数',
        },
        pri: {
          label: '优先级',
          desc: '优先级: pri 允许使用 ${} 占位符变量,Put命令参数',
        },
        delay: {
          label: '延迟时间',
          desc: '延迟时间: delay 允许使用 ${} 占位符变量,Put命令参数，格式如：“30s”、“5m”',
        },
        ttr: {
          label: 'Job最大执行秒数',
          desc: '最大执行秒数:ttr 允许使用 ${} 占位符变量,Put命令参数',
        },
        kickBound: {
          label: '唤醒的Job数量上限',
          desc: 'Kick命令参数bound 允许使用 ${} 占位符变量',
        },
        pauseTime: {
          label: '暂停时间',
          desc: 'Pause命令参数time 允许使用 ${} 占位符变量，格式如：“30s”、“5m”',
        },
      },
      dbClient: {
        label: '数据库',
        icon: '/images/db.svg',
        desc: '<a href="https://rulego.cc/pages/32683d/" target="_blank">帮助文档</a>',
        sql: {
          label: 'SQL语句',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '可以使用 ${metadata.key} 或者 ${msg.key}变量，SQL参数允许使用 ? 占位符',
          component: {
            type: 'textarea',
            rows: 4,
          },
        },
        params: {
          label: '占位符参数列表',
          desc: '可以使用 ${metadata.key} 读取元数据中的变量或者使用 ${msg.key} 读取消息负荷中的变量进行替换',
        },
        getOne: {
          label: '返回一条记录',
          desc: '',
        },
        poolSize: {
          label: '连接池大小',
          desc: '',
        },
        driverName: {
          label: '数据库驱动名称',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: 'mysql或postgres，如需其他数据库类型需引入对应数据库驱动',
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
          label: '数据库连接',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: 'Mysql配置示例: username:password@tcp(127.0.0.1:3306)/db Postgres配置示例：postgres://username:password@127.0.0.1:5432/db?sslmode=disable',
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
        desc: '<a href="https://rulego.cc/pages/44aa9a/" target="_blank">帮助文档</a>',
        topic: {
          label: '发布主题',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '可以使用 ${metadata.key} 读取元数据中的变量或者使用 ${msg.key} 读取消息负荷中的变量进行替换',
        },
        server: {
          label: 'MQTT 服务器地址',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '示例: 127.0.0.1:1883 。允许选择连接池进行连接',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        username: {
          label: '用户名',
          desc: '',
        },
        password: {
          label: '密码',
          desc: '',
        },
        maxReconnectInterval: {
          label: '重连间隔，单位秒',
          desc: '',
        },
        qOS: {
          label: 'QoS',
          desc: '',
        },
        clientID: {
          label: '客户端ID',
          desc: '',
        },
        cleanSession: {
          label: '清除会话',
          desc: '',
        },
        cAFile: {
          label: '证书颁发机构(CA)文件',
          desc: '',
        },
        certFile: {
          label: '证书文件',
          desc: '',
        },
        certKeyFile: {
          label: '证书密钥文件',
          desc: '',
        },
      },
      restApiCall: {
        label: 'REST',
        icon: '/images/rest.svg',
        desc: '<a href="https://rulego.cc/pages/f3a3d5/" target="_blank">帮助文档</a>',
        restEndpointUrlPattern: {
          label: 'HTTP URL地址',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '可以使用 ${metadata.key} 读取元数据中的变量或者使用 ${msg.key} 读取消息负荷中的变量进行替换',
        },
        requestMethod: {
          label: '请求方法',
          rules: [{ required: true, message: '该项是必须的' }],
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
          label: '不传输request body',
          desc: '不把消息负荷传输给配置的服务地址',
        },
        headers: {
          label: '请求头',
          desc: '可以使用 ${metadata.key} 读取元数据中的变量或者使用 ${msg.key} 读取消息负荷中的变量进行替换',
        },
        readTimeoutMs: {
          label: '超时，单位毫秒。默认:0',
          desc: '0代表不超时',
        },
        insecureSkipVerify: {
          label: '禁用证书验证',
          desc: '自签证书需要打开禁用证书验证',
        },
        maxParallelRequestsCount: {
          label: '最大并发大小',
          desc: '0代表不限制',
        },
        enableProxy: {
          label: '开启代理',
          desc: '',
        },
        useSystemProxyProperties: {
          label: '使用系统代理配置',
          desc: '',
        },
        proxyScheme: {
          label: '代理协议',
          desc: '',
        },
        proxyHost: {
          label: '代理主机',
          desc: '',
        },
        proxyPort: {
          label: '代理端口',
          desc: '',
        },
        proxyUser: {
          label: '用户名',
          desc: '',
        },
        proxyPassword: {
          label: '密码',
          desc: '',
        },
      },
      sendEmail: {
        label: '发邮件',
        icon: '/images/email.svg',
        desc: '<a href="https://rulego.cc/pages/70c37d/" target="_blank">帮助文档</a>',
        smtpHost: {
          label: 'SMTP 主机地址',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '',
        },
        smtpPort: {
          label: 'SMTP 主机端口',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '',
        },
        username: {
          label: '用户名',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '',
        },
        password: {
          label: '授权码',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '',
        },
        enableTls: {
          label: '是否开启TLS',
          desc: '',
        },
        email: {
          label: '邮件内容',
          desc: '',
          from: {
            label: '发件人邮箱',
            desc: '多个与`,`隔开',
          },
          to: {
            label: '收件人邮箱',
            desc: '多个与`,`隔开',
          },
          cc: {
            label: '抄送人邮箱',
            desc: '多个与`,`隔开',
          },
          bcc: {
            label: '密送人邮箱',
            desc: '多个与`,`隔开',
          },
          subject: {
            label: '邮件主题',
            desc: '可以使用 ${metadata.key} 读取元数据中的变量或者使用 ${msg.key} 读取消息负荷中的变量进行替换',
          },
          body: {
            label: '邮件内容',
            desc: '可以使用 ${metadata.key} 读取元数据中的变量或者使用 ${msg.key} 读取消息负荷中的变量进行替换',
          },
        },
        connectTimeout: {
          label: '连接超时,单位秒。默认:10',
          desc: '',
        },
      },
      ssh: {
        label: 'SSH',
        icon: '/images/ssh.svg',
        desc: '<a href="https://rulego.cc/pages/fa62c1/" target="_blank">帮助文档</a>',
        host: {
          label: 'ssh主机地址',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '',
        },
        port: {
          label: 'ssh主机端口',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '',
        },
        username: {
          label: 'ssh登录用户名',
          desc: '',
        },
        password: {
          label: 'ssh登录密码',
          desc: '',
        },
        cmd: {
          label: 'shell命令',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '可以使用 ${metadata.key} 读取元数据中的变量或者使用 ${msg.key} 读取消息负荷中的变量进行替换',
        },
      },
      fieldFilter: {
        label: '字段过滤',
        desc: '<a href="https://rulego.cc/pages/502031/" target="_blank">帮助文档</a>',
        checkAllKeys: {
          label: '是否满足需要所有字段key存在',
          desc: '',
        },
        dataNames: {
          label: 'msg data字段key',
          desc: '多个与逗号隔开',
        },
        metadataNames: {
          label: 'metadata字段key',
          desc: '多个与逗号隔开',
        },
      },
      jsFilter: {
        label: 'js过滤',
        icon: '/images/jsFilter.svg',
        desc: '<a href="https://rulego.cc/pages/8269e5/" target="_blank">帮助文档</a>',
        jsScript: {
          label: 'function Filter(msg, metadata, msgType) {',
          desc: '}',
        },
      },
      jsSwitch: {
        label: 'js路由',
        desc: '<a href="https://rulego.cc/pages/bd9a27/" target="_blank">帮助文档</a>',
        jsScript: {
          label: 'function Switch(msg, metadata, msgType) {',
          desc: '}',
        },
      },
      msgTypeSwitch: {
        label: '消息路由',
        icon: '/images/msgTypeSwitch.svg',
        desc: '<a href="https://rulego.cc/pages/09b453/" target="_blank">帮助文档</a>',
      },
      exprFilter: {
        label: '表达式过滤',
        icon: '/images/exp.svg',
        desc: '<ul><li>使用expr表达式过滤消息</li><li>通过`msg`变量访问消息体。例如 `msg.temperature`</li><li>通过`metadata`变量访问消息元数据。例如 `metadata.customerName`</li><li>通过`type`变量访问消息类型</li><li>通过`dataType`变量访问数据类型</li><a href="https://rulego.cc/pages/c8fe75/" target="_blank">帮助文档</a></ul>',
        expr: {
          label: '过滤表达式',
          desc: '例如:msg.temperature>50，返回值必须是布尔类型',
          rules: [{ required: true, message: '过滤表达式是必须的' }],
        },
      },
      switch: {
        label: '条件分支',
        icon: '/images/msgTypeSwitch.svg',
        desc: '<a href="https://rulego.cc/pages/switch/" target="_blank">帮助文档</a>',
        cases: {
          label: '条件列表',
          desc: '依次匹配条件列表，如果匹配到根据路由执行后续节点，如果没有匹配到则执行Default链',
          component: {
            type: 'switchNode',
          },
        },
        relationTypeDynamics: true,
      },
      exprTransform: {
        label: '表达式转换',
        icon: '/images/exp.svg',
        desc: '<ul><li>使用expr表达式转换或者创建新的msg</li><li>通过`msg`变量访问消息体。例如 `msg.temperature`</li><li>通过`metadata`变量访问消息元数据。例如 `metadata.customerName`</li><li>通过`type`变量访问消息类型</li><li>通过`dataType`变量访问数据类型</li><a href="https://rulego.cc/pages/3769cc/" target="_blank">帮助文档</a></ul>',
        expr: {
          label: '转换表达式',
          desc: '例如:msg.name。如果该字段有值则优先使用该字段。',
        },
        mapping: {
          label: '字段-表达式映射列表（创建新的Msg）',
          desc: 'Key:字段名,Value:表达式。如果该字段有值，根据指定的字段和转换表达式创建新的Msg',
        },
      },
      metadataTransform: {
        label: '元数据转换',
        icon: '/images/metadata.svg',
        desc: '<ul><li>使用expr表达式转换或者创建新的元数据</li><li>通过`msg`变量访问消息体。例如 `msg.temperature`</li><li>通过`metadata`变量访问消息元数据。例如 `metadata.customerName`</li><li>通过`type`变量访问消息类型</li><li>通过`dataType`变量访问数据类型</li><a href="https://rulego.cc/pages/316efe/" target="_blank">帮助文档</a></ul>',
        mapping: {
          label: '字段-表达式映射列表',
          desc: "Key:字段名,Value:转换表达式。如果不是表达式，使用单引号，如：'xx'",
        },
        isNew: {
          label: '是否创建新的元数据列表',
          desc: 'true:创建新的元数据列表,false:更新对应的元数据key',
        },
      },
      jsTransform: {
        label: 'js转换',
        desc: '<a href="https://rulego.cc/pages/794696/" target="_blank">帮助文档</a>',
        jsScript: {
          label: 'function Transform(msg, metadata, msgType) {',
          desc: '}',
        },
      },
      net: {
        label: 'TCP/UDP',
        icon: '/images/net.svg',
        desc: '<a href="https://rulego.cc/pages/c1af87/" target="_blank">帮助文档</a>',
        protocol: {
          label: '协议',
          desc: 'tcp/udp',
          rules: [{ required: true, message: '协议是必须的' }],
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
          label: '服务地址',
          rules: [{ required: true, message: '服务地址是必须的' }],
          desc: '示例:127.0.0.1:6335',
        },
        connectTimeout: {
          label: '连接超时，单位秒，默认60',
        },
        heartbeatInterval: {
          label: '心跳间隔，单位秒，0不发送心跳',
        },
      },
      flow: {
        label: '子规则链',
        desc: '<a href="https://rulego.cc/pages/e27cec/" target="_blank">帮助文档</a>',
        targetId: {
          label: '子规则链ID',
          desc: '',
          rules: [{ required: true, message: '子规则链ID是必须的' }],
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
          label: '继承模式',
          desc: '如果开启，不合并子规则链输出关系和消息',
          rules: [{ required: true, message: '子规则链ID是必须的' }],
        },
      },
      ref: {
        label: '节点引用',
        icon: '/images/ref.svg',
        relationTypeAllowCreate: true,
        relationTypes: [
          { label: '成功', value: 'Success' },
          { label: '失败', value: 'Failure' },
          { label: '真', value: 'True' },
          { label: '假', value: 'False' },
        ],
        desc: '<a href="https://rulego.cc/pages/ref_node/" target="_blank">帮助文档</a>',
        targetId: {
          label: '节点ID',
          desc: '引用本规则链中的其他节点',
          rules: [{ required: true, message: '节点ID是必须的' }],
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
        label: '过滤器组',
        icon: '/images/groupFilter.svg',
        desc: '<a href="https://rulego.cc/pages/b14e3b/" target="_blank">帮助文档</a>',
        allMatches: {
          label: '是否需要全匹配',
          desc: '',
        },
        nodeIds: {
          label: '组内节点ID列表',
          desc: '',
          rules: [{ required: true, message: '组内节点ID是必须的' }],
          component: {
            type: 'select',
            filterable: true,
            allowCreate: false,
            multiple: true,
            loadData: loadSelectNodes,
          },
        },
        timeout: {
          label: '组内执行超时，单位秒，默认0',
          desc: '默认0，代表不超时',
        },
      },
      groupAction: {
        label: '节点组',
        desc: '<ul><li>异步执行多个节点，把所有节点结果合并，发送到下一个节点</li><li>如果匹配到指定数量节点都是指定关系类型，则把数据到`Success`链, 否则发到`Failure`链</li><a href="https://rulego.cc/pages/bf06e2/" target="_blank">帮助文档</a></ul>',
        icon: '/images/groupAction.svg',
        matchRelationType: {
          label: '匹配关系，默认Success',
          desc: '',
        },
        matchNum: {
          label: '匹配满足节点数量，默认0',
          desc: '默认0，表示所有节点都满足指定关系',
        },
        nodeIds: {
          label: '组内节点ID列表',
          desc: '',
          rules: [{ required: true, message: '组内节点ID是必须的' }],
          component: {
            type: 'select',
            filterable: true,
            allowCreate: false,
            multiple: true,
            loadData: loadSelectNodes,
          },
        },
        timeout: {
          label: '组内执行超时，单位秒，默认0',
          desc: '默认0，代表不超时',
        },
      },
      iterator: {
        label: '迭代器',
        desc: '<ul><li>弃用，使用for组件代替</li><li>遍历msg或者msg中指定字段item值到下一个节点，遍历字段值必须是`数组`或者`{key:value}`类型</li><li>如果item满足jsScript，则会把item数据通过`True`链发到下一个节点，否则通过`False`链发到下一个节点</li><li>如果找不到指定字段、js脚本执行失败或者遍历的对象不是 `数组`或者`{key:value}`，则会把错误信息通过`Failure`链发到下一个节点</li><li>遍历结束后，通过`Success`链把原始msg发送到下一个节点</li><a href="https://rulego.cc/pages/5898a0/" target="_blank">帮助文档</a></ul>',
        icon: '/images/iterator.svg',
        fieldName: {
          label: '遍历字段',
          desc: '如果空，遍历整个msg，支持嵌套方式获取msg字段值，例如items.value、items',
        },
        jsScript: {
          label: 'function Filter(item,index,metadata) {',
          desc: '} 匹配item的js脚本，可选，如果空则遍历所有item',
        },
      },
      join: {
        label: '合并',
        desc: '<ul><li>合并多个异步节点执行结果</li><a href="https://rulego.cc/pages/join/" target="_blank">帮助文档</a></ul>',
        icon: '/images/join.svg',
        timeout: {
          label: '组内执行超时，单位秒，默认0',
          desc: '默认0，代表不超时',
        },
      },
      fork: {
        label: '并行网关',
        desc: '<ul><li>把流分成多个并行执行的路径</li><a href="https://rulego.cc/pages/fork/" target="_blank">帮助文档</a></ul>',
        icon: '/images/fork.svg',
      },
      'text/template': {
        label: '模板转换',
        icon: '/images/template.svg',
        desc: '<a href="https://rulego.cc/pages/3ffde3/" target="_blank">帮助文档</a>',
        template: {
          label: '模板内容或者文件路径',
          desc: '如果是模板文件路径使用file:开头',
          component: {
            type: 'codeEditor',
          },
        },
      },
      exec: {
        label: '命令行',
        icon: '/images/ssh.svg',
        desc: '<ul><li>只执行系统白名单的命令</li><a href="https://rulego.cc/pages/413ea9/" target="_blank">帮助文档</a></ul>',
        cmd: {
          label: '执行命令',
          desc: '',
          rules: [{ required: true, message: '执行命令是必须的' }],
        },
        args: {
          label: '参数',
          desc: '可以使用 ${metadata.key} 读取元数据中的变量或者使用 ${msg.key} 读取消息负荷中的变量进行替换',
        },
        log: {
          label: '打印标准输出',
          desc: '',
        },
        replaceData: {
          label: '替换Data',
          desc: '把Data替换为标准输出，默认为false',
        },
      },
      'x/redisClient': {
        label: 'Redis',
        icon: '/images/redis.svg',
        desc: '<a href="https://rulego.cc/pages/de062b/" target="_blank">帮助文档</a>',
        server: {
          label: 'redis服务器地址',
          desc: '',
          rules: [{ required: true, message: 'redis服务器地址是必须的' }],
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        password: {
          label: '密码',
          desc: '',
        },
        poolSize: {
          label: '连接池大小',
          desc: '',
        },
        db: {
          label: '数据库编号',
          rules: [
            { required: true, message: '该项是必须的' },
            { type: 'integer', required: true, message: '必须是整型' },
          ],
          desc: '默认0',
        },
        cmd: {
          label: '执行命令，例如SET/GET/DEL/HMSET/HMGET',
          desc: '支持${metadata.key}占位符读取metadata元数据，支持${msg.key}占位符读取消息负荷指定key数据，支持${data}获取消息原始负荷',
          rules: [{ required: true, message: '执行命令是必须的' }],
        },
        paramsExpr: {
          label: '命令动态参数',
          desc: '支持Expr表达式。如:["myhash2", "field1", "value1"]，或者通过变量取值如:msg表示取消息负荷。命令动态参数和命令静态参数，优先取命令动态参数值。',
        },
        params: {
          label: '命令静态参数',
          desc: '支持${metadata.key}占位符读取metadata元数据，支持${msg.key}占位符读取消息负荷指定key数据，支持${data}获取消息原始负荷',
        },
      },
      'x/redisPub': {
        label: 'Redis 发布',
        icon: '/images/redis.svg',
        desc: '<a href="https://rulego.cc/pages/x_redis_pub/" target="_blank">帮助文档</a>',
        server: {
          label: 'redis服务器地址',
          desc: '',
          rules: [{ required: true, message: 'redis服务器地址是必须的' }],
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        password: {
          label: '密码',
          desc: '',
        },
        poolSize: {
          label: '连接池大小',
          desc: '',
        },
        db: {
          label: '数据库编号',
          rules: [
            { required: true, message: '该项是必须的' },
            { type: 'integer', required: true, message: '必须是整型' },
          ],
          desc: '默认0',
        },
        channel: {
          label: '发布通道',
          desc: '支持${metadata.key}占位符读取metadata元数据，支持${msg.key}占位符读取消息负荷指定key数据',
          rules: [{ required: true, message: '发布通道是必须的' }],
        },
      },
      'x/kafkaProducer': {
        label: 'Kafka',
        icon: '/images/kafka.svg',
        desc: '<a href="https://rulego.cc/pages/fa986d/" target="_blank">帮助文档</a>',
        server: {
          label: 'kafka服务器地址',
          desc: '多个服务器地址用逗号隔开，如: 127.0.0.1:9092,127.0.0.2:9092',
          rules: [{ required: true, message: '服务器地址是必须的' }],
        },
        topic: {
          label: '发布主题',
          desc: '可以使用 ${metadata.key} 读取元数据中的变量或者使用 ${msg.key} 读取消息负荷中的变量进行替换',
          rules: [{ required: true, message: '主题是必须的' }],
        },
        key: {
          label: '分区键',
          desc: '可以使用 ${metadata.key} 读取元数据中的变量或者使用 ${msg.key} 读取消息负荷中的变量进行替换',
        },
        partition: {
          label: '分区编号',
          desc: '',
        },
      },
      'x/luaFilter': {
        label: 'Lua脚本过滤',
        icon: '/images/lua.svg',
        desc: '<ul><li>使用Lua脚本对msg、metadata、msgType进行过滤。根据脚本返回值路由到True或者False链。</li><li>也可以使用lua脚本，进行例如：加解密、I/O、网络、文件等高级操作</li><a href="https://rulego.cc/pages/5d61cc/" target="_blank">帮助文档</a></ul>',
        script: {
          label: '脚本函数体或者是脚本文件路径',
          desc: '只需要提供函数体内容，如果是文件路径，则需要提供完整的脚本函数',
        },
      },
      'x/luaTransform': {
        label: 'Lua脚本转换',
        icon: '/images/lua.svg',
        desc: '<ul><li>lua脚本转换器。可以使用Lua脚本对msg、metadata、msgType进行转换或增强。</li><li>也可以使用lua脚本，进行例如：加解密、I/O、网络、文件等高级操作</li><a href="https://rulego.cc/pages/bf0eaf/" target="_blank">帮助文档</a></ul>',
        script: {
          label: '脚本函数体或者是脚本文件路径',
          desc: '只需要提供函数体内容，如果是文件路径，则需要提供完整的脚本函数',
        },
      },
      'x/natsClient': {
        label: 'NATS',
        icon: '/images/nats.svg',
        desc: '<a href="https://rulego.cc/pages/9e177d/" target="_blank">帮助文档</a>',
        topic: {
          label: '发布主题',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '可以使用 ${metadata.key} 读取元数据中的变量或者使用 ${msg.key} 读取消息负荷中的变量进行替换',
        },
        server: {
          label: 'NATS服务地址',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '示例: nats://127.0.0.1:4222',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        username: {
          label: '用户名',
          desc: '',
        },
        password: {
          label: '密码',
          desc: '',
        },
      },
      'x/rabbitmqClient': {
        label: 'RabbitMQ',
        icon: '/images/rabbitmq.svg',
        desc: '<ul><li>发消息负荷发送到rabbitmq队列</li><li>支持AMQP协议</li><li><a href="https://rulego.cc/pages/rabbitmq-client/" target="_blank">帮助文档</li></ul></a>',
        server: {
          label: '服务地址',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '格式:amqp://[用户名:密码]@host/[虚拟机名称]',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        key: {
          label: '路由键',
          desc: '可以使用 ${metadata.key} 读取元数据中的变量或者使用 ${msg.key} 读取消息负荷中的变量进行替换',
        },
        exchange: {
          label: '交换机名称',
          desc: '',
        },
        exchangeType: {
          label: '交换机类型',
          desc: '可选类型：direct/fanout/headers/topic',
        },
        durable: {
          label: '是否持久化',
          desc: '',
        },
        autoDelete: {
          label: '是否自动删除',
          desc: '',
        },
      },
      'x/opengeminiWrite': {
        label: 'opengemini写',
        icon: '/images/opengemini-write.svg',
        desc: '<a href="https://rulego.cc/pages/opengemini-write/" target="_blank">帮助文档</a>',
        server: {
          label: 'opengemini服务地址',
          desc: '格式: 主机名:端口，多个服务地址用逗号隔开',
          rules: [{ required: true, message: '服务器地址是必须的' }],
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        database: {
          label: '数据库',
          desc: '允许使用 ${} 占位符变量，例如：${metadata.key}、${msg.key}',
          rules: [{ required: true, message: '数据库是必须的' }],
        },
        username: {
          label: '用户名',
          desc: '',
        },
        password: {
          label: '密码',
          desc: '',
        },
        token: {
          label: 'Token',
          desc: '如果Token不为空，使用Token认证',
        },
      },
      'x/opengeminiQuery': {
        label: 'opengemini读',
        icon: '/images/opengemini.svg',
        desc: '<a href="https://rulego.cc/pages/opengemini-query/" target="_blank">帮助文档</a>',
        server: {
          label: 'opengemini服务地址',
          desc: '格式: 主机名:端口，多个服务地址用逗号隔开',
          rules: [{ required: true, message: '服务地址是必须的' }],
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        database: {
          label: '数据库',
          desc: '允许使用 ${} 占位符变量，例如：${metadata.key}、${msg.key}',
          rules: [{ required: true, message: '数据库是必须的' }],
        },
        username: {
          label: '用户名',
          desc: '',
        },
        password: {
          label: '密码',
          desc: '',
        },
        token: {
          label: 'Token',
          desc: '如果Token不为空，使用Token认证',
        },
        command: {
          label: '查询语句',
          desc: '允许使用 ${} 占位符变量，例如：${metadata.key}、${msg.key}',
          rules: [{ required: true, message: '服务器地址是必须的' }],
        },
      },
      'x/grpcClient': {
        label: 'gRPC 客户端',
        icon: '/images/grpc.svg',
        desc: '<ul><li>动态调用gRPC服务</li></li></ul><a href="https://rulego.cc/pages/grpc-client/" target="_blank">帮助文档</a>',
        server: {
          label: 'gRPC服务地址',
          desc: '格式: 主机名:端口',
          rules: [{ required: true, message: '服务地址是必须的' }],
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        service: {
          label: '服务名称',
          desc: '示例：helloworld.Greeter。允许使用 ${} 占位符变量',
          rules: [{ required: true, message: '服务名称是必须的' }],
        },
        method: {
          label: '方法名称',
          desc: '示例：SayHello。允许使用 ${} 占位符变量',
          rules: [{ required: true, message: '方法名称是必须的' }],
        },
        request: {
          label: '请求参数内容',
          desc: '示例：{"name":"lala"}。如果空，则使用当前消息负荷。参数使用JSON编码，必须和service/method要求一致。允许使用 ${} 占位符变量',
          component: {
            type: 'textarea',
          },
        },
        headers: {
          label: '请求头',
          desc: '允许使用 ${} 占位符变量',
        },
      },
      'x/mongodbClient': {
        label: 'MongoDB',
        icon: '/images/mongodb.svg',
        desc: '<ul><li>MongoDB 客户端</li></li></ul><a href="https://rulego.cc/pages/mongodb-client/" target="_blank">帮助文档</a>',
        server: {
          label: 'MongoDB服务地址',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '允许选择连接池进行连接',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        database: {
          label: '数据库',
          desc: '允许使用 ${} 占位符变量',
          rules: [{ required: true, message: '该项是必须的' }],
        },
        collection: {
          label: '集合',
          desc: '允许使用 ${} 占位符变量',
          rules: [{ required: true, message: '该项是必须的' }],
        },
        opType: {
          label: '操作类型',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: false,
            multiple: false,
            options: [
              {
                label: '插入',
                value: 'INSERT',
              },
              {
                label: '查询',
                value: 'QUERY',
              },
              {
                label: '更新',
                value: 'UPDATE',
              },
              {
                label: '删除',
                value: 'DELETE',
              },
            ],
          },
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '',
        },
        filter: {
          label: '过滤条件',
          desc: '查询是可为空。允许Expr表达式，示例：{"age"": {"$gte": 18 }。',
        },
        doc: {
          label: '更新/插入文档',
          desc: '查询或者删除可为空。允许Expr表达式，示例：{"name":"test","age":18}。',
        },
        one: {
          label: '是否操作1条记录',
          desc: '',
        },
      },
      'ai/createImage': {
        label: 'AI图像生成',
        icon: '/images/generate-image.svg',
        desc: '<ul><li>通过提示词生成图片</li><a href="https://rulego.cc/pages/b0e537/" target="_blank">帮助文档</a></ul>',
        url: {
          label: 'API地址',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '',
        },
        key: {
          label: '授权秘钥',
          desc: '',
        },
        model: {
          label: '模型',
          desc: '允许手动输入模型',
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
          label: '图像生成的提示',
          desc: '',
          rules: [{ required: true, message: '该项是必须的' }],
          component: {
            type: 'textarea',
          },
        },
        n: {
          label: '生成图像的数量',
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
          label: '响应格式',
          desc: '默认:url',
          rules: [{ required: true, message: '该项是必须的' }],
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
          label: '图像质量',
          desc: '默认:standard',
          rules: [{ required: true, message: '该项是必须的' }],
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
          label: '图像尺寸',
          desc: '默认:1024x1024',
          rules: [{ required: true, message: '该项是必须的' }],
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
          label: '图像风格',
          desc: '默认:vivid',
          rules: [{ required: true, message: '该项是必须的' }],
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
        label: 'AI文本生成',
        icon: '/images/generate-text.svg',
        desc: '<ul><li>通过提示词生成文本</li><a href="https://rulego.cc/pages/a43229/" target="_blank">帮助文档</a></ul>',
        url: {
          label: 'API地址',
          desc: '',
        },
        key: {
          label: '授权秘钥',
          desc: '',
        },
        model: {
          label: '模型',
          desc: '允许手动输入模型',
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
          label: '系统提示',
          desc: '用于预先定义模型的基础行为框架和响应风格。可以使用${} 占位符变量',
          component: {
            type: 'textarea',
          },
        },
        messages: {
          label: '上下文/用户消息列表',
          desc: '',
          rules: [{ required: true, message: '该项是必须的' }],
          component: {
            type: 'table',
            options: [
              {
                name: 'role',
                label: '角色',
                type: 'string',
                rules: [{ required: true, message: '该项是必须的' }],
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
                label: '消息内容',
                type: 'string',
                rules: [{ required: true, message: '该项是必须的' }],
                desc: 'USER角色：向模型提供指令、查询或任何基于文本的输入。 ASSISTANT角色：基于用户消息的模型回复',
                component: {
                  type: 'textarea',
                },
              },
            ],
          },
        },
        images: {
          label: '视觉',
          desc: '图像URL列表，大模型将根据图像内容的理解回答用户问题。该功能需要大模型api支持(Qwen2-VL-72B支持视觉)。可以使用${} 占位符变量',
        },
        params: {
          label: '大模型参数',
          desc: '',
          temperature: {
            label: '温度',
            desc: '采样温度控制输出的随机性。温度值在 [0.0, 2.0] 范围内，值越高，输出越随机和创造性；值越低，输出越稳定。',
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
            desc: '通过核心采样控制多样性：0.5表示考虑了一半的所有可能性加权选项。取值范围：[0.0, 1.0]',
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
            label: '存在惩罚',
            desc: '对文本中已有的标记的对数概率施加惩罚',
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
            label: '频率惩罚',
            desc: '对文本中出现的标记的对数概率施加惩罚。取值范围[0.0,1.0]',
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
            label: '最大输出长度',
            desc: '',
            component: {
              type: 'input-number',
              min: 0,
              max: 1000000,
              step: 10,
            },
          },
          stop: {
            label: '模型停止输出的标记',
            desc: '',
          },
          responseFormat: {
            label: '输出结果的格式',
            desc: '取值：text、json_object、json_schema。默认为 text。',
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
            label: '是否保留输出思考过程',
            desc: '只对text响应格式生效',
          },
        },
      },
      'ci/exec': {
        label: '命令行',
        icon: '/images/ssh.svg',
        desc: '<ul><li>只执行系统白名单的命令</li></ul>',
        command: {
          label: '执行命令',
          desc: '',
        },
        args: {
          label: '参数',
          desc: '可以使用 ${metadata.key} 读取元数据中的变量或者使用 ${msg.key} 读取消息负荷中的变量进行替换',
        },
        log: {
          label: '打印标准输出',
          desc: '',
        },
        replaceData: {
          label: '替换Data',
          desc: '把Data替换为标准输出，默认为false',
        },
      },
      'ci/gitClone': {
        label: 'Git拉取',
        icon: '/images/git.svg',
        desc: '<ul><li>git克隆或者拉取仓库代码</li><a href="https://rulego.cc/pages/ci-git-clone/" target="_blank">帮助文档</a></ul>',
        repository: {
          label: '仓库地址',
          desc: '示例:https://github.com/rulego/rulego.git',
        },
        directory: {
          label: '克隆到本地目录',
          desc: '默认取元数据中workDir值',
        },
        reference: {
          label: '引用名称',
          desc: '可以是分支名、标签名完整引用名。例如：refs/heads/main。默认取元数据中ref值',
        },
        authType: {
          label: '认证类型',
          desc: '可以是:ssh/password/token',
        },
        authUser: {
          label: '用户名',
          desc: '',
        },
        authPassword: {
          label: '密码或 token',
          desc: '密码或 token',
        },
        authPemFile: {
          label: '秘钥文件路径',
          desc: '',
        },
        proxyUrl: {
          label: '代理URL',
          desc: '',
        },
        proxyUsername: {
          label: '代理用户名',
          desc: '',
        },
        proxyPassword: {
          label: '代理密码',
          desc: '',
        },
      },
      'ci/gitPush': {
        label: 'Git推送',
        icon: '/images/git-push.svg',
        desc: '<ul><li>git推送</li><a href="https://rulego.cc/pages/ci-git-push/" target="_blank">帮助文档</a></ul>',
        repository: {
          label: '仓库地址',
          desc: '示例:https://github.com/rulego/rulego.git',
        },
        directory: {
          label: '本地目录',
          desc: '默认取元数据中workDir值',
        },
        refSpecs: {
          label: '本地分支与远程分支映射关系',
          desc: '例如：refs/heads/your-branch:refs/heads/your-branch，多个映射关系与逗号隔开',
        },
        authType: {
          label: '认证类型',
          desc: '可以是:ssh/password/token',
        },
        authUser: {
          label: '用户名',
          desc: '',
        },
        authPassword: {
          label: '密码或 token',
          desc: '密码或 token',
        },
        authPemFile: {
          label: '秘钥文件路径',
          desc: '',
        },
        proxyUrl: {
          label: '代理地址',
          desc: '',
        },
        proxyUsername: {
          label: '代理用户名',
          desc: '',
        },
        proxyPassword: {
          label: '代理密码',
          desc: '',
        },
      },
      'ci/gitCommit': {
        label: 'Git提交',
        icon: '/images/git-commit.svg',
        desc: '<ul><li>git提交，如果文件没变更则转发到失败链</li><a href="https://rulego.cc/pages/ci-git-commit/" target="_blank">帮助文档</a></ul>',
        directory: {
          label: '本地目录',
          desc: '默认取元数据中workDir值',
        },
        pattern: {
          label: '添加的文件匹配模式',
          desc: '必须当前工作区相对目录。例如：/example/*.go',
          rules: [{ required: true, message: '添加的文件匹配模式是必须的' }],
        },
        message: {
          label: 'Git提交',
          desc: '',
          rules: [{ required: true, message: '提交消息是必须的' }],
        },
        signature: {
          label: '作者信息',
          desc: '',
          authorName: {
            label: '作者名称',
            desc: '',
          },
          authorEmail: {
            label: '作者邮箱',
            desc: '',
          },
        },
      },
      'ci/gitCreateTag': {
        label: 'Git创建标签',
        icon: '/images/git-tag.svg',
        desc: '<ul><li>git提交，如果文件没变更则转发到失败链</li><a href="https://rulego.cc/pages/ci-git-create-tag/" target="_blank">帮助文档</a></ul>',
        directory: {
          label: '本地目录',
          desc: '默认取元数据中workDir值',
        },
        tag: {
          label: '标签名称',
          desc: '',
          rules: [{ required: true, message: '标签名称是必须的' }],
        },
        message: {
          label: '标签消息',
          desc: '',
          rules: [{ required: true, message: '标签消息是必须的' }],
        },
        signature: {
          label: '作者信息',
          desc: '',
          authorName: {
            label: '作者名称',
            desc: '',
          },
          authorEmail: {
            label: '作者邮箱',
            desc: '',
          },
        },
      },
      'ci/gitLog': {
        label: '获取Git日志',
        icon: '/images/git-log.svg',
        desc: '<ul><li>获取git提交日志</li><a href="https://rulego.cc/pages/ci-git-log/" target="_blank">帮助文档</a></ul>',
        directory: {
          label: '本地目录',
          desc: '允许通过变量${msg.xx}获取。默认取${metadata.workDir}值',
        },
        limit: {
          label: '最大日志数量',
          desc: '',
          rules: [],
        },
        startTime: {
          label: '起始提交时间',
          desc: '允许通过变量${msg.xx}获取。yyyy-MM-dd或者yyyy-MM-dd HH:mm:ss 格式示例：2006-01-02 15:04:05',
        },
        endTime: {
          label: '结束提交时间',
          desc: '允许通过变量${msg.xx}获取。yyyy-MM-dd或者yyyy-MM-dd HH:mm:ss 格式示例：2006-01-02 15:04:05',
        },
      },
      'ci/ps': {
        label: '服务器指标',
        icon: '/images/ps.svg',
        desc: '用于监控服务器CPU、内存、磁盘等指标。<a href="https://rulego.cc/pages/ci-ps/" target="_blank">帮助文档</a>',
        options: {
          label: '指标列表',
          desc: '如果为空，则查询所有指标',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: true,
            options: [
              { label: '主机信息', value: 'host/info' },
              { label: 'CPU信息', value: 'cpu/info' },
              { label: '虚拟内存信息', value: 'mem/virtualMemory' },
              { label: '交换内存信息', value: 'mem/swapMemory' },
              { label: '磁盘使用情况', value: 'disk/usage' },
              { label: '磁盘IO计数器信息', value: 'disk/ioCounters' },
              { label: '网络IO计数器信息', value: 'net/ioCounters' },
              { label: '网络接口信息', value: 'net/interfaces' },
            ],
            placeholder: '请选择查询指标',
          },
        },
      },
      'x/opcuaRead': {
        label: 'OPC_UA读',
        icon: '/images/opcua_read.svg',
        category: 'iot',
        desc: '<ul><li>获取消息负荷指定节点列表点位数据，并通过Success链转到下一个节点。</li><a href="https://rulego.cc/pages/x-opcua-read/" target="_blank">帮助文档</a></ul>',
        server: {
          label: '服务器地址',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '示例: opc.tcp://localhost:4840',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        auth: {
          label: '授权方式',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
            options: [
              {
                label: '匿名',
                value: 'anonymous',
              },
              {
                label: '用户名',
                value: 'username',
              },
              {
                label: '证书',
                value: 'certificate',
              },
            ],
          },
        },
        username: {
          label: '用户名',
          desc: '如果授权方式是用户名需要填写',
        },
        password: {
          label: '密码',
          desc: '如果授权方式是用户名需要填写',
        },
        certFile: {
          label: '证书文件路径',
          desc: '如果授权方式是证书需要填写',
        },
        certKeyFile: {
          label: '密钥文件路径',
          desc: '如果授权方式是证书需要填写',
        },
        mode: {
          label: '模式',
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
          label: '策略',
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
        label: 'OPC_UA写',
        icon: '/images/opcua_write.svg',
        category: 'iot',
        desc: '<ul><li>把消息负荷点位数据列表，写入OPCUA服务器。</li><a href="https://rulego.cc/pages/x-opcua-write/" target="_blank">帮助文档</a></ul>',
        server: {
          label: '服务器地址',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '示例: opc.tcp://localhost:4840',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        auth: {
          label: '授权方式',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
            options: [
              {
                label: '匿名',
                value: 'anonymous',
              },
              {
                label: '用户名',
                value: 'username',
              },
              {
                label: '证书',
                value: 'certificate',
              },
            ],
          },
        },
        username: {
          label: '用户名',
          desc: '如果授权方式是用户名需要填写',
        },
        password: {
          label: '密码',
          desc: '如果授权方式是用户名需要填写',
        },
        certFile: {
          label: '证书文件路径',
          desc: '如果授权方式是证书需要填写',
        },
        certKeyFile: {
          label: '密钥文件路径',
          desc: '如果授权方式是证书需要填写',
        },
        mode: {
          label: '模式',
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
          label: '策略',
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
        desc: '<ul><li>通过OTLP协议把指标发送到后端系统，如：Prometheus、Datadog、InfluxDB等</li><a href="https://rulego.cc/pages/x-otel/" target="_blank">帮助文档</a></ul>',
        server: {
          label: 'OTLP后端系统地址',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '示例: localhost:4318',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        protocol: {
          label: '传输协议',
          rules: [{ required: true, message: '协议是必须的' }],
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
          label: '指标配置表达式',
          desc: '示例: ${msg.metrics} 指标配置表达式 和 指标配置 可以同时存在',
        },
        metrics: {
          label: '指标配置',
          rules: [],
          component: {
            type: 'table',
            options: [
              {
                name: 'metricName',
                label: '指标名称',
                type: 'string',
                rules: [{ required: true, message: '该项是必须的' }],
              },

              {
                name: 'unit',
                label: '单位',
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
                label: '操作类型',
                type: 'string',
                component: {
                  type: 'select',
                  filterable: true,
                  allowCreate: false,
                  multiple: false,
                  options: [
                    {
                      label: '计数器',
                      value: 'COUNTER',
                    },
                    {
                      label: '仪表盘',
                      value: 'GAUGE',
                    },
                    {
                      label: '直方图',
                      value: 'HISTOGRAM',
                    },
                  ],
                },
              },
              {
                name: 'description',
                label: '指标描述',
                type: 'string',
                component: {
                  type: 'textarea',
                },
              },
              {
                name: 'value',
                label: '值表达式',
                desc: '如：${msg.ipCount}',
                type: 'string',
              },
              {
                name: 'labels',
                label: '标签表达式',
                desc: '如：${msg.labels}',
                type: 'string',
              },
            ],
          },
        },
      },
      'x/wukongimSender': {
        label: 'WuKongIM发',
        icon: '/images/wukongim.svg',
        desc: '<ul><li>把消息负荷发送到WuKongIM指定频道或用户</li><a href="https://rulego.cc/pages/x-wukongim/" target="_blank">帮助文档</a></ul>',
        server: {
          label: '服务器地址',
          rules: [{ required: true, message: '该项是必须的' }],
          desc: '示例: tcp://175.27.245.108:15100',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        uID: {
          label: '用户ID',
          rules: [{ required: true, message: '该项是必须的' }],
        },
        token: {
          label: '登录密码',
          desc: '',
        },
        connectTimeout: {
          label: '连接超时，单位秒',
          desc: '',
        },
        protoVersion: {
          label: '协议版本',
          desc: '示例:3',
        },
        pingInterval: {
          label: '心跳间隔，单位秒',
          desc: '示例:30',
        },
        reconnect: {
          label: '是否自动重连',
          desc: '',
        },
        autoAck: {
          label: '是否自动确认消息',
          desc: '',
        },
        channelType: {
          label: '频道类型',
          desc: '',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
            options: [
              {
                label: '个人频道',
                value: '1',
              },
              {
                label: '群组频道',
                value: '2',
              },
              {
                label: '客服频道',
                value: '3',
              },
              {
                label: '社区频道',
                value: '4',
              },
              {
                label: '社区话题频道',
                value: '5',
              },
              {
                label: '资讯频道',
                value: '6',
              },
              {
                label: '数据频道',
                value: '7',
              },
            ],
          },
        },
        channelID: {
          label: '频道ID',
          desc: '允许使用 ${} 占位符变量。如果是个人频道填用户ID',
        },
        noPersist: {
          label: '是否不存储',
          desc: '',
        },
        syncOnce: {
          label: '是否同步一次',
          desc: '',
        },
        redDot: {
          label: '是否显示红点',
          desc: '',
        },
        noEncrypt: {
          label: '是否不需要加密',
          desc: '',
        },
      },
      'x/modbus': {
        label: 'Modbus读写',
        icon: '/images/modbus.svg',
        category: 'iot',
        desc: "<ul><li>获取消息负荷指定节点列表点位数据，并通过Success链转到下一个节点。</li><a href='https://rulego.cc/pages/x-modbus/' target='_blank'>帮助文档</a></ul>",
        server: {
          label: '服务器地址',
          rules: [
            {
              required: true,
              message: '该项是必须的',
            },
          ],
          desc: '服务器地址，格式为：<mode>://<serial device or host:port> 示例: tcp://hostname-or-ip-address:502; rtu:///dev/ttyUSB0',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: true,
            multiple: false,
          },
        },
        cmd: {
          label: 'Modbus方法名称',
          desc: 'Modbus命令名称',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: false,
            multiple: false,
            options: [
              {
                label: '读取线圈状态',
                value: 'ReadCoils',
              },
              {
                label: '读取单个线圈状态',
                value: 'ReadCoil',
              },
              {
                label: '读取离散输入状态',
                value: 'ReadDiscreteInputs',
              },
              {
                label: '读取单个离散输入状态',
                value: 'ReadDiscreteInput',
              },
              {
                label: '读取寄存器',
                value: 'ReadRegisters',
              },
              {
                label: '读取单个寄存器',
                value: 'ReadRegister',
              },
              {
                label: '读取无符号32位整数',
                value: 'ReadUint32s',
              },
              {
                label: '读取单个无符号32位整数',
                value: 'ReadUint32',
              },
              {
                label: '读取浮点数32位',
                value: 'ReadFloat32s',
              },
              {
                label: '读取单个浮点数32位',
                value: 'ReadFloat32',
              },
              {
                label: '读取无符号64位整数',
                value: 'ReadUint64s',
              },
              {
                label: '读取单个无符号64位整数',
                value: 'ReadUint64',
              },
              {
                label: '读取浮点数64位',
                value: 'ReadFloat64s',
              },
              {
                label: '读取单个浮点数64位',
                value: 'ReadFloat64',
              },
              {
                label: '读取字节数据',
                value: 'ReadBytes',
              },
              {
                label: '读取原始字节数据',
                value: 'ReadRawBytes',
              },
              {
                label: '写入线圈状态',
                value: 'WriteCoil',
              },
              {
                label: '写入多个线圈状态',
                value: 'WriteCoils',
              },
              {
                label: '写入寄存器',
                value: 'WriteRegister',
              },
              {
                label: '写入多个寄存器',
                value: 'WriteRegisters',
              },
              {
                label: '写入无符号32位整数',
                value: 'WriteUint32',
              },
              {
                label: '写入多个无符号32位整数',
                value: 'WriteUint32s',
              },
              {
                label: '写入浮点数32位',
                value: 'WriteFloat32',
              },
              {
                label: '写入多个浮点数32位',
                value: 'WriteFloat32s',
              },
              {
                label: '写入无符号64位整数',
                value: 'WriteUint64',
              },
              {
                label: '写入多个无符号64位整数',
                value: 'WriteUint64s',
              },
              {
                label: '写入浮点数64位',
                value: 'WriteFloat64',
              },
              {
                label: '写入多个浮点数64位',
                value: 'WriteFloat64s',
              },
              {
                label: '写入字节数据',
                value: 'WriteBytes',
              },
              {
                label: '写入原始字节数据',
                value: 'WriteRawBytes',
              },
            ],
          },
        },
        unitId: {
          label: '从机编号',
          desc: '使用的单元编号（从机编号），格式：uint8，示例：1',
          rules: [
            {
              required: true,
              message: '该项是必须的',
            },
          ],
        },
        address: {
          label: '寄存器地址',
          desc: '寄存器地址，允许使用${}占位符变量，格式：uint16，示例：50或者0x32',
        },
        quantity: {
          label: '寄存器数量',
          desc: '寄存器数量，允许使用${}占位符变量，示例：1',
        },
        value: {
          label: '寄存器值',
          desc: '寄存器值，允许使用${}占位符变量。读则不需要提供，如果写入多个与逗号隔开，例如：0x01,0x01 true 51,52',
        },
        regType: {
          label: '寄存器类型',
          desc: '寄存器类型',
          component: {
            type: 'select',
            filterable: true,
            allowCreate: false,
            multiple: false,
            options: [
              {
                label: '保持寄存器0x3',
                value: '0',
              },
              {
                label: '输入寄存器0x4',
                value: '1',
              },
            ],
          },
        },
        encodingConfig: {
          label: '编码配置',
          desc: '',
          endianness: {
            label: '字节序',
            desc: '寄存器的字节序',
            component: {
              type: 'select',
              filterable: true,
              allowCreate: false,
              multiple: false,
              options: [
                {
                  label: '大端序',
                  value: 1,
                },
                {
                  label: '小端序',
                  value: 2,
                },
              ],
            },
          },
          wordOrder: {
            label: '字序',
            desc: '32位寄存器的字序',
            component: {
              type: 'select',
              filterable: true,
              allowCreate: false,
              multiple: false,
              options: [
                {
                  label: '高字在前',
                  value: 1,
                },
                {
                  label: '低字在前',
                  value: 2,
                },
              ],
            },
          },
        },
        rtuConfig: {
          label: 'RTU配置',
          desc: '',
          parity: {
            label: '校验位',
            desc: '串行链路的校验模式（仅RTU模式）',
            component: {
              type: 'select',
              filterable: true,
              allowCreate: false,
              multiple: false,
              options: [
                {
                  label: '无校验',
                  value: 0,
                },
                {
                  label: '偶校验',
                  value: 1,
                },
                {
                  label: '奇校验',
                  value: 2,
                },
              ],
            },
          },
          speed: {
            label: '串行波特率',
            desc: '设置串行链路波特率（仅RTU模式）',
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
            label: '数据位',
            desc: '设置串行字符的数据位数（仅RTU模式）',
          },
          stopBits: {
            label: '停止位',
            desc: '设置串行停止位数（仅RTU模式）',
          },
        },
        tcpConfig: {
          label: 'TCP配置',
          desc: '',
          timeout: {
            label: '超时时间',
            desc: '设置请求超时值，单位为秒',
          },
          certPath: {
            label: '证书路径',
            desc: '证书文件路径',
          },
          keyPath: {
            label: '密钥路径',
            desc: '密钥文件路径',
          },
          caPath: {
            label: 'CA证书路径',
            desc: 'CA证书文件路径',
          },
        },
      },
    },
  },
  Input: '输入',
  relationTypes: {
    Success: '成功',
    Failure: '失败',
    True: '真',
    False: '假',
  },
};
