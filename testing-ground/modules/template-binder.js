import {EVENT_LIST} from './event-list.js';
import {createContext} from "./context.js";

export class TemplateBinder extends HTMLElement {
    constructor() {
        super();
        this.onCleanup = () => {};
    }

    static createBoundFunction(intrinsicFnBody, context){
        const boundFn = context.withScope(intrinsicFnBody, 'event');

        return (event) => boundFn.call(null, event);
    }

    static bindTemplate(root, context){
        const stack = [];

        while(root){
            stack.push(...Array.from(root.children));

            if(root.hasAttributes && root.hasAttributes()){
                for(const {name, value} of root.attributes){
                    if(EVENT_LIST.has(name)){
                        root[name] = context.withScope(value, 'event')
                    }
                }
            }

            if(root.nodeName === "WITH-CTX"){
                root.context = context;
            }

            root = stack.pop();
        }
    }

    async connectedCallback(componentName){
        const template = document.getElementById(componentName);
        const content = template.content;

        const script = content.querySelector('script');
        const shadowRoot = this.attachShadow({mode: 'open'});

        const objectUrl = URL.createObjectURL(new Blob([
            script.innerText.trim()
        ], {
            type: 'text/javascript'
        }));
        const module = await import(objectUrl);
        const context = createContext(module);
        const clonedContent = content.cloneNode(true);
        TemplateBinder.bindTemplate(clonedContent, context);

        this.onCleanup = () => {
            URL.revokeObjectURL(objectUrl);
        }
        shadowRoot.appendChild(clonedContent);
    }

    disconnectedCallback(){
        this.onCleanup();
    }
}

export const createFragment = (name) => {
    customElements.define(
        name,
        class extends TemplateBinder{
            async connectedCallback() {
                return super.connectedCallback(name);
            }
        }
    )
}