from flask import Blueprint, Response, g, request, flash, render_template, url_for
from werkzeug.exceptions import abort
from flaskr.auth import login_required
from flaskr.models import Post, Comment, Content
from sqlalchemy.sql import desc
from .utils import safe_redirect

bp = Blueprint('blog', __name__)


POSTS_PER_PAGE = 5


@bp.route('/', methods=('GET',))
@bp.route('/<int:id>', methods=('GET',))
def index(id=None):
  if id is None:
    return safe_redirect(url_for('blog.page', page=1))
  post = get_post(id, check_author=False)
  return render_template('blog/post.jinja2', post=post, request=request)


@bp.route('/page/<int:page>', methods=('GET',))
def page(page):
  posts_query = g.db_session.query(Post).order_by(desc(Post.created), Post.id)
  total_posts = posts_query.count()
  posts = posts_query.offset((page - 1) * POSTS_PER_PAGE).limit(POSTS_PER_PAGE).all()
  total_pages = (total_posts + POSTS_PER_PAGE - 1) // POSTS_PER_PAGE
  return render_template(
    'blog/index.jinja2',
    posts=posts,
    request=request,
    page=page,
    total_pages=total_pages
  )


@bp.route('/<int:post_id>/comments/<int:page>', methods=('GET',))
def comments(post_id, page=1):
  pass


@bp.route('/create', methods=('GET', 'POST'))
@login_required
def create():
  if request.method == 'POST':
    title = request.form['title']
    body = request.form['body']
    error = None

    if not title:
      error = 'Title is required.'

    if error is not None:
      flash(error)
    else:
      g.db_session.add(Post(title, g.user.id, body))
      g.db_session.commit()

      return safe_redirect(url_for('blog.index'))

  return render_template('blog/create.jinja2')


@bp.route('/<int:post_id>/comment/create', methods=('GET', 'POST'))
@login_required
def create_comment(post_id):
  post = get_post(post_id, check_author=False)

  if request.method == 'POST':
    body = request.form['body']
    error = None

    if not body:
      error = 'Comment body is required.'

    if error is not None:
      flash(error)
    else:
      content = Content(body=body)
      comment = Comment(author_id=g.user.id, post_id=post_id, content=content)
      g.db_session.add(comment)
      g.db_session.commit()

      if request.form.get('ajax') == '1':
        html = render_template('components/comment.jinja2', comment=comment)
        return Response(html, content_type='text/html')

      return safe_redirect(url_for('blog.index', id=post_id))

  return render_template('components/create_comment.jinja2', post=post)


def get_post(id, check_author=True):
  post = g.db_session.get(Post, id)

  if post is None:
    abort(404, f"Post id {id} doesn't exist.")

  if check_author and post.author_id != g.user.id:
    abort(403)

  return post


@bp.route('/<int:id>/update', methods=('GET', 'POST'))
@login_required
def update(id):
  post = get_post(id)

  if request.method == 'POST':
    title = request.form['title']
    body = request.form['body']
    error = None

    if not title:
      error = 'Title is required.'

    if error is not None:
      flash(error)
    else:
      post.title = title
      post.content.body = body

      post.verified = True
      g.db_session.commit()

      return safe_redirect(url_for('blog.index'))

  return render_template('blog/update.jinja2', post=post)


@bp.route('/<int:id>/delete', methods=('POST',))
@login_required
def delete(id):
  post = get_post(id)

  g.db_session.delete(post)
  g.db_session.commit()

  return safe_redirect(url_for('blog.index'))


def init_app(app):
  app.register_blueprint(bp)
  app.add_url_rule('/', endpoint='index')
