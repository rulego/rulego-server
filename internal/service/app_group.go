package service

import (
	"fmt"
	"slices"
	"sync"

	"github.com/rulego/rulego/api/types"
)

type AppGroup struct {
	name    string              // 业务层名称，可随便取
	owner   string              // 所有者
	members map[string]ModeKind // 成员，key为用户名，value为权限
	lock    sync.RWMutex

	svcName string // 底层服务名, 需要唯一, 由svc提供
	svc     *RuleEngineService
}

func NewAppGroup(owner, name string, svc *RuleEngineService) (*AppGroup, error) {

	if svc == nil {
		return nil, fmt.Errorf("svc is nil")
	}
	ag := &AppGroup{
		name: name,

		owner:   owner,
		members: make(map[string]ModeKind),
		lock:    sync.RWMutex{},

		svcName: svc.username,
		svc:     svc,
	}

	err := ag.addMember(owner, Owner|Manager|Executer)
	if err != nil {
		return nil, err
	}

	return ag, nil
}

func (ag *AppGroup) Name() string {
	return ag.name
}

func (ag *AppGroup) SetName(name string) {
	ag.name = name
}

func (ag *AppGroup) ServiceName() string {
	return ag.svcName
}

// app management
func (ag *AppGroup) ListAppIds(username string) []string {
	if !ag.getMemberMode(username).Has(Enable) {
		return make([]string, 0)
	}
	return ag.svc.ListPassIds()
}

func (ag *AppGroup) ExecuteAndWait(username, appId string, msg types.RuleMsg, opts ...types.RuleContextOption) error {

	// check user permission
	if !ag.getMemberMode(username).Has(Executer) {
		return fmt.Errorf("user %s not executer in group %s", username, ag.name)
	}
	return ag.svc.ExecuteAndWait(appId, msg, opts...)
}

func (ag *AppGroup) Execute(username, appId string, msg types.RuleMsg, opts ...types.RuleContextOption) error {

	// check user permission
	if !ag.getMemberMode(username).Has(Executer) {
		return fmt.Errorf("user %s not executer in group %s", username, ag.name)
	}
	return ag.svc.Execute(appId, msg, opts...)
}

// TODO: 实现其它ag.svc的所有public函数

// member management
func (ag *AppGroup) AddMember(username string, role ModeKind) error {
	return ag.addMember(username, role)
}

func (ag *AppGroup) GetMember(username string) (ModeKind, error) {
	return ag.getMember(username)
}

func (ag *AppGroup) Members() []string {
	return ag.getMembers(0)
}

// viewers
func (ag *AppGroup) MemberViewers() []string {
	return ag.getMembers(Enable)
}

// Executer
func (ag *AppGroup) MemberExecuters() []string {
	return ag.getMembers(Enable | Executer)
}

// Manager
func (ag *AppGroup) MemberManagers() []string {
	return ag.getMembers(Enable | Manager /*|Executer*/) // Manager can executer ?
}

func (ag *AppGroup) Grant(username string, roles []ModeKind) error {

	mode := ag.getMemberMode(username)
	if mode == ModeNotFound {
		return fmt.Errorf("user %s not found in group %s", username, ag.name)
	}
	// calc mode
	for _, role := range roles {
		mode |= role
	}
	if !ag.setMemberMode(username, mode, false) {
		return fmt.Errorf("grant set mode:%d failed for user %s in group %s", mode, username, ag.name)
	}
	return nil
}

func (ag *AppGroup) Revoke(username string, roles []ModeKind) error {

	mode := ag.getMemberMode(username)
	if mode == ModeNotFound {
		return fmt.Errorf("user %s not found in group %s", username, ag.name)
	}
	// calc mode
	for _, role := range roles {
		mode &= ^role
	}
	if !ag.setMemberMode(username, mode, false) {
		return fmt.Errorf("revoke set mode:%d failed for user %s in group %s", mode, username, ag.name)
	}
	return nil
}

func (ag *AppGroup) SwitchMember(username string, enable bool) error {

	mode := ag.getMemberMode(username)
	if mode == ModeNotFound {
		return fmt.Errorf("user %s not found in group %s", username, ag.name)
	}
	// calc mode
	if enable {
		mode |= Enable
	} else {
		mode &= ^Enable
	}
	if !ag.setMemberMode(username, mode, false) {
		return fmt.Errorf("switch set mode:%d failed for user %s in group %s", mode, username, ag.name)
	}
	return nil
}

func (ag *AppGroup) DeleteMember(username string) error {
	return ag.deleteMember(username)
}

// --- private ---
type ModeKind int

// 判断是否有某个权限，前提是有Enable权限
func (m ModeKind) Has(role ModeKind) bool {
	if m&Enable == 0 {
		return false
	}

	return m&role != 0
}

func (m ModeKind) String() string {
	modeStr := fmt.Sprintf("%d(", m)
	if m&Owner != 0 {
		modeStr += "Owner|"
	}
	if m&Manager != 0 {
		modeStr += "Manager|"
	}
	if m&Enable != 0 {
		modeStr += "Enable|"
	}
	if m&Executer != 0 {
		modeStr += "Executer|"
	}
	if modeStr[len(modeStr)-1] == '|' {
		modeStr = modeStr[:len(modeStr)-1]
	}
	modeStr += ")"
	return modeStr
}

const (
	ModeNotFound ModeKind = 0
)
const (
	Enable   ModeKind = 1 << iota // if it's Enable, it's a viewer
	Executer                      // 可请求执行应用
	Manager                       // 可编辑修改应用
	Owner                         // 所有者，可管理成员构成和成员权限
)

func (ag *AppGroup) getMembers(flag ModeKind) []string {
	ag.lock.RLock()
	defer ag.lock.RUnlock()

	mbs := make([]string, 0, len(ag.members))
	for k, mode := range ag.members {
		if 0 < flag {
			if mode&flag == 0 {
				continue
			}
		}
		mbs = append(mbs, k)
	}
	slices.Sort(mbs)
	return mbs
}

func (ag *AppGroup) getMemberMode(username string) ModeKind {
	ag.lock.RLock()
	defer ag.lock.RUnlock()

	return ag.members[username]
}

func (ag *AppGroup) setMemberMode(username string, mode ModeKind, force bool) bool {

	// check mode valid is nessesary
	if mode < 0 || mode > Owner|Executer|Manager|Enable {
		return false
	}

	ag.lock.RLock()
	defer ag.lock.RUnlock()

	if _, ok := ag.members[username]; !ok && !force {
		return false
	}

	ag.members[username] = mode
	return true
}

func (ag *AppGroup) addMember(username string, role ModeKind) error {
	// enable
	mode := role | Enable
	if !ag.setMemberMode(username, mode, true) {
		return fmt.Errorf("add member %s mode:%s to group %s failed", username, mode, ag.name)
	}
	return nil
}

func (ag *AppGroup) getMember(username string) (ModeKind, error) {
	mode := ag.getMemberMode(username)
	if mode == ModeNotFound {
		return 0, fmt.Errorf("user %s not found in group %s", username, ag.name)
	}
	return mode, nil
}

func (ag *AppGroup) deleteMember(username string) error {
	ag.lock.Lock()
	defer ag.lock.Unlock()

	if _, ok := ag.members[username]; !ok {
		return fmt.Errorf("user %s not found in group %s", username, ag.name)
	}
	delete(ag.members, username)
	return nil
}
