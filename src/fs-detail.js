class FsDetail extends HTMLElement {
    constructor() {

        super();
        console.log('constructor')
        this.classification = null;
        this.label = '';
        // bubblegum solution for parent div not loading during testing
        if (document.getElementById('faceted')) {
            const parentDiv = document.getElementById('faceted');
            parentDiv.addEventListener('showDetails', this.updateDetail.bind(this));
        }
    }

    updateDetail(event) {
        const item = event.detail;
        // parse a sane object from the mess
        this.classification = {
            code: item.code,
            name: item.classificationItemNames[0].name,
            note: item.explanatoryNotes[0].generalNote[0],

        };
        this.render();
    }

    get template() {
        if (!this.classification) {
            return '';
        }
        const item = this.classification;
        return `
        <div>
            <h3> ${item.code} ${item.name} </h3>
            <ul>
                <li> ${item.note} </li>
            </ul>
        </div>
        `;
    }

    get style() {
        return `
    <style>
    div {
        border: 1px solid #c5c5c5;
        width: 30%;
    }
    </style>
    `;
    }

    render() {
        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
        }
        // clear the possible old render
        this.shadowRoot.innerHTML = '';

        // stamp template to DOM
        const temp = document.createElement('template');
        temp.innerHTML = this.style + this.template;
        this.shadowRoot.appendChild(temp.content.cloneNode(true));
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {
        // bubblegum solution for parent div not loading during testing
        if (document.getElementById('faceted')) {
            const parentDiv = document.getElementById('faceted');
            parentDiv.removeEventListener('showDetails', this.updateDetail.bind(this));
        }
    }
}
customElements.define('fs-detail', FsDetail);
