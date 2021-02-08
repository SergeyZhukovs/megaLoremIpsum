import footerStyles from '@scss/footer.scss'
import { Component } from '@core/Component'

export class Footer extends Component {
    static className = footerStyles.footer

    constructor ($root, options) {
        super($root, { name: 'footer', ...options })
    }

    toHTML () {
        return '&copy; All rights reserved'
    }
}
