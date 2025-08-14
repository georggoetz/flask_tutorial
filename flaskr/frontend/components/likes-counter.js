import cssText from '../scss/components/_likes.scss?raw'
import { adoptStyleSheet } from '../global/adopt-style-sheet.js'
import { get, post, del } from '../global/requests.js'
import { showToast } from './toast.js'

/**
 * Web component that displays and manages like counts and like state for posts.
 * Allows users to like/unlike posts and automatically updates counts from the server.
 * 
 * @example
 * <x-likes-counter liked="false" count="5" url="/api/blog/123/likes"></x-likes-counter>
 */
export default class LikesCounter extends HTMLElement {

  #button
  #counter
  #wrapper
  #isDOMCreated = false
  
  /**
   * Attributes to observe for changes
   * @type {string[]} 
   */
  static get observedAttributes() {
    return ['liked', 'count', 'url', 'disabled']
  }

  constructor() {
    super()

    this.attachShadow({ mode: 'open' })
  }

  /**
   * Called when the element is added to the DOM.
   * Sets up the component and starts listening for refresh events.
   */
  connectedCallback() {
    adoptStyleSheet(this.shadowRoot, cssText)
    this.#isDOMCreated = this.#createDOM()
    this.#updateDOM()
    
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
   * Gets whether the current user has liked this item.
   * @returns {boolean} True if liked, false otherwise
   */
  get isLiked() {
    return this.getAttribute('liked') === 'true'
  }

  /**
   * Sets the liked state and updates the display.
   * @param {boolean} val - Whether the item is liked
   */
  set isLiked(val) {
    this.setAttribute('liked', val ? 'true' : 'false')
  }

  /**
   * Gets the API URL for like operations.
   * @returns {string|null} The URL or null if not set
   */
  get url() {
    return this.getAttribute('url')
  }

  /**
   * Gets the current like count.
   * @returns {number} The like count (defaults to 0)
   */
  get count() {
    return parseInt(this.getAttribute('count'), 10) || 0
  }

  /**
   * Sets the like count and updates the display.
   * @param {number} val - The new like count
   */
  set count(val) {
    this.setAttribute('count', val.toString())
  }

  /**
   * Gets whether the like button is disabled.
   * @returns {boolean} True if disabled, false otherwise
   */
  get isDisabled() {
    return this.getAttribute('disabled') === 'true'
  }

  #createDOM() {
    this.#button = document.createElement('button')
    this.#button.type = 'button'
    this.#button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 -256 1850 1850">
        <g transform="matrix(1,0,0,-1,37.966102,1343.4237)">
            <path d="m 896,-128 q -26,0 -44,18 L 228,492 q -10,8 -27.5,26 Q 183,536 145,583.5 107,631 77,681 47,731 23.5,802 0,873 0,940 q 0,220 127,344 127,124 351,124 62,0 126.5,-21.5 64.5,-21.5 120,-58 55.5,-36.5 95.5,-68.5 40,-32 76,-68 36,36 76,68 40,32 95.5,68.5 55.5,36.5 120,58 64.5,21.5 126.5,21.5 224,0 351,-124 127,-124 127,-344 0,-221 -229,-450 L 940,-110 q -18,-18 -44,-18" fill="currentColor"/>
        </g>
      </svg>
    `
    this.#button.setAttribute('aria-label', 'Like')
    this.#button.setAttribute('role', 'button')
    this.#button.setAttribute('aria-pressed', this.isLiked)
    this.#button.classList.add('likes__button')
    this.#button.addEventListener('click', () => { this.#handleClick() })

    this.#counter = document.createElement('span')
    this.#counter.classList.add('likes__counter')
    this.#counter.setAttribute('aria-live', 'polite')

    this.#wrapper = document.createElement('div')
    this.#wrapper.classList.add('likes')

    this.#button.appendChild(this.#counter)
    this.#wrapper.appendChild(this.#button)

    this.shadowRoot.appendChild(this.#wrapper)

    return true
  }

  #updateDOM() {
    if (!this.#isDOMCreated) {
      return
    }

    this.#button.setAttribute('aria-pressed', this.isLiked)
    this.#button.setAttribute('aria-disabled', this.isDisabled ? 'true' : 'false')
    
    this.#counter.textContent = `${this.count}`
    this.#counter.classList.toggle('likes__counter--liked', this.isLiked)
    this.#counter.classList.toggle('likes__counter--disabled', this.isDisabled)

    this.#button.classList.toggle('likes__button--liked', this.isLiked)
    this.#button.classList.toggle('likes__button--disabled', this.isDisabled)
  }

  async #handleClick() {
    if (this.isDisabled) {
      return
    }
    try {
      const response = await (this.isLiked ? del(this.url) : post(this.url))
      this.isLiked = response.isLiked
      this.count = response.count
    } catch (error) {
      showToast(error.message || 'Error updating likes')
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
        this.isLiked = response.isLiked
      }
    } catch (error) {
      console.warn('Failed to refresh likes:', error.message)
    }
  }

  #handleRefresh = async() => {
    await this.#refresh()
  }
}

customElements.define('x-likes-counter', LikesCounter)
