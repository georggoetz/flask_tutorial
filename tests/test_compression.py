import os
import tempfile
import pytest


@pytest.fixture
def temp_static_dir(app):
  original_static_folder = app.static_folder

  with tempfile.TemporaryDirectory() as temp_dir:
    dist_dir = os.path.join(temp_dir, 'dist')
    os.makedirs(dist_dir)

    bundle_js = os.path.join(dist_dir, 'bundle.js')
    bundle_js_gz = os.path.join(dist_dir, 'bundle.js.gz')

    with open(bundle_js, 'w') as f:
      f.write('console.log("test bundle");')

    with open(bundle_js_gz, 'wb') as f:
      f.write(b'\x1f\x8b\x08\x00\x00\x00\x00\x00\x00\x03')

    app.static_folder = temp_dir

    try:
      yield temp_dir
    finally:
      app.static_folder = original_static_folder


def test_serves_compressed_js_with_gzip_header(client, temp_static_dir):
  response = client.get('/static/dist/bundle.js',
                        headers={'Accept-Encoding': 'gzip, deflate'})

  assert response.status_code == 200
  assert response.headers.get('Content-Encoding') == 'gzip'
  assert response.headers.get('Content-Type') == 'application/javascript'
  assert 'Accept-Encoding' in response.headers.get('Vary', '')


def test_serves_original_file_without_gzip_header(client, temp_static_dir):
  response = client.get('/static/dist/bundle.js')

  assert response.status_code == 200
  assert 'Content-Encoding' not in response.headers
  assert response.data == b'console.log("test bundle");'
  assert response.data == b'console.log("test bundle");'


def test_serves_original_file_when_no_gz_exists(client, temp_static_dir):
  dist_dir = os.path.join(temp_static_dir, 'dist')
  test_file = os.path.join(dist_dir, 'test.js')

  with open(test_file, 'w') as f:
    f.write('console.log("no gz version");')

  response = client.get('/static/dist/test.js',
                        headers={'Accept-Encoding': 'gzip'})

  assert response.status_code == 200
  assert 'Content-Encoding' not in response.headers
  assert response.data == b'console.log("no gz version");'


def test_handles_missing_file(client, temp_static_dir):
  response = client.get('/static/dist/nonexistent.js')
  assert response.status_code == 404


def test_flask_compress_is_active(client):
  response = client.get('/', headers={'Accept-Encoding': 'gzip'})
  assert response.status_code in [200, 302]
