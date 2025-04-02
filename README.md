# server

English | [简体中文](README_ZH.md)

[Official Website](https://rulego.cc) | [Docs](https://rulego.cc/en/pages/rulego-server/) | [Contribution Guide](CONTRIBUTION.md)

<img src="docs/imgs/logo.png" alt="logo" width="100"/> 

`RuleGo-Server` is a lightweight, high-performance, modular, and integration-friendly automation workflow platform built on [RuleGo](https://github.com/rulego/rulego).

It can be used for automation orchestration, iPaaS (Integration Platform as a Service), API orchestration, application orchestration, AI orchestration, data processing, IoT rule engine, AI assistant, and other scenarios.


## Features
- **Lightweight:** Low memory usage, high performance, simple deployment, ready-to-use, no database required.
- **Rich Components:** Over 100 built-in components. Additionally, a component marketplace and rule chain marketplace are provided, supporting dynamic installation.
- **Visualization:** Supports visualization of rule chains.
- **Modular:** Compile and load on demand.
- **Hot Updates:** Workflow supports hot updates.
- **AI Support:** Supports large model components. The system automatically registers all components and rule chains as MCP tools for use by AI assistants.
- **Bridge the Last Mile:** Third-party system services can be easily encapsulated into MCP tools with the help of RuleGo-Server.

## Experience Links
- Experience Link 1: [http://8.134.32.225:9090/rulego-ipaas-ui/](http://8.134.32.225:9090/rulego-ipaas-ui/)
- Experience Link 2: [http://8.134.32.225:9090/ui/](http://8.134.32.225:9090/ui/)
- Experience Link 3: [http://8.134.32.225:9090/editor/](http://8.134.32.225:9090/editor/)

## HTTP API

[API Documentation](https://apifox.com/apidoc/shared-d17a63fe-2201-4e37-89fb-f2e8c1cbaf40/234016936e0)

## Multi-Tenancy
This project supports multi-tenancy/users, with isolated rule chain data for each user. User data is stored in the `data/workflows/{username}` directory.

User permission verification is disabled by default, and all operations are performed as the default user. To enable permission verification:

- Obtain a token through username and password, then access other interfaces using the token. Example:
```ini
# Whether to enable JWT authentication for APIs. If disabled, operations will be performed as the default user (admin)
require_auth = true
# JWT secret key
jwt_secret_key = r6G7qZ8xk9P0y1Q2w3E4r5T6y7U8i9O0pL7z8x9CvBnM3k2l1
# JWT expiration time
jwt_expire_time = 43200000
# JWT issuer
jwt_issuer = rulego.cc
# User list
# Configure usernames and passwords in the format username=password[,apiKey]. The apiKey is optional.
# If apiKey is configured, the caller can access other interfaces directly using the apiKey without logging in.
[users]
admin = admin
user01 = user01
```
The frontend obtains a token through the login interface (`/api/v1/login`), then accesses other interfaces using the token. Example:
```shell
curl -H "Authorization: Bearer token" http://localhost:8080/api/resource
```
- Access other interfaces using the `api_key` method. Example:
```ini
# Whether to enable JWT authentication for APIs. If disabled, operations will be performed as the default user (admin)
require_auth = true
# User list
# Configure usernames and passwords in the format username=password[,apiKey]. The apiKey is optional.
# If apiKey is configured, the caller can access other interfaces directly using the apiKey without logging in.
[users]
admin = admin,2af255ea-5618-467d-914c-67a8beeca31d
user01 = user01
```

Then access other interfaces using the token. Example:
```shell
curl -H "Authorization: Bearer apiKey" http://localhost:8080/api/resource
```

## Server Compilation

To save the size of the compiled file, the extension component [rulego-components](https://github.com/rulego/rulego-components) is not included by default. Default compilation:

```shell
cd cmd/server
go build .
```

If you need to include the extension component [rulego-components](https://github.com/rulego/rulego-components), compile with the `with_extend` tag:

```shell
cd cmd/server
go build -tags with_extend .
```
Other extension component library tags:
- Register the extension component [rulego-components](https://github.com/rulego/rulego-components) using the `with_extend` tag for compilation:
- Register the AI extension component [rulego-components-ai](https://github.com/rulego/rulego-components-ai) using the `with_ai` tag for compilation
- Register the CI/CD extension component [rulego-components-ci](https://github.com/rulego/rulego-components-ci) using the `with_ci` tag for compilation
- Register the IoT extension component [rulego-components-iot](https://github.com/rulego/rulego-components-iot) using the `with_iot` tag for compilation
- Register the ETL extension component [rulego-components-etl](https://github.com/rulego/rulego-components-etl) using the `with_etl` tag for compilation

If you need to include multiple extension component libraries at the same time, you can compile with the `go build -tags "with_extend,with_ai,with_ci,with_iot,with_etl"` tag.

## Server Startup

```shell
./server -c="./config.conf"
```

Or start in the background:

```shell
nohup ./server -c="./config.conf" >> console.log &
```

## UI
Details: [UI](ui/README.md)
Rename the compiled `ui` directory to `editor` and place it in the root directory, then run `server`.

## RuleGo-Server-MCP
RuleGo-Server supports MCP (Model Context Protocol).
When enabled, the system automatically registers all registered components, rule chains, and APIs as MCP tools.
This allows AI assistants (such as Windsurf, Cursor, Codeium, etc.) to directly call these tools through the MCP protocol, achieving deep integration with application systems.
Documentation: [rulego-server-mcp](https://rulego.cc/en/pages/rulego-server-mcp/)

## Configuration File Parameters
`config.conf`
```ini
# Data directory
data_dir = ./data
# Whitelist for cmd component commands
cmd_white_list = cp,scp,mvn,npm,yarn,git,make,cmake,docker,kubectl,helm,ansible,puppet,pytest,python,python3,pip,go,java,dotnet,gcc,g++,ctest
# Whether to load third-party Lua libraries
load_lua_libs = true
# HTTP server
server = :9090
# Default user
default_username = admin
# Whether to log node execution logs to the log file
debug = true
# Maximum node log size, default 40
max_node_log_size =40
# Resource mapping, supports wildcards, multiple mappings separated by commas, format: /url/*filepath=/path/to/file
resource_mapping = /editor/*filepath=./editor,/images/*filepath=./editor/images
# Node pool file, in rule chain JSON format, example: ./node_pool.json
node_pool_file=./node_pool.json
# Save run log to file
save_run_log = false
# Maximum script execution time
script_max_execution_time = 5000
# Whether to enable JWT authentication for APIs
require_auth = false
# JWT secret key
jwt_secret_key = r6G7qZ8xk9P0y1Q2w3E4r5T6y7U8i9O0pL7z8x9CvBnM3k2l1
# JWT expiration time, in milliseconds
jwt_expire_time = 43200000
# JWT issuer
jwt_issuer = rulego.cc
# MCP server configuration
[mcp]
# Whether to enable the MCP service
enable = true
# Whether to use components as MCP tools
load_components_as_tool = true
# Whether to use rule chains as MCP tools
load_chains_as_tool = true
# Whether to add a rule chain API tool
load_apis_as_tool = true
# Exclude component list
exclude_components = comment,iterator,delay,groupAction,ref,fork,join,*Filter
# Exclude rule chain list
exclude_chains =

# pprof configuration
[pprof]
# Whether to enable pprof
enable = false
# pprof address
addr = 0.0.0.0:6060

# Global custom configuration, components can access values using ${global.xxx}
[global]
# Example
sqlDriver = mysql
sqlDsn = root:root@tcp(127.0.0.1:3306)/test

# User list
# Configure usernames and passwords in the format username=password[,apiKey]. The apiKey is optional.
# If apiKey is configured, the caller can access other interfaces directly using the apiKey without logging in.
[users]
admin = admin,2af255ea5618467d914c67a8beeca31d
user01 = user01,2af255ea5618467d914c67a8beeca51c
```

## Contact Us
Email: rulego@outlook.com