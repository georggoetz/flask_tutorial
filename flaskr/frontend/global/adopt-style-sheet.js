// Not all browsers support CSSStyleSheet.adoptedStyleSheets. In this case we fallback to inserting a <style> tag directly into the Shadow DOM.
const globalSheets = new Map()

/**
 * Adopts CSS styles into a Shadow DOM, with fallback for browsers that don't support adoptedStyleSheets.
 * Uses modern adoptedStyleSheets API when available, otherwise falls back to inserting a <style> element.
 * Caches stylesheets globally to avoid duplicating CSS for better performance.
 * 
 * @param {ShadowRoot} shadowRoot - The Shadow DOM root to adopt styles into
 * @param {string} cssText - The CSS text content to adopt
 * @param {string} [key=cssText] - Optional cache key for the stylesheet. Defaults to the CSS text itself
 * 
 * @example
 * // Basic usage
 * const shadowRoot = element.attachShadow({ mode: 'open' })
 * adoptStyleSheet(shadowRoot, '.my-class { color: red; }')
 * 
 * // With custom cache key
 * adoptStyleSheet(shadowRoot, cssContent, 'my-component-styles')
 */
export function adoptStyleSheet(shadowRoot, cssText, key = cssText) {
  if (window.CSSStyleSheet && 'adoptedStyleSheets' in Document.prototype) {
    // CSSStyleSheet.adoptedStyleSheets is supported
    let sheet = globalSheets.get(key)
    if (!sheet) {
      sheet = new CSSStyleSheet()
      sheet.replaceSync(cssText)
      globalSheets.set(key, sheet)
    }
    shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, sheet]
  } else {
    if (!shadowRoot.querySelector('style[data-adopted]')) {
      const style = document.createElement('style')
      style.textContent = cssText
      style.setAttribute('data-adopted', '')
      shadowRoot.appendChild(style)
    }
  }
}
