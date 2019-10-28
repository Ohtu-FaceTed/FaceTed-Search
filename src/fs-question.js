const baseUrl = 'http://faceted.ddns.net:5000';

class FsQuestion extends HTMLElement {
    constructor() {
        super();
        this.question = null;
        this.reply = null;
        this.qNumber = 1;
        this.overlay = null;
    }

    get template() {
        return `
        <div class="comp">
          <p class="question">${this.qNumber}. ${this.questionString}</p>
          <div id="overlay">
            <div class="loader loader-default is-active"></div> 
          </div>
          <div class="button-container">   
            <button class="ok">Kyllä</button>
            <button class="no">Ei</button>
            <button class="skip">Ohita</button>
            ${this.qNumber !== 1 ? `<button class="previous">Edellinen</button>` : ''}
            </div>
        </div>
        `;
    }

    get questionString() {
        const qString = this.question.attribute_question;
        return qString ? qString : `Onko rakennuksessa ${this.question.attribute_name}?`;
    }

    get style() {
        return `
        <style> 
        .comp {
            font-family: Arial;
            font-size: 18px;
            background-color: white;
            padding: 10px 10px 5px 10px;
            margin: 10px 10px 10px 10px;
            border: 2px solid #c5c5c5;
            border-radius: 2px;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
            width: auto;
          }
          .question {
            font-size: 18px;
            text-align: center;
          }
          .button-container {
            text-align: center;
            padding: 10px 10px 5px 10px;
          }
          button {
            min-width: 80px;
            background-color: #0073b0;
            border-style: hidden;
            box-shadow: 2px 2px 1px #888888;
            border-radius: 4px;
            font-size: 16px;
            padding: 3px;
            color:white;
            cursor: pointer;
          }
          button:hover {
            color: black;
            background-color: #edf3f8;
            border-color: #6c757d;
          }
          .loader {
            color:#fff;
            position: fixed;
            box-sizing: border-box;
            left: -9999px;
            top: -9999px;
            width: 0;
            height: 0;
            overflow: hidden;
            z-index: 999999
        }
        .loader:after,
        .loader:before { 
            box-sizing: border-box;
            display: none
        }
        .loader.is-active { 
            background-color:rgba(0,0,0,.85);
            width: 100%;
            height: 100%;
            left: 0;
            top: 0
        }
        .loader.is-active:after,
        .loader.is-active:before { 
            display:block
        }
        @keyframes rotation {
            0% { transform: rotate(0) }
            to {transform: rotate(359deg) }
        }
        @keyframes blink {
            0% { opacity:.5 }
            to { opacity:1 }
        }
        .loader-default:after { 
            content: "";
            position: fixed;
            width: 48px;
            height: 48px;
            border: 8px solid #fff;
            border-left-color: transparent;
            border-radius: 50%;
            top: calc(50% - 24px);
            left: calc(50% - 24px);
            animation: rotation 1s linear infinite
        }
        .loader-default[data-half]:after { 
            border-right-color: transparent
        }
        .loader-default[data-inverse]:after { 
            animation-direction:reverse
        }
        </style>
        `;
    }

    // get the preliminary question
    async fetchQuestion() {
        const url = `${baseUrl}/question`;
        return await fetch(url, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .catch((error) => console.error('Error:', error));
    }

    // POST answer and get new question and scores
    async postAnswer(answer) {
        const url = `${baseUrl}/answer`;
        return await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            credentials: 'include',
            body: JSON.stringify(answer),
        }).then((response) => response.json());
    }

    // GET previous question and scores
    async getPrevious() {
        const url = `${baseUrl}/previous`;
        return await fetch(url, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .catch((error) => console.error('Error:', error));
    }

    // sends new classes to list element
    updateClasses() {
        const event = new CustomEvent('updateScores', {
            bubbles: true,
            detail: this.reply.building_classes,
            composed: true,
        });
        this.dispatchEvent(event);
    }

    async connectedCallback() {
        const data = await this.fetchQuestion();
        this.question = data;

        this.render();
    }

    render() {
        if (!this.shadowRoot) {
            this.attachShadow({mode: 'open'});
        }

        this.shadowRoot.innerHTML = '';
        const temp = document.createElement('template');
        temp.innerHTML = this.style + this.template;
        this.shadowRoot.appendChild(temp.content.cloneNode(true));

        this.addEventListeners();
        this.overlay = this.shadowRoot.getElementById('overlay');
        this.overlay.style.display = 'none';
    }

    // handles the logic for responding to user input
    async handleAnswer(response) {
        const answer = {
            language: 'suomi',
            attribute_id: this.question.attribute_id,
            response: response,
        };
        if (response === 'previous') {
            this.qNumber--;
            // activates loader
            this.overlay.style.display = 'block';
            this.reply = await this.getPrevious();
            this.overlay.style.display = 'none';
        } else {
            this.qNumber++;
            this.overlay.style.display = 'block';
            this.reply = await this.postAnswer(answer);
            this.overlay.style.display = 'none';
        }
        if (this.qNumber !== 1) {
            this.question = this.reply.new_question;
        } else {
            this.question = this.reply;
        }

        this.updateClasses();
        this.render();
    }

    // event listeners for answer buttons
    addEventListeners() {
        const okButton = this.shadowRoot.querySelector('.ok');
        okButton.addEventListener('click', (e) => {
            this.handleAnswer('yes');
        });

        const noButton = this.shadowRoot.querySelector('.no');
        noButton.addEventListener('click', (e) => {
            this.handleAnswer('no');
        });
        const skipButton = this.shadowRoot.querySelector('.skip');
        skipButton.addEventListener('click', (e) => {
            this.handleAnswer('skip');
        });
        // /add back button if availialbe
        if (this.qNumber !== 1) {
            const previousButton = this.shadowRoot.querySelector('.previous');
            previousButton.addEventListener('click', (e) => {
                this.handleAnswer('previous');
            });
        }
    }
}

// check for polyfills
const register = () => customElements.define('fs-question', FsQuestion);
window.WebComponents ? window.WebComponents.waitFor(register) : register();
