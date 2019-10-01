/* eslint-disable max-len */
import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-styles/paper-styles.js';
import '@polymer/paper-styles/element-styles/paper-material-styles.js';
import '@polymer/iron-list/iron-list.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import './style-element.js';

class TkValinta extends PolymerElement {
    static get template() {
        const temp = html`
      <style include="style-element">    
      </style>
      <div class="tk tk-valinta-body"> 
        <h1 class="tk-valinta-h1"> {{header}} </h1>
        <iron-list items="{{class}}" class="tk-valinta-iron-list">
        <template class="tk-valinta-template">
          <div>
            <h3 class="tk-valinta-h3"><span class="classCode tk-valinta-classCode">{{item.code}}</span><span class="className tk-valinta-className"> {{item.name}}</span></h3>
            <ul class="tk-valinta-ul">
              <li class="tk-valinta-li description tk-valinta-description">{{item.note}}</li>
              <template is="dom-if" if="{{item.excludes}}">
                <li class="tk-valinta-li tk-valinta-excludes"><span class="excludesHeader">{{excludes}}</span><span class="tk-valinta-textContent tk-valinta-excludesContent">{{item.excludes}}</span></li>
              </template>
              <template is="dom-if" if="{{item.includes}}">
                <li class="tk-valinta-li tk-valinta-includes"><span class="includesHeader">{{includes}}</span><span class="tk-valinta-textContent tk-valinta-includesContent">{{item.includes}}</span></li>
              </template>
              <template is="dom-if" if="{{item.includesAlso}}">
                <li class="tk-valinta-li tk-valinta-includesAlso"><span class="includesAlsoHeader">{{includesAlso}}</span><span class="tk-valinta-textContent tk-valinta-includesAlsoContent">{{item.includesAlso}}</span></li>
              </template>
              <template is="dom-if" if="{{item.keywords}}">
                <li class="tk-valinta-li tk-valinta-keywords"><span class="keywordsHeader">{{keywords}}</span><span class="tk-valinta-textContent tk-valinta-keywordsContent">{{item.keywords}}</span></li>
              </template>
            </ul>
          </div>
        </template>
      </iron-list>
      </div>
      `;
        temp.setAttribute('strip-whitespace', true);
        return temp;
    }

    static get properties() {
        return {
            class: Array,
            language: {
                type: String,
                value: 'fi',
                notify: true,
                reflectToAttribute: true,
            },
            header: {
                type: String,
                value: 'Rakennusluokitus 2018',
                notify: true,
            },
            excludes: {
                type: String,
                value: 'Tähän ei kuulu: ',
                notify: true,
            },
            includes: {
                type: String,
                value: 'Tähän kuuluu: ',
                notify: true,
            },
            includesAlso: {
                type: String,
                value: 'Tähän kuuluu myös: ',
                notify: true,
            },
            keywords: {
                type: String,
                value: 'Hakusana: ',
                notify: true,
            },
        };
    }

    connectedCallback() {
        super.connectedCallback();
        this.addEventListeners();
        this.setLanguage();
    }

    setLanguage() {
        if (this.language === 'en') {
            this.set('header', 'Chosen class');
            this.set('keywords', 'Keywords: ');
            this.set('includes', 'Includes: ');
            this.set('includesAlso', 'Includes also: ');
            this.set('excludes', 'Excludes: ');
        } else if (this.language === 'sv') {
            this.set('header', 'Valda klassen');
            this.set('keywords', 'Nyckelord: ');
            this.set('includes', 'Innehåller: ');
            this.set('includesAlso', 'Innehåller också ');
            this.set('excludes', 'Innehåller inte: ');
        }
    }

    addEventListeners() {
        window.addEventListener('tk-luokkahaku-luokka', (e) => {
            console.log(e.detail);
            this.shadowRoot.querySelector('.tk-valinta-body').style.visibility = 'visible';
            this.set('class', [e.detail]);
            this.notifyPath('class');
        });
    }

    setHeaderLanguage() {
        if (this.language === 'en') {
            this.set('header', 'Classification of Buildings 2018');
        } else if (this.language === 'sv') {
            this.set('header', 'Byggnadsklassificering 2018');
        }
    }
}

window.customElements.define('tk-valinta', TkValinta);
