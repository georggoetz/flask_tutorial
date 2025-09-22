import base64
import functools

from flask import Blueprint, g, request, session, flash, render_template, url_for, jsonify
from sqlalchemy.exc import IntegrityError
from werkzeug.security import check_password_hash, generate_password_hash

from flaskr.models import User
from flaskr.utils import safe_redirect
from flaskr.logger import log_user_action, log_exception

bp = Blueprint('auth', __name__, url_prefix='/auth')


@bp.route('/register', methods=('GET', 'POST'))
def register():
  if request.method == 'POST':
    username = request.form['username']
    password = request.form['password']
    error = None

    if not username:
      error = 'Username is required!'
    elif not password:
      error = 'Password is required!'

    if error is None:
      try:
        new_user = User(username=username,
                        password=generate_password_hash(password))
        g.db_session.add(new_user)
        g.db_session.commit()
      except IntegrityError as e:
        g.db_session.rollback()
        log_exception(f'User registration: Database constraint failed - {e}')
        log_user_action(f'Registration failed: Username already exists: {username}', level='warning')
        error = f'User {username} is already registered!'
      else:
        log_user_action(f'User registered: {username}', user_id=new_user.id)
        flash(f'User {username} successfully registered!')
        return safe_redirect(url_for('auth.login'))

    flash(error)

  return render_template('auth/register.jinja2')


@bp.route('/login', methods=('GET', 'POST'))
def login():
  if request.method == 'POST':
    username = request.form['username']
    password = request.form['password']
    error = None

    user = g.db_session.query(User).filter(
      User.username == username).first()

    if user is None:
      log_user_action(f'Failed login attempt: Unknown username: {username}, IP: {request.remote_addr}',
                      level='warning')
      error = 'Incorrect username!'
    elif not check_password_hash(user.password, password):
      log_user_action(f'Failed login attempt: Incorrect password, IP: {request.remote_addr}',
                      user_id=user.id,
                      level='warning')
      error = 'Incorrect password!'

    if error is None:
      session.clear()
      session['user_id'] = user.id
      log_user_action(f'Successful login: {username}', user_id=user.id)
      next_page = request.args.get('next')

      if next_page is None:
        next_page = url_for('index')

      return safe_redirect(next_page)

    flash(error)

  return render_template('auth/login.jinja2')


@bp.before_app_request
def load_logged_in_user():
  user_id = session.get('user_id')

  if user_id is None:
    g.user = basic_auth()
  else:
    g.user = g.db_session.get(User, user_id)


def basic_auth():
  auth_header = request.headers.get('Authorization')
  if not auth_header or not auth_header.startswith('Basic '):
    return None

  try:
    credentials = base64.b64decode(auth_header[6:]).decode('utf-8')
    username, password = credentials.split(':', 1)

    user = g.db_session.query(User).filter(User.username == username).first()
    if user and check_password_hash(user.password, password):
      log_user_action(f'Basic auth login: {username}', user_id=user.id)
      session['user_id'] = user.id
      return user
    else:
      log_user_action(f'Basic auth failed: {username}, IP: {request.remote_addr}',
                      level='warning')

  except (ValueError, UnicodeDecodeError, AttributeError) as e:
    log_exception(f'Basic auth: Credential parsing failed - {e}')
    log_user_action(f'Basic auth error: Malformed credentials, IP: {request.remote_addr}',
                    level='warning')

  return None


@bp.teardown_app_request
def clear_logged_in_user(response):
  g.user = None
  return response


@bp.route('/logout')
def logout():
  if g.user:
    log_user_action('User logout', user_id=g.user.id)
  session.clear()
  return safe_redirect(url_for('index'))


@bp.route('/swagger-oauth')
def swagger_oauth():
  if g.user:
    return safe_redirect('/apidocs/#/')
  else:
    return safe_redirect(url_for('auth.login', next=url_for('auth.swagger_oauth')))


def login_required(view):
  @functools.wraps(view)
  def wrapped_view(**kwargs):
    if g.user is None:
      return safe_redirect(url_for('auth.login', next=request.url))

    return view(**kwargs)

  return wrapped_view


def api_login_required(view):
  @functools.wraps(view)
  def wrapped_view(**kwargs):
    if g.user is None:
      log_user_action(f'API access denied: {request.endpoint}, IP: {request.remote_addr}',
                      level='warning')
      return jsonify(error='Authentication required to access this API endpoint.'), 401

    return view(**kwargs)

  return wrapped_view


def init_app(app):
  app.register_blueprint(bp)
