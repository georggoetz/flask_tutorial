import { addGlobalStyleSheetsToShadowRoot } from '../global-styles.js'

export default class GlobalStyles extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    addGlobalStyleSheetsToShadowRoot(this.shadowRoot)
  }
}