/**
 * Performs a GET request to the specified URL.
 * Automatically handles JSON and HTML responses.
 * 
 * @param {string} url - The URL to fetch data from
 * @param {object} [options={}] - Additional fetch options
 * @param {string} [options.responseType='json'] - Expected response type ('json' or 'html')
 * @returns {Promise<any>} The response data (parsed JSON or text)
 * @throws {Error} When the request fails or returns an error status
 * 
 * @example
 * // GET JSON data
 * const data = await get('/api/users')
 * 
 * // GET with custom options
 * const data = await get('/api/data', { responseType: 'html' })
 */
export async function get(url, options = {}) {
  const responseType = options.responseType || 'json'
  const response = await fetch(url, { method: 'GET', ...options })
  return handleResponse(response, responseType)
}

/**
 * Performs a POST request with JSON data to the specified URL.
 * Automatically includes CSRF token in headers for security.
 * 
 * @param {string} url - The URL to send data to
 * @param {object} [body={}] - The data to send in the request body (will be JSON stringified)
 * @param {object} [options={}] - Additional fetch options
 * @param {object} [options.headers={}] - Additional headers to include
 * @returns {Promise<any>} The response data (parsed JSON)
 * @throws {Error} When the request fails or returns an error status
 * 
 * @example
 * // POST JSON data
 * const result = await post('/api/users', { name: 'John', email: 'john@example.com' })
 * 
 * // POST with custom headers
 * const result = await post('/api/data', { value: 42 }, { 
 *   headers: { 'Custom-Header': 'value' } 
 * })
 */
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

/**
 * Performs a POST request with form data to the specified URL.
 * Automatically includes CSRF token if not already present in the form data.
 * 
 * @param {string} url - The URL to send the form data to
 * @param {FormData} formData - The form data to send
 * @param {object} [options={}] - Additional fetch options
 * @returns {Promise<any>} The response data (parsed JSON or text)
 * @throws {Error} When the request fails or returns an error status
 * 
 * @example
 * // POST form data
 * const formData = new FormData()
 * formData.append('name', 'John')
 * formData.append('file', fileInput.files[0])
 * const result = await postForm('/api/upload', formData)
 */
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


/**
 * Performs a DELETE request with optional JSON data to the specified URL.
 * Automatically includes CSRF token in headers for security.
 * 
 * @param {string} url - The URL to send the delete request to
 * @param {object} [body={}] - Optional data to send in the request body (will be JSON stringified)
 * @param {object} [options={}] - Additional fetch options
 * @param {object} [options.headers={}] - Additional headers to include
 * @returns {Promise<any>} The response data (parsed JSON or text)
 * @throws {Error} When the request fails or returns an error status
 * 
 * @example
 * // DELETE without body
 * await del('/api/users/123')
 * 
 * // DELETE with additional data
 * await del('/api/posts/456', { reason: 'spam' })
 */
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
