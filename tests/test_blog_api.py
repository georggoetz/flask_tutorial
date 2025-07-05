from flaskr.models import Post


def test_like_post(client, auth, db_session):
  auth.login(username='other')

  # Like post 1
  response = client.post('/api/blog/1/like')
  assert response.status_code == 200
  data = response.get_json()
  assert data['isLiked'] is True
  assert data['count'] == 1

  # Like again (should fail)
  response = client.post('/api/blog/1/like')
  assert response.status_code == 400
  assert b'already liked' in response.data

  # Unlike post
  response = client.delete('/api/blog/1/like')
  assert response.status_code == 200
  data = response.get_json()
  assert data['isLiked'] is False
  assert data['count'] == 0

  # Unlike again (should fail)
  response = client.delete('/api/blog/1/like')
  assert response.status_code == 400
  assert b'have not liked' in response.data

  auth.login()

  # Authors cannot like their own post
  response = client.post('/api/blog/1/like')
  assert response.status_code == 400
  assert b'cannot like your own' in response.data


def test_liked_by(client, auth, db_session):
  post = db_session.get(Post, 1)
  post.author_id = 2
  db_session.commit()

  auth.login()
  client.post('/api/blog/1/like')
  response = client.get('/api/blog/1/liked_by')
  assert response.status_code == 200
  data = response.get_json()
  assert 'test' in data['users']
