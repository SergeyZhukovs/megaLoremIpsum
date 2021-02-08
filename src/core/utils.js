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
    label.classList.add(...className)
    label.appendChild(innerEl)
    return label.outerHTML
}

export function createInpt (isLoading = true, type = 'text', name = 'blank',
    className= 'input', isRequired = false, cellClass, contentClass) {
    className = typeof className === 'string' ? className.split(' ') : className
    cellClass = typeof cellClass === 'string' ? cellClass.split(' ') : cellClass
    contentClass = typeof contentClass === 'string' ? contentClass.split(' ') : contentClass
    if (isLoading) {
        const loaderEl = document.createElement('div')
        const innerEl = document.createElement('span')
        loaderEl.classList.add(...cellClass)
        innerEl.classList.add(...contentClass)
        loaderEl.appendChild(innerEl)
        return loaderEl.outerHTML
    }

    const input = document.createElement('input')
    input.setAttribute('type', type)
    input.setAttribute('name', name)
    if (isRequired) input.setAttribute('required', '')
    input.classList.add(...className)
    return input.outerHTML
}

export function createBtn (isLoading = true, cellClass,
    contentClass, type = 'submit', btnText = 'Submit') {
    cellClass = typeof cellClass === 'string' ? cellClass.split(' ') : cellClass
    contentClass = typeof contentClass === 'string' ? contentClass.split(' ') : contentClass
    if (isLoading) {
        const el = document.createElement('div')
        el.classList.add(...cellClass)
        const innerEl = document.createElement('span')
        innerEl.classList.add(...contentClass)
        el.appendChild(innerEl)
        return el.outerHTML
    }

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

