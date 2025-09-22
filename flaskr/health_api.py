from flask import Blueprint

from flaskr import db
from flaskr.logger import log_info, log_exception

bp = Blueprint('health', __name__)


@bp.route('/health')
def health_check():
  """
  Health check endpoint for monitoring and load balancers.

  Returns:
    - 200: Service is healthy
    - 500: Service has issues
  """
  health_status = {
    'status': 'healthy',
    'checks': {}
  }

  is_healthy = True

  try:
    db.get_db().execute('SELECT 1').fetchone()
    health_status['checks']['database'] = 'connected'
    log_info('Health check: Database connection successful')
  except Exception as e:
    health_status['checks']['database'] = 'disconnected'
    health_status['status'] = 'unhealthy'
    is_healthy = False
    log_exception(f'Health check: Database connection failed - {e}')

  return (health_status, 200) if is_healthy else (health_status, 500)


def init_app(app):
  app.register_blueprint(bp)
