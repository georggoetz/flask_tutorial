import { showToast } from './toast.js'
import { showModal } from './modal.js'
import { get, postForm } from '../global/requests.js'
import { scrollToElement, getElementOffset } from '../global/scroll.js'

/**
 * Web component that displays and manages comment counts for posts.
 * Automatically fetches comment counts from the server and refreshes when needed.
 * 
 * @example
 * <x-comments-counter count="5" url="/api/blog/123/comments/count"></x-comments-counter>
 */
export default class CommentsCounter extends HTMLElement {
  
  /** @type {string[]} Attributes to observe for changes */
  static observedAttributes = ['count', 'url']

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  /**
   * Called when the element is added to the DOM.
   * Sets up the component and starts listening for refresh events.
   */
  connectedCallback() {
    this.#createDOM()
    this.#refresh()

    window.addEventListener('refresh-dynamic-content', this.#handleRefresh)
  }

  /**
   * Called when the element is removed from the DOM.
   * Cleans up event listeners to prevent memory leaks.
   */
  disconnectedCallback() {
    window.removeEventListener('refresh-dynamic-content', this.#handleRefresh)
  }

  /**
   * Called when observed attributes change.
   * @param {string} name - The name of the changed attribute
   * @param {string|null} oldValue - The previous value
   * @param {string|null} newValue - The new value
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.#updateDOM()
    }
  }

  /**
   * Gets the API URL for fetching comment count.
   * @returns {string|null} The URL or null if not set
   */
  get url() {
    return this.getAttribute('url')
  }

  /**
   * Sets the comment count and updates the display.
   * @param {number|string} val - The new comment count
   */
  set count(val) {
    this.setAttribute('count', val)
  }

  /**
   * Gets the current comment count.
   * @returns {number} The comment count (defaults to 0)
   */
  get count() {
    return parseInt(this.getAttribute('count')) || 0
  }

  #createDOM() {
    this.shadowRoot.innerHTML = `<span class="comments__counter" aria-label="${this.count} comments">${this.count}</span>`
  }

  #updateDOM() {
    const counter = this.shadowRoot.querySelector('.comments__counter')
    if (counter) {
      counter.textContent = this.count
      counter.setAttribute('aria-label', `${this.count} comments`)
    }
  }

  async #refresh() {
    if (!this.url) {
      return
    }
    try {
      const response = await get(this.url)
      if (response) {
        this.count = response.count
      }
    } catch (error) {
      showToast(error.message || 'Error fetching comment count')
    }
  }

  #handleRefresh = async() => {
    await this.#refresh()
  }
}

customElements.define('x-comments-counter', CommentsCounter)

/**
 * Registers global click handlers for opening comment modals.
 * Listens for clicks on elements with [data-comment-url] attribute.
 * 
 * @example
 * <button data-comment-url="/123/comment/create">Add Comment</button>
 */
export function registerPostCommentModal() {
  document.body.addEventListener('click', async(e) => {
    const btn = e.target.closest('[data-comment-url]')
    if (!btn) {
      return
    }
    
    e.preventDefault()
    const commentUrl = btn.dataset.commentUrl
    
    try {
      await openPostCommentModal(commentUrl)
    } catch (err) {
      showToast(err.message || 'Error opening comment form')
    }
  })
}

/**
 * Registers scroll behavior for deep links to the comments section.
 * Automatically scrolls to comments when URL contains #comments hash.
 */
export function registerScrollToCommentsSection() {
  window.addEventListener('load', () => {
    if (window.location.hash === '#comments') {
      scrollToElement('comments', { offset: getElementOffset('.nav-bar') })
    }
  })
}

async function handleSubmit(form) {
  const formData = new FormData(form)
  formData.append('ajax', '1')

  const commentHtml = await postForm(form.action, formData)

  const commentsSection = document.querySelector('#comments')
  if (commentsSection) {
    commentsSection.insertAdjacentHTML('beforeend', commentHtml)
  }

  const commentMatch = commentHtml.match(/id="comment-(\d+)"/)
  return commentMatch ? commentMatch[1] : null
}

function scrollToComment(commentId) {
  const targetId = commentId ? `comment-${commentId}` : 'comments'

  setTimeout(() => {
    scrollToElement(targetId, { offset: getElementOffset('nav-bar') })
  }, 100)
}

async function openPostCommentModal(commentUrl) {
  const html = await get(commentUrl)
  const modal = showModal(html)
  const form = modal.querySelector('form')

  if (form) {
    form.addEventListener('submit', async(ev) => {
      ev.preventDefault()
      
      const commentId = await handleSubmit(form)
      modal.close()
      scrollToComment(commentId)
    })
  }
}

if (!customElements.get('x-comments-counter')) {
  customElements.define('x-comments-counter', CommentsCounter)
}