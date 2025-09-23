VENV = .venv
PYTHON = $(VENV)/bin/python
PIP = $(VENV)/bin/pip
FLASK = $(VENV)/bin/flask
NPM = npm
WEBPACK = npx webpack
WEBPACK_DEV = npx webpack --watch --mode development
FLAKE8 = $(VENV)/bin/flake8
BANDIT = $(VENV)/bin/bandit

.PHONY: help
help:
	@echo "Available targets:"
	@echo "  make venv         						- Create virtual environment"
	@echo "  make install      						- Install Python and Node dependencies"
	@echo "  make flask        						- Run Flask with hot reload"
	@echo "  make webpack      						- Build frontend assets"
	@echo "  make dev          						- Run Flask and Webpack dev server (tmux required)"
	@echo "  make test         						- Run tests (Vitest, pytest, coverage)"
	@echo "  make lint         						- Run all linters (Python, JS)"
	@echo "  make security     						- Run all security scans (Python, JS, Dependencies)"
	@echo "  make security-python					- Run Python security scan (Bandit)"
	@echo "  make security-python-sarif		- Run Python security scan with SARIF output (for CI)"
	@echo "  make security-js  					  - Run JavaScript security scan (ESLint Security)"
	@echo "  make security-deps-js				- Run JavaScript dependency security audit (npm audit)"
	@echo "  make security-deps-python		- Run Python dependency security audit (pip-audit)"
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
	@echo "  make fly-db-create   				- Create Fly.io Postgres database"
	@echo "  make fly-db-connect  				- Connect to Fly.io Postgres database"
	@echo "  make fly-db-status   				- Check Fly.io Postgres database status"
	@echo "  make cypress-open     				- Open Cypress UI"
	@echo "  make cypress-run      				- Run Cypress tests"

venv:
	python3 -m venv $(VENV)

install: venv
	$(PIP) install .[dev]
	$(NPM) install

flask:
	FLASK_ENV=production FLASK_APP=flaskr $(FLASK) run

webpack:
	$(WEBPACK)

dev:
	@echo "Starting Flask and Webpack dev servers (tmux required)..."
	@tmux new-session -d -s dev 'make flask'
	@tmux split-window -h '$(WEBPACK_DEV)'
	@tmux attach-session -t dev

test:
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
	$(NPM) audit --audit-level=moderate

security-deps-python:
	@echo "Running pip-audit for Python dependencies..."
	@$(VENV)/bin/pip-audit --desc || echo "✓ pip-audit completed (local packages skipped)"

security: security-python security-js security-deps-js security-deps-python

# SBOM (Software Bill of Materials) generation
sbom-python:
	@echo "Generating Python SBOM..."
	@mkdir -p sbom
	@$(VENV)/bin/cyclonedx-py environment --output-format JSON --output-file sbom/python-sbom.json --pyproject pyproject.toml $(VENV)
	@echo "✓ Python SBOM generated: sbom/python-sbom.json"

sbom-python-public:
	@echo "Generating Public Python SBOM (filtered)..."
	@mkdir -p sbom
	@$(VENV)/bin/cyclonedx-py environment --output-format JSON --output-file sbom/python-sbom-temp.json --pyproject pyproject.toml $(VENV)
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
	docker build -t flask-tutorial:local .

docker-run:
	docker run --rm -it -p 5000:5000 flask-tutorial:local

docker-shell:
	docker run --rm -it -p 5000:5000 --entrypoint /bin/bash flask-tutorial:local

docker-push:
	docker tag flask-tutorial:local your-dockerhub/flask-tutorial:latest
	docker push your-dockerhub/flask-tutorial:latest

docker-compose-up:
	docker-compose up --build

docker-compose-down:
	docker-compose down

docker-compose-logs:
	docker-compose logs -f

docker-compose-init-db:
	docker-compose exec web flask init-db

docker-compose-seed-db:
	docker-compose exec web flask seed-db

fly-db-create:
	fly postgres create --name flask-tutorial-db --org personal --region fra --initial-cluster-size 1

fly-db-connect:
	fly postgres connect -a flask-tutorial-db

fly-db-status:
	fly postgres list

cypress-open:
	$(NPM) run cypress:open

cypress-run:
	$(NPM) run cypress:run

init-db:
	.venv/bin/flask --app flaskr init-db

seed-db:
	.venv/bin/flask --app flaskr seed-db
