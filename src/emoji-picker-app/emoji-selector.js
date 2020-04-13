/*
`emoji-selector` is a `paper-input-addon` component (see Polymer.PaperInput)
that lets you select an emoji from a list and insert it into a text field.

Since you probably don't remember where each emoji is, it ships with a
search-for-emoji-keywords feature!

Example:

    <paper-input label="needs moar emoji">
      <emoji-selector slot="suffix"></emoji-selector>
    </paper-input>

### Styling

The following custom properties and mixins are available for styling:

Custom property | Description | Default
----------------|-------------|----------
`--emoji-selector-background-color` | Background color of the popup | `white`
`--emoji-selector-icon-color` | Color of the category icons | `black`
`--emoji-selector` | Mixin applied to the popup | `{}`
`--emoji-selector-icon` | Mixin applied to the emoji icons | `{}`
`--emoji-selector-icon-hover` | Mixin applied to the emoji icons when hovered | `{}`

You can also use any of the Polymer.PaperInputContainer styles to style the
search input, or the Polymer.PaperTabs and Polymer.PaperTab styles to style
the category tabs.

*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import {PolymerElement} from '@polymer/polymer/polymer-element.js';

import '@polymer/paper-menu-button/paper-menu-button.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/social-icons.js';
import '@polymer/iron-icons/maps-icons.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-styles/default-theme.js';
import '@polymer/iron-media-query/iron-media-query.js';

import emoji_lib from "./emoji_list.js"

import { html } from '@polymer/polymer/lib/utils/html-tag.js';

class EmojiSelector extends PolymerElement {
  static get template() {
    return html`
  <style>
    :host {
      display: inline-block;
      --paper-tabs-selection-bar-color: var(--default-primary-color);
      width:100%;
      height:100%;
    }

    paper-tabs {
      height: 30px;
      color: var(--emoji-selector-icon-color, black);
    }

    paper-tab iron-icon {
      --iron-icon-width: 18px;
      --iron-icon-height: 18px;
    }

    #searchInput {
      --paper-input-container-input: {
        text-align: center;
      };
    };

    #menu {
      padding: 0;
    }

    .box {
      background: var(--emoji-selector-background-color, white);
      border-radius: 2px;
      /* box-shadow: 0 2px 5px 0 rgba(0,0,0,.26);
      width: 270px;
      height: 240px; */
      font-size: 15px;
      height: 100%;
      width: 100%;
      @apply --emoji-selector;
    }

    .section-title {
      padding: 0;
      margin: 0;
      font-size: 11px;
      text-transform: uppercase;
      color: var(--emoji-selector-icon-color, black);
    }

    .emoji-section {
      height: 100%;
      overflow-y: auto;
      flex-direction: column;
      flex-wrap: wrap;
      padding-left: 8px;
      padding-top: 5px;
    }

    .emoji-icon {
      cursor: pointer;
      text-align: center;
      display: inline-block;
      font-size: 18px;
      line-height: 24px;
      width: 24px;
      height: 24px;

      /* >.< */
      -webkit-transition: all .14s linear;
    	-moz-transition: all .14s linear;
    	-o-transition: all .14s linear;
    	-ms-transition: all .14s linear;
    	transition: all .14s linear;

      @apply --emoji-selector-icon;
    }

    .emoji-icon:hover {
      transform: scale(1.3, 1.3);
      -webkit-transform: scale(1.3, 1.3);
      @apply --emoji-selector-icon-hover;
    }

    paper-icon-button.clear-button {
      color: var(--paper-input-container-color);
      --iron-icon-width: 15px;
      --iron-icon-height: 15px;
      padding: 0px 4px;
      margin-left: 4px;
    }
  </style>

    <iron-media-query query="(max-width: 375px)" query-matches="{{smallScreen}}"></iron-media-query>

    <!-- <paper-menu-button id="menu" vertical-align="top" vertical-offset="40" horizontal-align="[[_computeHorizontalAlign(smallScreen)]]" ignore-select="">
      <paper-icon-button icon="face" slot="dropdown-trigger"></paper-icon-button>
      <paper-menu slot="dropdown-content"> -->
        <div class="box">
          <paper-input autofocus="" no-label-float="" id="searchInput" placeholder="find an emoji!" value="{{searchString}}">
            <paper-icon-button on-tap="_onClearSearchInput" id="clearSearch" class="clear-button hide" icon="clear" alt="clear" title="clear" tabindex="0" slot="suffix" hidden="">
            </paper-icon-button>
          </paper-input>

          <paper-tabs selected="{{selected}}" id="tabs" tabindex="0">
            <paper-tab><iron-icon icon="icons:history"></iron-icon></paper-tab>
            <paper-tab><iron-icon icon="social:mood"></iron-icon></paper-tab>
            <paper-tab><iron-icon icon="maps:local-florist"></iron-icon></paper-tab>
            <paper-tab><iron-icon icon="maps:local-pizza"></iron-icon></paper-tab>
            <paper-tab><iron-icon icon="social:cake"></iron-icon></paper-tab>
            <paper-tab><iron-icon icon="maps:directions-walk"></iron-icon></paper-tab>
            <paper-tab><iron-icon icon="account-balance"></iron-icon></paper-tab>
            <paper-tab><iron-icon icon="perm-phone-msg"></iron-icon></paper-tab>
          </paper-tabs>

          <iron-pages selected="{{selected}}">
            <div class="emoji-section">
              <p class="section-title">Recently Used</p>
              <template is="dom-repeat" id="resultList" items="{{recentlyUsedEmojis}}">
                <div class="emoji-icon" on-tap="_onEmojiClick">{{item}}</div>
              </template>
            </div>
            <template is="dom-repeat" items="[[emojis]]" as="category">
              <div class="emoji-section">
                <p class="section-title">[[category.title]]</p>
                <template is="dom-repeat" items="[[category.items]]">
                  <div class="emoji-icon" on-tap="_onEmojiClick" title="{{item.keywords}}">{{item.char}}</div>
                </template>
              </div>
            </template>
            <div class="emoji-section">
              <p class="section-title">Search Results</p>
              <template is="dom-repeat" id="resultList" items="{{searchResults}}">
                <div class="emoji-icon" on-tap="_onEmojiClick" title="{{item.keywords}}">{{item.char}}</div>
              </template>
            </div>
          </iron-pages>
        </div>
      <!-- </paper-menu>
    </paper-menu-button> -->
`;
  }

  static get is() { return 'emoji-selector'; }

  static get properties() {
    return {
      /**
      * The input element the emojis should be inserted to. If not specified,
      * and the emoji-selector is used as a ``<paper-input>`` suffix element, then
      * `inputTarget` will be this parent `paper-input` element.
      */
      inputTarget: {
        type: Object
      },

      /**
      * The selected category.
      */
      selected: {
        type: Number,
        value: 0
      },

      /**
      * A list of all emojis, split by category.
      */
      emojis: {
        type: Array,
        value: []
      },

      /**
      * A sorted list of all recently used emoji.
      */
      recentlyUsedEmojis: {
        type: Array,
        value: []
      },

      /**
      * A list of the emojis matching the search.
      */
      searchResults: {
        type: Array,
        value: []
      },
      searchString:{
          type: String,
          observer: '_onSearchInput'
      },
      smallScreen: {
        type: Boolean,
        value: false
      }
    }
  }

  ready() {
    this.inputTarget = this.parentNode;
    this._selectedTabBeforeSearch = 1;
    super.ready();
  }

  connectedCallback() {
    super.connectedCallback();
    this._hasLocalStorage = this._checkLocalStorage();
    // Restore recently used emoji.
    if (this._hasLocalStorage) {
      this._localStorageKey = '__emoji-selector-recently-used__';
      this.recentlyUsedEmojis = JSON.parse(localStorage.getItem(this._localStorageKey));
    }

    if (this.recentlyUsedEmojis === null) {
      this.recentlyUsedEmojis = [];
    }

    this._parseEmojiLib(emoji_lib)
  }


  _parseEmojiLib(emojis) {
    this.emojis = [{ 'name': 'people',  'items' : [ ], title : 'people' },
                { 'name': 'animals_and_nature',  'items' : [ ], title : 'animals and nature' },
                { 'name': 'food_and_drink',  'items' : [ ], title : 'food and drink' },
                { 'name': 'objects',  'items' : [ ], title : 'objects' },
                { 'name': 'activity',  'items' : [ ], title : 'activity' },
                { 'name': 'travel_and_places', 'items' : [ ], title : 'travel and places' },
                { 'name': 'symbols', 'items' : [ ], title : 'symbols' },
                { 'name': 'flags', 'items' : [ ], title : 'flags' }];
    var indexes = { 'people' : 0,
                    'animals_and_nature' : 1,
                    'food_and_drink' : 2,
                    'objects': 3,
                    'activity' : 4,
                    'travel_and_places': 5,
                    'symbols': 6,
                    'flags': 7,
                  };
    this._searchPageIndex = 9;  // the page after the last legit emoji page.

    for (var name in emojis) {
      var category = emojis[name]['category'];
      var index = indexes[category];
      if (index !== undefined) {
        var keywords = emojis[name]['keywords'];
        if (keywords.indexOf(name) == -1)
          keywords.push(name);

        this.emojis[index]['items'].push(
            {'char': emojis[name]['char'],
             'keywords': keywords.join(' ').toLowerCase()});
      }
    }

    this.selected = this.recentlyUsedEmojis.length == 0 ? 1 : 0;
  }

  _onEmojiClick(event) {
    if (!this.inputTarget)
      return;
    var emoji = event.target.textContent;

    // If this emoji already exists, remove it. In all cases, add it to the
    // front of the queue since it's the newest one.
    var index = this.recentlyUsedEmojis.indexOf(emoji);
    if (index != -1)
      this.splice('recentlyUsedEmojis', index, 1);
    this.unshift('recentlyUsedEmojis', emoji);

    if (this._hasLocalStorage)
      localStorage.setItem(this._localStorageKey, JSON.stringify(this.recentlyUsedEmojis));

    var value = '';
    if (this.inputTarget.value)
      value = this.inputTarget.value;

    // Carets are witchcraft.
    var newValue = this._updateValueAndPreserveCaret(value, emoji);

    // This is a bit of a hack, but an iron-input or iron-autogrow-textarea
    // need to get notified to update their `bind-value`. And `onInput`
    // is a listener method, so fake the bit of the event it cares about.
    // Gross.
    if (this.inputTarget._onInput)
      this.inputTarget._onInput({target: {value: newValue}});

    this.inputTarget.focus();

    // Close the box.
    this._closeMenu();
  }

  _onSearchInput(event) {
    var search = this.$.searchInput.value.toLowerCase();
    if (search.trim() == '' && this.selected == this._searchPageIndex) {
      this.$.clearSearch.hidden = true;
      this.selected = this._selectedTabBeforeSearch;
      return;
    }

    // Remember what we were looking at before the search started.
    if (this.selected != this._searchPageIndex)
      this._selectedTabBeforeSearch = this.selected;
    this.$.clearSearch.hidden = false;

    if (!this.emojis)
      return;

    this.selected = this._searchPageIndex;
    this.searchResults = [];

    // UGH
    for (var i = 0; i < this.emojis.length; i++) {
      var category = this.emojis[i];
      for (var j = 0; j < category.items.length; j++) {
        if (category.items[j]['keywords'].indexOf(search) != -1) {
          this.push('searchResults',
              {'char': category.items[j]['char'],
               'keywords': category.items[j]['keywords']});
        }
      }
    }
  }

  _onClearSearchInput() {
    this.$.clearSearch.hidden = true;
    this.$.searchInput.value = '';
    this.selected = this._selectedTabBeforeSearch;
  }

  _closeMenu() {
    this.$.searchInput.focus();
    if (this.selected != this._searchPageIndex) {
      this.$.searchInput.value = '';
    }
    this.$.searchInput.selectionStart = 0;

    this.$.menu.close();
    this.$.tabs.notifyResize();
  }

  _updateValueAndPreserveCaret(value, emoji) {
    // Preserve the cursor position. If this is a paper-input, we really
    // care about the cursor position of the underlying iron-input.
    var underlyingIronInput = this.inputTarget.inputElement;

    var start, end;

    if (underlyingIronInput) {
      start = underlyingIronInput.inputElement.selectionStart || value.length;
      end = underlyingIronInput.inputElement.selectionEnd || value.length + 1;
    } else {
      start = this.inputTarget.selectionStart || value.length;
      end = this.inputTarget.selectionEnd || value.length + 1;
    }

    var front = value.substring(0, start);
    var back = value.substring(end, value.length);
    var newValue = front + emoji + back;

    this.inputTarget.value = newValue;

    // Restore the cursor position. See the same note about paper-input above.
    if (underlyingIronInput) {
      underlyingIronInput.selectionStart = start + emoji.length;
      underlyingIronInput.selectionEnd = start + emoji.length;
    } else {
      this.inputTarget.selectionStart = start + emoji.length;
      this.inputTarget.selectionEnd = start + emoji.length;
    }

    return newValue;
  }

  _computeHorizontalAlign(smallScreen) {
    return smallScreen ? 'right': 'left';
  }

  _checkLocalStorage() {
    var mod = '__emoji_test_local_storage__';
    try {
      localStorage.setItem(mod, 'a');
      localStorage.removeItem(mod);
      return true;
    } catch (exception) {
      return false;
    };
  }
}
window.customElements.define(EmojiSelector.is, EmojiSelector);
