import cssText from '../scss/components/_toast.scss?raw'
import { adoptStyleSheet } from '../global/adopt-style-sheet.js'

export default class Toast extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    adoptStyleSheet(this.shadowRoot, cssText)
    this.createDOM()
    this.closeBtn.addEventListener('click', this.#onClose)
  }

  disconnectedCallback() {
    this.closeBtn.removeEventListener('click', this.#onClose)
  }

  createDOM() {
    this.shadowRoot.innerHTML = `
      <div class="toast" role="status" aria-live="assertive" aria-atomic="true">
        <slot></slot>
        <button class="toast__close" aria-label="Close">&times;</button>
      </div>
    `
    this.closeBtn = this.shadowRoot.querySelector('.toast__close')
  }

  #onClose = () => {
    this.remove()
  }
}

customElements.define('x-toast', Toast)

export function showToast(message) {
  const stack = document.querySelector('.toast-stack')
  if (!stack) {
    return
  }
  const toast = document.createElement('x-toast')
  toast.textContent = message
  stack.appendChild(toast)
  setTimeout(() => toast.remove(), 5000)
}
