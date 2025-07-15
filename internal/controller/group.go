package controller

import (
	"github.com/rulego/rulego-server/internal/svc"

	"github.com/rulego/rulego/api/types/endpoint"
)

func Myhandler(svcCtx *svc.ServiceContext) endpoint.Process {
	return func(router endpoint.Router, exchange *endpoint.Exchange) bool {

		// do something here

		return true
	}
}
