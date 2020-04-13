import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';

/**
 * @customElement
 * @polymer
 */
class EmojiPickerApp extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <h2>Hello [[prop]]!</h2>
      <paper-input always-float-label label="Floating label"></paper-input>
    `;
  }
  static get properties() {
    return {
      prop: {
        type: String,
        value: 'emoji_picker-app'
      }
    };
  }
}

window.customElements.define('emoji-picker-app', EmojiPickerApp);
