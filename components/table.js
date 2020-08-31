class TableComponent extends HTMLElement {
    constructor() {
        super();
        this.setupShadow();
    }

    setupShadow() {
        this.shadow = this.attachShadow({ mode: 'open' });
        const template = document.getElementById('table-component');
        const templateContent = template.content;
        this.shadowRoot.appendChild(templateContent.cloneNode(true))
    }

    static get observedAttributes() {
        return ['loading', 'itemsFetched', 'input'];
    }

    get input() {
        return JSON.parse(this.getAttribute('input'));
    }

    set input(v) {
        this.setAttribute('input', JSON.stringify(v));
    }

    get loading() {
        return JSON.parse(this.getAttribute('loading'));
    }

    set loading(v) {
        this.setAttribute('loading', JSON.stringify(v));
    }

    get items() {
        return JSON.parse(this.getAttribute('itemsFetched'));
    }

    set items(v) {
        this.setAttribute('itemsFetched', JSON.stringify(v))
    }

    async fetchItems(url) {
        this.loading = true;
        const response = await fetch(url);
        const json = await response.json();
        this.itemsFetched = json;
        this.loading = false;
    }

    async connectedCallback() {
        await this.fetchItems('https://jsonplaceholder.typicode.com/users').then(() => {
            for (const item of this.itemsFetched) {
                this.appendNewItem(item)
            }
        })

        let userInput = document.querySelector('table-component').shadowRoot.querySelector('input');

        userInput.addEventListener('keyup', event => {
            this.input = event.target.value;
        })
    }

    disconnectedCallback() {
    }

    attributeChangedCallback(attributeName, oldVal, newVal) {
        //filter items depending on search input
        switch (attributeName) {
            case 'input':
                this.updateNodeList();
            default:
                break;
        }
    }

    appendNewItem(item) {
        const newRow = document.createElement('row-component');
        newRow.id = 'row-' + item.id;
        newRow.classList = 'row ' + (item.id%2 ? 'dark' : 'bright');
        newRow.innerHTML = `
            <span slot="name">${item.name}</span>
            <span slot="email">${item.email}</span>
            <span slot="city">${item.address.city}</span>
            <span slot="website">${item.website}</span>
        `;
        const container = this.shadow.querySelector('.table-section');
        container.appendChild(newRow)
    }

    updateNodeList() {
        let userSelected = this.itemsFetched.filter(el => {
            return  el.name.includes(this.input) ||
                    el.address.city.includes(this.input) ||
                    el.website.includes(this.input)
        })
        
        const container = this.shadow.querySelector('.table-section');
        
        while (container.hasChildNodes()) {
            container.removeChild(container.firstChild);
        }
        
        for (const item of userSelected) {
            this.appendNewItem(item)
        }
    }
}

customElements.define('table-component', TableComponent);

// customElements.whenDefined('table-component').then(() => {
//     let userInput = document.querySelector('table-component').shadowRoot.querySelector('input');

//     userInput.addEventListener('keyup', event => {
//         this.input = event.target.value;
//     })
// })