// Package controller This file is for share node related operations
package controller

import (
	"github.com/rulego/rulego-server/config/logger"
	"github.com/rulego/rulego-server/internal/constants"
	"github.com/rulego/rulego-server/internal/service"
	"github.com/rulego/rulego/api/types"
	endpointApi "github.com/rulego/rulego/api/types/endpoint"
	"github.com/rulego/rulego/endpoint"
	"github.com/rulego/rulego/utils/json"
	"net/http"
	"strconv"
	"strings"
)

// ShareNode 共享节点
type ShareNode struct{}

// NewShareNode 创建共享节点实例
func NewShareNode() *ShareNode {
	return &ShareNode{}
}

// ListShareNodes 共享节点列表
func (s *ShareNode) ListShareNodes(url string) endpointApi.Router {
	return endpoint.NewRouter().From(url).Process(AuthProcess).Process(listShareNodes).End()
}

// GetShareNodeByID 获取共享节点详情
func (s *ShareNode) GetShareNodeByID(url string) endpointApi.Router {
	return endpoint.NewRouter().From(url).Process(AuthProcess).Process(getShareNodeByID).End()
}

// UpsertShareNode 创建或更新共享节点
func (s *ShareNode) UpsertShareNode(url string) endpointApi.Router {
	return endpoint.NewRouter().From(url).Process(AuthProcess).Process(upsertShareNode).End()
}

// DelShareNode 删除共享节点
func (s *ShareNode) DelShareNode(url string) endpointApi.Router {
	return endpoint.NewRouter().From(url).Process(AuthProcess).Process(delShareNode).End()
}

// listShareNodes 共享节点列表
func listShareNodes(router endpointApi.Router, exchange *endpointApi.Exchange) bool {
	msg := exchange.In.GetMsg()
	username := strings.TrimSpace(msg.Metadata.GetValue(constants.KeyUsername))
	pageStr := strings.TrimSpace(msg.Metadata.GetValue(constants.KeyPage))
	sizeStr := strings.TrimSpace(msg.Metadata.GetValue(constants.KeySize))
	keywords := strings.TrimSpace(msg.Metadata.GetValue(constants.KeyKeywords))
	nodeType := strings.TrimSpace(msg.Metadata.GetValue(constants.KeyType))
	var (
		engineServer *service.RuleEngineService
		ok           bool
	)
	if engineServer, ok = service.UserRuleEngineServiceImpl.Get(username); !ok {
		return userNotFound(username, exchange)
	}

	var (
		nodes []types.RuleNode
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

	if nodes, total, err = engineServer.ShareNodeService().List(keywords, page, size, nodeType); err != nil {
		logger.Logger.Println(err)
		exchange.Out.SetStatusCode(http.StatusBadRequest)
		exchange.Out.SetBody([]byte(err.Error()))
		return true
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
func getShareNodeByID(router endpointApi.Router, exchange *endpointApi.Exchange) bool {
	msg := exchange.In.GetMsg()
	username := strings.TrimSpace(msg.Metadata.GetValue(constants.KeyUsername))
	nodeID := strings.TrimSpace(msg.Metadata.GetValue(constants.KeyId))
	nodeType := strings.TrimSpace(msg.Metadata.GetValue(constants.KeyType))
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
func upsertShareNode(router endpointApi.Router, exchange *endpointApi.Exchange) bool {
	msg := exchange.In.GetMsg()
	username := strings.TrimSpace(msg.Metadata.GetValue(constants.KeyUsername))
	// todo cole 参数校验
	nodeType := strings.TrimSpace(msg.Metadata.GetValue(constants.KeyType))

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
func delShareNode(router endpointApi.Router, exchange *endpointApi.Exchange) bool {
	msg := exchange.In.GetMsg()
	username := strings.TrimSpace(msg.Metadata.GetValue(constants.KeyUsername))
	nodeID := strings.TrimSpace(msg.Metadata.GetValue(constants.KeyId))
	nodeType := strings.TrimSpace(msg.Metadata.GetValue(constants.KeyType))
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
