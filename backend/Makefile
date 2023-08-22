DIRS_PYTHON := app tests ../docs

.PHONY: help
help:
	@echo "Usage: make <target>"
	@echo
	@echo "Targets:"
	@echo "  help    This help (default target)"
	@echo "  deps    Install all dependencies"
	@echo "  format  Format source code"
	@echo "  lint    Run lint checks"
	@echo "  test    Run tests"
	@echo "  ci      Install dependencies, run lints and tests"
	@echo "  docs    Generate the documentation"
	@echo "  serve   Run the (development) server"

.PHONY: deps
deps:
	pipenv install --dev

.PHONY: format
format:	\
	format-isort \
	format-black

.PHONY: format-isort
format-isort:
	pipenv run isort --profile=black $(DIRS_PYTHON)

.PHONY: format-black
format-black:
	pipenv run black --line-length 100 $(DIRS_PYTHON)

.PHONY: lint
lint: \
	lint-isort \
	lint-black \
	lint-flake8 \
	lint-mypy

.PHONY: lint-isort
lint-isort:
	pipenv run isort --profile=black --check-only --diff $(DIRS_PYTHON)

.PHONY: lint-black
lint-black:
	pipenv run black --check --line-length 100 --diff $(DIRS_PYTHON)

.PHONY: lint-flake8
flake8:
	pipenv run flake8 --max-line-length 100 $(DIRS_PYTHON)

.PHONY: lint-mypy
lint-mypy:
	pipenv run mypy $(DIRS_PYTHON)

.PHONY: test
test:
	pipenv run pytest \
		--cov-report term-missing \
		--cov-report lcov \
		--cov=app \
		tests/

.PHONY: ci
ci: \
	deps \
	lint \
	test

.PHONY: docs
docs:
	pipenv run -- make -C ../docs clean html

.PHONY: serve
serve:
	pipenv run uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload
