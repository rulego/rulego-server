# RuleGo-Server

[English](README.md)| 中文

[官网](https://rulego.cc) | [文档](https://rulego.cc/pages/rulego-server/) | [贡献指南](CONTRIBUTION_CN.md)

`RuleGo-Server` 是一个基于[RuleGo](https://github.com/rulego/rulego) 构建的轻量化、高性能、模块化、便于集成的自动化工作流平台。
可用于自动化编排、iPaaS（集成平台即服务）、API编排、应用编排、AI编排、数据处理、IoT规则引擎、AI助手等场景。

## 特性
- 轻量级：内存小、性能高、部署简单、开箱即用、不需要数据库
- 丰富的组件：内置100+组件。另外提供组件市场和规则链市场，支持动态安装
- 可视化：支持规则链的可视化
- 组件化：按需编译，按需加载
- 热更新：工作流支持热更新
- AI支持：支持大模型组件。另外系统会自动把所有组件和规则链注册成MCP工具，对外提供给AI助手使用
- 打通AI助手与应用最后一公里：第三方系统服务可以很方便借助RuleGo-Server封装成MCP工具

## 体验地址
- 体验地址1：[http://8.134.32.225:9090/rulego-ipaas-ui/](http://8.134.32.225:9090/rulego-ipaas-ui/)
- 体验地址2：[http://8.134.32.225:9090/ui/](http://8.134.32.225:9090/ui/)
- 体验地址3：[http://8.134.32.225:9090/editor/](http://8.134.32.225:9090/editor/)

## 组件和工作流市场
[rulego-marketplace](https://github.com/rulego/rulego-marketplace)

## HTTP API

[API 文档](https://apifox.com/apidoc/shared-d17a63fe-2201-4e37-89fb-f2e8c1cbaf40/234016936e0)

## 多租户
该工程支持多租户/用户，每个用户的规则链数据是隔离的，用户数据存在`data/workflows/{username}`目录下。

用户权限校验默认是关闭，所有操作都是基于默认用户操作。开启权限校验方法：

- 通关过用户名密码获取token，然后通过token访问其他接口。示例:
```ini
# api是否开启jwt认证，如果关闭，则以默认用户(admin)身份操作
require_auth = true
# jwt secret key
jwt_secret_key = r6G7qZ8xk9P0y1Q2w3E4r5T6y7U8i9O0pL7z8x9CvBnM3k2l1
# jwt expire time
jwt_expire_time = 43200000
# jwt issuer
jwt_issuer = rulego.cc
# 用户列表
# 配置用户和密码，格式 username=password[,apiKey]，apiKey可选。
# 如果配置apiKey 调用方可以不需要登录，直接通过apiKey访问其他接口。
[users]
admin = admin
user01 = user01
```
前端通过登录接口(`/api/v1/login`)，获取token，然后通过token访问其他接口。示例：
```shell
curl -H "Authorization: Bearer token" http://localhost:8080/api/resource
```
- 通过`api_key`方式访问其他接口。示例：
```ini
# api是否开启jwt认证，如果关闭，则以默认用户(admin)身份操作
require_auth = true
# 用户列表
# 配置用户和密码，格式 username=password[,apiKey]，apiKey可选。
# 如果配置apiKey 调用方可以不需要登录，直接通过apiKey访问其他接口。
[users]
admin = admin,2af255ea-5618-467d-914c-67a8beeca31d
user01 = user01
```

然后通过token访问其他接口。示例：
```shell
curl -H "Authorization: Bearer apiKey" http://localhost:8080/api/resource
```

## server编译

为了节省编译后文件大小，默认不引入扩展组件[rulego-components](https://github.com/rulego/rulego-components) ，默认编译：

```shell
cd cmd/server
go build .
```

如果需要引入扩展组件[rulego-components](https://github.com/rulego/rulego-components) ，使用`with_extend`tag进行编译：

```shell
cd cmd/server
go build -tags with_extend .
```
其他扩展组件库tags：
- 注册扩展组件[rulego-components](https://github.com/rulego/rulego-components) ，使用`with_extend`tag进行编译：
- 注册AI扩展组件[rulego-components-ai](https://github.com/rulego/rulego-components-ai) ，使用`with_ai`tag进行编译
- 注册CI/CD扩展组件[rulego-components-ci](https://github.com/rulego/rulego-components-ci) ，使用`with_ci`tag进行编译
- 注册IoT扩展组件[rulego-components-iot](https://github.com/rulego/rulego-components-iot) ，使用`with_iot`tag进行编译
- 注册ETL扩展组件[rulego-components-etl](https://github.com/rulego/rulego-components-etl) ，使用`with_etl`tag进行编译

如果需要同时引入多个扩展组件库，可以使用`go build -tags "with_extend,with_ai,with_ci,with_iot,with_etl" .` tag进行编译。

## server启动

```shell
./server -c="./config.conf"
```

或者后台启动

```shell
nohup ./server -c="./config.conf" >> console.log &
```

## UI
[UI](ui/README.md)]

把编译后的`ui`目录改名成`editor`放到根目录下，然后运行`server`即可。也可以通过配置文件修改`ui`目录例如：
```ini
resource_mapping = /editor/*filepath=./editor,/images/*filepath=./editor/images
```

## RuleGo-Server-MCP
RuleGo-Server 支持 MCP（Model Context Protocol，模型上下文协议），
开启后，系统会自动将所有注册的组件、规则链以及 API 注册为 MCP 工具。
这使得 AI 助手（如 Windsurf、Cursor、Codeium 等）能够通过 MCP 协议直接调用这些工具，实现与应用系统的深度融合。
文档: [rulego-server-mcp](https://rulego.cc/pages/rulego-server-mcp/)

## 配置文件参数
`config.conf`
```ini
# 数据目录
data_dir = ./data
# cmd组件命令白名单
cmd_white_list = cp,scp,mvn,npm,yarn,git,make,cmake,docker,kubectl,helm,ansible,puppet,pytest,python,python3,pip,go,java,dotnet,gcc,g++,ctest
# 是否加载lua第三方库
load_lua_libs = true
# http server
server = :9090
# 默认用户
default_username = admin
# 是否把节点执行日志打印到日志文件
debug = true
# 最大节点日志大小，默认40
max_node_log_size =40
# 资源映射，支持通配符，多个映射用逗号分隔，格式：/url/*filepath=/path/to/file
resource_mapping = /editor/*filepath=./editor,/images/*filepath=./editor/images
# 节点池文件，规则链json格式，示例：./node_pool.json
node_pool_file=./node_pool.json
# save run log to file
save_run_log = false
# script max execution time
script_max_execution_time = 5000
# api是否开启jwt认证
require_auth = false
# jwt secret key
jwt_secret_key = r6G7qZ8xk9P0y1Q2w3E4r5T6y7U8i9O0pL7z8x9CvBnM3k2l1
# jwt expire time，单位毫秒
jwt_expire_time = 43200000
# jwt issuer
jwt_issuer = rulego.cc
# mcp server config
[mcp]
# Whether to enable the MCP service
enable = true
# Whether to use the component as an MCP tool
load_components_as_tool = true
# Whether to use the rule chain as an MCP tool
load_chains_as_tool = true
# Whether to add a rule chain api tool
load_apis_as_tool = true
# Exclude component list
exclude_components = comment,iterator,delay,groupAction,ref,fork,join,*Filter
# Exclude rule chain list
exclude_chains =

# pprof配置
[pprof]
# 是否开启pprof
enable = false
# pprof地址
addr = 0.0.0.0:6060

# 全局自定义配置，组件可以通过${global.xxx}方式取值
[global]
# 例子
sqlDriver = mysql
sqlDsn = root:root@tcp(127.0.0.1:3306)/test

# 用户列表
# 配置用户和密码，格式 username=password[,apiKey]，apiKey可选。
# 如果配置apiKey 调用方可以不需要登录，直接通过apiKey访问其他接口。
[users]
admin = admin,2af255ea5618467d914c67a8beeca31d
user01 = user01,2af255ea5618467d914c67a8beeca51c
```

## 贡献
欢迎任何形式的贡献，包括提交问题、建议、文档、测试、组件市场组件或代码。[贡献指南](CONTRIBUTION_CN.md)

## 交流群
Email: rulego@outlook.com

QQ群号：**720103251**     
<img src="docs/imgs/qq.png"  width="258">

微信(加好友拉入群)：**rulegoteam**     
<img src="docs/imgs/wechat.png" width="258">