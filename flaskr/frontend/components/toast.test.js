import { describe, it, expect, beforeEach } from 'vitest'
import { showToast } from './toast.js'

function getToastStack() {
  return document.querySelector('.toast-stack')
}

describe('Toast component', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div class="toast-stack"></div>'
  })

  it('shows a single toast', async() => {
    showToast('Test message')
    const stack = getToastStack()
    expect(stack).toBeTruthy()
    expect(stack.children.length).toBe(1)
    expect(stack.children[0].textContent).toContain('Test message')
  })

  it('stacks multiple toasts', () => {
    showToast('First message')
    showToast('Second message')
    const stack = getToastStack()
    expect(stack.children.length).toBe(2)
    expect(stack.children[0].textContent).toContain('First message')
    expect(stack.children[1].textContent).toContain('Second message')
  })

  it('removes toast when close button is clicked', () => {
    showToast('Closable message')
    const stack = getToastStack()
    const toast = stack.children[0]
    expect(toast.closeBtn).toBeTruthy()
    toast.closeBtn.click()
    expect(stack.children.length).toBe(0)
  })
})
