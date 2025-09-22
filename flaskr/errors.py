from flask import render_template

from flaskr.logger import log_warning, log_exception, log_error


def init_app(app):
  @app.errorhandler(404)
  def not_found(e):
    path = getattr(e, 'description', 'unknown')
    log_warning(f'404 Not Found for path: {path}')
    return render_template(
      'error.jinja2',
      error_code=404,
      error_name='Not Found',
      error_message='The page you requested does not exist.'
    ), 404

  @app.errorhandler(500)
  def internal_error(e):
    log_error(f'Internal server error: {e.description or str(e)}')
    return render_template(
      'error.jinja2',
      error_code=500,
      error_name='Internal Server Error',
      error_message='An unexpected error occurred.'
    ), 500

  @app.errorhandler(Exception)
  def handle_exception(e):
    code = getattr(e, 'code', 500)
    name = getattr(e, 'name', 'Error')
    message = str(e)

    log_exception(f'Unhandled exception ({name}): {message}')

    return render_template(
      'error.jinja2',
      error_code=code,
      error_name=name,
      error_message=message
    ), code
