export function createButton (className = '') {
    return `
            <button data-type="button" class="${className}">Add new column</button>
        `
}

export function createHeader (className) {
    return `
            <h1 class="${className.heading}">Header</h1>
            ${createButton(className.rounded)}
        `
}
