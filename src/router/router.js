export class Router {
    constructor () {
        this.pageHandler = this.pageHandler.bind(this)
        this.init()
    }

    init () {
        window.addEventListener('hashchange', this.pageHandler)
        this.pageHandler()
    }

    pageHandler (event) {
        console.log('route: ', window.location)
    }
}

export function getFromHistory () {
    return history.state
}

export function setToHistory (data, title = 'title', url = '/') {
    history.pushState(data, title, url)
}
