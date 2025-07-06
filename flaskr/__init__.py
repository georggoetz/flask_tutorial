import os
from flask import Flask


def create_app(test_config=None):
  app = Flask(__name__, instance_relative_config=True)

  secret_key = os.environ.get("SECRET_KEY", "dev")
  db_url = os.environ.get("DATABASE_URL")
  if db_url is None and test_config is None:
    db_url = 'sqlite:///' + os.path.join(app.instance_path, 'flaskr.sqlite')

  app.config.from_mapping(
    SECRET_KEY=secret_key,
    SQLALCHEMY_DATABASE_URI=db_url,
  )

  if test_config is not None:
    app.config.from_mapping(test_config)
  else:
    app.config.from_pyfile('config.py', silent=True)

  try:
    os.makedirs(app.instance_path)
  except OSError:
    pass

  from . import db
  db.init_app(app)

  from . import auth
  auth.init_app(app)

  from . import blog
  blog.init_app(app)

  from . import blog_api
  blog_api.init_app(app)

  return app
