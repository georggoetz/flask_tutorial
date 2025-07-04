
from flask import Blueprint, request, jsonify, g
from flaskr.auth import login_required
from flaskr.blog import get_post

bp = Blueprint('blog_api', __name__, url_prefix='/api/blog')


@bp.route('/<int:id>/like', methods=('POST', 'DELETE',))
@login_required
def like(id):
  post = get_post(id, check_author=False)

  if post is None:
    return jsonify(error='Post not found!'), 404

  if g.user.id == post.author.id:
    return jsonify(error='You cannot like your own posts!'), 400

  if request.method == 'POST':
    if g.user.likes_post(post):
      return jsonify(error='You already liked that post!'), 400
    g.user.like_post(post)

  elif request.method == 'DELETE':
    if not g.user.likes_post(post):
      return jsonify(error='You have not liked that post!'), 400
    g.user.unlike_post(post)

  g.db_session.commit()

  return jsonify({
    'count': post.like_count,
    'isLiked': request.method == 'POST'
  })


@bp.route('/<int:id>/liked_by', methods=('GET',))
@login_required
def liked_by(id):
  post = get_post(id, check_author=False)
  return jsonify({
    'users': [user.username for user in post.liked_by]
  })


def init_app(app):
    app.register_blueprint(bp)
