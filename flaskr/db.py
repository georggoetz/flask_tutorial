import click
import random

from faker import Faker
from flask import g
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash

from flaskr.logger import log_exception

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
        except Exception as e:
          log_exception(f"Database session: Commit failed - {e}")
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


@click.command('seed-db')
def seed_db_command():
  from flaskr.models import User, Post, Comment
  fake = Faker()

  users = []
  for _ in range(10):
    user = User(username=fake.user_name(), password=generate_password_hash('secret'))
    db.session.add(user)
    users.append(user)

  db.session.commit()

  posts = []
  for user in users:
    for _ in range(3):
      title = fake.sentence()
      body_length = random.randint(100, 5000)
      body = fake.text(max_nb_chars=body_length)
      excerpt = fake.sentence() if random.choice([True, False]) else None
      post = Post(
        title=title,
        body=body,
        excerpt=excerpt,
        author_id=user.id
      )
      db.session.add(post)
      posts.append(post)

  db.session.commit()

  comment_count = 0
  for post in posts[:5]:
    for _ in range(random.randint(1, 4)):
      user = random.choice(users)
      comment_text = fake.paragraph(nb_sentences=random.randint(1, 3))
      comment = Comment(
        author_id=user.id,
        post_id=post.id,
        content=comment_text
      )
      db.session.add(comment)
      comment_count += 1

  db.session.commit()
  click.echo(f'Seeded {len(users)} users, {len(posts)} posts, and {comment_count} comments')


def init_app(app):
  db.init_app(app)
  migrate.init_app(app, db)
  setup_transaction_middleware(app, db)
  app.cli.add_command(init_db_command)
  app.cli.add_command(seed_db_command)
