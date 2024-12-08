from flask import Blueprint, g, request, flash, redirect, render_template, url_for, jsonify
from werkzeug.exceptions import abort
from flaskr.auth import login_required
from flaskr.models import Post, Content, post_likes

bp = Blueprint('blog', __name__)


@bp.route('/', methods=('GET',))
@bp.route('/<int:id>', methods=('GET',))
def index(id=None):
  if id is None:
    posts = g.db_session.query(Post).all()
    return render_template('blog/index.html', posts=posts)

  post = get_post(id, check_author=False)
  return render_template('blog/post.html', post=post, is_liked=is_liked_by_current_user(post))


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
      new_post = Post(title, g.user.id)
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

      return redirect(url_for('blog.index'))

  return render_template('blog/update.html', post=post)


@bp.route('/<int:id>/delete', methods=('POST',))
@login_required
def delete(id):
  post = get_post(id)

  g.db_session.delete(post)
  g.db_session.commit()

  return redirect(url_for('blog.index'))


@bp.route('/<int:id>/like', methods=('POST', 'DELETE',))
@login_required
def like(id):
  post = get_post(id, check_author=False)

  if post is None:
    abort(404)

  if g.user.id == post.author.id:
    abort(400, 'You cannot like your own posts!')

  if request.method == 'POST':
    exists = g.db_session.query(post_likes).filter_by(user_id=g.user.id, post_id=post.id).first() is not None
    if exists:
      abort(400, 'You already liked that post!')

    g.user.liked_posts.append(post)
    post.like_count += 1

  elif request.method == 'DELETE':
    g.user.liked_posts.remove(post)
    post.like_count -= 1

  g.db_session.commit()

  return jsonify({
    'like_count': post.like_count,
    'liked': request.method == 'POST'
  })


def is_liked_by_current_user(post):
  return g.db_session.query(post_likes).filter_by(user_id=g.user.id, post_id=post.id).first() is not None


def init_app(app):
  app.register_blueprint(bp)
  app.add_url_rule('/', endpoint='index')
