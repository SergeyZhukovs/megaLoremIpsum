import { DomListeners } from '@/core/DomListeners'

export class Component extends DomListeners {
    constructor (selector, options) {
        super(selector, options.listeners)
        this.name = options.name || ''
        this.emitter = options.emitter
    }

    init () {
        this.initDomListeners()
    }
}
