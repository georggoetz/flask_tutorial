from sqlalchemy import Integer, String, Text, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import relationship, mapped_column, Mapped
from flaskr.db import db


class User(db.Model):
  __tablename__ = 'users'

  id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
  username: Mapped[str] = mapped_column(String, unique=True, nullable=False)
  password: Mapped[str] = mapped_column(String, nullable=False)
  posts: Mapped[list['Post']] = relationship('Post', back_populates='author')

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
  author: Mapped["User"] = relationship('User', back_populates='posts')
  content: Mapped["Content"] = relationship('Content', back_populates='post', cascade='all, delete')

  def __init__(self, title: None, author_id: None):
    self.title = title
    self.author_id = author_id

  def __repr__(self):
    return f'Post(id={self.id!r}, title={self.title!r}, author_id={self.author_id!r})'


class Content(db.Model):
  __tablename__ = 'content'

  id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
  body: Mapped[str] = mapped_column(Text, nullable=False)
  post_id: Mapped[int] = mapped_column(Integer, ForeignKey('posts.id'), nullable=False)
  post: Mapped["Post"] = relationship('Post', back_populates='content')

  def __init__(self, body: None, post_id: None):
    self.body = body
    self.post_id = post_id

  def __repr__(self):
    return f'Content(id={self.id!r}, post_id={self.post_id!r})'
