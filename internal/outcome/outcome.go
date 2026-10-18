// Package outcome defines what a property run can conclude. It is a shared contract:
// the types and their meanings are fixed here; task core.outcomes adds validation,
// aggregation, and exit codes without changing them.
package outcome

// Status is the verdict for one property in one run.
type Status string

const (
	// Pass means only the executed scenarios passed. It requires Runs >= 1 and a Scope.
	Pass Status = "pass"
	// Fail means a violation was witnessed, with a fault-plan replay.
	Fail Status = "fail"
	// Unknown means the run happened but evidence is insufficient. It is never a pass.
	Unknown Status = "unknown"
	// NotTested means the property was relevant but did not run.
	NotTested Status = "not_tested"
)

// Kind says which question a failure answers.
type Kind string

const (
	// Regression: the current code violates the property with no environment faults.
	Regression Kind = "regression"
	// Resilience: the property breaks under a fault the property declares in `tolerates`.
	Resilience Kind = "resilience"
)

// Reason codes for Unknown. Add new codes here, never as free text.
const (
	ReasonTimeout           = "timeout"
	ReasonAppDidNotStart    = "app_did_not_start"
	ReasonNonIsolatedTarget = "non_isolated_target"
	ReasonUnsafeCompose     = "unsafe_compose"
	ReasonSecretInEnv       = "secret_in_env"
)

// Result is the outcome of one property.
type Result struct {
	PropertyID string `json:"property_id"`
	Status     Status `json:"status"`
	Kind       Kind   `json:"kind,omitempty"`   // set when Status == Fail
	Reason     string `json:"reason,omitempty"` // set when Status == Unknown
	Runs       int    `json:"runs"`
	Failed     int    `json:"failed"` // runs that failed; "reproducible: Failed/Runs"
	Scope      Scope  `json:"scope"`
	ReplayID   string `json:"replay_id,omitempty"` // set when Status == Fail
	Observed   any    `json:"observed,omitempty"`
	Expected   any    `json:"expected,omitempty"`
}

// Scope records what actually ran, so a pass never claims more.
type Scope struct {
	Commit    string   `json:"commit,omitempty"`
	Scenario  string   `json:"scenario"`
	Faults    []string `json:"faults,omitempty"`
	Seed      int64    `json:"seed"`
	Isolation string   `json:"isolation"` // "compose"
}
