from flaskr.models import Post, User


def test_like_post(client, db_session):
  with client:
    post = db_session.query(Post).filter(Post.id == 1).first()
    user = db_session.query(User).filter(User.id == 2).first()
    assert not post.is_liked_by(user)
    assert not user.likes_post(post)
    user.like_post(post)
    assert post.is_liked_by(user)
    assert user.likes_post(post)
    user.unlike_post(post)
    assert not post.is_liked_by(user)
    assert not user.likes_post(post)
