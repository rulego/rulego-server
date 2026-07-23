//go:build with_iot

package main

import (
	"github.com/rulego/rulego-server/internal/service"

	// Register the Extended Component Library
	// Use `go build -tags with_iot .` to include the IoT extension components in the executable
	_ "github.com/rulego/rulego-components-iot/endpoint/opcua"
	_ "github.com/rulego/rulego-components-iot/external/modbus"
	_ "github.com/rulego/rulego-components-iot/external/opcua"
	"github.com/rulego/rulego-components-iot/external/serial"
)

func init() {
	// Retrieve serial port list function, supports real-time retrieval
	getSerialPorts := func() interface{} {
		serialPortsList, _ := serial.GetPortsList()
		return map[string]interface{}{
			"port": serialPortsList,
		}
	}
	service.RegisterBuiltin("x/serialIn", getSerialPorts)
	service.RegisterBuiltin("x/serialOut", getSerialPorts)
	service.RegisterBuiltin("x/serialRequest", getSerialPorts)
	service.RegisterBuiltin("x/serialControl", getSerialPorts)
}
