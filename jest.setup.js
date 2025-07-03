global.CSSStyleSheet = class {
  replaceSync() { }
}

// Patch attachShadow, damit adoptedStyleSheets immer existiert
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