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
  }

  createDOM() {
    this.shadowRoot.innerHTML = `
      <div class="toast">
        <slot></slot>
        <button class="toast__close" aria-label="Close">&times;</button>
      </div>
    `
    this.closeBtn = this.shadowRoot.querySelector('.toast__close')
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => {
        this.remove()
      })
    }
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
