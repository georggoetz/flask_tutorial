import cssText from '../scss/components/_modal.scss?raw'
import { adoptStyleSheet } from '../global/adopt-style-sheet.js'

export default class Modal extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    adoptStyleSheet(this.shadowRoot, cssText)
    this.createDOM()
    this.closeBtn.addEventListener('click', this.#onClose)
    this.shadowRoot.addEventListener('click', this.#onBackdrop)
    document.addEventListener('keydown', this.#onEscape)
    this.setAttribute('tabindex', '-1')
    this.focus()
  }

  disconnectedCallback() {
    this.closeBtn.removeEventListener('click', this.#onClose)
    this.shadowRoot.removeEventListener('click', this.#onBackdrop)
    document.removeEventListener('keydown', this.#onEscape)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.updateDOM()
    }
  }

  createDOM() {
    this.shadowRoot.innerHTML = `
      <div class="modal-overlay">
        <div class="modal" role="dialog" aria-modal="true">
          <button class="modal__close" aria-label="Close">&times;</button>
          <slot></slot>
        </div>
      </div>
    `
    this.modal = this.shadowRoot.querySelector('.modal')
    this.closeBtn = this.shadowRoot.querySelector('.modal__close')
    this.overlay = this.shadowRoot.querySelector('.modal-overlay')
  }

  updateDOM() {
  }

  open() {
    this.modal.setAttribute('open', '')
    this.focus()
  }

  close() {
    this.modal.removeAttribute('open')
    this.dispatchEvent(new CustomEvent('close', { bubbles: true }))
  }

  #onClose = (e) => {
    e.stopPropagation()
    this.close()
  }

  #onBackdrop = (e) => {
    if (e.target === this.overlay) {
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

export function showModal(content) {
  const modal = document.createElement('x-modal')
  if (typeof content === 'string') {
    const frag = document.createRange().createContextualFragment(content)
    modal.appendChild(frag)
  } else if (content instanceof Node) {
    modal.appendChild(content)
  }
  document.body.appendChild(modal)
  modal.open()
  modal.addEventListener('close', () => modal.remove())
  return modal
}
