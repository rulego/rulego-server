// Package controller This file is for share node related operations
package controller

import (
	"fmt"
	"github.com/rulego/rulego-server/config/logger"
	"github.com/rulego/rulego-server/internal/constants"
	"github.com/rulego/rulego-server/internal/service"
	"github.com/rulego/rulego-server/internal/utils"
	endpointApi "github.com/rulego/rulego/api/types/endpoint"
	"github.com/rulego/rulego/endpoint"
	"github.com/rulego/rulego/utils/json"
	"net/http"
	"strconv"
	"strings"
)

// ShareNodeHttpImpl handles HTTP requests from shared nodes
type ShareNodeHttpImpl struct{}

// NewShareNodeHttpImpl creates a shared node instance
func NewShareNodeHttpImpl() *ShareNodeHttpImpl {
	return &ShareNodeHttpImpl{}
}

// ListShareNodes: A list of shared nodes
func (sdt *ShareNodeHttpImpl) ListShareNodes(url string) endpointApi.Router {
	return endpoint.NewRouter().From(url).Process(AuthProcess).Process(NewShareNode().listShareNodes).End()
}

// GetShareNodeByID to obtain the details of the shared node
func (sdt *ShareNodeHttpImpl) GetShareNodeByID(url string) endpointApi.Router {
	return endpoint.NewRouter().From(url).Process(AuthProcess).Process(NewShareNode().getShareNodeByID).End()
}

// UpsertShareNode creates or updates a shared node
func (sdt *ShareNodeHttpImpl) UpsertShareNode(url string) endpointApi.Router {
	return endpoint.NewRouter().From(url).Process(AuthProcess).Process(NewShareNode().upsertShareNode).End()
}

// DelShareNode deletes the shared node
func (sdt *ShareNodeHttpImpl) DelShareNode(url string) endpointApi.Router {
	return endpoint.NewRouter().From(url).Process(AuthProcess).Process(NewShareNode().delShareNode).End()
}

// ShareNode handles shared node logic
type ShareNode struct {
	// NodeType node type
	NodeType string
}

// NewShareNode creates a shared node instance
func NewShareNode() *ShareNode {
	return &ShareNode{}
}

// listShareNodes: A list of shared nodes
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

// getShareNodeByID to obtain the details of the shared node
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

// upsertShareNode creates or updates a shared node
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

// delShareNode deletes the shared node
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

// checkNodType checks the node type
func (sd *ShareNode) checkNodType() error {
	if utils.InArray(sd.NodeType, constants.GetShareNodesDir()) {
		return nil
	}

	return fmt.Errorf("node type %s is not supported", sd.NodeType)
}
