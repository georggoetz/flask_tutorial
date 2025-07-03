// Jest does not support the replaceSync method on CSSStyleSheet.
global.CSSStyleSheet = class {
  replaceSync() { }
}

// Jest does not support the adoptedStyleSheets property on ShadowRoot.
const origAttachShadow = Element.prototype.attachShadow
Element.prototype.attachShadow = function(init) {
  const shadow = origAttachShadow.call(this, init)
  if (!shadow.adoptedStyleSheets) {
    Object.defineProperty(shadow, 'adoptedStyleSheets', {
      value: [],
      writable: true
    })
  }
  return shadow
}