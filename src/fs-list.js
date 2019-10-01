class FsList extends HTMLElement {
    constructor() {
        super();
        this.data = null;
        this.classifications = null;
        this.hidden = true;
        // listen to score updates from question-element
        const parentDiv = document.getElementById('faceted');
        if (parentDiv) {
            parentDiv.addEventListener(
                'updateScores',
                this.updateScores.bind(this)
            );
        }
    }

    updateScores(event) {
        let newData = event.detail;
        // purkkaa
        const ids = new Set();
        newData = newData
            .map((item) => {
                if (ids.has(item.class_id)) {
                    return null;
                }
                ids.add(item.class_id);
                return item;
            })
            .filter((item) => item != null);
        // end purkka
        this.classifications = this.data.map((item, i) => {
            const newObj = {...item};
            newObj.score = newData[i].score;
            return newObj;
        });
        this.classifications.sort((a, b) => {
            return b.score - a.score;
        });
        this.hidden = false;
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
        let classificationsToShow = this.classifications.slice(0, 10);
        classificationsToShow = classificationsToShow.map((item) => {
            return `<li id="${item.code}">
                        ${item.code} ${item.classificationItemNames[0].name} ${
    item.score ? `Score: ${Number(item.score).toFixed(2)}` : ''
}
                    </li>`;
        });
        const lis = classificationsToShow.join('');
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

    async fetchData() {
        return await fetch(
            'https://data.stat.fi/api/classifications/v1/classifications/rakennus_1_20180712/classificationItems?content=data&meta=max&lang=fi'
        ).then((res) => res.json());
    }

    renderList() {
        if (!this.shadowRoot) {
            this.attachShadow({mode: 'open'});
        }
        // clear the possible old render
        this.shadowRoot.innerHTML = '';

        // construct template and render to DOM
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
                const c = this.classifications.find((item) => {
                    return item.code === li.id;
                });
                const item = {
                    name: c.classificationItemNames[0].name,
                    keywords: c.classificationIndexEntry[0].text.join(', '),
                    code: c.code,
                    visible: true,
                    note: c.explanatoryNotes[0].generalNote[c.explanatoryNotes[0].generalNote.length-1],
                };
                if (c.explanatoryNotes[0].excludes) {
                    item.excludes = c.explanatoryNotes[0].excludes[c.explanatoryNotes[0].excludes.length-1];
                }
                if (c.explanatoryNotes[0].includes) {
                    item.includes = c.explanatoryNotes[0].includes[c.explanatoryNotes[0].includes.length-1];
                }
                if (c.explanatoryNotes[0].includesAlso) {
                    item.includesAlso = c.explanatoryNotes[0].includesAlso[c.explanatoryNotes[0].includesAlso.length-1];
                }
                this.dispatchEvent(new CustomEvent('tkshowdetail', {
                    detail: item,
                    bubbles: true,
                    composed: true,
                }));
            });
        });
    }

    async connectedCallback() {
        const data = await this.fetchData();
        this.data = data.filter(
            (item) => item.level === 3 && item.code !== '1919'
        );
        // make a deep copy
        this.classifications = this.data.map((item) => {
            return {...item};
        });

        this.renderList();
    }

    disconnectedCallback() {
        const div = document.getElementById('faceted');
        if (div) {
            div.removeEventListener(
                'updateScores',
                this.updateScores.bind(this)
            );
        }
    }
}

// check for polyfills
const register = () => customElements.define('fs-list', FsList);
window.WebComponents ? window.WebComponents.waitFor(register) : register();
