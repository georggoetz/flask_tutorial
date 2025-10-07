VENV = .venv
PYTHON = $(VENV)/bin/python
PIP = $(VENV)/bin/pip
FLASK = $(VENV)/bin/flask
NPM = npm
NPX = npx
WEBPACK = $(NPX) webpack
WEBPACK_DEV = $(NPX) webpack --watch --mode development
FLAKE8 = $(VENV)/bin/flake8
BANDIT = $(VENV)/bin/bandit
PIP_AUDIT = $(VENV)/bin/pip-audit
CYCLONEDX = $(VENV)/bin/cyclonedx-py
DOCKER = docker
DOCKER_COMPOSE = docker-compose
FLY = fly

PYTHON3_CMD := $(shell command -v python3 2>/dev/null)
NODE_CMD := $(shell command -v node 2>/dev/null)
NPM_CMD := $(shell command -v npm 2>/dev/null)
DOCKER_CMD := $(shell command -v docker 2>/dev/null)
DOCKER_COMPOSE_CMD := $(shell command -v docker-compose 2>/dev/null)
FLY_CMD := $(shell command -v fly 2>/dev/null)
TMUX_CMD := $(shell command -v tmux 2>/dev/null)

.PHONY: help configure check-required-tools check-venv check-node-modules check-fly
help:
	@echo "Available targets:"
	@echo ""
	@echo "Setup & Configuration:"
	@echo "  make configure    						- Check system requirements (Unix-style)"
	@echo "  make venv         						- Create virtual environment"
	@echo "  make install      						- Install Python and Node dependencies"
	@echo ""
	@echo "Development:"
	@echo "  make flask        						- Run Flask in development mode"
	@echo "  make webpack      						- Build frontend assets (production)"
	@echo "  make webpack-dev  						- Build frontend assets (development + watch)"
	@echo "  make dev          						- Run Flask and Webpack dev server (tmux required)"
	@echo ""
	@echo "Testing & Quality:"
	@echo "  make test         						- Run tests (Vitest, pytest, coverage)"
	@echo "  make lint         						- Run all linters (Python, JS)"
	@echo "  make security     						- Run all security scans (Python, JS, Dependencies)"
	@echo "  make security-python					- Run Python security scan (Bandit)"
	@echo "  make security-python-sarif		- Run Python security scan with SARIF output (for CI)"
	@echo "  make security-js  					  - Run JavaScript security scan (ESLint Security)"
	@echo "  make security-deps-js				- Run JavaScript dependency security audit (npm audit)"
	@echo "  make security-deps-python		- Run Python dependency security audit (pip-audit)"
	@echo ""
	@echo "Deployment & Infrastructure:"
	@echo "  make clean        						- Remove generated files and folders"
	@echo "  make docker-build  					- Build Docker image"
	@echo "  make docker-run    					- Run Docker container"
	@echo "  make docker-shell  					- Access Docker container shell"
	@echo "  make docker-push   					- Push Docker image to registry"
	@echo "  make docker-compose-up    		- Start Docker containers with Docker Compose"
	@echo "  make docker-compose-down  		- Stop Docker containers with Docker Compose"
	@echo "  make docker-compose-logs  		- View logs from Docker containers"
	@echo "  make docker-compose-init-db 	- Initialize the database"
	@echo "  make docker-compose-seed-db  - Seed the database"
	@echo "  make fly-deploy      				- Deploy to Fly.io"
	@echo "  make fly-db-create   				- Create Fly.io Postgres database"
	@echo "  make fly-db-connect  				- Connect to Fly.io Postgres database"
	@echo "  make fly-db-status   				- Check Fly.io Postgres database status"
	@echo ""
	@echo "E2E Testing:"
	@echo "  make cypress-open     				- Open Cypress UI"
	@echo "  make cypress-run      				- Run Cypress tests"
	@echo "  make cypress-run SPEC=<file> - Run specific Cypress test file"
	@echo "                          		    Example: make cypress-run SPEC=\"cypress/e2e/login-user.cy.js\""
	@echo ""
	@echo "Database Management:"
	@echo "  make init-db          				- Initialize database (create tables)"
	@echo "  make seed-db          				- Seed database with sample data"
	@echo "  make migrate          				- Create new migration from model changes"
	@echo "  make migrate-initial  				- Create initial migration (fresh start)"
	@echo "  make migrate-upgrade  				- Apply pending migrations"
	@echo "  make migrate-downgrade				- Rollback last migration"

configure:
	@echo "Checking system requirements..."
	@echo "================================"
	@printf "Python3:        "
	@if [ -n "$(PYTHON3_CMD)" ];        then echo "✅ $(PYTHON3_CMD)";        else echo "❌ NOT FOUND"; fi
	@printf "Node.js:        "
	@if [ -n "$(NODE_CMD)" ];           then echo "✅ $(NODE_CMD)";           else echo "❌ NOT FOUND"; fi
	@printf "npm:            "
	@if [ -n "$(NPM_CMD)" ];            then echo "✅ $(NPM_CMD)";            else echo "❌ NOT FOUND"; fi
	@printf "Docker:         "
	@if [ -n "$(DOCKER_CMD)" ];         then echo "✅ $(DOCKER_CMD)";         else echo "⚠️  NOT FOUND (optional)"; fi
	@printf "Docker Compose: "
	@if [ -n "$(DOCKER_COMPOSE_CMD)" ]; then echo "✅ $(DOCKER_COMPOSE_CMD)"; else echo "⚠️  NOT FOUND (optional)"; fi
	@printf "Fly CLI:        "
	@if [ -n "$(FLY_CMD)" ];            then echo "✅ $(FLY_CMD)";            else echo "⚠️  NOT FOUND (optional)"; fi
	@printf "tmux:           "
	@if [ -n "$(TMUX_CMD)" ];           then echo "✅ $(TMUX_CMD)";           else echo "⚠️  NOT FOUND (for 'make dev')"; fi
	@echo ""
	@if [ -z "$(PYTHON3_CMD)" ] || [ -z "$(NODE_CMD)" ] || [ -z "$(NPM_CMD)" ]; then \
		echo "❌ Missing required dependencies. Please install:"; \
		[ -z "$(PYTHON3_CMD)" ] && echo "   - Python 3"; \
		[ -z "$(NODE_CMD)" ]    && echo "   - Node.js"; \
		echo ""; \
		exit 1; \
	fi
	@echo "✅ All required tools are available!"
	@echo ""
	@echo "Next steps:"
	@echo "  make install    # Install dependencies"
	@echo "  make init-db    # Initialize database"
	@echo "  make seed-db    # Populate with sample data"
	@echo "  make dev        # Start development server"

check-required-tools:
	@if [ -z "$(PYTHON3_CMD)" ]; 	then echo "❌ python3 not found. Run 'make configure'"; 	exit 1; fi
	@if [ -z "$(NODE_CMD)" ]; 		then echo "❌ node not found. Run 'make configure'"; 		exit 1; fi
	@if [ -z "$(NPM_CMD)" ]; 			then echo "❌ npm not found. Run 'make configure'"; 			exit 1; fi

check-venv:
	@if [ ! -d "$(VENV)" ]; then echo "❌ Virtual environment not found. Run 'make install'"; exit 1; fi

check-node-modules:
	@if [ ! -d "node_modules" ]; then echo "❌ node_modules not found. Run 'make install'"; exit 1; fi

check-fly:
	@if [ -z "$(FLY_CMD)" ]; then echo "❌ fly CLI not found. Install from https://fly.io/docs/hands-on/install-flyctl/"; exit 1; fi

venv: check-required-tools
	$(PYTHON) -m venv $(VENV)

install: check-required-tools venv
	$(PIP) install .[dev]
	$(NPM) install

flask: check-venv
	FLASK_ENV=development FLASK_APP=flaskr $(FLASK) run

webpack: check-node-modules
	@echo "Building frontend assets (production)..."
	$(NPM) run build

webpack-dev: check-node-modules
	@echo "Building frontend assets (development with watch)..."
	$(NPM) run watch

dev: check-venv check-node-modules
	@if [ -z "$(TMUX_CMD)" ]; then echo "❌ tmux not found. Install with: sudo apt install tmux"; exit 1; fi
	@echo "Starting Flask and Webpack dev servers (tmux required)..."
	@tmux new-session -d -s dev 'make flask'
	@tmux split-window -h 'make webpack-dev'
	@tmux attach-session -t dev

test: check-venv check-node-modules
	$(NPM) run test:ci
	$(PYTHON) -m pytest -v --cov=flaskr --cov-report=xml --cov-report=html

lint-python:
	$(FLAKE8)

lint-js:
	$(NPM) run eslint

lint: lint-python lint-js

security-python:
	$(BANDIT) -r flaskr/ -ll -f txt

security-python-sarif:
	$(BANDIT) -r flaskr/ -ll -f json -o bandit-results.json || true

security-js:
	$(NPM) run security-eslint

security-deps-js:
	$(NPM) audit --audit-level=moderate $(if $(JSON_OUTPUT),--json > js-audit.json,)

security-deps-python:
	@echo "Running pip-audit for Python dependencies..."
	@$(PIP_AUDIT) --desc $(if $(JSON_OUTPUT),--format=json --output=python-audit.json,) || echo "✓ pip-audit completed (local packages skipped)"

security: security-python security-js security-deps-js security-deps-python

sbom-python:
	@echo "Generating Python SBOM..."
	@mkdir -p sbom
	@$(CYCLONEDX) environment --output-format JSON --output-file sbom/python-sbom.json --pyproject pyproject.toml $(VENV)
	@echo "✓ Python SBOM generated: sbom/python-sbom.json"

sbom-python-public:
	@echo "Generating Public Python SBOM (filtered)..."
	@mkdir -p sbom
	@$(CYCLONEDX) environment --output-format JSON --output-file sbom/python-sbom-temp.json --pyproject pyproject.toml $(VENV)
	@# Filter out dev dependencies (simplified version)
	@cp sbom/python-sbom-temp.json sbom/python-sbom-public.json
	@rm -f sbom/python-sbom-temp.json
	@echo "✓ Public Python SBOM generated: sbom/python-sbom-public.json"

sbom-js:
	@echo "Generating JavaScript SBOM..."
	@mkdir -p sbom
	@$(NPM) run sbom
	@echo "✓ JavaScript SBOM generated: sbom/javascript-sbom.json"

sbom-js-public:
	@echo "Generating Public JavaScript SBOM (production only)..."
	@mkdir -p sbom
	@$(NPM) run sbom-public
	@echo "✓ Public JavaScript SBOM generated: sbom/javascript-sbom-public.json"

sbom: sbom-python sbom-js
	@echo "✓ All SBOMs generated in sbom/ directory"

sbom-public: sbom-python-public sbom-js-public
	@echo "✓ Public SBOMs generated for release"

clean:
	rm -rf $(VENV) node_modules static/dist htmlcov .pytest_cache .mypy_cache \
		__pycache__ \
		flaskr/__pycache__ flaskr/*/__pycache__ \
		migrations/versions/__pycache__ \
		flaskr/static/dist \
		flaskr/frontend/dist \
		dist build *.egg-info \
		instance/*.sqlite instance/*.db

docker-build:
	@if [ -z "$(DOCKER_CMD)" ]; then echo "❌ docker not found. Install from: https://docker.com"; exit 1; fi
	$(DOCKER) build -t flask-tutorial:local .

docker-run:
	$(DOCKER) run --rm -it -p 5000:5000 flask-tutorial:local

docker-shell:
	$(DOCKER) run --rm -it -p 5000:5000 --entrypoint /bin/bash flask-tutorial:local

docker-push:
	$(DOCKER) tag flask-tutorial:local your-dockerhub/flask-tutorial:latest
	$(DOCKER) push your-dockerhub/flask-tutorial:latest

docker-compose-up:
	@if [ -z "$(DOCKER_COMPOSE_CMD)" ]; then echo "❌ docker-compose not found. Install from: https://docs.docker.com/compose/"; exit 1; fi
	$(DOCKER_COMPOSE) up --build

docker-compose-down:
	$(DOCKER_COMPOSE) down

docker-compose-logs:
	$(DOCKER_COMPOSE) logs -f

docker-compose-init-db:
	$(DOCKER_COMPOSE) exec web flask init-db

docker-compose-seed-db:
	$(DOCKER_COMPOSE) exec web flask seed-db

fly-deploy: check-fly
	@echo "Deploying to Fly.io..."
	$(FLY) deploy --remote-only

fly-db-create:
	$(FLY) postgres create --name flask-tutorial-db --org personal --region fra --initial-cluster-size 1

fly-db-connect:
	$(FLY) postgres connect -a flask-tutorial-db

fly-db-status:
	$(FLY) postgres list

cypress-open:
	$(NPM) run cypress:open

cypress-run: check-node-modules
	@if [ -n "$(SPEC)" ]; then \
		echo "Running specific Cypress test: $(SPEC)"; \
		DBUS_SESSION_BUS_ADDRESS=/dev/null NO_AT_BRIDGE=1 \
		$(NPX) start-server-and-test flask http://localhost:5000 "cypress run --spec $(SPEC)"; \
	else \
		DBUS_SESSION_BUS_ADDRESS=/dev/null NO_AT_BRIDGE=1 \
		$(NPM) run cypress:run; \
	fi

init-db: check-venv
	$(FLASK) --app flaskr init-db

seed-db: check-venv
	$(FLASK) --app flaskr seed-db

migrate: check-venv
	@if [ -z "$(name)" ]; then \
		echo "Usage: make migrate name='migration_description'"; \
		echo "Example: make migrate name='add_user_profile'"; \
		exit 1; \
	fi
	$(FLASK) --app flaskr db migrate -m "$(name)"

migrate-initial: check-venv
	@echo "Creating initial migration (removes existing migrations)..."
	@read -p "This will remove all existing migrations. Continue? [y/N]: " confirm && [ "$$confirm" = "y" ] || exit 1
	rm -f migrations/versions/*.py
	rm -f instance/flaskr.sqlite
	$(FLASK) --app flaskr db migrate -m "initial_migration"

migrate-upgrade: check-venv
	$(FLASK) --app flaskr db upgrade

migrate-downgrade: check-venv
	$(FLASK) --app flaskr db downgrade
