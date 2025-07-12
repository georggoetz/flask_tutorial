from flask import render_template


def init_app(app):
    @app.errorhandler(404)
    def not_found(e):
        return render_template(
          'error.jinja2',
          error_code=404,
          error_name='Not Found',
          error_message='The page you requested does not exist.'
        ), 404

    @app.errorhandler(500)
    def internal_error(e):
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
        return render_template(
          'error.jinja2',
          error_code=code,
          error_name=name,
          error_message=message
        ), code
