from flask import Blueprint, request, jsonify, g

from flaskr.auth import api_login_required
from flaskr.blog import get_post
from flaskr.models import Post
from flaskr.logger import log_user_action

bp = Blueprint('blog_api', __name__, url_prefix='/api/blog')


@bp.route('/<int:post_id>/like', methods=('GET', 'POST', 'DELETE',))
@api_login_required
def like(post_id):
  """
  Handle post likes
  ---
  tags:
    - Posts
  parameters:
    - name: post_id
      in: path
      type: integer
      required: true
      description: The post ID
  responses:
    200:
      description: Like status and count
      schema:
        type: object
        properties:
          count:
            type: integer
            description: Total like count
          isLiked:
            type: boolean
            description: Whether current user likes this post
    400:
      description: Bad request (cannot like own post or already liked)
      schema:
        type: object
        properties:
          error:
            type: string
    401:
      description: Authentication required
      schema:
        type: object
        properties:
          error:
            type: string
            example: "Authentication required to access this API endpoint."
    404:
      description: Post not found
      schema:
        type: object
        properties:
          error:
            type: string
  security:
    - BasicAuth: []
  """
  post = get_post(post_id, check_author=False)

  if post is None:
    return jsonify(error='Post not found!'), 404

  if request.method == 'GET':
    return jsonify({
      'count': post.like_count,
      'isLiked': g.user.likes_post(post)
    })

  if g.user.id == post.author.id:
    log_user_action(f'Failed to like own post: {post_id}',
                    user_id=g.user.id,
                    level='warning')
    return jsonify(error='You cannot like your own posts!'), 400

  if request.method == 'POST':
    if g.user.likes_post(post):
      return jsonify(error='You already liked that post!'), 400
    g.user.like_post(post)
    log_user_action(f'Post liked: {post_id}', user_id=g.user.id)

  elif request.method == 'DELETE':
    if not g.user.likes_post(post):
      return jsonify(error='You have not liked that post!'), 400
    g.user.unlike_post(post)
    log_user_action(f'Post unliked: {post_id}', user_id=g.user.id)

  g.db_session.commit()

  return jsonify({
    'count': post.like_count,
    'isLiked': request.method == 'POST'
  })


@bp.route('/<int:post_id>/liked_by', methods=('GET',))
@api_login_required
def liked_by(post_id):
  """
  Get users who liked a post
  ---
  tags:
    - Posts
  parameters:
    - name: post_id
      in: path
      type: integer
      required: true
      description: The post ID
  responses:
    200:
      description: List of users who liked the post
      schema:
        type: object
        properties:
          users:
            type: array
            items:
              type: string
            description: List of usernames
    401:
      description: Authentication required
      schema:
        type: object
        properties:
          error:
            type: string
            example: "Authentication required to access this API endpoint."
    404:
      description: Post not found
      schema:
        type: object
        properties:
          error:
            type: string
  security:
    - BasicAuth: []
  """
  post = get_post(post_id, check_author=False)
  return jsonify({
    'users': [user.username for user in post.liked_by]
  })


@bp.route('/<int:post_id>/comments/count', methods=['GET'])
def comments_count(post_id):
  """
  Get comment count for a post
  ---
  tags:
    - Posts
  parameters:
    - name: post_id
      in: path
      type: integer
      required: true
      description: The post ID
  responses:
    200:
      description: Comment count for the post
      schema:
        type: object
        properties:
          count:
            type: integer
            description: Number of comments
    404:
      description: Post not found
      schema:
        type: object
        properties:
          count:
            type: integer
            description: Returns 0 when post not found
  """
  post = g.db_session.get(Post, post_id)
  if not post:
    return jsonify({'count': 0}), 404
  return jsonify({'count': len(post.comments)})


def init_app(app):
  app.register_blueprint(bp)

  if hasattr(app, 'extensions') and 'csrf' in app.extensions:
    app.extensions['csrf'].exempt(bp)
