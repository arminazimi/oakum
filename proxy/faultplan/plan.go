// Package faultplan defines fault plans as data. It is a shared contract between
// proxies (which apply plans) and the core (which builds them from properties).
// Protocol packages interpret Command and Target; this package knows no protocol.
package faultplan

import "time"

// Action is what a proxy does to a matching message.
type Action string

const (
	// Drop removes the matched command. The proxy answers the client as the server would
	// for a successful command (for RESP DEL: an integer reply of 1), so the app cannot tell.
	Drop Action = "drop"
	// Delay forwards the command after Delay, without blocking other connections.
	Delay Action = "delay"
	// Rewrite forwards the command with its target replaced by RewriteTarget.
	Rewrite Action = "rewrite"
	// Hold keeps the command until the named signal fires, then forwards it.
	// Other connections keep flowing while it is held.
	Hold Action = "hold"
	// Redeliver sends a message to its consumer again (brokers only).
	Redeliver Action = "redeliver"
	// Cut closes the connection after the matched message (databases only).
	Cut Action = "cut"
)

// Match selects messages. Empty fields match anything.
type Match struct {
	Command string `json:"command,omitempty" yaml:"command,omitempty"` // e.g. "DEL", "SET"; case-insensitive
	Target  string `json:"target,omitempty" yaml:"target,omitempty"`   // key, subject, or table glob, e.g. "user:*"
	Nth     int    `json:"nth,omitempty" yaml:"nth,omitempty"`         // only the nth match (1-based); 0 = every match
}

// Rule is one match and what to do with it.
type Rule struct {
	Name          string        `json:"name" yaml:"name"`
	Match         Match         `json:"match" yaml:"match"`
	Action        Action        `json:"action" yaml:"action"`
	Delay         time.Duration `json:"delay,omitempty" yaml:"delay,omitempty"`
	RewriteTarget string        `json:"rewrite_target,omitempty" yaml:"rewrite_target,omitempty"`
	Until         string        `json:"until,omitempty" yaml:"until,omitempty"` // signal name for Hold
	// Emit fires this signal when the rule's message has been forwarded (or dropped).
	// Hold rules on other connections can wait on it. This is how schedules are built.
	Emit string `json:"emit,omitempty" yaml:"emit,omitempty"`
}

// Plan is an ordered list of rules. The first matching rule applies.
type Plan struct {
	Name  string `json:"name" yaml:"name"`
	Rules []Rule `json:"rules" yaml:"rules"`
}

// Signals lets rules and the runner coordinate. Implementations must be safe for concurrent use.
type Signals interface {
	// Fire marks a signal as fired and releases everything waiting on it. Firing twice is a no-op.
	Fire(name string)
	// Wait blocks until the signal fires or the timeout passes; it reports whether it fired.
	Wait(name string, timeout time.Duration) bool
}
