package main

import (
	"bytes"
	"strings"
	"testing"
)

func TestDispatch(t *testing.T) {
	var out, errOut bytes.Buffer
	if code := dispatch([]string{"version"}, &out, &errOut); code != 0 {
		t.Fatalf("version: exit %d", code)
	}
	if strings.TrimSpace(out.String()) != version {
		t.Fatalf("version printed %q", out.String())
	}
	if code := dispatch([]string{"no-such-command"}, &out, &errOut); code != 2 {
		t.Fatalf("unknown command: exit %d, want 2", code)
	}
}
