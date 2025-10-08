from sqlalchemy import Integer, String, Text, ForeignKey, TIMESTAMP, Table, Column, func
from sqlalchemy.sql import exists, and_, desc
from sqlalchemy.orm import relationship, mapped_column, object_session, deferred
from sqlalchemy.ext.hybrid import hybrid_method, hybrid_property

from flaskr.db import db
from flaskr.utils import markdown_to_html, get_preview


post_likes = Table(
  'post_likes',
  db.metadata,
  Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
  Column('post_id', Integer, ForeignKey('posts.id'), primary_key=True))


comment_likes = Table(
  'comment_likes',
  db.metadata,
  Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
  Column('comment_id', Integer, ForeignKey('comments.id'), primary_key=True))


class Post(db.Model):
  __tablename__ = 'posts'

  id = mapped_column(Integer, primary_key=True, autoincrement=True)
  created = mapped_column(TIMESTAMP, server_default=func.current_timestamp(), nullable=False)
  title = mapped_column(String, nullable=False)
  excerpt = mapped_column(Text, nullable=True)
  author_id = mapped_column(Integer, ForeignKey('users.id'), nullable=False)
  like_count = mapped_column(Integer, default=0, nullable=False)

  body = deferred(mapped_column(Text, nullable=False))
  body_html = deferred(mapped_column(Text, nullable=True))

  author = relationship('User', back_populates='posts')
  liked_by = relationship('User', secondary=post_likes, back_populates='liked_posts', cascade='all, delete')
  comments = relationship('Comment', back_populates='post', cascade='all, delete')

  def __init__(self, title=None, author_id=None, body=None, excerpt=None):
    self.title = title
    self.author_id = author_id
    self.body = body
    self.excerpt = excerpt
    self.body_html = None

  def __repr__(self):
    return f'Post(id={self.id!r}, title={self.title!r}, author_id={self.author_id!r})'

  @hybrid_property
  def html(self):
    if self.body_html is None and self.body:
      self.body_html = markdown_to_html(self.body)
    return self.body_html or ''

  def preview(self, max_length=200):
    if self.excerpt:
      if len(self.excerpt) <= max_length:
        return self.excerpt
      else:
        truncated = self.excerpt[:max_length]
        last_space = truncated.rfind(' ')
        if last_space > max_length * 0.8:
          return truncated[:last_space] + '...'
        else:
          return truncated + '...'
    else:
      html_content = self.html
      return get_preview(html_content, max_length)

  @hybrid_method
  def is_liked_by(self, user):
    session = object_session(self)
    return session.query(post_likes).filter(
      and_(
        post_likes.c.user_id == user.id,
        post_likes.c.post_id == self.id
      )).count() > 0

  @is_liked_by.expression
  def is_liked_by(cls, user):
    return exists().where(
      and_(
        post_likes.user_id == user.id,
        post_likes.post_id == cls.id))


class Comment(db.Model):
  __tablename__ = 'comments'

  id = mapped_column(Integer, primary_key=True, autoincrement=True)
  created = mapped_column(TIMESTAMP, server_default=func.current_timestamp(), nullable=False)
  author_id = mapped_column(Integer, ForeignKey('users.id'), nullable=False)
  post_id = mapped_column(Integer, ForeignKey('posts.id'), nullable=False)
  comment_id = mapped_column(Integer, ForeignKey('comments.id'))

  content = deferred(mapped_column(Text, nullable=False))

  author = relationship('User', back_populates='comments')
  post = relationship('Post', back_populates='comments')
  reply_to = relationship('Comment', remote_side=[id], back_populates='replies')
  replies = relationship('Comment', back_populates='reply_to', cascade='all, delete')

  def __init__(self, author_id=None, post_id=None, content=None, comment_id=None):
    self.author_id = author_id
    self.post_id = post_id
    self.content = content
    self.comment_id = comment_id

  def __repr__(self):
    return f'Comment(id={self.id!r}, author_id={self.author_id!r}, post_id={self.post_id!r})'


class User(db.Model):
  __tablename__ = 'users'

  id = mapped_column(Integer, primary_key=True, autoincrement=True)
  username = mapped_column(String, unique=True, nullable=False)
  password = mapped_column(String, nullable=False)
  posts = relationship('Post', back_populates='author', cascade='all, delete')
  comments = relationship('Comment', back_populates='author', cascade='all, delete')
  liked_posts = relationship('Post',
                             secondary=post_likes,
                             back_populates='liked_by',
                             cascade='all, delete',
                             order_by=[desc(Post.created), Post.id])

  def __init__(self, username=None, password=None):
    self.username = username
    self.password = password

  def __repr__(self) -> str:
    return f'User(id={self.id!r}, username={self.username!r})'

  @hybrid_method
  def like_post(self, post):
    session = object_session(self)
    self.liked_posts.append(post)
    post.like_count += 1
    session.commit()

  @like_post.expression
  def like_post(cls, post):
    return post_likes.insert().values(user_id=cls.id, post_id=post.id)

  @hybrid_method
  def unlike_post(self, post):
    session = object_session(self)
    self.liked_posts.remove(post)
    post.like_count -= 1
    session.commit()

  @unlike_post.expression
  def unlike_post(cls, post):
    return post_likes.delete().where(
      and_(
        post_likes.c.user_id == cls.id,
        post_likes.c.post_id == post.id))

  @hybrid_method
  def likes_post(self, post):
    session = object_session(self)
    return session.query(post_likes).filter(
      and_(
        post_likes.c.user_id == self.id,
        post_likes.c.post_id == post.id
      )).count() > 0

  @likes_post.expression
  def likes_post(cls, post):
    return exists().where(
      and_(
        post_likes.user_id == cls.id,
        post_likes.post_id == post.id))
