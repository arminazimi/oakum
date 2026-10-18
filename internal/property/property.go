// Package property defines what every property type implements. It is a shared contract:
// each property type lives in its own sub-package (for example property/raw for read_after_write)
// and registers itself here.
package property

import (
	"context"
	"fmt"
	"net/http"
	"sync"

	"github.com/arminazimi/oakum/internal/outcome"
	"github.com/arminazimi/oakum/proxy/faultplan"
)

// Env is what a running property can use. verify builds it; properties never start containers.
type Env struct {
	AppURL  string       // base URL of the app under test, reachable from oakum
	HTTP    *http.Client // client for the app
	SQL     func(ctx context.Context, query string) ([]map[string]any, error)
	Signals faultplan.Signals // shared with the proxies for this run
	Fresh   func() string     // a unique value per call, for `$fresh`
	Seed    int64
}

// Type is one property type, such as read_after_write.
type Type interface {
	// Name is the `type:` value in oakum.yaml.
	Name() string
	// Run executes one scenario of the property under the plan the proxies already apply.
	Run(ctx context.Context, env Env, spec map[string]any) outcome.Result
	// DefectFaults are the code-defect fault plans for check-property (sensitivity).
	DefectFaults(spec map[string]any) []faultplan.Plan
}

var (
	mu    sync.Mutex
	types = map[string]Type{}
)

// Register adds a property type. Call it from init() in the type's package.
func Register(t Type) {
	mu.Lock()
	defer mu.Unlock()
	if _, dup := types[t.Name()]; dup {
		panic(fmt.Sprintf("property: duplicate type %q", t.Name()))
	}
	types[t.Name()] = t
}

// Lookup returns a registered property type.
func Lookup(name string) (Type, bool) {
	mu.Lock()
	defer mu.Unlock()
	t, ok := types[name]
	return t, ok
}
