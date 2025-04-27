// Package dao is a data access object for the share node.
package dao

import (
	"bytes"
	"encoding/json"
	"errors"
	"github.com/rulego/rulego-server/config"
	"github.com/rulego/rulego-server/config/logger"
	"github.com/rulego/rulego-server/internal/constants"
	"github.com/rulego/rulego/api/types"
	"github.com/rulego/rulego/utils/fs"
	"github.com/rulego/rulego/utils/str"
	"os"
	"path"
	"path/filepath"
	"strings"
	"sync"
	"time"
)

// ShareNodeDao is a struct that represents the share node DAO.
type ShareNodeDao struct {
	config   config.Config
	username string
	sync.RWMutex
	index map[string]Index
}

// NewShareNodeDao creates a new ShareNodeDao.
func NewShareNodeDao(config config.Config, username string) (*ShareNodeDao, error) {
	shareNodeDao := &ShareNodeDao{
		config:   config,
		username: username,
		index:    make(map[string]Index),
	}

	// Load or initialize the index
	indexList := constants.GetShareNodesDir()
	for idx := range indexList {
		indexPath := shareNodeDao.getIndexPath(indexList[idx])
		if _, err := os.Stat(indexPath); errors.Is(err, os.ErrNotExist) {
			if err = shareNodeDao.rebuildIndex(indexList[idx]); err != nil {
				return &ShareNodeDao{}, err
			}
		} else if err != nil {
			return &ShareNodeDao{}, err
		}

		if err := shareNodeDao.loadIndex(indexList[idx], indexPath); err != nil {
			return &ShareNodeDao{}, err
		}
	}

	return shareNodeDao, nil
}

// loadIndex loads the index from a file.
func (d *ShareNodeDao) loadIndex(nodeType string, indexPath string) error {
	d.Lock()
	defer d.Unlock()
	file, err := os.Open(indexPath)
	if err != nil {
		return err
	}
	defer func() {
		_ = file.Close()
	}()

	idx := Index{Rules: make(map[string]RuleMeta)}
	if err := json.NewDecoder(file).Decode(&idx); err != nil {
		return err
	}

	d.index[nodeType] = idx

	return nil
}

// rebuildIndex rebuilds the index from the data directory.
func (d *ShareNodeDao) rebuildIndex(indexType string) error {
	var paths []string
	paths = append(paths, d.config.DataDir, constants.DirWorkflows)
	paths = append(paths, d.username, constants.DirWorkflowsShareNodes, indexType)
	logger.Logger.Printf("444Rebuilding share node index from directory:%s\n ", paths)

	// 构建完整的路径
	basePath := filepath.Join(paths...)

	// 读取目录下的所有文件
	files, err := os.ReadDir(basePath)
	if err != nil {
		return err
	}

	// 遍历文件
	for _, file := range files {
		if file.IsDir() {
			continue
		}
		if filepath.Ext(strings.ToLower(file.Name())) == constants.RuleChainFileSuffix {
			// 构建文件的完整路径
			filePath := filepath.Join(basePath, file.Name())

			// 读取文件内容
			data, err := os.ReadFile(filePath)
			if err != nil {
				continue
			}

			var node types.RuleNode
			if err = json.Unmarshal(data, &node); err != nil {
				continue
			}
			d.createNodeIndex(node, indexType)
		}
	}
	return d.saveIndex(d.getIndexPath(indexType))
}

// UpsertNode updates or inserts a share node with the given node type and node info.
func (d *ShareNodeDao) UpsertNode(nodeInfo []byte) error {
	node := types.RuleNode{}
	if err := json.Unmarshal(nodeInfo, &node); err != nil {
		return err
	}
	if err := d.saveShareNode(node, nodeInfo); err != nil {
		return err
	}
	// 创建索引
	d.createNodeIndex(node, constants.DirShareNode)
	// 保存索引到文件
	return d.saveIndex(d.getIndexPath(constants.DirShareNode))
}

// UpsertEndpoint updates or inserts a share endpoint with the given node type and node info.
func (d *ShareNodeDao) UpsertEndpoint(nodeInfo []byte) error {
	node := types.EndpointDsl{}
	if err := json.Unmarshal(nodeInfo, &node); err != nil {
		return err
	}
	if err := d.saveShareEndpoint(node, nodeInfo); err != nil {
		return err
	}
	// 创建索引
	d.createEndpointIndex(node, constants.TypeShareEndpoint)
	// 保存索引到文件
	return d.saveIndex(d.getIndexPath(constants.TypeShareEndpoint))
}

// getIndexPath returns the path of the index file.
func (d *ShareNodeDao) getIndexPath(nodeType string) string {
	return filepath.Join(d.config.DataDir, constants.DirWorkflows, d.username,
		constants.DirWorkflowsShareNodes, nodeType, constants.FileNameIndex)
}

// saveShareNode saves a share node to a file.
func (d *ShareNodeDao) saveShareNode(node types.RuleNode, def []byte) error {
	var paths = []string{d.config.DataDir, constants.DirWorkflows}
	paths = append(paths, d.username, constants.DirWorkflowsShareNodes, constants.TypeShareNode)
	pathStr := path.Join(paths...)
	// 创建文件夹
	_ = fs.CreateDirs(pathStr)
	// 保存到文件
	var buf bytes.Buffer
	if err := json.Indent(&buf, def, "", "  "); err != nil {
		return err
	}

	// 保存规则链到文件
	return fs.SaveFile(filepath.Join(pathStr, node.Id+constants.RuleChainFileSuffix), buf.Bytes())
}

// saveShareEndpoint saves a share endpoint to a file.
func (d *ShareNodeDao) saveShareEndpoint(node types.EndpointDsl, def []byte) error {
	var paths = []string{d.config.DataDir, constants.DirWorkflows}
	paths = append(paths, d.username, constants.DirWorkflowsShareNodes, constants.TypeShareEndpoint)
	pathStr := path.Join(paths...)
	// 创建文件夹
	_ = fs.CreateDirs(pathStr)
	// 保存到文件
	var buf bytes.Buffer
	if err := json.Indent(&buf, def, "", "  "); err != nil {
		return err
	}

	// 保存规则链到文件
	return fs.SaveFile(filepath.Join(pathStr, node.Id+constants.RuleChainFileSuffix), buf.Bytes())
}

// createNodeIndex creates an index for the share node with the given node type and node info.
func (d *ShareNodeDao) createNodeIndex(node types.RuleNode, nodeType string) {
	nodeID := node.Id
	// 更新索引
	meta := RuleMeta{
		Name:       node.Name,
		ID:         nodeID,
		UpdateTime: str.ToString(time.Now()),
	}
	d.Lock()
	defer d.Unlock()
	d.index[nodeType].Rules[nodeID] = meta
}

// createEndpointIndex creates an index for the share node with the given node type and node info.
func (d *ShareNodeDao) createEndpointIndex(node types.EndpointDsl, nodeType string) {
	nodeID := node.Id
	// 更新索引
	meta := RuleMeta{
		Name:       node.Name,
		ID:         nodeID,
		UpdateTime: str.ToString(time.Now()),
	}
	d.Lock()
	defer d.Unlock()
	d.index[nodeType].Rules[nodeID] = meta
}

// saveIndex saves the index to a file.
func (d *ShareNodeDao) saveIndex(indexPath string) error {
	d.Lock()
	defer d.Unlock()
	file, err := os.Create(indexPath)
	if err != nil {
		return err
	}
	defer func() {
		_ = file.Close()
	}()

	if err := json.NewEncoder(file).Encode(d.index); err != nil {
		return err
	}
	return nil
}

// GetByID gets a share node by ID and node type.
func (d *ShareNodeDao) GetByID(nodeID string, nodeType string) ([]byte, error) {
	var paths = []string{d.config.DataDir, constants.DirWorkflows}
	paths = append(paths, d.username, constants.DirWorkflowsShareNodes, nodeType, nodeID+constants.RuleChainFileSuffix)
	pathStr := path.Join(paths...)
	return os.ReadFile(pathStr)
}

// DelNode deletes a share node by ID.
func (d *ShareNodeDao) DelNode(nodeID string) error {
	nodeInfo, err := d.Get(nodeID, constants.TypeShareNode)
	if err != nil {
		return err
	}

	node := types.RuleNode{}
	_ = json.Unmarshal(nodeInfo, &node)

	var paths = []string{d.config.DataDir, constants.DirWorkflows}
	paths = append(paths, d.username, constants.DirWorkflowsShareNodes)
	paths = append(paths, constants.TypeShareNode)
	pathStr := path.Join(paths...)
	file := filepath.Join(pathStr, nodeID+constants.RuleChainFileSuffix)
	if err := os.RemoveAll(file); err != nil {
		return err
	}
	return d.deleteIndex(nodeID, constants.TypeShareNode)
}

// DelEndpoint deletes a share endpoint by ID.
func (d *ShareNodeDao) DelEndpoint(nodeID string) error {
	nodeInfo, err := d.Get(nodeID, constants.TypeShareEndpoint)
	if err != nil {
		return err
	}

	node := types.EndpointDsl{}
	_ = json.Unmarshal(nodeInfo, &node)

	var paths = []string{d.config.DataDir, constants.DirWorkflows}
	paths = append(paths, d.username, constants.DirWorkflowsShareNodes)
	paths = append(paths, constants.TypeShareEndpoint)
	pathStr := path.Join(paths...)
	file := filepath.Join(pathStr, nodeID+constants.RuleChainFileSuffix)
	if err := os.RemoveAll(file); err != nil {
		return err
	}
	return d.deleteIndex(nodeID, constants.TypeShareEndpoint)
}

// deleteIndex deletes an index by ID and node type.
func (d *ShareNodeDao) deleteIndex(nodeID string, nodeType string) error {
	d.Lock()
	delete(d.index[nodeType].Rules, nodeID)
	d.Unlock()
	return d.saveIndex(d.getIndexPath(nodeType))
}

// ListNode lists share nodes.
func (d *ShareNodeDao) ListNode(keywords string, page int, size int, nodeType string) ([]types.RuleNode, int, error) {
	var nodes []types.RuleNode
	totalCount := 0
	indexList := d.getAllIndex(nodeType)

	// 遍历索引中的元数据
	for idx := range indexList {
		meta := indexList[idx]
		if keywords == "" || strings.Contains(meta.Name, keywords) || strings.Contains(meta.ID, keywords) {
			oneNode, err := d.GetAsShareNode(meta.ID, nodeType)
			if err != nil {
				continue
			}
			nodes = append(nodes, oneNode)
			totalCount++
		}

	}

	if page == 0 {
		return nodes, totalCount, nil
	}

	start := (page - 1) * size
	end := start + size
	if start > totalCount {
		start = totalCount
	}
	if end > totalCount {
		end = totalCount
	}

	return nodes[start:end], totalCount, nil
}

// ListEndpoint lists share endpoints.
func (d *ShareNodeDao) ListEndpoint(keywords string, page int, size int, nodeType string) ([]types.EndpointDsl, int, error) {
	var nodes []types.EndpointDsl
	totalCount := 0
	indexList := d.getAllIndex(nodeType)

	// 遍历索引中的元数据
	for idx := range indexList {
		meta := indexList[idx]
		if keywords == "" || strings.Contains(meta.Name, keywords) || strings.Contains(meta.ID, keywords) {
			oneNode, err := d.GetAsShareEndpoint(meta.ID, nodeType)
			if err != nil {
				continue
			}
			nodes = append(nodes, oneNode)
			totalCount++
		}

	}

	if page == 0 {
		return nodes, totalCount, nil
	}

	start := (page - 1) * size
	end := start + size
	if start > totalCount {
		start = totalCount
	}
	if end > totalCount {
		end = totalCount
	}

	return nodes[start:end], totalCount, nil
}

// getAllIndex gets all index of the share node with the given node type.
func (d *ShareNodeDao) getAllIndex(nodeType string) []RuleMeta {
	d.RLock()
	defer d.RUnlock()
	var items []RuleMeta
	for _, v := range d.index[nodeType].Rules {
		items = append(items, v)
	}
	return items
}

// GetAsShareNode gets a share node by ID and returns it as a RuleNode.
func (d *ShareNodeDao) GetAsShareNode(nodeID string, nodeType string) (types.RuleNode, error) {
	var node types.RuleNode
	data, err := d.Get(nodeID, nodeType)
	if err != nil {
		return node, err
	}
	if err = json.Unmarshal(data, &node); err != nil {
		return node, err
	}

	return node, nil
}

// GetAsShareEndpoint gets a share endpoint by ID and returns it as a EndpointDsl.
func (d *ShareNodeDao) GetAsShareEndpoint(nodeID string, nodeType string) (types.EndpointDsl, error) {
	var node types.EndpointDsl
	data, err := d.Get(nodeID, nodeType)
	if err != nil {
		return node, err
	}
	if err = json.Unmarshal(data, &node); err != nil {
		return node, err
	}

	return node, nil
}

// Get gets a rule chain by ID and node type.
func (d *ShareNodeDao) Get(nodeID string, nodeType string) ([]byte, error) {
	var paths = []string{d.config.DataDir, constants.DirWorkflows}
	paths = append(paths, d.username, constants.DirWorkflowsShareNodes, nodeType, nodeID+constants.RuleChainFileSuffix)
	pathStr := path.Join(paths...)
	return os.ReadFile(pathStr)
}
