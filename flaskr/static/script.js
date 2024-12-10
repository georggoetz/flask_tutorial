'use strict'

function Like(args) {
  let { count, liked } = args
  const { postId, userId, authorId, loginUrl } = args
  
  const div = document.getElementById(`post-like-${postId}`)
  const checkbox = div.querySelector('div')
  const link = div.querySelector('a')

  if (userId === authorId) {
    checkbox.classList.toggle('disabled')
  }

  if (!userId) {
    link.removeAttribute('href')
  }

  function updateCheckbox() {
    if (liked) {
      checkbox.classList.add('liked')
    } else {
      checkbox.classList.remove('liked')
    }
  }

  function updateCount() {
    if (count === 0) {
      link.innerText = 'not liked yet'
    } else if (count === 1) {
      link.innerText = '1 like'
    } else {
      link.innerText = `${count} likes`
    }
    
  }

  updateCheckbox()
  updateCount()
  
  return {
    toggle: function() {
      if (!userId) {
        window.location.href = loginUrl
        return
      }
      fetch(`${postId}/like`, {
        method: liked ? 'DELETE' : 'POST',
        headers: { 'accept': 'application/json' }
      })
        .then(response => response.json())
        .then(data => {
          liked = data.liked
          count = data.like_count
          updateCheckbox()
          updateCount()
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    }
  }
}

module.exports = { Like }