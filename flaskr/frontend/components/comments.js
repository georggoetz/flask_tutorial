import { showToast } from './toast.js'
import { showModal } from './modal.js'
import { get, postForm } from '../global/requests.js'

export default class Comments extends HTMLElement {
  static observedAttributes = ['count', 'data-post-id']

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.createDOM()
    this.#refresh()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.updateDOM()
    }
  }

  set count(val) {
    this.setAttribute('count', val)
  }

  get count() {
    return parseInt(this.getAttribute('count')) || 0
  }

  createDOM() {
    this.shadowRoot.innerHTML = `<span class="comments__counter" aria-label="${this.count} comments">${this.count}</span>`
  }

  updateDOM() {
    const counter = this.shadowRoot.querySelector('.comments__counter')
    if (counter) {
      counter.textContent = this.count
    }
  }

  async #refresh() {
    const postId = this.getAttribute('data-post-id')
    if (!postId) {
      return
    }
    try {
      const response = await get(`/api/blog/${postId}/comments/count`)
      if (response.ok) {
        const data = await response.json()
        this.count = data.count
      }
    } catch (error) {
      showToast(error.message || 'Error fetching comment count')
    }
  }

  // Public method for forced refresh (bypassing any cache)
  async forceRefresh() {
    const postId = this.getAttribute('data-post-id')
    if (!postId) {
      return
    }
    try {
      // Force fresh data with cache busting
      const timestamp = Date.now()
      const response = await get(`/api/blog/${postId}/comments/count?t=${timestamp}`)
      if (response.ok) {
        const data = await response.json()
        this.count = data.count
      }
    } catch (error) {
      showToast(error.message || 'Error fetching comment count')
    }
  }
}

customElements.define('x-comments', Comments)

export function registerPostCommentModal() {
  document.body.addEventListener('click', async e => {
    const btn = e.target.closest('[data-post-comment]')
    if (btn) {
      e.preventDefault()
      const postId = btn.dataset.postId
      const html = await get(`/${postId}/comment/create`)
      const modal = showModal(html)
      const form = modal.querySelector('form')

      if (form) {
        form.addEventListener('submit', async ev => {
          ev.preventDefault()
          const formData = new FormData(form)
          try {
            const commentHtml = await postForm(form.action, formData)
            const commentsSection = document.querySelector('#comments')
            if (commentsSection) {
              commentsSection.insertAdjacentHTML('beforeend', commentHtml)
            }
            modal.close()
            const match = commentHtml.match(/id="comment-(\d+)"/)
            if (match) {
              const commentId = match[1]
              window.location.replace(`/${postId}#comment-${commentId}`)
            } else {
              window.location.replace(`/${postId}#comments`)
            }
          } catch (err) {
            showToast(err.message || 'Error submitting comment')
          }
        })
      }
    }
  })
}

export function registerScrollToComments() {
  window.addEventListener('load', () => {
    if (window.location.hash === '#comments') {
      const commentsSection = document.getElementById('comments')
      const navbar = document.querySelector('.nav-bar')
      const offset = navbar ? navbar.offsetHeight : 0
      if (commentsSection) {
        const top = commentsSection.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({ top, behavior: 'smooth' })
      }
    }
  })
}
