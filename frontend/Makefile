SHELL := bash -euo pipefail

.PHONY: help
help:
	@echo "Usage: make <target>"
	@echo
	@echo "Targets:"
	@echo "  help    This help (default target)"
	@echo "  deps    Install all dependencies"
	@echo "  format  Format source code"
	@echo "  lint    Run lint checks"
	@echo "  test    Run tests (no watch)"
	@echo "  test-w  Run tests (watch)"
	@echo "  ci      Install dependencies, run lints and tests"
	@echo "  serve   Run the (development) server"

.PHONY: deps
deps:
	npm install --include=dev

.PHONY: format
format:
	npm run format

.PHONY: lint
lint:
	npm run lint
	npm run type-check
	npm run format:check

.PHONY: test
test:
	npm run -- test:unit --run

.PHONY: test-w
test-w:
	npm run -- test:unit

.PHONY: ci
ci: \
	deps \
	lint \
	test

.PHONY: serve
serve:
	MODE=development npm run dev

.PHONY: serve-public
serve-public:
	MODE=development npm run dev-public
