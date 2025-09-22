import logging
import sys
import os
import time
import uuid

from flask import request, current_app, g


SENSITIVE_FIELDS = {
  'password', 'passwd', 'pwd', 'secret', 'token', 'key', 'auth',
  'authorization', 'credentials', 'api_key', 'access_token',
  'refresh_token', 'session_id', 'csrf_token', 'private_key',
  'client_secret', 'auth_code', 'verification_code'
}


SENSITIVE_HEADERS = {
  'authorization', 'cookie', 'set-cookie', 'x-api-key', 'x-auth-token',
  'x-access-token', 'x-csrf-token', 'x-session-token'
}


def redact_sensitive_data(data_dict, sensitive_keys):
  if not data_dict:
    return {}

  redacted = {}
  for key, value in data_dict.items():
    if key.lower() in sensitive_keys:
      redacted[key] = '[REDACTED]'
    else:
      redacted[key] = value
  return redacted


def get_log_level():
  flask_env = os.getenv('FLASK_ENV', 'production')
  log_level_env = os.getenv('LOG_LEVEL', '').upper()

  if log_level_env in ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL']:
    return getattr(logging, log_level_env)

  if flask_env == 'development':
    return logging.DEBUG
  elif flask_env == 'testing':
    return logging.WARNING
  else:
    return logging.INFO


def init_app(app):
  log_level = get_log_level()

  logging.basicConfig(
    level=log_level,
    format='%(asctime)s %(levelname)s [%(name)s]: %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
    stream=sys.stdout
  )

  app.logger.setLevel(log_level)

  flask_env = os.getenv("FLASK_ENV", "production")
  log_level_name = logging.getLevelName(log_level)
  app.logger.info(f'Application: Starting up (ENV: {flask_env}, LOG_LEVEL: {log_level_name})')

  if flask_env != 'testing':
    @app.before_request
    def log_request():
      g.request_id = str(uuid.uuid4())[:8]
      g.request_start_time = time.time()

      log_msg = f'Request [{g.request_id}]: {request.method} {request.path} from {request.remote_addr}'

      user_agent = request.headers.get("User-Agent", "Unknown")
      log_msg += f' User-Agent: {user_agent}'

      if request.args:
        safe_params = redact_sensitive_data(dict(request.args), SENSITIVE_FIELDS)
        if safe_params:
          log_msg += f' Query: {safe_params}'

      if app.logger.level <= logging.DEBUG:
        safe_headers = redact_sensitive_data(dict(request.headers), SENSITIVE_HEADERS)
        log_msg += f' Headers: {safe_headers}'

      app.logger.info(log_msg)

    @app.after_request
    def log_response(response):
      request_id = getattr(g, 'request_id', 'unknown')
      duration = 0
      if hasattr(g, 'request_start_time'):
        duration = round((time.time() - g.request_start_time) * 1000, 2)

      app.logger.info(
        f'Response [{request_id}]: {request.method} {request.path} '
        f'Status: {response.status_code} '
        f'Size: {response.content_length or 0} bytes '
        f'Duration: {duration}ms'
      )
      return response


def log_user_action(action, user_id=None, level='info'):
  request_id = getattr(g, 'request_id', None)
  request_context = f' [{request_id}]' if request_id else ''

  if user_id:
    log_msg = f'User Action{request_context} (User ID: {user_id}): {action}'
  else:
    log_msg = f'User Action{request_context}: {action}'

  if level.lower() == 'warning':
    current_app.logger.warning(log_msg)
  elif level.lower() == 'error':
    current_app.logger.error(log_msg)
  else:
    current_app.logger.info(log_msg)


def get_request_id():
  """Get the current request ID for correlation purposes."""
  return getattr(g, 'request_id', None)


def log_info(message):
  request_id = get_request_id()
  request_context = f' [{request_id}]' if request_id else ''
  current_app.logger.info(f'{message}{request_context}')


def log_warning(message):
  request_id = get_request_id()
  request_context = f' [{request_id}]' if request_id else ''
  current_app.logger.warning(f'{message}{request_context}')


def log_error(message):
  request_id = get_request_id()
  request_context = f' [{request_id}]' if request_id else ''
  current_app.logger.error(f'{message}{request_context}')


def log_exception(error):
  request_id = get_request_id()
  request_context = f' [{request_id}]' if request_id else ''
  current_app.logger.exception(f'{error}{request_context}')
