VENV = .venv
PYTHON = $(VENV)/bin/python
PIP = $(VENV)/bin/pip
FLASK = $(VENV)/bin/flask
NPM = npm
WEBPACK = npx webpack
WEBPACK_DEV = npx webpack serve --mode development --hot
FLAKE8 = $(VENV)/bin/flake8

.PHONY: help
help:
	@echo "Available targets:"
	@echo "  make venv         - Create virtual environment"
	@echo "  make install      - Install Python and Node dependencies"
	@echo "  make flask        - Run Flask with hot reload"
	@echo "  make webpack      - Build frontend assets"
	@echo "  make dev          - Run Flask and Webpack dev server (tmux required)"
	@echo "  make test         - Run tests (Vitest, pytest, coverage)"
	@echo "  make lint         - Run all linters (Python, JS)"
	@echo "  make clean        - Remove generated files and folders"

venv:
	python3 -m venv $(VENV)

install: venv
	$(PIP) install .[dev]
	$(PIP) install .
	$(NPM) install

flask:
	FLASK_ENV=development FLASK_APP=flaskr $(FLASK) run

webpack:
	$(WEBPACK)

dev:
	@echo "Starting Flask and Webpack dev servers (tmux required)..."
	@tmux new-session -d -s dev 'make flask'
	@tmux split-window -h '$(WEBPACK_DEV)'
	@tmux attach-session -t dev

test:
	$(NPM) run test:ci
	$(PYTHON) -m pytest -v
	coverage run -m pytest

lint-python:
	$(FLAKE8)

lint-js:
	$(NPM) run eslint

lint: lint-python lint-js

clean:
	rm -rf $(VENV) node_modules static/dist htmlcov .pytest_cache .mypy_cache
