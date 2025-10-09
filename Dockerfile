FROM node:22-slim AS frontend-build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY flaskr/frontend/ ./flaskr/frontend/
COPY webpack.config.js .babelrc eslint.config.mjs ./
RUN npm run build

FROM python:3.14-slim AS backend-build
WORKDIR /app
RUN apt-get update && apt-get install -y build-essential libpq-dev && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml .
RUN pip install --upgrade pip && pip install build

COPY . .
COPY --from=frontend-build /app/flaskr/static/dist ./flaskr/static/dist

RUN pip install --no-cache-dir .
RUN python -m build --wheel

FROM python:3.14-slim AS production
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=backend-build /app/dist/*.whl /tmp/
COPY --from=backend-build /app /app
RUN pip install --no-cache-dir /tmp/*.whl
RUN pip install --no-cache-dir gunicorn

ENV FLASK_APP=flaskr
ENV FLASK_ENV=production

CMD ["gunicorn", "-b", "0.0.0.0:5000", "flaskr:create_app()"]
