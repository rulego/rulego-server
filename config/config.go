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
	// DataDir data directory
	DataDir string `ini:"data_dir" env:"RULEGO_DATA_DIR"`
	// LogFile
	LogFile string `ini:"log_file" env:"RULEGO_LOG_FILE"`
	// CmdWhiteList shell commands the whitelist
	CmdWhiteList string `ini:"cmd_white_list" env:"RULEGO_CMD_WHITE_LIST"`
	// LoadLuaLibs Whether to load the lua library
	LoadLuaLibs string `ini:"load_lua_libs" env:"RULEGO_LOAD_LUA_LIBS"`
	// Server http server address
	Server string `ini:"server" env:"RULEGO_SERVER"`
	// DefaultUsername is the default username when you visit
	DefaultUsername string `ini:"default_username" env:"RULEGO_DEFAULT_USERNAME"`
	// Whether node debug logs are printed into log files
	Debug bool `ini:"debug" env:"RULEGO_DEBUG"`
	// Maximum node log size, default 40
	MaxNodeLogSize int `ini:"max_node_log_size" env:"RULEGO_MAX_NODE_LOG_SIZE"`
	// Static file path mapping, for example: /ui/*filepath=/home/demo/dist, /images/*filepath=/home/demo/dist/images
	ResourceMapping string `ini:"resource_mapping" env:"RULEGO_RESOURCE_MAPPING"`
	// Global custom configuration, components can take values using ${global.xxx}
	Global types.Properties `ini:"global"`
	// Node pool files, rule chain in JSON format
	NodePoolFile string `ini:"node_pool_file" env:"RULEGO_NODE_POOL_FILE"`
	// Whether to save the runtime log to a file
	SaveRunLog bool `ini:"save_run_log" env:"RULEGO_SAVE_RUN_LOG"`
	// ScriptMaxExecutionTime: The maximum execution time for a script in milliseconds
	ScriptMaxExecutionTime int `ini:"script_max_execution_time" env:"RULEGO_SCRIPT_MAX_EXECUTION_TIME"`
	// EndpointEnabled Whether to enable Endpoint
	EndpointEnabled *bool `ini:"endpoint_enabled" env:"RULEGO_ENDPOINT_ENABLED"`
	// SecretKey key
	SecretKey *string `ini:"secret_key" env:"RULEGO_SECRET_KEY"`
	// EventBusChainId Core rule Chain Id
	EventBusChainId string `ini:"event_bus_chain_id" env:"RULEGO_EVENT_BUS_CHAIN_ID"`

	// Whether authentication is required for RequireAuth API access, by default it is not required
	RequireAuth bool `ini:"require_auth" env:"RULEGO_REQUIRE_AUTH"`
	// JwtSecretKey jwt key
	JwtSecretKey string `ini:"jwt_secret_key" env:"RULEGO_JWT_SECRET_KEY"`
	// JwtExpireTime, jwt expiration time, in milliseconds
	JwtExpireTime int `ini:"jwt_expire_time" env:"RULEGO_JWT_EXPIRE_TIME"`
	// JwtIssuer jwt issuer
	JwtIssuer string `ini:"jwt_issuer" env:"RULEGO_JWT_ISSUER"`
	// User list
	Users types.Properties `ini:"users"`
	// Pprof pprof configuration
	Pprof Pprof `ini:"pprof"`
	// Module market root address
	MarketplaceBaseUrl string `ini:"marketplace_base_url" env:"RULEGO_MARKETPLACE_BASE_URL"`
	// Is the HTTP service set to a shared node by default?
	ShareHttpServer bool `ini:"share_http_server" env:"RULEGO_SHARE_HTTP_SERVER"`
	// MCP configuration
	MCP MCP `ini:"mcp"`
	// Username and password mapping
	UserNamePasswordMap types.Properties `ini:"-"`
	// API key and username mapping
	ApiKeyUserNameMap types.Properties `ini:"-"`
}

type Pprof struct {
	Enable bool   `ini:"enable" env:"RULEGO_PPROF_ENABLE"`
	Addr   string `ini:"addr" env:"RULEGO_PPROF_ADDR"`
}

type MCP struct {
	// Whether to enable MCP service is set to true by default
	Enable bool `ini:"enable" env:"RULEGO_MCP_ENABLE"`
	// Whether to use components as MCP tools defaults to true
	LoadComponentsAsTool bool `ini:"load_components_as_tool" env:"RULEGO_MCP_LOAD_COMPONENTS_AS_TOOL"`
	// Whether to use the rule chain as an MCP tool, default is true
	LoadChainsAsTool bool `ini:"load_chains_as_tool" env:"RULEGO_MCP_LOAD_CHAINS_AS_TOOL"`
	// Whether to set the API seat MCP tool to true by default
	LoadApisAsTool bool `ini:"load_apis_as_tool" env:"RULEGO_MCP_LOAD_APIS_AS_TOOL"`
	// Rule chain IDs for exclusion, multiple separated by commas. Supports *wildcards, for example: *Filter
	ExcludeChains string `ini:"exclude_chains" env:"RULEGO_MCP_EXCLUDE_CHAINS"`
	// Excluded components, multiple separated by commas. Supports *wildcards, for example: *Filter
	ExcludeComponents string `ini:"exclude_components" env:"RULEGO_MCP_EXCLUDE_COMPONENTS"`
}

// LoadFromEnv loads the configuration from the environment variable
func (c *Config) LoadFromEnv() {
	// Basic configuration
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

	// Endpoint configuration
	if value := os.Getenv("RULEGO_ENDPOINT_ENABLED"); value != "" {
		if boolValue, err := strconv.ParseBool(value); err == nil {
			c.EndpointEnabled = &boolValue
		}
	}

	// SecretKey configuration
	if value := os.Getenv("RULEGO_SECRET_KEY"); value != "" {
		c.SecretKey = &value
	}

	// EventBus configuration
	if value := os.Getenv("RULEGO_EVENT_BUS_CHAIN_ID"); value != "" {
		c.EventBusChainId = value
	}

	// JWT configuration
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

	// Other configurations
	if value := os.Getenv("RULEGO_MARKETPLACE_BASE_URL"); value != "" {
		c.MarketplaceBaseUrl = value
	}
	if value := os.Getenv("RULEGO_SHARE_HTTP_SERVER"); value != "" {
		if boolValue, err := strconv.ParseBool(value); err == nil {
			c.ShareHttpServer = boolValue
		}
	}

	// Pprof configuration
	if value := os.Getenv("RULEGO_PPROF_ENABLE"); value != "" {
		if boolValue, err := strconv.ParseBool(value); err == nil {
			c.Pprof.Enable = boolValue
		}
	}
	if value := os.Getenv("RULEGO_PPROF_ADDR"); value != "" {
		c.Pprof.Addr = value
	}

	// MCP configuration
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

// CheckPassword: Check the password
func (c *Config) CheckPassword(username, password string) bool {
	if c.UserNamePasswordMap == nil {
		return false
	}
	return c.UserNamePasswordMap[username] == password
}

// GetUsernameByApiKey Retrieves the username through the ApiKey
func (c *Config) GetUsernameByApiKey(apikey string) string {
	if c.ApiKeyUserNameMap == nil {
		return ""
	}
	return c.ApiKeyUserNameMap[apikey]
}

// GetApiKeyByUsername Retrieves the ApiKey from the username
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

// DefaultConfig The default configuration
var DefaultConfig = Config{
	DataDir: "./data",
	// LogFile:      "./rulego.log",
	CmdWhiteList:       "cp,scp,mvn,npm,yarn,git,make,cmake,docker,kubectl,helm,ansible,puppet,pytest,python,python3,pip,go,java,dotnet,gcc,g++,ctest",
	LoadLuaLibs:        "true",
	Server:             ":9090",
	DefaultUsername:    "admin",
	MaxNodeLogSize:     40,
	ResourceMapping:    "/editor/*filepath=./editor,/images/*filepath=./editor/images",
	JwtSecretKey:       "r6G7qZ8xk9P0y1Q2w3E4r5T6y7U8i9O0pL7z8x9CvBnM3k2l1",
	JwtExpireTime:      43200000, // 12 hours
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
