import os
from flask import Blueprint, send_from_directory, current_app, request

bp = Blueprint('static_assets', __name__)


@bp.route('/static/dist/<path:filename>')
def serve_compressed_dist(filename):
    """Serve compressed static files if available and accepted by client."""
    dist_path = os.path.join(current_app.static_folder, 'dist')
    gz_path = os.path.join(dist_path, filename + '.gz')

    # Use compression if client supports it and .gz file exists
    accepts_gzip = 'gzip' in request.headers.get('Accept-Encoding', '')

    if accepts_gzip and os.path.exists(gz_path):
        response = send_from_directory(dist_path, filename + '.gz')
        response.headers['Content-Encoding'] = 'gzip'
        response.headers['Vary'] = 'Accept-Encoding'
        # Set correct content type
        if filename.endswith('.js'):
            response.headers['Content-Type'] = 'application/javascript'
        elif filename.endswith('.css'):
            response.headers['Content-Type'] = 'text/css'
        return response

    # Fallback to original file
    return send_from_directory(dist_path, filename)


def init_app(app):
    """Initialize static assets blueprint."""
    app.register_blueprint(bp)
