package core

import (
	"github.com/rulego/rulego/api/types"
	"github.com/rulego/rulego/engine"
)

var pool *engine.Pool = engine.DefaultPool

func NewFlow(id string, dsl []byte) (types.RuleEngine, error) {

	eg, err := pool.New(id, dsl)
	if err != nil {
		return nil, err
	}

	return eg, nil
}
