package router

import (
	"log"
	"net/http"
	"strings"

	"github.com/rulego/rulego-server/config"
	"github.com/rulego/rulego-server/config/logger"
	"github.com/rulego/rulego-server/internal/controller"
	"github.com/rulego/rulego-server/internal/service"
	"github.com/rulego/rulego-server/internal/svc"

	"github.com/rulego/rulego"
	"github.com/rulego/rulego/api/types"
	endpointApi "github.com/rulego/rulego/api/types/endpoint"
	"github.com/rulego/rulego/endpoint"
	"github.com/rulego/rulego/endpoint/rest"
	"github.com/rulego/rulego/node_pool"
)

const (
	// base HTTP paths.
	apiVersion  = "v1"
	apiBasePath = "/api/" + apiVersion
	moduleFlows = "rules"
	// moduleDcs 动态组件
	moduleDynamicComponents = "dynamic-components"
	// moduleSharedNodes 共享组件
	moduleSharedNodes = "shared-nodes"
	moduleLocales     = "locales"
	moduleLogs        = "logs"
	moduleMarketplace = "marketplace"
	ContentTypeKey    = "Content-Type"
	JsonContextType   = "application/json"
)

// NewRestServe rest服务 接收端点
func NewRestServe(c config.Config) *rest.Endpoint {
	// 初始化日志
	addr := c.Server
	if strings.HasPrefix(addr, ":") {
		logger.Logger.Println("RuleGo-Server now running at http://127.0.0.1" + addr)
	} else {
		logger.Logger.Println("RuleGo-Server now running at http://" + addr)
	}

	restEndpoint := &rest.Endpoint{
		Config: rest.Config{
			Server:    addr,
			AllowCors: true,
		},
		RuleConfig: rulego.NewConfig(types.WithDefaultPool(), types.WithLogger(logger.Logger)),
	}
	// 添加全局拦截器
	restEndpoint.AddInterceptors(func(router endpointApi.Router, exchange *endpointApi.Exchange) bool {
		exchange.Out.Headers().Set(ContentTypeKey, JsonContextType)
		return true
	})
	// 重定向UI界面
	restEndpoint.GET(endpoint.NewRouter().From("/").Process(func(router endpointApi.Router, exchange *endpointApi.Exchange) bool {
		r, ok1 := exchange.In.(*rest.RequestMessage)
		w, ok2 := exchange.Out.(*rest.ResponseMessage)
		if ok1 && ok2 {
			http.Redirect(w.Response(), r.Request(), "/editor/", http.StatusFound)
		}
		return false
	}).End())

	if c.MCP.Enable {
		restEndpoint.GET(controller.MCP.Handler(apiBasePath + "/mcp/:apiKey/sse"))
		restEndpoint.POST(controller.MCP.Handler(apiBasePath + "/mcp/:apiKey/message"))
		logger.Logger.Println("RuleGo-Server mcp server running at http://127.0.0.1" + addr + apiBasePath + "/mcp/" +
			service.UserServiceImpl.GetApiKeyByUsername(c.DefaultUsername) + "/sse")
	}

	//把默认HTTP服务设置成共享节点
	if c.ShareHttpServer {
		_, _ = node_pool.DefaultNodePool.AddNode(restEndpoint)
	}

	restEndpoint.OnEvent = func(eventName string, params ...any) {
		if eventName == endpointApi.EventInitServer {
			//加载静态文件
			LoadServeFiles(c, restEndpoint)
			wsEndpoint := NewWebsocketServe(c, params[0].(*rest.Rest))
			if err := wsEndpoint.Start(); err != nil {
				log.Fatal("error:", err)
			}
		}
	}

	return restEndpoint
}

// TODO: svcCtx需要注入到controller中，并在controller中调用service层方法
func RegisterHanler(restEndpoint *rest.Endpoint, svcCtx *svc.ServiceContext) error {
	/**   共享组件相关路由  **/

	// 获取共享组件列表
	restEndpoint.GET(controller.NewShareNodeHttpImpl(svcCtx).ListShareNodes(apiBasePath + "/" + moduleSharedNodes))
	// 获取共享组件详情
	restEndpoint.GET(controller.NewShareNodeHttpImpl(svcCtx).GetShareNodeByID(
		apiBasePath + "/" + moduleSharedNodes + "/:id" + "/:type"))
	// 新增/修改共享节点
	restEndpoint.POST(controller.NewShareNodeHttpImpl(svcCtx).UpsertShareNode(apiBasePath + "/" + moduleSharedNodes + "/:type"))
	// 删除共享节点
	restEndpoint.DELETE(
		controller.NewShareNodeHttpImpl(svcCtx).DelShareNode(apiBasePath + "/" + moduleSharedNodes + "/:id" + "/:type"))

	/**   共享组件相关路由  **/

	// 创建获取所有规则引擎组件列表路由
	restEndpoint.GET(controller.Node.Components(apiBasePath + "/components"))
	// 获取组件市场组件列表
	restEndpoint.GET(controller.Node.MarketplaceComponents(apiBasePath + "/" + moduleMarketplace + "/components"))
	// 获取组件市场规则链列表
	restEndpoint.GET(controller.Rule.MarketplaceChains(apiBasePath + "/" + moduleMarketplace + "/chains"))

	// 获取用户所有自定义动态组件列表
	restEndpoint.GET(controller.Node.CustomNodeList(apiBasePath + "/" + moduleDynamicComponents))
	// 获取自定义动态组件DSL
	restEndpoint.GET(controller.Node.CustomNodeDSL(apiBasePath + "/" + moduleDynamicComponents + "/:id"))
	// 安装/升级自定义动态组件
	restEndpoint.POST(controller.Node.CustomNodeUpgrade(apiBasePath + "/" + moduleDynamicComponents + "/:id"))
	// 卸装自定义动态组件
	restEndpoint.DELETE(controller.Node.CustomNodeUninstall(apiBasePath + "/" + moduleDynamicComponents + "/:id"))

	// 获取所有规则链列表
	restEndpoint.GET(controller.Rule.List(apiBasePath + "/" + moduleFlows))
	// 获取最新修改的规则链DSL 实际是：/api/v1/rules/get/latest
	restEndpoint.GET(controller.Rule.GetLatest(apiBasePath + "/" + moduleFlows + "/:id/latest"))
	// 获取规则链DSL
	restEndpoint.GET(controller.Rule.Get(apiBasePath + "/" + moduleFlows + "/:id"))
	// 新增/修改规则链DSL
	restEndpoint.POST(controller.Rule.Save(apiBasePath + "/" + moduleFlows + "/:id"))
	// 删除规则链
	restEndpoint.DELETE(controller.Rule.Delete(apiBasePath + "/" + moduleFlows + "/:id"))
	// 保存规则链附加信息
	restEndpoint.POST(controller.Rule.SaveBaseInfo(apiBasePath + "/" + moduleFlows + "/:id/base"))
	// 保存规则链配置信息
	restEndpoint.POST(controller.Rule.SaveConfiguration(apiBasePath + "/" + moduleFlows + "/:id/config/:varType"))
	// 执行规则链,并得到规则链处理结果
	restEndpoint.POST(controller.Rule.Execute(apiBasePath + "/" + moduleFlows + "/:id/execute/:msgType"))
	// 处理数据上报请求，并转发到规则引擎，不等待规则引擎处理结果
	restEndpoint.POST(controller.Rule.PostMsg(apiBasePath + "/" + moduleFlows + "/:id/notify/:msgType"))
	// 部署或者下线规则链
	restEndpoint.POST(controller.Rule.Operate(apiBasePath + "/" + moduleFlows + "/:id/operate/:type"))

	// 获取节点调试日志列表
	restEndpoint.GET(controller.Log.GetDebugLogs(apiBasePath + "/" + moduleLogs + "/debug"))
	// 获取规则链运行日志列表
	restEndpoint.GET(controller.Log.List(apiBasePath + "/" + moduleLogs + "/runs"))
	// 获取规则链运行日志详情
	restEndpoint.DELETE(controller.Log.Delete(apiBasePath + "/" + moduleLogs + "/runs"))

	restEndpoint.GET(controller.Locale.Locales(apiBasePath + "/" + moduleLocales))
	restEndpoint.POST(controller.Locale.Save(apiBasePath + "/" + moduleLocales))
	// 创建用户登录路由
	restEndpoint.POST(controller.Base.Login(apiBasePath + "/login"))

	return _registerHandler(restEndpoint, svcCtx)
}

// LoadServeFiles 加载静态文件映射
func LoadServeFiles(c config.Config, restEndpoint *rest.Endpoint) {
	if c.ResourceMapping != "" {
		mapping := strings.Split(c.ResourceMapping, ",")
		for _, item := range mapping {
			files := strings.Split(item, "=")
			if len(files) == 2 {
				restEndpoint.Router().ServeFiles(strings.TrimSpace(files[0]), http.Dir(strings.TrimSpace(files[1])))
			}
		}
	}
}

type Handler func(*svc.ServiceContext) endpointApi.Process
type router struct {
	Method  string
	Path    string
	Handler Handler

	WithAuth   bool
	Midelwares []endpointApi.Process
	Desc       string
}

var routes = []router{
	{
		Method:   "GET",
		Path:     "/rules/get/latest",
		WithAuth: false,
		Handler:  controller.Myhandler,
		Desc:     "获取最新修改的规则链DSL",
	},
}

func _registerHandler(restEndpoint *rest.Endpoint, svcCtx *svc.ServiceContext) error {

	for _, r := range routes {
		if r.Handler == nil {
			continue
		}
		// from
		from := endpoint.NewRouter().From(apiBasePath + r.Path)
		// auth middleware
		if r.WithAuth {
			from = from.Process(controller.AuthProcess)
		}
		// other middlewares
		for _, m := range r.Midelwares {
			from = from.Process(m)
		}
		// handler
		from = from.Process(r.Handler(svcCtx))
		// enda

		// const (
		// 	MethodGet     = "GET"
		// 	MethodHead    = "HEAD"
		// 	MethodPost    = "POST"
		// 	MethodPut     = "PUT"
		// 	MethodPatch   = "PATCH" // RFC 5789
		// 	MethodDelete  = "DELETE"
		// 	MethodConnect = "CONNECT"
		// 	MethodOptions = "OPTIONS"
		// 	MethodTrace   = "TRACE"
		// )

		// do register
		switch r.Method {
		case http.MethodGet:
			restEndpoint.GET(from.End())
		}
	}

	return nil
}
