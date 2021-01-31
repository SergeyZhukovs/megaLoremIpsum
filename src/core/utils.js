export function capitalize (string) {
    if (typeof string !== 'string') {
        return ''
    }
    return `${string.charAt(0).toUpperCase()}${string.slice(1)}`
}

export function getFromHistory () {
    return history.state
}

export function setToHistory (data, title = 'title', url = '/') {
    history.pushState(data, title, url)
}

export function createLabel (text = '', className= 'label', innerClass = 'inner') {
    if (innerClass === '') innerClass = 'inner'
    innerClass = typeof innerClass === 'string' ? innerClass.split(' ') : innerClass
    const label = document.createElement('label')
    const innerEl = document.createElement('span')
    innerEl.classList.add(...innerClass)
    innerEl.appendChild(document.createTextNode(text))
    label.setAttribute('class', className)
    label.appendChild(innerEl)
    return label.outerHTML
}

export function createInpt (type = 'text', name = '', className= 'input', isRequired = false) {
    const input = document.createElement('input')
    input.setAttribute('type', type)
    input.setAttribute('name', name)
    if (isRequired) input.setAttribute('required', '')
    input.setAttribute('class', `${className}`);
    return input.outerHTML
}

export function createBtn (type = 'submit', btnText = 'Submit') {
    const submitButton = document.createElement('input')
    submitButton.setAttribute('type', type)
    submitButton.setAttribute('value', btnText)
    return submitButton.outerHTML
}

export function getColumnName (data) {
    const columns = []
    data.forEach((item) => {
        item.data.forEach((column) => {
            if (columns.includes(column.columnName)) return
            columns.push(column.columnName)
        })
    })
    return columns.filter((field) => field.toLowerCase() !== 'id')
}

export async function createRequest (apiPath, type = 'get', data = {}) {
    let options = {}
    if (type.toUpperCase() !== 'GET') {
        options = {
            method: type.toUpperCase(),
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    }

    const response = await fetch(apiPath, options)
    return await response.json()
}
