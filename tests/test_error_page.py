def test_error_page_shown(client):
    response = client.get('/not-existing-url')
    assert response.status_code == 404
    assert b'class="card error-card"' in response.data
    assert b'Not Found' in response.data
