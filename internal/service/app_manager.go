package service

import (
	"sort"
	"sync"

	"github.com/rulego/rulego-server/internal/dao"
)

type AppManager struct {
	fs *dao.FileStorage

	appGroups     []*AppGroup
	appGroupIndex map[string]*AppGroup
	lock          sync.RWMutex
}
type userFilter func(username string, ag *AppGroup) bool

func NewAppManager() *AppManager {
	fs, err := dao.NewFileStorage("")
	if err != nil {
		// logger
	}

	return &AppManager{
		fs: fs,
	}
}

// 目前先通过calc实现用户相关的AppGroup检索； 后续若AppGroup太多了，再依用户维护维护关系表，实现更高效的检索
var (
	_filterAll = func(_ string, _ *AppGroup) bool {
		return true
	}

	// 能看
	_filterViewer = func(username string, ag *AppGroup) bool {
		mode, err := ag.GetMember(username)
		if err != nil {
			return false
		}
		return mode.Has(Enable)
	}

	// 能执行
	_filterExecuter = func(username string, ag *AppGroup) bool {
		m, err := ag.GetMember(username)
		if err != nil {
			return false
		}
		return m.Has(Executer)
	}

	// 能编辑: 编辑维护DSL
	_filterManager = func(username string, ag *AppGroup) bool {
		m, err := ag.GetMember(username)
		if err != nil {
			return false
		}
		return m.Has(Enable) && m.Has(Executer)
	}

	// 能管理成员构成
	_filterOwner = func(username string, ag *AppGroup) bool {
		return ag.owner == username
	}
)

// user interface
func (am *AppManager) ListAllAppGroups() ([]*AppGroup, error) {
	return am.listUserAppGroups("", _filterAll)
}

func (am *AppManager) ListViewerAppGroups(username string) ([]*AppGroup, error) {
	return am.listUserAppGroups(username, _filterViewer)
}

func (am *AppManager) ListExecuterAppGroups(username string) ([]*AppGroup, error) {
	return am.listUserAppGroups(username, _filterExecuter)
}

func (am *AppManager) ListManagerAppGroups(username string) ([]*AppGroup, error) {
	return am.listUserAppGroups(username, _filterManager)
}

func (am *AppManager) ListOwnerAppGroups(username string) ([]*AppGroup, error) {
	return am.listUserAppGroups(username, _filterOwner)
}

// system interface
func (am *AppManager) Load() error {

	return nil
}

func (am *AppManager) Save() error {

	// trans appGroups to dao.AppGroup
	dags := make([]dao.AppGroupDao, 0, len(am.appGroups))
	for _, ag := range am.appGroups {
		members := make(map[string]int)
		for k, v := range ag.members {
			members[k] = int(v)
			dag := dao.AppGroupDao{
				Name:      ag.name,
				Namespace: ag.svcName,
				Owner:     ag.owner,
				Members:   members,
			}
			dags = append(dags, dag)
		}
		sort.Slice(dags, func(i, j int) bool {
			return dags[i].Namespace < dags[j].Namespace
		})
	}
	// save to file
	return nil
}

func (am *AppManager) listUserAppGroups(username string, ft userFilter) ([]*AppGroup, error) {

	am.lock.RLock()
	defer am.lock.RUnlock()

	ags := make([]*AppGroup, 0)
	for _, ag := range am.appGroups {
		if !ft(username, ag) {
			continue
		}
		ags = append(ags, ag)
	}
	return ags, nil
}
