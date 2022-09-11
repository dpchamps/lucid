const entityMap = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    '&quot;': '"',
    '&#39;': "'",
    '&#x2F;': "/"
};

export class WithContext extends HTMLElement {
    constructor() {
        super();
        this.initialized = false;
    }

    static sanitizeTemplate(str){
        return str.replace(/&[#\w]+;/g, (s) => entityMap[s]);
    }

    interpolate(){
        const templatized = `return \`${this.template.trim()}\``;
        const interpolate = this.context.withScope(templatized);

        if(!this.initialized){
            this.initialized = true;
            this.innerHTML = interpolate();
            return;
        }

        const next = this.cloneNode(true);
        next.innerHTML = interpolate();
        const thisWalker = document.createTreeWalker(this, NodeFilter.SHOW_ALL);
        const nextWalker = document.createTreeWalker(next, NodeFilter.SHOW_ALL);
        const replacements = [];
        thisWalker.nextNode();
        nextWalker.nextNode();
        let nextNode = thisWalker.currentNode;

        while(nextNode){
            if(!thisWalker.currentNode.isEqualNode(nextWalker.currentNode)){
                console.log(`Not equal`, thisWalker.currentNode, nextWalker.currentNode)
                replacements.push([new WeakRef(thisWalker.currentNode.parentNode), new WeakRef(thisWalker.currentNode), new WeakRef(nextWalker.currentNode)]);
                nextNode = thisWalker.nextSibling();
                nextWalker.nextSibling()
            }else{
                nextNode = thisWalker.nextNode();
                nextWalker.nextNode();
            }
        }

        for(const [parent, current, next] of replacements){
            parent.deref().replaceChild(next.deref(), current.deref());
        }
    }

    connectedCallback(){
        this.template = WithContext.sanitizeTemplate(this.innerHTML);
        this.interpolate();
        this.context.onStateChange(() => {
            this.interpolate()
        })
    }

    attributeChangedCallback(name, oldValue, newValue) {
        debugger
    }

    static get observedAttributes(){
        return ['debug']
    }
}

export const register = () => {
    customElements.define('with-ctx', WithContext);
}

