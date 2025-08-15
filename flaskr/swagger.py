"""
Swagger/OpenAPI configuration for the Flaskr blog API.
"""

import os
import importlib.metadata
from flasgger import Swagger


def get_version():
  """Get the version from the package metadata."""
  try:
    return importlib.metadata.version('flaskr')
  except importlib.metadata.PackageNotFoundError:
    return "0.0.0"  # Fallback for development


def init_app(app):
  """Initialize Swagger documentation for the Flask application."""
  version = get_version()

  # For production (fly.io), use HTTPS since the platform provides it
  # For development, use HTTP
  is_production = os.environ.get('FLY_APP_NAME') is not None
  scheme = 'https' if is_production else 'http'

  swagger_config = {
    "headers": [],
    "specs": [{
      "endpoint": 'apispec',
      "route": '/apispec.json',
      "rule_filter": lambda rule: rule.endpoint.startswith('blog_api.'),
      "model_filter": lambda tag: True,
    }],
    "static_url_path": "/flasgger_static",
    "swagger_ui": True,
    "specs_route": "/apidocs/",
    "swagger_ui_config": {
      "persistAuthorization": True,
      "displayRequestDuration": True,
      "docExpansion": "none",
      "filter": True,
      "showExtensions": True,
      "showCommonExtensions": True
    },
    "securityDefinitions": {
      "BasicAuth": {
        "type": "basic",
        "description": "Enter your username and password to authenticate"
      }
    }
  }

  swagger_template = {
    "swagger": "2.0",
    "info": {
      "title": "Flaskr Blog API",
      "description": """REST API for the Flaskr blog application.

Provides endpoints for interacting with blog posts including likes and comments.

**Authentication:** Click the "Authorize" button to log in with your username and password.""",
      "version": version,
      "contact": {
        "name": "Flaskr Blog",
        "url": "/"
      }
    },
    "basePath": "/api/blog",
    "schemes": [scheme],
    "securityDefinitions": {
      "BasicAuth": {
        "type": "basic",
        "description": "HTTP Basic Authentication with username and password"
      }
    }
  }

  return Swagger(app, config=swagger_config, template=swagger_template)
