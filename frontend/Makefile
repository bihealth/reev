SHELL := bash -euo pipefail

.PHONY: help
help:
	@echo "Usage: make <target>"
	@echo
	@echo "Targets:"
	@echo "  help        This help (default target)"
	@echo "  deps        Install all dependencies"
	@echo "  format      Format source code"
	@echo "  lint        Run lint checks"
	@echo "  test        Run tests (no watch)"
	@echo "  test-ci     Run tests (no watch) for CI (with coverage, single-threaded)"
	@echo "  test-nocov  Run tests (no watch) without coverage"
	@echo "  test-w      Run tests (watch)"
	@echo "  ci          Install dependencies, run lints and tests"
	@echo "  serve       Run the (development) server"

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

# Tests in the CI are forced into a single thread as the worker only has
# two cores only and some tests run into timeouts otherwise.
.PHONY: test-ci
test-ci:
	npm run -- test:unit --run --poolOptions.threads.maxThreads=1 --poolOptions.threads.minThreads=1

.PHONY: test-nocov
test-nocov:
	npm run -- test:unit:nocov --run

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

# Build the OpenAPI TypeScript client for AutoACMG.
.PHONY: openapi-ts-autoacmg
openapi-ts-autoacmg:
	rm -rf src/ext/autoacmg-api/src/{lib}
	mkdir -p src/ext/autoacmg-api/src
	wget -O src/ext/autoacmg-api/openapi.yaml \
		https://raw.githubusercontent.com/bihealth/auto-acmg/main/openapi.yaml
	npx @hey-api/openapi-ts --file openapi-ts.config.autoacmg.ts

# Build the OpenAPI TypeScript client for InterVar.
.PHONY: openapi-ts-intervar
openapi-ts-intervar:
	rm -rf src/ext/intervar-api/src/{lib}
	mkdir -p src/ext/intervar-api/src
	npx @hey-api/openapi-ts --file openapi-ts.config.intervar.ts

# Build the OpenAPI TypeScript client for REEV.
.PHONY: openapi-ts-reev
openapi-ts-reev:
	rm -rf src/ext/reev-api/src/{lib}
	mkdir -p src/ext/reev-api/src
	npx @hey-api/openapi-ts --file openapi-ts.config.ts

.PHONY: openapi-ts
openapi-ts: openapi-ts-autoacmg openapi-ts-intervar openapi-ts-reev

.PHONY: openapi
openapi: openapi-ts format lint
