import pytest
from datetime import datetime
from flaskr.models import Post, post_likes
from sqlalchemy.sql import func


def test_index(client, auth):
  response = client.get('/')
  assert b"Log In" in response.data
  assert b"Register" in response.data

  auth.login()
  response = client.get('/')
  assert b'Log Out' in response.data
  assert b'test title' in response.data
  assert f'by test on {datetime.today().strftime('%Y-%m-%d')}'.encode() in response.data
  assert b'href="/1/update"' in response.data

  response = client.get('/1')
  assert b'Log Out' in response.data
  assert b'test title' in response.data
  assert f'by test on {datetime.today().strftime('%Y-%m-%d')}'.encode() in response.data
  assert b'href="/1/update"' in response.data
  assert b'test\nbody' in response.data


@pytest.mark.parametrize('path', (
  '/create',
  '/1/update',
  '/1/delete',
))
def test_login_required(client, path):
  response = client.post(path)
  assert response.headers["Location"] == "/auth/login"


def test_author_required(app, client, auth, db_session):
  # change the post author to another user
  with app.app_context():
    post = db_session.query(Post).get(1)
    post.author_id = 2
    db_session.commit()

  auth.login()
  # current user can't modify other user's post
  assert client.post('/1/update').status_code == 403
  assert client.post('/1/delete').status_code == 403
  # current user doesn't see edit link
  assert b'href="/1/update"' not in client.get('/').data


@pytest.mark.parametrize('path', (
  '/2/update',
  '/2/delete',
))
def test_exists_required(client, auth, path):
  auth.login()
  assert client.post(path).status_code == 404


def test_create(client, auth, db_session):
  auth.login()
  assert client.get('/create').status_code == 200
  client.post('/create', data={'title': 'created', 'body': ''})

  count = db_session.query(func.count(Post.id)).scalar()
  assert count == 2


def test_update(client, auth, db_session):
  auth.login()
  assert client.get('/1/update').status_code == 200
  client.post('/1/update', data={'title': 'updated', 'body': 'updated'})

  post = db_session.query(Post).filter(Post.id == 1).first()
  assert post.title == 'updated'
  assert post.content.body == 'updated'


@pytest.mark.parametrize('path', (
  '/create',
  '/1/update',
))
def test_create_update_validate(client, auth, path):
  auth.login()
  response = client.post(path, data={'title': '', 'body': ''})
  assert b'Title is required.' in response.data


def test_delete(client, auth, db_session):
  auth.login()
  response = client.post('/1/delete')
  assert response.headers["Location"] == "/"

  post = db_session.query(Post).filter(Post.id == 1).first()
  assert post is None


def test_like_validate(client, auth):
  auth.login()
  # Cannot like post that does not exist
  assert client.post('/2/like').status_code == 404
  # Cannot like my own posts
  assert client.post('/1/like').status_code == 400
  auth.logout()
  auth.login(username='other', password='test')
  assert client.post('/1/like').status_code == 200
  # Cannot like the same post twice
  assert client.post('/1/like').status_code == 400


def test_like(client, auth, db_session):
  auth.login(username='other', password='test')
  assert client.post('/1/like').status_code == 200
  assert db_session.query(post_likes).filter_by(user_id=2, post_id=1).first() is not None
  assert client.delete('/1/like').status_code == 200
  assert db_session.query(post_likes).filter_by(user_id=2, post_id=1).first() is None
