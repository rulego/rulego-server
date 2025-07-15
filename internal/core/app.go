package core

import (
	"github.com/rulego/rulego/api/types"
)

type App struct {
	id      string
	project string
	owner   string
	dsl     []byte
	// eg  types.RuleEngine // indicate	the rule engine used to process the flow
	eg types.RuleEngine
}

func NewApp(dsl []byte) *App {

	// parse dsl to rule chain

	app := &App{
		dsl: dsl,
	}

	return app
}

func (a *App) Init() error {

	flow, err := NewFlow(a.id, a.dsl)
	if err != nil {
		return err
	}
	a.eg = flow
	return nil
}

func (a *App) Exec() {
	return
}
