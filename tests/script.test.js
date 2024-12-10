const { Like } = require('../flaskr/static/script.js')

describe('Like', () => {
  
  beforeEach(() => {
    document.body.innerHTML = `
    <div id="post-like-1">
      <a href="#"></a>
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
      const link = document.getElementsByTagName('a')[0]
      expect(link.hasAttribute('href')).toBe(false)
    })

    test('checkbox refers to login', () => { 
    })

  })

  // test('if it works', () => {
  //   window.like = Like({
  //     postId: 1,
  //     authorId: 1,
  //     userId: 2,
  //     liked: false,
  //     count: 0,
  //     loginUrl: ''
  //   })

  //   const checkbox = document.getElementById('checkbox')
  //   checkbox.click()
  // })

})
