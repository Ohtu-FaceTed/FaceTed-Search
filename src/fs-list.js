class FsList extends HTMLElement {
    constructor() {
        super();
        this.data = null;
        this.classifications = null;
        // listen to score updates from question-element
        // bubblegum solution for parent div not loading during testing
        if (document.getElementById('faceted')) {
            const parentDiv = document.getElementById('faceted');
            parentDiv.addEventListener('updateScores', this.updateScores.bind(this));
        }
    }

    updateScores(event) {
        const newData = event.detail;
        this.classifications = this.data.map((item, i) => {
            const newObj = { ...item };
            newObj.score = newData[i].score;
            return newObj;
        });
        this.classifications.sort((a, b) => {
            return b.score - a.score;
        });
        this.renderList();
    }

    get template() {
        if (!this.data) {
            return '<h1>Error fetching data from api</h1>';
        }
        const lis = this.createListItems();

        return `
    <div>
      <ul id="classifications">
        ${lis}
      </ul>
    </div>
    `;
    }

    createListItems() {
        // map classifications to list items
        const classificationsToShow = this.classifications.map((item) => {
            return `<li id="${item.code}">
                        ${item.code} ${item.classificationItemNames[0].name} ${item.score ? `Score: ${Number(item.score).toFixed(2)}` : ''}
                    </li>`;
        });
        const lis = classificationsToShow.slice(0, 10).join('');
        return lis;
    }

    get style() {
        return `
    <style>
    div {
        border: 1px solid #c5c5c5;
        width: 30%;
    }
    ul {
          list-style: none;
        }
    li {
           margin: 5px 5px 5px -25px;
    }
    </style>
    `;
    }

    // native fetch for getting json
    async fetchData() {
        return await fetch(
            'https://data.stat.fi/api/classifications/v1/classifications/rakennus_1_20180712/classificationItems?content=data&meta=max&lang=fi'
        ).then((res) => res.json());
    }

    renderList() {
        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
        }
        // clear the possible old render
        this.shadowRoot.innerHTML = '';

        // stamp template to DOM
        const temp = document.createElement('template');
        temp.innerHTML = this.style + this.template;
        this.shadowRoot.appendChild(temp.content.cloneNode(true));
        // add eventlisteners to listitems
        this.addEventListeners();
    }

    addEventListeners() {
        const lis = this.shadowRoot.querySelectorAll('li');
        let odd = true;
        lis.forEach((li) => {
            // TODO move styling to somewhere sane
            li.style.background = odd ? '#bbbbbb' : '#dddddd';
            odd = !odd;
            li.addEventListener('click', (e) => {
                const classification = this.classifications.find((item) => {
                    return item.code === li.id;
                });
                const event = new CustomEvent('showDetails',
                    {
                        detail: classification,
                        bubbles: true,
                        composed: true,
                    });
                this.dispatchEvent(event);
            });
        });
    }

    async connectedCallback() {
        const data = await this.fetchData();
        this.data = data.filter((item) => item.level === 3);
        // make a deep copy
        this.classifications = this.data.map((item) => {
            return { ...item };
        });

        this.renderList();
    }

    disconnectedCallback() {
        // bubblegum solution for parent div not loading during testing
        if (document.getElementById('faceted')) {
            const div = document.getElementById('faceted');
            div.removeEventListener('updateScores', this.updateScores.bind(this));
        }
    }
}

// check for polyfills
const register = () =>
    customElements.define('fs-list', FsList);
window.WebComponents ? window.WebComponents.waitFor(register) : register();
