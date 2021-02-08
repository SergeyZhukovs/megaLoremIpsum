import { Component } from '@core/Component'
import confirmPopupStyles from '@scss/confirmPopup.scss'

export class PopupConfirm extends Component {
    static className = confirmPopupStyles.confirmPopup

    constructor ($root, options) {
        super($root, {
            name: 'PopupConfirm',
            listeners: ['click', 'keydown'],
            ...options,
        })

        this.rtty = $root

        this.emitter.subscribe('confirming', (state) => {
            /* we are watching for CRUD */
            document
                .querySelector(`.${PopupConfirm.className}`)
                .classList.toggle(confirmPopupStyles.active)
            $root.focus()
            const title = document.querySelector(`.${confirmPopupStyles.title}`)
            const body = document.querySelector('.md-body')
            switch (state.type) {
            case 'create':
                title.innerHTML = 'Add new record?'
                body.innerHTML = 'Are you sure you want to add new record?'
                break
            case 'update':
                title.innerHTML = 'Update record?'
                body.innerHTML = 'Are you sure you want to update this record?'
                $root.focus()
                break
            case 'delete':
                title.innerHTML = 'Delete record?'
                body.innerHTML = 'Are you sure you want to delete a record?'
                console.log('focus: ', document.activeElement)
                break
            }
        })
    }

    click (event) {
        const action = event.target.dataset.action
        document
            .querySelector(`.${PopupConfirm.className}`)
            .classList.toggle(confirmPopupStyles.active)
        switch (action) {
        case 'confirm':
            this.emitter.dispatch('confirming', 'confirmed')
            break
        case 'cancel':
            this.emitter.dispatch('confirming', 'canceled')
            break
        default:
            // eslint-disable-next-line no-case-declarations
            const isClosest = event.target.closest(`.${confirmPopupStyles.modal}`)
            if (!isClosest) {
                this.emitter.dispatch('confirming', 'canceled')
            }
            break
        }

        document
            .querySelector(`.${PopupConfirm.className}`)
            .classList.toggle(confirmPopupStyles.active)
    }

    keydown (e) {
        if (e.code === 'Escape') {
            this.emitter.dispatch('confirming', 'canceled')
        }
    }

    toHTML () {
        return `<div class="${confirmPopupStyles.modal}">
                <div class="${confirmPopupStyles.modalHeader}">
                    <div class="${confirmPopupStyles.title}">Add new record!!!?</div>
                    <div class="close">
                        <button class="cancel" data-action="cancel">X</button>
                    </div>
                </div>
                <div class="md-body ${confirmPopupStyles.modalBody}">
                    Are you sure you want to add new record!!!!?
                </div>
                <div class="${confirmPopupStyles.controls}">
                    <button class="${confirmPopupStyles.confirmModal}" data-action="confirm">
                        Confirm
                    </button>
                    <button class="${confirmPopupStyles.cancelModal}" data-action="cancel">
                        Cancel
                    </button>
                </div>
            </div>`
    }
}
