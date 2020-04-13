import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import './emoji-selector.js';

// var emoji = import('emoji-selector/emoji-selector.js');
// document.registerElement('emoji-selector', { prototype: emoji });

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
          font-family: 'Raleway', sans-serif;
        }
      </style>

      <h2>Search for an emoji:</h2>

      <emoji-selector search-string="{{search_string}}"></emoji-selector>
    `;
  }
  static get properties() {
    return {
      search_string: {
        type: String,
        value: 'smile'
      }
    };
  }
}

window.customElements.define('emoji-picker-app', EmojiPickerApp);
