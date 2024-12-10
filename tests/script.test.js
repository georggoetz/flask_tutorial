const { Like } = require('../flaskr/static/script.js')

describe('Like', () => {
  
  beforeEach(() => {
    document.body.innerHTML = `
    <div id="post-like-1">
      <a id="link" href="#"></a>
      <div id="checkbox" onclick="like.toggle(); return false;"></div>
    </div>`
  })

  describe('When not logged in', () => {
    
    beforeEach(() => {
      window.like = Like({
        postId: 1,
        authorId: 1,
        userId: null,
        liked: false,
        count: 100,
        loginUrl: '/auth/login'
      })
    })

    test('link is disabled', () => {
      const link = document.getElementById('link')
      expect(link.hasAttribute('href')).toBe(false)
    })

    test('checkbox refers to login', () => { 
      const checkbox = document.getElementById('checkbox')
      delete window.location
      window.location = { href: '' }
      checkbox.click()
      expect(window.location.href).toBe('/auth/login')
    })
  })

  describe('When logged in', () => {
    
    beforeEach(() => {
      window.like = Like({
        postId: 1,
        authorId: 1,
        userId: 2,
        liked: false,
        count: 0,
        loginUrl: ''
      })

      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ liked: true, like_count: 1 })
        })
      )
      
      document.getElementById('checkbox').innerText = '0 likes'
    })

    afterEach(() => {
      global.fetch.mockClear()
      delete global.fetch
    })

    test('link is enabled', () => {
      const link = document.getElementsByTagName('a')[0]
      expect(link.hasAttribute('href')).toBe(true)
    })

    test('toggle like', async () => {
      const checkbox = document.getElementById('checkbox')
      checkbox.click()
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(checkbox.classList.contains('liked')).toBe(true)
    })

    test('update like count', async () => {
      const checkbox = document.getElementById('checkbox')
      const link = document.getElementById('link')
      checkbox.click()
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(link.innerText).toBe('1 like')
    })
  })
})
