from sqlalchemy import Integer, String, Text, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import relationship, mapped_column, Mapped
from flaskr.db import db


class User(db.Model):
  __tablename__ = 'users'

  id: Mapped[int] = mapped_column(
    Integer, primary_key=True, autoincrement=True)
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

  id: Mapped[int] = mapped_column(
    Integer, primary_key=True, autoincrement=True)
  author_id: Mapped[int] = mapped_column(
    Integer, ForeignKey('users.id'), nullable=False)
  created: Mapped[TIMESTAMP] = mapped_column(
    TIMESTAMP, server_default=func.current_timestamp(), nullable=False)
  title: Mapped[str] = mapped_column(String, nullable=False)
  body: Mapped[str] = mapped_column(Text, nullable=False)

  author: Mapped["User"] = relationship('User', back_populates='posts')

  def __init__(self, title: None, body: None, author_id: None):
    self.title = title
    self.body = body
    self.author_id = author_id

  def __repr__(self) -> str:
    return f'Post(id={self.id!r}, title={self.title!r}, author_id={self.author_id!r})'
