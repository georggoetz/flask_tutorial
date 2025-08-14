from flask import Blueprint, request, jsonify, g
from flaskr.auth import login_required
from flaskr.blog import get_post
from flaskr.models import Post

bp = Blueprint('blog_api', __name__, url_prefix='/api/blog')


@bp.route('/<int:post_id>/like', methods=('GET', 'POST', 'DELETE',))
@login_required
def like(post_id):
  post = get_post(post_id, check_author=False)

  if post is None:
    return jsonify(error='Post not found!'), 404

  if request.method == 'GET':
    return jsonify({
      'count': post.like_count,
      'isLiked': g.user.likes_post(post)
    })

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


@bp.route('/<int:post_id>/liked_by', methods=('GET',))
@login_required
def liked_by(post_id):
  post = get_post(post_id, check_author=False)
  return jsonify({
    'users': [user.username for user in post.liked_by]
  })


@bp.route('/<int:post_id>/comments/count', methods=['GET'])
def comments_count(post_id):
    post = g.db_session.get(Post, post_id)
    if not post:
        return jsonify({'count': 0}), 404
    return jsonify({'count': len(post.comments)})


def init_app(app):
    app.register_blueprint(bp)
