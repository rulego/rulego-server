package config

import (
	"os"
	"strconv"
	"strings"

	"github.com/rulego/rulego-server/internal/constants"

	"github.com/rulego/rulego/api/types"
)

var C Config

func Get() *Config {
	return &C
}

func Set(c Config) {
	C = c
	if C.EventBusChainId == "" {
		C.EventBusChainId = constants.KeyDefaultIntegrationChainId
	}
}

type Config struct {
	// DataDir 数据目录
	DataDir string `ini:"data_dir" env:"RULEGO_DATA_DIR"`
	// LogFile 日志文件
	LogFile string `ini:"log_file" env:"RULEGO_LOG_FILE"`
	// CmdWhiteList shell命令白名单
	CmdWhiteList string `ini:"cmd_white_list" env:"RULEGO_CMD_WHITE_LIST"`
	// LoadLuaLibs 是否加载lua库
	LoadLuaLibs string `ini:"load_lua_libs" env:"RULEGO_LOAD_LUA_LIBS"`
	// Server http服务器地址
	Server string `ini:"server" env:"RULEGO_SERVER"`
	// DefaultUsername 你们访问时候，默认用户名
	DefaultUsername string `ini:"default_username" env:"RULEGO_DEFAULT_USERNAME"`
	// 是否把节点调试日志打印到日志文件
	Debug bool `ini:"debug" env:"RULEGO_DEBUG"`
	// 最大节点日志大小，默认40
	MaxNodeLogSize int `ini:"max_node_log_size" env:"RULEGO_MAX_NODE_LOG_SIZE"`
	// 静态文件路径映射，例如:/ui/*filepath=/home/demo/dist,/images/*filepath=/home/demo/dist/images
	ResourceMapping string `ini:"resource_mapping" env:"RULEGO_RESOURCE_MAPPING"`
	// 全局自定义配置，组件可以通过${global.xxx}方式取值
	Global types.Properties `ini:"global"`
	// 节点池文件，规则链json格式
	NodePoolFile string `ini:"node_pool_file" env:"RULEGO_NODE_POOL_FILE"`
	// 是否保存运行日志到文件
	SaveRunLog bool `ini:"save_run_log" env:"RULEGO_SAVE_RUN_LOG"`
	// ScriptMaxExecutionTime json执行脚本的最大执行时间，单位毫秒
	ScriptMaxExecutionTime int `ini:"script_max_execution_time" env:"RULEGO_SCRIPT_MAX_EXECUTION_TIME"`
	// EndpointEnabled 是否启用endpoint
	EndpointEnabled *bool `ini:"endpoint_enabled" env:"RULEGO_ENDPOINT_ENABLED"`
	// SecretKey 密钥
	SecretKey *string `ini:"secret_key" env:"RULEGO_SECRET_KEY"`
	// EventBusChainId 核心规则链Id
	EventBusChainId string `ini:"event_bus_chain_id" env:"RULEGO_EVENT_BUS_CHAIN_ID"`

	// RequireAuth api访问是否需要验证，默认不需要
	RequireAuth bool `ini:"require_auth" env:"RULEGO_REQUIRE_AUTH"`
	// JwtSecretKey jwt密钥
	JwtSecretKey string `ini:"jwt_secret_key" env:"RULEGO_JWT_SECRET_KEY"`
	// JwtExpireTime jwt过期时间，单位毫秒
	JwtExpireTime int `ini:"jwt_expire_time" env:"RULEGO_JWT_EXPIRE_TIME"`
	// JwtIssuer jwt签发者
	JwtIssuer string `ini:"jwt_issuer" env:"RULEGO_JWT_ISSUER"`
	// 用户列表
	Users types.Properties `ini:"users"`
	// Pprof pprof配置
	Pprof Pprof `ini:"pprof"`
	// 组件市场根地址
	MarketplaceBaseUrl string `ini:"marketplace_base_url" env:"RULEGO_MARKETPLACE_BASE_URL"`
	// 是否默认HTTP服务设置成共享节点
	ShareHttpServer bool `ini:"share_http_server" env:"RULEGO_SHARE_HTTP_SERVER"`
	// MCP配置
	MCP MCP `ini:"mcp"`
	// 用户名和密码映射
	UserNamePasswordMap types.Properties `ini:"-"`
	// API key和用户名映射
	ApiKeyUserNameMap types.Properties `ini:"-"`
}

type Pprof struct {
	Enable bool   `ini:"enable" env:"RULEGO_PPROF_ENABLE"`
	Addr   string `ini:"addr" env:"RULEGO_PPROF_ADDR"`
}

type MCP struct {
	// 是否启用MCP服务，默认为true
	Enable bool `ini:"enable" env:"RULEGO_MCP_ENABLE"`
	// 是否把组件作为工MCP具，默认为true
	LoadComponentsAsTool bool `ini:"load_components_as_tool" env:"RULEGO_MCP_LOAD_COMPONENTS_AS_TOOL"`
	// 是否把规则链作为MCP工具，默认为true
	LoadChainsAsTool bool `ini:"load_chains_as_tool" env:"RULEGO_MCP_LOAD_CHAINS_AS_TOOL"`
	// 是否把API座位MCP工具，默认为true
	LoadApisAsTool bool `ini:"load_apis_as_tool" env:"RULEGO_MCP_LOAD_APIS_AS_TOOL"`
	// 排除的规则链ID，多个用逗号分隔。支持*通配符，例如: *Filter
	ExcludeChains string `ini:"exclude_chains" env:"RULEGO_MCP_EXCLUDE_CHAINS"`
	// 排除的组件，多个用逗号分隔。支持*通配符，例如: *Filter
	ExcludeComponents string `ini:"exclude_components" env:"RULEGO_MCP_EXCLUDE_COMPONENTS"`
}

// LoadFromEnv 从环境变量加载配置
func (c *Config) LoadFromEnv() {
	// 基础配置
	if value := os.Getenv("RULEGO_DATA_DIR"); value != "" {
		c.DataDir = value
	}
	if value := os.Getenv("RULEGO_LOG_FILE"); value != "" {
		c.LogFile = value
	}
	if value := os.Getenv("RULEGO_CMD_WHITE_LIST"); value != "" {
		c.CmdWhiteList = value
	}
	if value := os.Getenv("RULEGO_LOAD_LUA_LIBS"); value != "" {
		c.LoadLuaLibs = value
	}
	if value := os.Getenv("RULEGO_SERVER"); value != "" {
		c.Server = value
	}
	if value := os.Getenv("RULEGO_DEFAULT_USERNAME"); value != "" {
		c.DefaultUsername = value
	}
	if value := os.Getenv("RULEGO_DEBUG"); value != "" {
		if boolValue, err := strconv.ParseBool(value); err == nil {
			c.Debug = boolValue
		}
	}
	if value := os.Getenv("RULEGO_MAX_NODE_LOG_SIZE"); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			c.MaxNodeLogSize = intValue
		}
	}
	if value := os.Getenv("RULEGO_RESOURCE_MAPPING"); value != "" {
		c.ResourceMapping = value
	}
	if value := os.Getenv("RULEGO_NODE_POOL_FILE"); value != "" {
		c.NodePoolFile = value
	}
	if value := os.Getenv("RULEGO_SAVE_RUN_LOG"); value != "" {
		if boolValue, err := strconv.ParseBool(value); err == nil {
			c.SaveRunLog = boolValue
		}
	}
	if value := os.Getenv("RULEGO_SCRIPT_MAX_EXECUTION_TIME"); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			c.ScriptMaxExecutionTime = intValue
		}
	}

	// Endpoint配置
	if value := os.Getenv("RULEGO_ENDPOINT_ENABLED"); value != "" {
		if boolValue, err := strconv.ParseBool(value); err == nil {
			c.EndpointEnabled = &boolValue
		}
	}

	// SecretKey配置
	if value := os.Getenv("RULEGO_SECRET_KEY"); value != "" {
		c.SecretKey = &value
	}

	// EventBus配置
	if value := os.Getenv("RULEGO_EVENT_BUS_CHAIN_ID"); value != "" {
		c.EventBusChainId = value
	}

	// JWT配置
	if value := os.Getenv("RULEGO_REQUIRE_AUTH"); value != "" {
		if boolValue, err := strconv.ParseBool(value); err == nil {
			c.RequireAuth = boolValue
		}
	}
	if value := os.Getenv("RULEGO_JWT_SECRET_KEY"); value != "" {
		c.JwtSecretKey = value
	}
	if value := os.Getenv("RULEGO_JWT_EXPIRE_TIME"); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			c.JwtExpireTime = intValue
		}
	}
	if value := os.Getenv("RULEGO_JWT_ISSUER"); value != "" {
		c.JwtIssuer = value
	}

	// 其他配置
	if value := os.Getenv("RULEGO_MARKETPLACE_BASE_URL"); value != "" {
		c.MarketplaceBaseUrl = value
	}
	if value := os.Getenv("RULEGO_SHARE_HTTP_SERVER"); value != "" {
		if boolValue, err := strconv.ParseBool(value); err == nil {
			c.ShareHttpServer = boolValue
		}
	}

	// Pprof配置
	if value := os.Getenv("RULEGO_PPROF_ENABLE"); value != "" {
		if boolValue, err := strconv.ParseBool(value); err == nil {
			c.Pprof.Enable = boolValue
		}
	}
	if value := os.Getenv("RULEGO_PPROF_ADDR"); value != "" {
		c.Pprof.Addr = value
	}

	// MCP配置
	if value := os.Getenv("RULEGO_MCP_ENABLE"); value != "" {
		if boolValue, err := strconv.ParseBool(value); err == nil {
			c.MCP.Enable = boolValue
		}
	}
	if value := os.Getenv("RULEGO_MCP_LOAD_COMPONENTS_AS_TOOL"); value != "" {
		if boolValue, err := strconv.ParseBool(value); err == nil {
			c.MCP.LoadComponentsAsTool = boolValue
		}
	}
	if value := os.Getenv("RULEGO_MCP_LOAD_CHAINS_AS_TOOL"); value != "" {
		if boolValue, err := strconv.ParseBool(value); err == nil {
			c.MCP.LoadChainsAsTool = boolValue
		}
	}
	if value := os.Getenv("RULEGO_MCP_LOAD_APIS_AS_TOOL"); value != "" {
		if boolValue, err := strconv.ParseBool(value); err == nil {
			c.MCP.LoadApisAsTool = boolValue
		}
	}
	if value := os.Getenv("RULEGO_MCP_EXCLUDE_CHAINS"); value != "" {
		c.MCP.ExcludeChains = value
	}
	if value := os.Getenv("RULEGO_MCP_EXCLUDE_COMPONENTS"); value != "" {
		c.MCP.ExcludeComponents = value
	}
}

func (c *Config) InitUserMap() {
	if c.Users != nil {
		c.UserNamePasswordMap = types.Properties{}
		for username, passwordAndApiKey := range c.Users {
			c.UserNamePasswordMap[strings.TrimSpace(username)] = strings.TrimSpace(strings.Split(passwordAndApiKey, ",")[0])
		}
		c.ApiKeyUserNameMap = types.Properties{}
		for username, passwordAndApiKey := range c.Users {
			params := strings.Split(passwordAndApiKey, ",")
			if len(params) > 1 {
				c.ApiKeyUserNameMap[strings.TrimSpace(params[1])] = strings.TrimSpace(username)
			}
		}
	}
}

// CheckPassword 检查密码
func (c *Config) CheckPassword(username, password string) bool {
	if c.UserNamePasswordMap == nil {
		return false
	}
	return c.UserNamePasswordMap[username] == password
}

// GetUsernameByApiKey 通过ApiKey获取用户名
func (c *Config) GetUsernameByApiKey(apikey string) string {
	if c.ApiKeyUserNameMap == nil {
		return ""
	}
	return c.ApiKeyUserNameMap[apikey]
}

// GetApiKeyByUsername 通过用户名获取ApiKey
func (c *Config) GetApiKeyByUsername(username string) string {
	if c.UserNamePasswordMap == nil {
		return ""
	}
	for apikey, u := range c.ApiKeyUserNameMap {
		if u == username {
			return apikey
		}
	}
	return ""
}

// DefaultConfig 默认配置
var DefaultConfig = Config{
	DataDir: "./data",
	// LogFile:      "./rulego.log",
	CmdWhiteList:       "cp,scp,mvn,npm,yarn,git,make,cmake,docker,kubectl,helm,ansible,puppet,pytest,python,python3,pip,go,java,dotnet,gcc,g++,ctest",
	LoadLuaLibs:        "true",
	Server:             ":9091",
	DefaultUsername:    "admin",
	MaxNodeLogSize:     40,
	ResourceMapping:    "/editor/*filepath=./editor,/images/*filepath=./editor/images",
	JwtSecretKey:       "r6G7qZ8xk9P0y1Q2w3E4r5T6y7U8i9O0pL7z8x9CvBnM3k2l1",
	JwtExpireTime:      43200000, // 12小时
	JwtIssuer:          "rulego.cc",
	MarketplaceBaseUrl: "http://8.134.32.225:9090/api/v1",
	ShareHttpServer:    true,
	Users: types.Properties{
		"admin": "admin,2af255ea5618467d914c67a8beeca31d",
	},
	Pprof: Pprof{
		Enable: false,
		Addr:   "0.0.0.0:6060",
	},
	MCP: MCP{
		Enable:               true,
		LoadComponentsAsTool: true,
		LoadChainsAsTool:     true,
		LoadApisAsTool:       true,
		ExcludeComponents:    "comment,iterator,delay,groupAction,ref,fork,join,for,*Filter",
	},
}
