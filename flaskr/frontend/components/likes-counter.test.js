import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import './likes-counter.js'

// Mock dependencies
vi.mock('../scss/components/_likes.scss?raw', () => ({
  default: '.likes { color: red; }'
}))

vi.mock('../global/adopt-style-sheet.js', () => ({
  adoptStyleSheet: vi.fn()
}))

vi.mock('../global/requests.js', () => ({
  get: vi.fn(),
  post: vi.fn(),
  del: vi.fn()
}))

vi.mock('./toast.js', () => ({
  showToast: vi.fn()
}))

describe('Likes Web Component', () => {
  let element

  beforeEach(() => {
    element = document.createElement('x-likes-counter')
    document.body.appendChild(element)
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  it('initializes with default attributes', () => {
    expect(element.isLiked).toBe(false)
    expect(element.count).toBe(0)
    expect(element.url).toBe(null)
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

  it('toggles liked class on button', () => {
    const heart = element.shadowRoot.querySelector('.likes__button')
    expect(heart.classList.contains('likes__button--liked')).toBe(false)
    element.isLiked = true
    expect(heart.classList.contains('likes__button--liked')).toBe(true)
  })

  it('toggles disabled class on button', () => {
    const heart = element.shadowRoot.querySelector('.likes__button')
    expect(heart.classList.contains('likes__button--disabled')).toBe(false)
    element.setAttribute('disabled', 'true')
    expect(heart.classList.contains('likes__button--disabled')).toBe(true)
  })

  it ('toggles like class on counter', () => {
    const counter = element.shadowRoot.querySelector('.likes__counter')
    expect(counter.classList.contains('likes__counter--liked')).toBe(false)
    element.isLiked = true
    expect(counter.classList.contains('likes__counter--liked')).toBe(true)
  })

  it ('toggles disabled class on counter', () => {
    const counter = element.shadowRoot.querySelector('.likes__counter')
    expect(counter.classList.contains('likes__counter--disabled')).toBe(false)
    element.setAttribute('disabled', 'true')
    expect(counter.classList.contains('likes__counter--disabled')).toBe(true)
  })
})
