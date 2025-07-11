function getCsrfToken() {
  const meta = document.querySelector('meta[name="csrf-token"]')
  if (!meta) throw new Error('CSRF token not found in document')
  return meta.getAttribute('content')
}

async function handleResponse(response) {
  let data
  try {
    data = await response.json()
  } catch {
    data = await response.text()
  }
  if (!response.ok) {
    const errorMsg = data?.error || response.statusText || 'Unknown error'
    throw new Error(`${response.status}: ${errorMsg}`)
  }
  return data
}

export async function get(url, options = {}) {
  const response = await fetch(url, { method: 'GET', ...options })
  return handleResponse(response)
}

export async function post(url, body = {}, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  headers['X-CSRFToken'] = getCsrfToken();
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    ...options
  })
  return handleResponse(response)
}

export async function del(url, body = {}, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  headers['X-CSRFToken'] = getCsrfToken()
  const response = await fetch(url, {
    method: 'DELETE',
    headers,
    body: JSON.stringify(body),
    ...options
  })
  return handleResponse(response)
}
