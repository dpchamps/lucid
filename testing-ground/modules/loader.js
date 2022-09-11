
const intoText = (response) => {
    if(!response.ok){
        throw new Error(`Failed to load resource ${response}`)
    }

    return response.text()
}

export const load = (src) => {
    const {href} = new URL(src, import.meta.url);

    return fetch(href).then(intoText)
}