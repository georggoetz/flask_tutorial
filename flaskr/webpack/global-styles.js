let globalStyleSheets = null

export function getGlobalStyleSheets() {
  if (!globalStyleSheets) {
    globalStyleSheets = Array
      .from(document.styleSheets)
      .map(s => {
        const styleSheet = new CSSStyleSheet()
        const css = Array
          .from(s.cssRules)
          .map(rule => rule.cssText)
          .join(' ')

        styleSheet.replaceSync(css)
        return styleSheet
      })
  }
  return globalStyleSheets
}

export function addGlobalStyleSheetsToShadowRoot(shadowRoot) {
  shadowRoot.adoptedStyleSheets.push(...getGlobalStyleSheets())
}