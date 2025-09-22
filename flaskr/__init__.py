from flask import Flask
from flask_wtf import CSRFProtect
from flask_compress import Compress


def create_app(test_config=None):
  app = Flask(__name__, instance_relative_config=True)

  CSRFProtect(app)
  Compress(app)

  app.jinja_env.trim_blocks = True
  app.jinja_env.lstrip_blocks = True

  from . import config
  config.init_app(app, test_config)

  from . import logger
  logger.init_app(app)

  from . import errors
  errors.init_app(app)

  from . import db
  db.init_app(app)

  from . import auth
  auth.init_app(app)

  from . import blog
  blog.init_app(app)

  from . import blog_api
  blog_api.init_app(app)

  from . import static_assets
  static_assets.init_app(app)

  from . import swagger
  swagger.init_app(app)

  from . import health_api
  health_api.init_app(app)

  return app
