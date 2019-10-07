class FsDetail extends HTMLElement {
    constructor() {
        super();
        this.classification = null;

        const parentDiv = document.getElementById('faceted');
        if (parentDiv) {
            parentDiv.addEventListener('showDetails', this.updateDetail.bind(this));
        }
    }

    updateDetail(event) {
        this.classification = event.detail;
        this.render();
    }

    get template() {
        if (!this.classification) {
            this.hidden = true;
            return '';
        }
        this.hidden = false;
        const item = this.classification;
        const template = `
        <div>
            <h3> ${item.code} ${item.name} </h3>
            <ul>
                <li class="note">${item.note}</li>
                ${this.excludes}
                ${this.includes}
                ${this.includesAlso}
                ${this.keywords}
            </ul>
        </div>
        `;
        return template;
    }

    get excludes() {
        if (!this.classification.excludes) {
            return '';
        }
        return `
            <li class="excludes"><span class="header">Tähän ei kuulu: </span><span>${this.classification.excludes}</span></li>
            `;
    }

    get includes() {
        if (!this.classification.includes) {
            return '';
        }
        return `
        <li class="includes"><span class="header">Tähän kuuluu: </span><span>${this.classification.includes}</span></li>
        `;
    }

    get includesAlso() {
        if (!this.classification.includesAlso) {
            return '';
        }
        return `
        <li class="includesAlso"><span class="header">Tähän kuuluu myös: </span><span>${this.classification.includesAlso}</span></li>
        `;
    }

    get keywords() {
        if (!this.classification.keywords) {
            return '';
        }
        return `
        <li class="keywords"><span class="header">Hakusanat: </span><span>${this.classification.keywords}</span></li>
        `;
    }

    get style() {
        return `
    <style>
    div {
        border: 1px solid #c5c5c5;
        width: auto;
    }
    h3 {
        font-size 1em;
        margin: 0;
        padding: 10px 10px 5x 10px;
    }
    ul {
        list-style: none;
        padding-top: 0px;
        margin-top 0px;
    }
    li {
        padding 0;
        white-space: pre-wrap;
    }
    .header {
        font-weight: bold;
        font-size: 1em;
    }
    </style>
    `;
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
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {
        const parentDiv = document.getElementById('faceted');
        if (parentDiv) {
            parentDiv.removeEventListener('showDetails', this.updateDetail.bind(this));
        }
    }
}
customElements.define('fs-detail', FsDetail);
