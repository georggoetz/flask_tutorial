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
    this.button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 -256 1850 1850">
        <g transform="matrix(1,0,0,-1,37.966102,1343.4237)">
            <path d="m 896,-128 q -26,0 -44,18 L 228,492 q -10,8 -27.5,26 Q 183,536 145,583.5 107,631 77,681 47,731 23.5,802 0,873 0,940 q 0,220 127,344 127,124 351,124 62,0 126.5,-21.5 64.5,-21.5 120,-58 55.5,-36.5 95.5,-68.5 40,-32 76,-68 36,36 76,68 40,32 95.5,68.5 55.5,36.5 120,58 64.5,21.5 126.5,21.5 224,0 351,-124 127,-124 127,-344 0,-221 -229,-450 L 940,-110 q -18,-18 -44,-18" fill="currentColor"/>
        </g>
      </svg>
    `
    this.button.setAttribute('aria-label', 'Like')
    this.button.setAttribute('role', 'button')
    this.button.setAttribute('aria-pressed', this.isLiked)
    this.button.classList.add('likes__button')
    this.button.addEventListener('click', () => { this.handleClick() })

    this.counter = document.createElement('span')
    this.counter.classList.add('likes__counter')
    this.counter.setAttribute('aria-live', 'polite')

    this.wrapper = document.createElement('div')
    this.wrapper.classList.add('likes')

    this.button.appendChild(this.counter)
    this.wrapper.appendChild(this.button)

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

    this.button.classList.toggle('likes__button--liked', this.isLiked)
    this.button.classList.toggle('likes__button--disabled', this.isDisabled)
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
