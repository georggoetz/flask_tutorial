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
	@echo "  make venv         						- Create virtual environment"
	@echo "  make install      						- Install Python and Node dependencies"
	@echo "  make flask        						- Run Flask with hot reload"
	@echo "  make webpack      						- Build frontend assets"
	@echo "  make dev          						- Run Flask and Webpack dev server (tmux required)"
	@echo "  make test         						- Run tests (Vitest, pytest, coverage)"
	@echo "  make lint         						- Run all linters (Python, JS)"
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
