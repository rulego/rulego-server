// Package service provides the business logic for the share node service.
package service

import (
	"fmt"
	"github.com/rulego/rulego-server/config"
	"github.com/rulego/rulego-server/config/logger"
	"github.com/rulego/rulego-server/internal/constants"
	"github.com/rulego/rulego-server/internal/dao"
	"github.com/rulego/rulego/api/types"
	"github.com/rulego/rulego/utils/fs"
	"path"
)

// ShareNodeService represents the service for managing share nodes.
type ShareNodeService struct {
	// userSettingDao is the DAO for managing user settings.
	userSettingDao *dao.UserSettingDao
	// ShareNodeDao is the DAO for managing share nodes.
	shareNodeDao *dao.ShareNodeDao
	// config is the configuration of the server.
	config config.Config
	// username is the username of the user who owns the share nodes.
	username string
}

// NewShareNodeService creates a new ShareNodeService.
func NewShareNodeService(c config.Config, username string) (*ShareNodeService, error) {
	shareNodeService := &ShareNodeService{
		config:   c,
		username: username,
	}

	userSettingDao, err := dao.NewUserSettingDao(c, fmt.Sprintf(
		"%s/%s/%s", c.DataDir, constants.DirWorkflows, username))
	if err != nil {
		return &ShareNodeService{}, err
	}

	shareNodeService.userSettingDao = userSettingDao
	if err = shareNodeService.Init(); err != nil {
		return &ShareNodeService{}, err
	}

	shareNodeDao, err := dao.NewShareNodeDao(c, username)
	if err != nil {
		return nil, err
	}
	shareNodeService.shareNodeDao = shareNodeDao

	return shareNodeService, nil
}

// Init initializes all share nodes from the data directory.
func (s *ShareNodeService) Init() error {
	dirs := constants.GetShareNodesDir()
	for idx := range dirs {
		oneShareNode := dirs[idx]
		folderPath := path.Join(s.config.DataDir,
			constants.DirWorkflows, s.username, constants.DirWorkflowsShareNodes, oneShareNode)
		if err := fs.CreateDirs(folderPath); err != nil {
			logger.Logger.Printf("failed to create share node directory: %s\n", err)
			return err
		}
	}

	return nil
}

// Upsert updates or inserts a share node with the given node type and node info.
func (s *ShareNodeService) Upsert(nodeType string, nodeInfo []byte) error {
	if nodeType == constants.TypeShareNode {
		return s.shareNodeDao.UpsertNode(nodeInfo)
	}
	return s.shareNodeDao.UpsertEndpoint(nodeInfo)
}

// GetByID returns the share node with the given ID and node type.
func (s *ShareNodeService) GetByID(nodeID string, nodeType string) ([]byte, error) {
	return s.shareNodeDao.GetByID(nodeID, nodeType)
}

// Del deletes the share node with the given ID and node type.
func (s *ShareNodeService) Del(nodeID string, nodeType string) error {
	if nodeType == constants.TypeShareNode {
		return s.shareNodeDao.DelNode(nodeID)
	}
	return s.shareNodeDao.DelEndpoint(nodeID)
}

// ListNode returns a list of share nodes with the given keywords and pagination information.
func (s *ShareNodeService) ListNode(keywords string, page int, size int) ([]types.RuleNode, int, error) {
	return s.shareNodeDao.ListNode(keywords, page, size, constants.TypeShareNode)
}

// ListEndpoint returns a list of share nodes with the given keywords and pagination information.
func (s *ShareNodeService) ListEndpoint(keywords string, page int, size int) ([]types.EndpointDsl, int, error) {
	return s.shareNodeDao.ListEndpoint(keywords, page, size, constants.TypeShareEndpoint)
}
