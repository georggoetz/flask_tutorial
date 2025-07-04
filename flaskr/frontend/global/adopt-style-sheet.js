// Not all browsers support CSSStyleSheet.adoptedStyleSheets. In this case we fallback to inserting a <style> tag directly into the Shadow DOM.
const globalSheets = new Map()

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
