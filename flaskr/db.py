import click
from flask import g
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate(db=db)


def setup_transaction_middleware(app, db):
  @app.before_request
  def before_request():
    g.db_session = db.session()

  @app.teardown_request
  def teardown_request(exception=None):
    db_session = g.pop('db_session', None)
    if db_session is not None:
      if exception is None:
        try:
          db_session.commit()
        except Exception:
          db_session.rollback()
          raise
      else:
        db_session.rollback()
      db_session.close()


def init_db():
  db.drop_all()
  db.create_all()


@click.command('init-db')
def init_db_command():
  init_db()
  click.echo('Initialized database')


def init_app(app):
  db.init_app(app)
  migrate.init_app(app, db)
  setup_transaction_middleware(app, db)
  app.cli.add_command(init_db_command)
