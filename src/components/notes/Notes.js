import {Emitter} from '@core/Emitter';

export class Notes {
    constructor (selector, options) {
        this.appRoot = document.querySelector(selector)
        this.components = options.components || []
        this.emitter = new Emitter()
    }

    getRoot () {
        const rootElement = document.createElement('div')
        rootElement.classList.add('notes')
        this.components = this.components.map((Component) => {
            this.componentRoot = document.createElement('div')
            this.componentRoot.classList.add(Component.className)
            const component = new Component(this.componentRoot, {
                emitter: this.emitter,
            })
            if (component.name) {
                window['c'+ component.name] = component
            }
            this.componentRoot.innerHTML = component.toHTML()
            rootElement.append(this.componentRoot)
            return component
        })

        return rootElement
    }

    render () {
        this.appRoot.append(this.getRoot())

        this.components.forEach((component) => component.init())
    }

    destroy () {
        this.components.forEach((component) => component.destroy())
    }
}

