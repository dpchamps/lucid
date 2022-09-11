import {load} from "./loader.js";
import {createFragment} from "./template-binder.js";

export const register = () => {
    customElements.define(
        'import-fragment',
        class extends HTMLElement {
            connectedCallback(){
                const src = this.getAttribute('src');
                load(src)
                    .then(result => {
                        const documentFragment = window.document.createRange().createContextualFragment(result.trim());
                        if(documentFragment.children.length > 1){
                            throw new Error(`Failed to load ${src}. A Fragment should contain exactly one top level node.`)
                        }
                        const template = documentFragment.querySelector('template');

                        if(!template){
                            throw new Error(`Failed to load ${src}, a Fragment must have a template as a top-level node.`);
                        }

                        const id = template.getAttribute('id');

                        if(!id){
                            throw new Error(`Failed to load ${src}, a Fragment must have an id associated with it`);
                        }
                        window.document.body.appendChild(documentFragment);
                        createFragment(id);
                    })
            }
        }
    )
}