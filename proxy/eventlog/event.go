// Package eventlog defines the ordered record every proxy writes. It is a shared contract:
// replay, reports, and evidence read it; proxies write it.
package eventlog

// Direction of a message through the proxy.
type Direction string

const (
	ToServer Direction = "to_server"
	ToClient Direction = "to_client"
)

// Event is one message seen by a proxy.
type Event struct {
	Seq       uint64    `json:"seq"`        // strictly increasing across all connections of one proxy
	MonoNanos int64     `json:"mono_nanos"` // monotonic time since the proxy started
	Proxy     string    `json:"proxy"`      // "resp", "nats", ...
	Conn      uint64    `json:"conn"`       // connection id, stable for the run
	Dir       Direction `json:"dir"`
	Command   string    `json:"command"`          // upper-case command or message type
	Target    string    `json:"target,omitempty"` // key, subject, or table
	Rule      string    `json:"rule,omitempty"`   // fault rule name that applied, if any
	Action    string    `json:"action,omitempty"` // fault action that applied, if any
	Signal    string    `json:"signal,omitempty"` // signal fired or waited on, if any
}

// Sink receives events. Implementations must be safe for concurrent use and must preserve Seq order.
type Sink interface {
	Write(Event)
}
