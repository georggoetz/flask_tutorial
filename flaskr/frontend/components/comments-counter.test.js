import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import './comments-counter.js'

// Mock dependencies
vi.mock('./toast.js', () => ({
  showToast: vi.fn()
}))

vi.mock('./modal.js', () => ({
  showModal: vi.fn()
}))

vi.mock('../global/requests.js', () => ({
  get: vi.fn(),
  postForm: vi.fn()
}))

vi.mock('../global/scroll.js', () => ({
  scrollToElement: vi.fn(),
  getElementOffset: vi.fn()
}))

describe('CommentsCounter Web Component', () => {
  let element

  beforeEach(() => {
    element = document.createElement('x-comments-counter')
    document.body.appendChild(element) // DOM verbinden damit connectedCallback aufgerufen wird
  })

  afterEach(() => {
    if (element.parentNode) {
      document.body.removeChild(element)
    }
    vi.clearAllMocks()
  })

  it('initializes with default attributes', () => {
    expect(element.count).toBe(0)
    expect(element.url).toBe(null)
  })

  it('reflects count attribute', () => {
    element.count = 5
    expect(element.getAttribute('count')).toBe('5')
    expect(element.count).toBe(5)
  })

  it('updates count display in DOM', () => {
    element.count = 7
    const counter = element.shadowRoot.querySelector('.comments__counter')
    expect(counter.textContent).toBe('7')
    expect(counter.getAttribute('aria-label')).toBe('7 comments')
  })

  it('handles string count values', () => {
    element.setAttribute('count', '10')
    expect(element.count).toBe(10)
  })

  it('defaults count to 0 for invalid values', () => {
    element.setAttribute('count', 'invalid')
    expect(element.count).toBe(0)
  })

  it('updates URL attribute', () => {
    const testUrl = '/api/blog/123/comments/count'
    element.setAttribute('url', testUrl)
    expect(element.url).toBe(testUrl)
  })

  it('creates proper DOM structure', () => {
    const counter = element.shadowRoot.querySelector('.comments__counter')
    expect(counter).toBeTruthy()
    expect(counter.tagName).toBe('SPAN')
    expect(counter.classList.contains('comments__counter')).toBe(true)
  })

  it('updates DOM when count changes', () => {
    element.count = 3
    let counter = element.shadowRoot.querySelector('.comments__counter')
    expect(counter.textContent).toBe('3')

    element.count = 8
    counter = element.shadowRoot.querySelector('.comments__counter')
    expect(counter.textContent).toBe('8')
  })

  it('has correct accessibility attributes', () => {
    element.count = 2
    const counter = element.shadowRoot.querySelector('.comments__counter')
    expect(counter.getAttribute('aria-label')).toBe('2 comments')
  })

  it('observes correct attributes', () => {
    expect(element.constructor.observedAttributes).toEqual(['count', 'url'])
  })

  it('calls updateDOM when observed attributes change', () => {
    // Spy on the private method indirectly by checking DOM updates
    element.count = 1
    let counter = element.shadowRoot.querySelector('.comments__counter')
    expect(counter.textContent).toBe('1')

    // Change attribute directly to trigger attributeChangedCallback
    element.setAttribute('count', '5')
    counter = element.shadowRoot.querySelector('.comments__counter')
    expect(counter.textContent).toBe('5')
  })
})
