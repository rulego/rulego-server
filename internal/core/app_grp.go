package core

type AppGrp struct {
	apps  map[string]*App
	owner string
}

type UserApp struct {
	user string

	owns []*App
	uses []*App

	ownsGrp []*AppGrp
	usesGrp []*AppGrp
}

type UserAppManager struct {
	UserApps map[string]*UserApp
}
