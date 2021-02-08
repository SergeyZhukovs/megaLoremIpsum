export class DomListeners {
    constructor (selector, listeners = []) {
        this.selector = selector
        this.listeners = listeners
    }

    initDomListeners () {
        this.listeners.forEach((listener) => {
            if (listener === 'load') this.selector = window
            this[listener] = this[listener].bind(this)
            this.selector.addEventListener(listener, this[listener])
        })
    }

    removeDomListeners () {
        this.listeners.forEach((listener) => {
            this.selector.removeEventListener(listener, this[listener])
        })
    }
}
