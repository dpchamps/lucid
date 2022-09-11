class Fragment extends HTMLElement {}

export const register = () => {
    customElements.define('x-fragment', Fragment);
}