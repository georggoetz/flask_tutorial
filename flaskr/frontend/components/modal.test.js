import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import './modal.js'

describe('Modal Web Component', () => {
  let element

  beforeEach(() => {
    element = document.createElement('x-modal')
    document.body.appendChild(element)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('initializes with default DOM', () => {
    expect(element.shadowRoot.querySelector('.modal')).toBeTruthy()
    expect(element.shadowRoot.querySelector('.modal-overlay')).toBeTruthy()
    expect(element.shadowRoot.querySelector('.modal__close')).toBeTruthy()
  })

  it('shows modal when open() is called', () => {
    element.open()
    expect(element.modal.classList.contains('modal--open')).toBe(true)
    expect(element.modal.classList.contains('modal--hidden')).toBe(false)
  })

  it('hides modal when close() is called', () => {
    element.open()
    element.close()
    expect(element.modal.classList.contains('modal--open')).toBe(false)
    expect(element.modal.classList.contains('modal--hidden')).toBe(true)
  })

  it('closes when close button is clicked', () => {
    element.open()
    element.closeBtn.click()
    expect(element.modal.classList.contains('modal--open')).toBe(false)
    expect(element.modal.classList.contains('modal--hidden')).toBe(true)
  })

  it('closes when backdrop is clicked', () => {
    element.open()
    element.overlay.click()
    expect(element.modal.classList.contains('modal--open')).toBe(false)
    expect(element.modal.classList.contains('modal--hidden')).toBe(true)
  })

  it('closes when Escape is pressed', () => {
    element.open()
    const event = new KeyboardEvent('keydown', { key: 'Escape' })
    document.dispatchEvent(event)
    expect(element.modal.classList.contains('modal--open')).toBe(false)
    expect(element.modal.classList.contains('modal--hidden')).toBe(true)
  })
})
