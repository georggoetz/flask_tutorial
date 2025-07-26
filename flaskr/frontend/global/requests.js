function getCsrfToken() {
  const meta = document.querySelector('meta[name="csrf-token"]')
  if (!meta) {
    throw new Error('CSRF token not found in document')
  }
  return meta.getAttribute('content')
}

async function handleResponse(response) {
  let data
  const contentType = response.headers.get('Content-Type') || ''
  if (contentType.startsWith('application/json')) {
    data = await response.json()
  } else if (contentType.startsWith('text/html')) {
    data = await response.text()
  } else {
    throw new Error(`Unsupported response type: ${contentType}`)
  }
  if (!response.ok) {
    const errorMsg = data?.error || response.statusText || 'Unknown error'
    throw new Error(`${response.status}: ${errorMsg}`)
  }
  return data
}

export async function get(url, options = {}) {
  const responseType = options.responseType || 'json'
  const response = await fetch(url, { method: 'GET', ...options })
  return handleResponse(response, responseType)
}

export async function post(url, body = {}, options = {}) {
  const headers = { 
    'Content-Type': 'application/json', 
    'X-CSRFToken': `${getCsrfToken()}`, 
    ...options.headers 
  }
  
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    ...options
  })

  return handleResponse(response)
}

export async function postForm(url, formData, options = {}) {
  if (!formData.has('csrf_token')) {
    formData.append('csrf_token', getCsrfToken())
  }

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
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
