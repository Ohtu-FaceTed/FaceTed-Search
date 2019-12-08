const apiUrl = 'https://data.stat.fi/api/classifications/v1/classifications/rakennus_1_20180712/classificationItems?content=data&meta=max&lang=';
const MIN_PROB = 0.2;
const MIN_QUESTIONS = 5;

class FsResult extends HTMLElement {
    constructor() {
        super();
        this.data = null;
        this.classifications = null;
        this.language = 'fi';
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
        if (!event.detail) {
            this.hidden = true;
            this.render();
            return;
        }
        // Sort the event data by id (string) to make sure it is in the same order as this.data
        const newData = event.detail.building_classes.sort((a, b) => a.class_id.localeCompare(b.class_id));
        if (newData.length !== this.data.length) {
            console.error(`Mismatch of building classess between api and backend: Got ${newData.length}, expected: ${this.data.length}`);
        }
        // Map new scores to classifications
        this.classifications = this.data.map((item, i) => {
            const newObj = {...item};
            newObj.score = newData[i].score;
            return newObj;
        });
        this.classifications.sort((a, b) => {
            return b.score - a.score;
        });
        // Do not show results if not enough questions asked or not high enough probability
        this.showResults = event.detail.question_number <= MIN_QUESTIONS && this.classifications[0].score < MIN_PROB ? false : true;
        this.hidden = false;
        this.render();
    }

    get template() {
        if (!this.data) {
            return '<h1>Error fetching data from api</h1>';
        }
        // Do not show results if not enough questions asked or not high enough probability
        if (!this.showResults) {
            return `
                <div class="blue" style="text-align: center;margin-left:10px;margin-right:10px;">
                    <h4>${this.instructionText[0]}</h4>
                    <h4>${this.instructionText[1]}</h4>
                </div>
            `;
        }
        return `
        <div class="comp">
            <div class="blue">
                <h3>${this.headerText}</h3>
            </div>
            <div class="white">  
                <table class="results">
                    <tbody>
                        ${this.createRows()}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    }

    createRows() {
        if (!this.classifications) {
            return '';
        }
        // maps classifications to table rows
        const classes = this.classifications.slice(0, 10);
        const rows = classes.map((item, i) => {
            return `
            <tr class="resultRow">
                <td class="itemInfo" id="id${item.code}" tabindex=0>${item.code} ${item.classificationItemNames[0].name}</td>
                <td class="itemScore" style="background-color:${this.chooseColor(item)}">
                    ${(item.score * 100).toFixed(0)}%
                <td>
            </tr>
            `;
        });
        return rows.join('');
    }

    chooseColor(item) {
        const green = '#00ff00';
        const yellow = '#ffff66';
        const gray = '#dcdcdc';
        let color = 'red';
        if (item.score >= 0.05) {
            color = green;
        } else {
            color = item.score > 0.015 ? yellow : gray;
        }
        return color;
    }

    get style() {
        return `
    <style>
    .comp {
        font-family: Arial;
        font-size: 18px;
        background-color: white;
        margin: 10px 10px 10px 10px;
        border: 2px solid #c5c5c5;
        border-radius: 2px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        width: auto;
      }
    div {
        border: 1px solid #c5c5c5;
        width: auto;
    }
    .blue {
        padding: 10px 10px 5px 10px;
        background-color: #0073b0;
        color: white;
        padding:  5px 5px 5px 5px;
        margin: 0px;
      }
    .white {
        padding: 10px 10px 5px 10px;
        border: 1px solid #c5c5c5;
        width: auto;
    }
    .results {
        width: 100%;
    }
    .itemScore {
        text-align: center;
        border-style: solid;
        border-width: 1px;
        border-color: black;
        border-radius: 4px;
        max-width: 4ch;
        min-width: 4ch;
        overflow: auto;
    }
    .itemInfo {
        text-align: left;
        cursor: pointer;
    }
    .itemInfo:hover {
        background-color: #e0effa;
    }
    .itemInfo:focus {
        background-color: #e0effa;
    }
    .selected {
        background-color: #badcf5 !important;
        font-weight: bold;
    }
    </style>
    `;
    }

    // Fetch classifications from stat.fi API
    async fetchData() {
        return await fetch(
            apiUrl + this.language
        ).then((res) => res.json());
    }

    // Monitors the value of language attribute
    static get observedAttributes() {
        return ['language'];
    }

    // Reacts to changes in the value of language attribute
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        } else if (name === 'language') {
            this.language = newValue;
            this.setLanguage();
        }
    }

    setLanguage() {
        if (this.language === 'en') {
            this.instructionText = [
                'Find the building category that best matches your building by answering the presented questions.',
                'Search results will appear here.',
            ];
            this.headerText = 'Results';
        } else if (this.language === 'sv') {
            this.instructionText = [
                'Svara på frågorna för att hitta den byggkategori som bäst passar din byggnad',
                'Sökresultaten visas här.',
            ];
            this.headerText = 'Resultat';
        } else if (this.language === 'fi') {
            this.instructionText = [
                'Löydä rakennustasi parhaiten vastaava rakennusluokka vastaamalla esitettyihin kysymyksiin.',
                'Haun tulokset ilmestyvät tähän.',
            ];
            this.headerText = 'Hakutulokset';
        }
    }


    render() {
        if (!this.shadowRoot) {
            this.attachShadow({mode: 'open'});
        }
        // clear the possible old render
        this.shadowRoot.innerHTML = '';

        // stamp template to DOM
        const temp = document.createElement('template');
        temp.innerHTML = this.style + this.template;
        this.shadowRoot.appendChild(temp.content.cloneNode(true));
        // add eventlisteners to info cells
        this.addEventListeners();
    }

    addEventListeners() {
        const listener = (e) => {
            // Checks if enter key was pressed. e.code is null if this was a click event.
            if (e.code && e.code !== 'Enter') {
                return;
            }
            const row = e.target;
            // .selected-class css highlighting
            const rows = this.shadowRoot.querySelectorAll('.itemInfo');
            rows.forEach((row) => {
                row.classList.remove('selected');
            });
            row.classList.add('selected');
            // Prepare an object for detail component
            const c = this.classifications.find((item) => {
                return item.code === row.id.slice(2, 6);
            });
            const item = {
                name: c.classificationItemNames[0].name,
                keywords: c.classificationIndexEntry[0].text.join(', '),
                code: c.code,
                note: c.explanatoryNotes[0].generalNote[c.explanatoryNotes[0].generalNote.length - 1],
            };
            // Cleans dupes, ''s and ','s from the arrays.
            const cleanArray = (arr) => {
                return Array.from(new Set(arr))
                    .filter((item) => item.trim().length > 1)
                    .map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
            };
            const ex = c.explanatoryNotes[0].excludes;
            if (ex && ex.join('').replace(',', '').trim()) {
                item.excludes = cleanArray(ex);
            }
            const inc = c.explanatoryNotes[0].includes;
            if (inc && inc.join('').replace(',', '').trim()) {
                item.includes = cleanArray(inc);
            }
            const incA = c.explanatoryNotes[0].includesAlso;
            if (incA && incA.join('').replace(' ', '').trim()) {
                item.includesAlso = cleanArray(incA);
            }
            const event = new CustomEvent('showDetails', {
                detail: item,
                bubbles: true,
                composed: true,
            });
            this.dispatchEvent(event);
        };
        const rows = this.shadowRoot.querySelectorAll('.itemInfo');
        rows.forEach((row) => {
            row.addEventListener('click', listener);
            row.onkeydown = listener;
        });
    }

    async connectedCallback() {
        const data = await this.fetchData();
        this.data = data.filter((item) => item.level === 3);
        // make a deep copy
        this.classifications = this.data.map((item) => {
            return {...item};
        });
        this.showResults = false;
        this.setLanguage();
        this.render();
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
const register = () => customElements.define('fs-result', FsResult);
window.WebComponents ? window.WebComponents.waitFor(register) : register();
