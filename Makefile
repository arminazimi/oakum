# `make check` is the one command every task must pass.
# Ignore any go.work in parent directories.
export GOWORK := off

.PHONY: check test vet roadmap build

check: vet test roadmap

vet:
	go vet ./...

test:
	go test -race ./...

roadmap:
	npm run check --silent

build:
	go build -o bin/oakum ./cmd/oakum
