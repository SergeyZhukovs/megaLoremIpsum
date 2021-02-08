import headerStyles from '@scss/header.scss'
import { Component } from '@core/Component'
import { createHeader } from '@/components/header/header.template'

export class Header extends Component {
    static className = headerStyles.notesHeader

    constructor ($root, options) {
        super($root, {
            name: 'Header',
            listeners: ['click'],
            ...options,
        })
    }

    click (event) {
    }

    toHTML () {
        return createHeader(headerStyles)
    }
}
