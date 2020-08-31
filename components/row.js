class RowComponent extends HTMLElement {
    shadow;

    constructor() {
        super();
        this.setupShadow();
    }

    setupShadow() {
        this.shadow = this.attachShadow({ mode: 'open' });
        const template = document.getElementById('row-component');
        const templateContent = template.content;
        this.shadowRoot.appendChild(templateContent.cloneNode(true))
    }
}

customElements.define('row-component', RowComponent);