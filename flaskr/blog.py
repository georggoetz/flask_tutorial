from flask import Blueprint, g, request, flash, redirect, render_template, url_for
from werkzeug.exceptions import abort
from flaskr.auth import login_required
from flaskr.models import Post, Content

bp = Blueprint('blog', __name__)


@bp.route('/', methods=('GET',))
@bp.route('/<int:id>', methods=('GET',))
def index(id=None):
  if id is None:
    posts = g.db_session.query(Post).all()
    return render_template('blog/index.html', posts=posts)

  post = get_post(id, check_author=False)
  return render_template('blog/post.html', post=post)


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
      new_post = Post(title, g.user['id'])
      g.db_session.add(new_post)
      g.db_session.commit()

      new_content = Content(body, new_post.id)
      g.db_session.add(new_content)
      g.db_session.commit()

      return redirect(url_for('blog.index'))

  return render_template('blog/create.html')


def get_post(id, check_author=True):
  post = g.db_session.query(Post).get(id)

  if post is None:
    abort(404, f"Post id {id} doesn't exist.")

  if check_author and post.author_id != g.user['id']:
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

      return redirect(url_for('blog.index'))

  return render_template('blog/update.html', post=post)


@bp.route('/<int:id>/delete', methods=('POST',))
@login_required
def delete(id):
  post = get_post(id)

  g.db_session.delete(post)
  g.db_session.commit()

  return redirect(url_for('blog.index'))


def init_app(app):
  app.register_blueprint(bp)
  app.add_url_rule('/', endpoint='index')
