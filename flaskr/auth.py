import functools

from flask import Blueprint, g, request, session, flash, redirect, render_template, url_for
from sqlalchemy.exc import IntegrityError
from werkzeug.security import check_password_hash, generate_password_hash
from flaskr.models import User

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
      except IntegrityError:
        g.db_session.rollback()
        error = f'User {username} is already registered!'
      else:
        flash(f'User {username} successfully registered!')
        return redirect(url_for('auth.login'))

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
      error = 'Incorrect username!'
    elif not check_password_hash(user.password, password):
      error = 'Incorrect password!'

    if error is None:
      session.clear()
      session['user_id'] = user.id
      next_page = request.args.get('next')
      return redirect(next_page or url_for('index'))

    flash(error)

  return render_template('auth/login.jinja2')


@bp.before_app_request
def load_logged_in_user():
  user_id = session.get('user_id')
  g.user = None if user_id is None else g.db_session.query(User).get(user_id)


@bp.teardown_app_request
def clear_logged_in_user(response):
  g.user = None
  return response


@bp.route('/logout')
def logout():
  session.clear()
  return redirect(url_for('index'))


def login_required(view):
  @functools.wraps(view)
  def wrapped_view(**kwargs):
    if g.user is None:
      return redirect(url_for('auth.login', next=request.url))

    return view(**kwargs)

  return wrapped_view


def init_app(app):
  app.register_blueprint(bp)
