// Command oakum verifies application state across databases, caches, and brokers.
//
// Each subcommand lives in its own file in this directory and registers itself in init(),
// so tasks that add commands never edit the same file.
package main

import (
	"fmt"
	"io"
	"os"
	"sort"
)

// version is set at build time with -ldflags "-X main.version=...".
var version = "0.0.0-dev"

// command is one oakum subcommand. run returns the process exit code.
type command struct {
	summary string
	run     func(args []string, stdout, stderr io.Writer) int
}

var commands = map[string]command{}

// register adds a subcommand. Call it from init() in the subcommand's own file.
func register(name, summary string, run func(args []string, stdout, stderr io.Writer) int) {
	if _, dup := commands[name]; dup {
		panic("oakum: duplicate command " + name)
	}
	commands[name] = command{summary: summary, run: run}
}

func init() {
	register("version", "Print the oakum version", func(_ []string, stdout, _ io.Writer) int {
		fmt.Fprintln(stdout, version)
		return 0
	})
}

func main() {
	os.Exit(dispatch(os.Args[1:], os.Stdout, os.Stderr))
}

func dispatch(args []string, stdout, stderr io.Writer) int {
	if len(args) == 0 || args[0] == "help" || args[0] == "-h" || args[0] == "--help" {
		usage(stdout)
		return 0
	}
	cmd, ok := commands[args[0]]
	if !ok {
		fmt.Fprintf(stderr, "oakum: unknown command %q\n\n", args[0])
		usage(stderr)
		return 2
	}
	return cmd.run(args[1:], stdout, stderr)
}

func usage(w io.Writer) {
	fmt.Fprintln(w, "Usage: oakum <command> [arguments]")
	fmt.Fprintln(w)
	names := make([]string, 0, len(commands))
	for name := range commands {
		names = append(names, name)
	}
	sort.Strings(names)
	for _, name := range names {
		fmt.Fprintf(w, "  %-16s %s\n", name, commands[name].summary)
	}
}
