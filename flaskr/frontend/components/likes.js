import cssText from '../scss/components/_likes.scss?raw'
import { adoptStyleSheet } from '../global/adopt-style-sheet.js'
import {post, del} from '../global/requests.js'
import { showToast } from './toast.js'

export default class Likes extends HTMLElement {
  
  static get observedAttributes() {
    return ['liked', 'count', 'url', 'disabled']
  }

  constructor() {
    super()

    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    adoptStyleSheet(this.shadowRoot, cssText)
    this.isDOMCreated = this.createDOM()
    this.updateDOM()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.updateDOM()
    }
  }

  get isLiked() {
    return this.getAttribute('liked') === 'true'
  }

  set isLiked(val) {
    this.setAttribute('liked', val ? 'true' : 'false')
  }

  get url() {
    return this.getAttribute('url')
  }

  get count() {
    return parseInt(this.getAttribute('count'), 10) || 0
  }

  set count(val) {
    this.setAttribute('count', val.toString())
  }

  get isDisabled() {
    return this.getAttribute('disabled') === 'true'
  }

  createDOM() {
    this.button = document.createElement('button')
    this.button.type = 'button'
    this.button.innerHTML = '<span class="likes__heart"></span>'
    this.button.setAttribute('aria-pressed', this.isLiked)
    this.button.addEventListener('click', () => { this.handleClick() })

    this.counter = document.createElement('span')
    this.counter.classList.add('likes__counter')

    this.wrapper = document.createElement('div')
    this.wrapper.classList.add('likes')

    this.wrapper.appendChild(this.button)
    this.wrapper.appendChild(this.counter)

    this.shadowRoot.appendChild(this.wrapper)

    return true
  }

  updateDOM() {
    if (!this.isDOMCreated) {
      return
    }

    this.button.setAttribute('aria-pressed', this.isLiked)
    this.button.setAttribute('aria-disabled', this.isDisabled ? 'true' : 'false')
    
    this.counter.textContent = `${this.count}`
    this.counter.classList.toggle('likes__counter--liked', this.isLiked)
    this.counter.classList.toggle('likes__counter--disabled', this.isDisabled)

    const heart = this.button.querySelector('.likes__heart')
    if (heart) {
      heart.classList.toggle('likes__heart--liked', this.isLiked)
      heart.classList.toggle('likes__heart--disabled', this.isDisabled)
    }
  }

  async handleClick() {
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
}

customElements.define('x-likes', Likes)
