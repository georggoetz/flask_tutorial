from sqlalchemy import Integer, String, Text, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import relationship, mapped_column, Mapped
from flaskr.db import db


class User(db.Model):
  __tablename__ = 'users'

  id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
  username: Mapped[str] = mapped_column(String, unique=True, nullable=False)
  password: Mapped[str] = mapped_column(String, nullable=False)
  posts: Mapped[list['Post']] = relationship('Post', back_populates='author')
  likes: Mapped[list['Like']] = relationship('Like', back_populates='user')

  def __init__(self, username: None, password: None):
    self.username = username
    self.password = password

  def __repr__(self) -> str:
    return f'User(id={self.id!r}, username={self.username!r})'


class Post(db.Model):
  __tablename__ = 'posts'

  id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
  author_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), nullable=False)
  created: Mapped[TIMESTAMP] = mapped_column(TIMESTAMP, server_default=func.current_timestamp(), nullable=False)
  title: Mapped[str] = mapped_column(String, nullable=False)
  author: Mapped['User'] = relationship('User', back_populates='posts')
  content: Mapped['Content'] = relationship('Content', back_populates='post', cascade='all, delete')
  likes: Mapped[list['Like']] = relationship('Like', back_populates='post', cascade='all, delete')

  def __init__(self, title: None, author_id: None):
    self.title = title
    self.author_id = author_id

  def __repr__(self):
    return f'Post(id={self.id!r}, title={self.title!r}, author_id={self.author_id!r})'


class Content(db.Model):
  __tablename__ = 'content'

  post_id: Mapped[int] = mapped_column(Integer, ForeignKey('posts.id'), primary_key=True, nullable=False)
  post: Mapped['Post'] = relationship('Post', back_populates='content')
  body: Mapped[str] = mapped_column(Text, nullable=False)

  def __init__(self, body: None, post_id: None):
    self.body = body
    self.post_id = post_id

  def __repr__(self):
    return f'Content(id={self.id!r}, post_id={self.post_id!r})'


class Like(db.Model):
  __tablename__ = 'likes'
  __table_args__ = (db.PrimaryKeyConstraint('user_id', 'post_id'),)

  user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), nullable=False)
  post_id: Mapped[int] = mapped_column(Integer, ForeignKey('posts.id'), nullable=False)
  user: Mapped['User'] = relationship('User', back_populates='likes')
  post: Mapped['Post'] = relationship('Post', back_populates='likes')

  def __init__(self, user_id=None, post_id=None):
    self.user_id = user_id
    self.post_id = post_id

  def __repr__(self):
    return f'Like(user_id={self.user_id!r}, post_id={self.post_id!r})'
