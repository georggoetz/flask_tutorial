import cssText from '../scss/components/_modal.scss?raw'
import { adoptStyleSheet } from '../global/adopt-style-sheet.js'

/**
 * Web component that displays modal dialogs with overlay background.
 * Supports keyboard navigation (Escape to close) and click outside to close.
 * 
 * @example
 * <x-modal>
 *   <h2>Modal Title</h2>
 *   <p>Modal content goes here</p>
 * </x-modal>
 */
export default class Modal extends HTMLElement {
  
  #closeBtn
  #modal
  #overlay
  
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    adoptStyleSheet(this.shadowRoot, cssText)
    this.#createDOM()
    this.#closeBtn.addEventListener('click', this.#onClose)
    this.shadowRoot.addEventListener('click', this.#onBackdrop)
    document.addEventListener('keydown', this.#onEscape)
    this.setAttribute('tabindex', '-1')
    this.focus()
  }

  disconnectedCallback() {
    this.#closeBtn.removeEventListener('click', this.#onClose)
    this.shadowRoot.removeEventListener('click', this.#onBackdrop)
    document.removeEventListener('keydown', this.#onEscape)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.#updateDOM()
    }
  }

  /**
   * Opens the modal and makes it visible to the user.
   * Focuses the modal for accessibility.
   */
  open() {
    this.#modal.classList.add('modal--open')
    this.#modal.classList.remove('modal--hidden')
    this.focus()
  }

  /**
   * Closes the modal and hides it from view.
   * Dispatches a 'close' event that can be listened to.
   */
  close() {
    this.#modal.classList.remove('modal--open')
    this.#modal.classList.add('modal--hidden')
    this.dispatchEvent(new CustomEvent('close', { bubbles: true }))
  }

  /**
   * Checks if the modal is currently open.
   * @returns {boolean} True if the modal is open, false otherwise
   */
  isOpen() {
    return this.#modal.classList.contains('modal--open')
  }

  #createDOM() {
    this.shadowRoot.innerHTML = `
      <div class="modal-overlay">
        <div class="modal modal--hidden" role="dialog" aria-modal="true">
          <button class="modal__close" aria-label="Close">&times;</button>
          <slot></slot>
        </div>
      </div>
    `
    this.#modal = this.shadowRoot.querySelector('.modal')
    this.#closeBtn = this.shadowRoot.querySelector('.modal__close')
    this.#overlay = this.shadowRoot.querySelector('.modal-overlay')
  }

  #updateDOM() {
  }

  #onClose = (e) => {
    e.stopPropagation()
    this.close()
  }

  #onBackdrop = (e) => {
    if (e.target === this.#overlay) {
      this.close()
    }
  }

  #onEscape = (e) => {
    if (e.key === 'Escape') {
      this.close()
    }
  }
}

customElements.define('x-modal', Modal)

/**
 * Creates and displays a modal dialog with the provided content.
 * The modal is automatically added to the document body and removed when closed.
 * 
 * @param {string|Node} content - The content to display in the modal.
 *                                Can be an HTML string or a DOM Node.
 * @returns {Modal} The created modal element
 * 
 * @example
 * // With HTML string
 * showModal('<h2>Title</h2><p>Content</p>')
 * 
 * // With DOM element
 * const div = document.createElement('div')
 * div.textContent = 'Hello World'
 * showModal(div)
 */
export function showModal(content) {
  const modal = document.createElement('x-modal')
  if (typeof content === 'string') {
    const fragment = document.createRange().createContextualFragment(content)
    modal.appendChild(fragment)
  } else if (content instanceof Node) {
    modal.appendChild(content)
  }
  document.body.appendChild(modal)
  modal.open()
  modal.addEventListener('close', () => modal.remove())
  return modal
}
