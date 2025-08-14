import cssText from '../scss/components/_toast.scss?raw'
import { adoptStyleSheet } from '../global/adopt-style-sheet.js'

/**
 * Web component that displays toast notifications with automatic dismissal.
 * Provides a close button for manual dismissal and uses ARIA attributes for accessibility.
 * 
 * @example
 * <x-toast>Your message here</x-toast>
 */
export default class Toast extends HTMLElement {
  
  #closeBtn

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    adoptStyleSheet(this.shadowRoot, cssText)
    this.#createDOM()
    this.#closeBtn.addEventListener('click', this.#onClose)
  }

  disconnectedCallback() {
    this.#closeBtn.removeEventListener('click', this.#onClose)
  }

  #createDOM() {
    this.shadowRoot.innerHTML = `
      <div class="toast" role="status" aria-live="assertive" aria-atomic="true">
        <slot></slot>
        <button class="toast__close" aria-label="Close">&times;</button>
      </div>
    `
    this.#closeBtn = this.shadowRoot.querySelector('.toast__close')
  }

  #onClose = () => {
    this.remove()
  }
}

customElements.define('x-toast', Toast)

/**
 * Displays a toast notification message in the toast stack.
 * The toast automatically disappears after 5 seconds and can be manually closed.
 * 
 * @param {string} message - The message to display in the toast notification
 * 
 * @example
 * showToast('Operation completed successfully!')
 * showToast('Error: Something went wrong')
 */
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
