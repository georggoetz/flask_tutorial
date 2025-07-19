// Webpack: import all JavaScript files except test files
const requireAll = require.context('./', true, /^(?!.*\.(spec|test)\.js$).*\.js$/)
requireAll.keys().forEach(requireAll)

import './scss/main.scss'

import { showModal } from './components/modal.js'
import { get, postForm } from './global/requests.js'

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', async e => {
    const btn = e.target.closest('[data-post-comment]')
    if (btn) {
      e.preventDefault()
      const postId = btn.dataset.postId
      const html = await get(`/${postId}/comment/create`)
      const modal = showModal(html)
      const form = modal.querySelector('form')
      
      if (form) {
        form.addEventListener('submit', async ev => {
          ev.preventDefault()
          const formData = new FormData(form)
          
          try {
            const commentHtml = await postForm(form.action, formData)
            const commentsSection = document.querySelector('#comments')

            if (commentsSection) {
              commentsSection.insertAdjacentHTML('beforeend', commentHtml)
            }

            modal.close()
            
            const match = commentHtml.match(/id="comment-(\d+)"/)
            if (match) {
              const commentId = match[1]
              window.location.replace(`/${postId}#comment-${commentId}`)
            } else {
              window.location.replace(`/${postId}#comments`)
            }
          } catch (err) {
            showToast(err.message || 'Error submitting comment')
          }
        })
      }
    }
  })

  function scrollToComments() {
    if (window.location.hash === '#comments') {
      const commentsSection = document.getElementById('comments')
      const navbar = document.querySelector('.nav-bar')
      const offset = navbar ? navbar.offsetHeight : 0
      if (commentsSection) {
        const top = commentsSection.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({ top, behavior: 'smooth' })
      }
    }
  }

  scrollToComments()
  window.addEventListener('load', scrollToComments)
})

