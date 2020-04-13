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
      <emoji-rain drops="50" active></emoji-rain>
      <h2>Search for an emoji:</h2>
      <paper-input value="{{search_string}}"></paper-input>
      <p>Currently searching for:[[search_string]]</p>
    `;
  }
  static get properties() {
    return {
      search_string: {
        type: String,
        value: 'tears'
      }
    };
  }
}

window.customElements.define('emoji-picker-app', EmojiPickerApp);
