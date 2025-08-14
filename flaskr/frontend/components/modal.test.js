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
    const modal = element.shadowRoot.querySelector('.modal')
    expect(modal.classList.contains('modal--open')).toBe(true)
    expect(modal.classList.contains('modal--hidden')).toBe(false)
  })

  it('hides modal when close() is called', () => {
    element.open()
    element.close()
    const modal = element.shadowRoot.querySelector('.modal')
    expect(modal.classList.contains('modal--open')).toBe(false)
    expect(modal.classList.contains('modal--hidden')).toBe(true)
  })

  it('closes when close button is clicked', () => {
    element.open()
    const closeBtn = element.shadowRoot.querySelector('.modal__close')
    closeBtn.click()
    const modal = element.shadowRoot.querySelector('.modal')
    expect(modal.classList.contains('modal--open')).toBe(false)
    expect(modal.classList.contains('modal--hidden')).toBe(true)
  })

  it('closes when backdrop is clicked', () => {
    element.open()
    const overlay = element.shadowRoot.querySelector('.modal-overlay')
    overlay.click()
    const modal = element.shadowRoot.querySelector('.modal')
    expect(modal.classList.contains('modal--open')).toBe(false)
    expect(modal.classList.contains('modal--hidden')).toBe(true)
  })

  it('closes when Escape is pressed', () => {
    element.open()
    const event = new KeyboardEvent('keydown', { key: 'Escape' })
    document.dispatchEvent(event)
    const modal = element.shadowRoot.querySelector('.modal')
    expect(modal.classList.contains('modal--open')).toBe(false)
    expect(modal.classList.contains('modal--hidden')).toBe(true)
  })
})
