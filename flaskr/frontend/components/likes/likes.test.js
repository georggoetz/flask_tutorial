import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import './likes.js'

describe('Likes Web Component', () => {
  let element

  beforeEach(() => {
    element = document.createElement('x-likes')
    document.body.appendChild(element)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('initializes with default attributes', () => {
    expect(element.isLiked).toBe(false)
    expect(element.count).toBe(0)
    expect(element.isDisabled).toBe(false)
  })

  it('reflects liked attribute', () => {
    element.isLiked = true
    expect(element.getAttribute('liked')).toBe('true')
    expect(element.isLiked).toBe(true)
  })

  it('updates count attribute', () => {
    element.count = 5
    expect(element.getAttribute('count')).toBe('5')
    expect(element.count).toBe(5)
    expect(element.shadowRoot.querySelector('.likes__counter').textContent).toBe('5')
  })

  it('toggles liked class on heart', () => {
    const heart = element.shadowRoot.querySelector('.likes__heart')
    expect(heart.classList.contains('likes__heart--liked')).toBe(false)
    element.isLiked = true
    element.updateDOM()
    expect(heart.classList.contains('likes__heart--liked')).toBe(true)
  })

  it('toggles disabled class on heart', () => {
    const heart = element.shadowRoot.querySelector('.likes__heart')
    expect(heart.classList.contains('likes__heart--disabled')).toBe(false)
    element.setAttribute('disabled', 'true')
    element.updateDOM()
    expect(heart.classList.contains('likes__heart--disabled')).toBe(true)
  })
})
