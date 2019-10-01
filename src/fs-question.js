const baseUrl = 'http://faceted.ddns.net:5000'; // 'http://0.0.0.0:5000'; //

class FsQuestion extends HTMLElement {
    constructor() {
        super();
        this.question = null;
        this.reply = null;
    }

    get template() {
        return `
        <div class='comp'>
          <p class='question'>
            Onko rakennuksessa <span>${this.question.attribute_name}</span>?
          </p>
          <div class='button-container'>
            <button class="ok">Kyllä</button>
            <button class="no">Ei</button>
          </div>
        </div>
        `;
    }

    get style() {
        return `
        <style> 
        .comp {
            font-family: Arial;
            font-size: 18px;
            padding: 10px 10px 5px 10px;
            position: absolute;
            top: 30%;
            left: 55%;
            transform: translate(-50%,-50%);
            border: 2px solid #c5c5c5;
            border-radius: 2px;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
            
            min-width: 300px;
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
            background-color: #4078a5;
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
        </style>
        `;
    }

    // get the preliminary question
    async fetchQuestion() {
        const url = `${baseUrl}/question`;
        return await fetch(url, {
            method: 'GET',
            mode: 'cors',
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
            body: JSON.stringify(answer),
        }).then((response) => response.json());
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

        if (this.question) {
            this.render();
        }
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
    }

    // handles the logic for responding to user input
    async handleAnswer(response) {
        const answer = {
            language: 'suomi',
            attribute_id: this.question.attribute_id,
            response: response,
        };
        this.reply = await this.postAnswer(answer);
        this.updateClasses();
        this.question = this.reply.new_question;
        this.render();
    }

    // event listeners for answer buttons
    addEventListeners() {
        const okButton = this.shadowRoot.querySelector('.ok');
        okButton.addEventListener('click', (e) => {
            this.handleAnswer(true);
        });

        const noButton = this.shadowRoot.querySelector('.no');
        noButton.addEventListener('click', (e) => {
            this.handleAnswer(false);
        });
    }
}

// check for polyfills
const register = () => customElements.define('fs-question', FsQuestion);
window.WebComponents ? window.WebComponents.waitFor(register) : register();
