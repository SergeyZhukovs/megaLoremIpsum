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

        /* const keydown = (event) => {
            console.log('e ->', event)
        }*/

        // document.querySelector('.confirm-popup___1EJOT').addEventListener('keydown', keydown);

        this.emitter.subscribe('new record', (state) => {
            console.log('confirm action', state)
            this.dialogHandler(confirmPopupStyles.title)
            document.querySelector(`.${confirmPopupStyles.title}`).innerHTML = 'Add new record?'
            document.
                querySelector('.md-body')
                .innerHTML = 'Are you sure you want to add new record?'
            document
                .querySelector(`.${PopupConfirm.className}`)
                .classList.toggle(confirmPopupStyles.active)
        })

        this.emitter.subscribe('delete record', (state) => {
            console.log('confirm action', state)

            document.querySelector(`.${confirmPopupStyles.title}`).innerHTML = 'Delete record?'
            document.
                querySelector('.md-body')
                .innerHTML = 'Are you sure you want to delete a record?'

            document
                .querySelector(`.${PopupConfirm.className}`)
                .classList.toggle(confirmPopupStyles.active)
            $root.focus()
        })

        this.emitter.subscribe('update record', (state) => {
            console.log('confirm action', state)

            document.querySelector(`.${confirmPopupStyles.title}`).innerHTML = 'Update record?'
            document.
                querySelector('.md-body')
                .innerHTML = 'Are you sure you want to update this record?'

            this.dialogHandler(confirmPopupStyles.title)
            document
                .querySelector(`.${PopupConfirm.className}`)
                .classList.toggle(confirmPopupStyles.active)
            $root.focus()
        })
    }

    dialogHandler (text) {
        console.log('text ...', text, '===')
    }

    click (event) {
        const action = event.target.dataset.action
        console.log('event.target.dataset: ', action)
        switch (action) {
        case 'confirm':
            /* TO-DO FIX*/
            this.emitter.dispatch('new record', 'confirmed')
            this.emitter.dispatch('update record', 'confirmed')
            this.emitter.dispatch('delete record', 'confirmed')
            break
        case 'cancel':
            this.emitter.dispatch('new record', 'canceled')
            break
        default:
            // eslint-disable-next-line no-case-declarations
            const isClosest = event.target.closest(`.${confirmPopupStyles.modal}`)
            if (!isClosest) {
                this.emitter.dispatch('new record', 'canceled')
            }
            break
        }
    }

    keydown (e) {
        if (e.code === 'Escape') {
            this.emitter.dispatch('delete record', 'canceled')
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
                <div class="${confirmPopupStyles.modalFooter}">
                    <div class="${confirmPopupStyles.controls}">
                        <button class="${confirmPopupStyles.confirmModal}" data-action="confirm">
                            Confirm
                        </button>
                        <button class="${confirmPopupStyles.cancelModal}" data-action="cancel">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>`

        /*        return `<div class="${confirmPopupStyles.item}">
            <div class="${confirmPopupStyles.modal}">
                <div class="${confirmPopupStyles.modalHeader}">
                    <div class="${confirmPopupStyles.title}">Add new record!!!?</div>
                    <div class="close">
                        <button class="cancel">X</button>
                    </div>
                </div>
                <div class="md-body ${confirmPopupStyles.modalBody}">
                    Are you sure you want to add new record!!!!?
                </div>
                <div class="${confirmPopupStyles.modalFooter}">
                    <div class="${confirmPopupStyles.controls}">
                        <button class="${confirmPopupStyles.confirmModal}" data-action="confirm">
                            Confirm
                        </button>
                        <button class="${confirmPopupStyles.cancelModal}" data-action="cancel">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>`*/
    }
}
