// Package controller This file is for share node related operations
package controller

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/rulego/rulego-server/config/logger"
	"github.com/rulego/rulego-server/internal/constants"
	"github.com/rulego/rulego-server/internal/service"
	"github.com/rulego/rulego-server/internal/svc"
	"github.com/rulego/rulego-server/internal/utils"
	endpointApi "github.com/rulego/rulego/api/types/endpoint"
	"github.com/rulego/rulego/endpoint"
	"github.com/rulego/rulego/utils/json"
)

// ShareNodeHttpImpl 处理共享节点 http 请求
type ShareNodeHttpImpl struct {
	svcCtx *svc.ServiceContext
}

// NewShareNodeHttpImpl 创建共享节点实例
func NewShareNodeHttpImpl(svcCtx *svc.ServiceContext) *ShareNodeHttpImpl {

	return &ShareNodeHttpImpl{
		svcCtx: svcCtx,
	}
}

// ListShareNodes 共享节点列表
func (sdt *ShareNodeHttpImpl) ListShareNodes(url string) endpointApi.Router {
	return endpoint.NewRouter().From(url).Process(AuthProcess).Process(NewShareNode(sdt.svcCtx).listShareNodes).End()
}

// GetShareNodeByID 获取共享节点详情
func (sdt *ShareNodeHttpImpl) GetShareNodeByID(url string) endpointApi.Router {
	return endpoint.NewRouter().From(url).Process(AuthProcess).Process(NewShareNode(sdt.svcCtx).getShareNodeByID).End()
}

// UpsertShareNode 创建或更新共享节点
func (sdt *ShareNodeHttpImpl) UpsertShareNode(url string) endpointApi.Router {
	return endpoint.NewRouter().From(url).Process(AuthProcess).Process(NewShareNode(sdt.svcCtx).upsertShareNode).End()
}

// DelShareNode 删除共享节点
func (sdt *ShareNodeHttpImpl) DelShareNode(url string) endpointApi.Router {
	return endpoint.NewRouter().From(url).Process(AuthProcess).Process(NewShareNode(sdt.svcCtx).delShareNode).End()
}

// ShareNode 共享节点逻辑处理
type ShareNode struct {
	// NodeType 节点类型
	NodeType string
	svcCtx   *svc.ServiceContext
}

// NewShareNode 创建共享节点实例
func NewShareNode(svcCtx *svc.ServiceContext) *ShareNode {
	return &ShareNode{
		svcCtx: svcCtx,
	}
}

// listShareNodes 共享节点列表
func (sd *ShareNode) listShareNodes(router endpointApi.Router, exchange *endpointApi.Exchange) bool {
	msg := exchange.In.GetMsg()
	username := strings.TrimSpace(msg.Metadata.GetValue(constants.KeyUsername))
	pageStr := strings.TrimSpace(msg.Metadata.GetValue(constants.KeyPage))
	sizeStr := strings.TrimSpace(msg.Metadata.GetValue(constants.KeySize))
	keywords := strings.TrimSpace(msg.Metadata.GetValue(constants.KeyKeywords))
	nodeType := strings.TrimSpace(msg.Metadata.GetValue(constants.KeyType))
	sd.NodeType = nodeType

	if err := sd.checkNodType(); err != nil {
		exchange.Out.SetStatusCode(http.StatusBadRequest)
		exchange.Out.SetBody([]byte(err.Error()))
		return true
	}

	var (
		engineServer *service.RuleEngineService
		ok           bool
	)
	if engineServer, ok = service.UserRuleEngineServiceImpl.Get(username); !ok {
		return userNotFound(username, exchange)
	}

	var (
		nodes interface{}
		err   error
		total int
		page  int
		size  int
	)
	if page, err = strconv.Atoi(pageStr); err != nil {
		exchange.Out.SetStatusCode(http.StatusBadRequest)
		exchange.Out.SetBody([]byte(err.Error()))
		return true
	}

	if size, err = strconv.Atoi(sizeStr); err != nil {
		exchange.Out.SetStatusCode(http.StatusBadRequest)
		exchange.Out.SetBody([]byte(err.Error()))
		return true
	}

	if nodeType == constants.TypeShareNode {
		if nodes, total, err = engineServer.ShareNodeService().ListNode(keywords, page, size); err != nil {
			logger.Logger.Println(err)
			exchange.Out.SetStatusCode(http.StatusBadRequest)
			exchange.Out.SetBody([]byte(err.Error()))
			return true
		}
	} else {
		if nodes, total, err = engineServer.ShareNodeService().ListEndpoint(keywords, page, size); err != nil {
			logger.Logger.Println(err)
			exchange.Out.SetStatusCode(http.StatusBadRequest)
			exchange.Out.SetBody([]byte(err.Error()))
			return true
		}
	}

	result := map[string]interface{}{
		"total": total,
		"page":  page,
		"size":  size,
		"items": nodes,
	}

	var response []byte
	if response, err = json.Marshal(result); err != nil {
		logger.Logger.Println(err)
		exchange.Out.SetStatusCode(http.StatusBadRequest)
		exchange.Out.SetBody([]byte(err.Error()))
		return true
	}

	exchange.Out.SetStatusCode(http.StatusOK)
	exchange.Out.SetBody(response)
	return true
}

// getShareNodeByID 获取共享节点详情
func (sd *ShareNode) getShareNodeByID(router endpointApi.Router, exchange *endpointApi.Exchange) bool {
	msg := exchange.In.GetMsg()
	username := strings.TrimSpace(msg.Metadata.GetValue(constants.KeyUsername))
	nodeID := strings.TrimSpace(msg.Metadata.GetValue(constants.KeyId))
	nodeType := strings.TrimSpace(msg.Metadata.GetValue(constants.KeyType))
	sd.NodeType = nodeType

	if err := sd.checkNodType(); err != nil {
		exchange.Out.SetStatusCode(http.StatusBadRequest)
		exchange.Out.SetBody([]byte(err.Error()))
		return true
	}

	var (
		engineServer *service.RuleEngineService
		ok           bool
	)
	if engineServer, ok = service.UserRuleEngineServiceImpl.Get(username); !ok {
		return userNotFound(username, exchange)
	}

	var (
		nodeInfo []byte
		err      error
	)
	if nodeInfo, err = engineServer.ShareNodeService().GetByID(nodeID, nodeType); err != nil {
		logger.Logger.Println(err)
		exchange.Out.SetStatusCode(http.StatusBadRequest)
		exchange.Out.SetBody([]byte(err.Error()))
		return true
	}

	exchange.Out.SetStatusCode(http.StatusOK)
	exchange.Out.SetBody(nodeInfo)
	return true
}

// upsertShareNode 创建或更新共享节点
func (sd *ShareNode) upsertShareNode(router endpointApi.Router, exchange *endpointApi.Exchange) bool {
	msg := exchange.In.GetMsg()
	username := strings.TrimSpace(msg.Metadata.GetValue(constants.KeyUsername))
	nodeType := strings.TrimSpace(msg.Metadata.GetValue(constants.KeyType))
	sd.NodeType = nodeType
	if err := sd.checkNodType(); err != nil {
		exchange.Out.SetStatusCode(http.StatusBadRequest)
		exchange.Out.SetBody([]byte(err.Error()))
		return true
	}

	var (
		engineServer *service.RuleEngineService
		ok           bool
	)
	if engineServer, ok = service.UserRuleEngineServiceImpl.Get(username); !ok {
		return userNotFound(username, exchange)
	}

	if err := engineServer.ShareNodeService().Upsert(nodeType, exchange.In.Body()); err != nil {
		logger.Logger.Println(err)
		exchange.Out.SetStatusCode(http.StatusBadRequest)
		exchange.Out.SetBody([]byte(err.Error()))
		return true
	}

	exchange.Out.SetStatusCode(http.StatusOK)
	return true
}

// delShareNode 删除共享节点
func (sd *ShareNode) delShareNode(router endpointApi.Router, exchange *endpointApi.Exchange) bool {
	msg := exchange.In.GetMsg()
	username := strings.TrimSpace(msg.Metadata.GetValue(constants.KeyUsername))
	nodeID := strings.TrimSpace(msg.Metadata.GetValue(constants.KeyId))
	nodeType := strings.TrimSpace(msg.Metadata.GetValue(constants.KeyType))
	sd.NodeType = nodeType

	if err := sd.checkNodType(); err != nil {
		exchange.Out.SetStatusCode(http.StatusBadRequest)
		exchange.Out.SetBody([]byte(err.Error()))
		return true
	}
	var (
		engineServer *service.RuleEngineService
		ok           bool
	)
	if engineServer, ok = service.UserRuleEngineServiceImpl.Get(username); !ok {
		return userNotFound(username, exchange)
	}

	if err := engineServer.ShareNodeService().Del(nodeID, nodeType); err != nil {
		logger.Logger.Println(err)
		exchange.Out.SetStatusCode(http.StatusBadRequest)
		exchange.Out.SetBody([]byte(err.Error()))
		return true
	}

	exchange.Out.SetStatusCode(http.StatusOK)
	return true
}

// checkNodType 检查节点类型
func (sd *ShareNode) checkNodType() error {
	if utils.InArray(sd.NodeType, constants.GetShareNodesDir()) {
		return nil
	}

	return fmt.Errorf("node type %s is not supported", sd.NodeType)
}
