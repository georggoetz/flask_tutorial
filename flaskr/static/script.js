'use strict'

function toggleLike(postId) {
  const likeElement = document.getElementById('like')
  if (!likeElement) {
    console.error('Element \'like\' not found')
    return
  }

  const userElement = document.getElementById('user-data')
  if (!userElement) {
    console.error('Element \'user-data\' not found')
    return
  }
  const likedByUser = JSON.parse(userElement.getAttribute('liked-by-user'))
  fetch(`${postId}/like`, {
    method: likedByUser ? 'DELETE' : 'POST',
    headers: { 'accept': 'application/json' },
    body: JSON.stringify({})
  })
    .then(response => response.json())
    .then(data => {
      userElement.setAttribute('liked-by-user', (!likedByUser).toString())
      likeElement.innerText = data.liked ? 'Unlike' : 'Like'
      const countElement = document.getElementById('like-count')
      if (!countElement) {
        console.error('Element \'like-count\' not found')
        return
      }
      countElement.innerText = data.likes_count
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}

window.toggleLike = toggleLike