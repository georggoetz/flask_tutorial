import os
import pytest
import tempfile
from flaskr import create_app
from flaskr.db import init_db, db
from flaskr.models import User, Post
from werkzeug.security import generate_password_hash


@pytest.fixture
def app():
  db_fd, db_path = tempfile.mkstemp()

  app = create_app({
    'TESTING': True,
    'WTF_CSRF_ENABLED': False,
    'SQLALCHEMY_DATABASE_URI': 'sqlite:///' + db_path
  })

  with app.app_context():
    init_db()
    seed_db()

  yield app

  os.close(db_fd)
  os.unlink(db_path)


def seed_db():
  with db.session() as db_session:
    db_session.add(User(username='test', password=generate_password_hash('test')))
    db_session.add(User(username='other', password=generate_password_hash('test')))
    db_session.add(Post(title='test title', author_id=1, body='test\nbody'))
    db_session.commit()


@pytest.fixture
def client(app):
  return app.test_client()


@pytest.fixture
def runner(app):
  return app.test_cli_runner()


@pytest.fixture
def session(app):
  with app.app_context():
    yield db.session
    db.session.remove()


class AuthActions(object):
  def __init__(self, client):
    self._client = client

  def login(self, username='test', password='test'):
    return self._client.post('/auth/login', data={'username': username, 'password': password})

  def logout(self):
    return self._client.get('/auth/logout')


@pytest.fixture
def auth(client):
  return AuthActions(client)


@pytest.fixture
def db_session(app):
  with app.app_context():
    yield db.session()
    db.session.remove()
