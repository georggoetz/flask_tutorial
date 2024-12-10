'use strict'

function Like(args) {
  let { count, liked } = args
  const { postId, userId, authorId, loginUrl } = args
  
  const div = document.getElementById(`post-like-${postId}`)
  const checkbox = div.querySelector('div')
  const link = div.querySelector('a')
  const modalDialog = document.getElementById('modal-dialog')
  const modalContent = document.getElementById('modal-content')
  const close = document.getElementsByClassName("close")[0]

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

  link.addEventListener('click', async (event) => {

    const response = await fetch(`${String(postId)}/liked_by`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    })

    if (response.ok) {
      const data = await response.json()
      const users = data.users

      const heading = document.createElement('h2')
      heading.textContent = 'Liked by'
      modalContent.appendChild(heading)
      
      const userList = document.createElement('ul')
      userList.id = 'user-list'
      userList.className = 'user-list'
      modalContent.appendChild(userList)

      for (const username of users) {
        const listItem = document.createElement('li')
        
        const avatar = document.createElement("div")
        avatar.className = 'user-avatar'
        avatar.textContent = username[0]
        listItem.appendChild(avatar)

        const userName = document.createElement("span")
        userName.className = 'user-name'
        userName.textContent = username
        listItem.appendChild(userName)
        
        userList.appendChild(listItem)
      }

      count = users.length
      updateCount()

      modalDialog.style.display = 'block'

      close.onclick = function () {
        modalDialog.style.display = "none"
        modalContent.removeChild(heading)
        modalContent.removeChild(userList)
      }
    }
  })
  
  return {
    toggle() {
      if (!userId) {
        window.location.href = loginUrl
        return
      }

      return fetch(`${String(postId)}/like`, {
        method: liked ? 'DELETE' : 'POST',
        headers: { 'Accept': 'application/json' }
      })
        .then(response => response.json())
        .then(data => {
          liked = data.liked
          count = data.like_count
          updateCheckbox()
          updateCount()
        })
        .catch((error) => {
          console.error('Error:', error.message)
        })
    }
  }
}

module.exports = { Like }