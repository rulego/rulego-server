package svc

import (
	"github.com/rulego/rulego-server/config"
	"github.com/rulego/rulego-server/internal/core"
	"github.com/rulego/rulego-server/internal/service"
)

type ServiceContext struct {
	Config config.Config

	// new service
	AppManager *core.UserAppManager

	// services
	UserSvc     *service.UserService
	UserRuleSvc *service.UserRuleEngineService
	EventSvc    *service.EventService

	// useless services
	ruleSvc      *service.RuleEngineService
	componentSvc *service.ComponentService
}

var _gSvcCtx *ServiceContext

func NewServiceContext(cfg config.Config) *ServiceContext {

	if _gSvcCtx != nil {
		return _gSvcCtx
	}
	ctx := &ServiceContext{
		Config: cfg,
	}

	err := ctx.setup()
	if err != nil {
		panic(err)
	}

	_gSvcCtx = ctx

	return _gSvcCtx
}

// FIXME: 应该是上述初始化后的对象，注入到各个模块中, 但目前改造麻烦，先妥协
func GetServiceContext() *ServiceContext {
	if _gSvcCtx == nil {
		panic("service context not initialized")
	}
	return _gSvcCtx
}

func (ctx *ServiceContext) setup() error {

	userSvc, err := service.NewUserService(ctx.Config)
	if err != nil {
		return err
	}
	ctx.UserSvc = userSvc

	userRuleSvc, err := service.NewUserRuleEngineServiceImpl(ctx.Config)
	if err != nil {
		return err
	}
	ctx.UserRuleSvc = userRuleSvc

	eventSvc, err := service.NewEventService(ctx.Config)
	if err != nil {
		return err
	}
	ctx.EventSvc = eventSvc

	return nil
}
