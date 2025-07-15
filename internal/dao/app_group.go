package dao

type AppGroupDao struct {
	Name      string         `json:"name"`      // 业务层名称
	Namespace string         `json:"namespace"` // 底层项目空间
	Owner     string         `json:"owner"`     // 业务层所有者
	Members   map[string]int `json:"members"`   // 可访问成员
}
