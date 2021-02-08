// import commonStyles from '@scss/common.scss'
import popupStyles from '@scss/popup.scss'
import { Component } from '@core/Component'
import {createRequest, getFromHistory} from '@core/utils';

export class Popup extends Component {
    static className = popupStyles.notesPopup

    constructor ($root, options) {
        super($root, {
            name: 'Popup',
            listeners: ['click', 'keydown'],
            ...options,
        })

        this.content = getFromHistory()

        window.addEventListener('load', () => {
            this.modalOnLoad()
        })

        this.emitter.subscribe('modal', (state) => {
            switch (state) {
            case 'open':
                console.log('foc')
                $root.focus()
                console.log('---foc---')
                // eslint-disable-next-line no-case-declarations
                let data = {}
                if (this.content) {
                    data = Object.keys(this.content.data)
                }
                $root.classList.toggle(popupStyles.active)
                document.querySelector(`.${popupStyles.modalBody}`).innerHTML = `<div>
            ${data.map((item) => (item))}
            </div>`
                break
            case 'close':
                $root.classList.toggle(popupStyles.active)
                history.back()
                break
            }
        })
    }

    click (event) {
        const target = event.target
        const action = target.dataset.action
        const isClosest = target.closest(`.${popupStyles.modal}`)
        if (!isClosest || action === 'close') {
            this.emitter.dispatch('modal', 'close')
        }
    }

    keydown (e) {
        if (e.code === 'Escape') {
            this.emitter.dispatch('modal', 'close')
        }
    }

    async modalOnLoad () {
        const urlParams = new URLSearchParams(window.location.search);
        const myParam = urlParams.get('record');
        if (Number.isInteger(parseInt(myParam))) {
            /* make request*/
            const result = await createRequest(`/api/record/${myParam}`)
            this.content = result
            this.emitter.dispatch('modal', 'open')
        }
    }

    toHTML () {
        return `<div class="popup ${popupStyles.modal}">
            <div class="${popupStyles.modalHeader}">
                <div class="${popupStyles.title}">Record Number:</div>
                <div class="md-body ${popupStyles.modalBody}">
                    Are you sure you want to add new record!!!!?
                </div>
                <div class="close">
                    <button class="${popupStyles.closeModal}" data-action="close">X</button>
                </div>
            </div>
            <div class="${popupStyles.modalBody}">
            </div>
        </div>`
    }
}
