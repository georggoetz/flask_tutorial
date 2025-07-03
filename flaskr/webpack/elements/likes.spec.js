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

  test('initializes with default attributes', () => {
    expect(element.isLiked).toBe(false)
    expect(element.count).toBe(0)
    expect(element.isDisabled).toBe(false)
  })

  test('reflects liked attribute', () => {
    element.isLiked = true
    expect(element.getAttribute('liked')).toBe('true')
    expect(element.isLiked).toBe(true)
  })

  test('updates count attribute', () => {
    element.count = 42
    expect(element.getAttribute('count')).toBe('42')
    expect(element.count).toBe(42)
    expect(element.shadowRoot.querySelector('.likes__counter').textContent).toBe('42')
  })

  test('toggles liked class on heart', () => {
    const heart = element.shadowRoot.querySelector('.likes__heart')
    expect(heart.classList.contains('likes__heart--liked')).toBe(false)
    element.isLiked = true
    element.updateDOM()
    expect(heart.classList.contains('likes__heart--liked')).toBe(true)
  })

  test('toggles disabled class on heart', () => {
    const heart = element.shadowRoot.querySelector('.likes__heart')
    expect(heart.classList.contains('likes__heart--disabled')).toBe(false)
    element.setAttribute('disabled', 'true')
    element.updateDOM()
    expect(heart.classList.contains('likes__heart--disabled')).toBe(true)
  })
})
