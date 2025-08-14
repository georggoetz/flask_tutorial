/**
 * Scrolls to a specific element with configurable options
 * @param {string} elementId - The ID of the element to scroll to
 * @param {object} options - Configuration options
 * @param {number} options.offset - Offset from the top in pixels (default: 0)
 * @param {string} options.behavior - Scroll behavior: 'smooth' or 'instant' (default: 'smooth')
 * @param {boolean} options.updateHash - Whether to update the URL hash (default: true)
 * @returns {boolean} - Returns true if successful, false if element not found
 */
export function scrollToElement(elementId, options = {}) {
  const element = document.getElementById(elementId)
  if (!element) {
    return false
  }
  
  const { offset = 0, behavior = 'smooth', updateHash = true } = options
  const top = element.getBoundingClientRect().top + window.scrollY - offset
  
  window.scrollTo({ top, behavior })
  
  // Update URL hash without page reload
  if (updateHash) {
    const newHash = `#${elementId}`
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, '', newHash)
    }
  }
  
  return true
}

/**
 * Gets the current height of an element by selector
 * @param {string} selector - CSS selector for the element (default: '.nav-bar')
 * @returns {number} - Height of the element in pixels, or 0 if not found
 */
export function getElementOffset(selector = '.nav-bar') {
  const element = document.querySelector(selector)
  return element ? element.offsetHeight : 0
}
