import headerStyles from '@scss/header.scss'
import { Component } from '@core/Component'
import { createHeader } from '@/components/header/header.template'

export class Header extends Component {
    static className = 'notes_header'

    constructor ($root, options) {
        super($root, {
            name: 'Header',
            listeners: ['click'],
            ...options,
        })
        console.log('root', $root)
    }

    click (event) {
    }

    toHTML () {
        return createHeader(headerStyles)
    }
}
