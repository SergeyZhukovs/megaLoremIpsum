import commonStyles from '@scss/common.scss'
import popupStyles from '@scss/popup.scss'
import { Component } from '@core/Component'
import {getFromHistory} from '@core/utils';

export class Popup extends Component {
    static className = popupStyles.notesPopup

    constructor ($root, options) {
        super($root, {
            name: 'Popup',
            listeners: ['click', 'load'],
            ...options,
        })

        this.componentRoot = $root

        window.onpopstate = function (event) {
            console.warn(`location: ${document.location}, state: ${JSON.stringify(event.state)}`)
        }

        const subscribe = this.emitter.subscribe('click to open popup', (state) => {
            const info = getFromHistory()
            let data = {}
            if (!info) {
                data = {}
            } else {
                data = Object.keys(info.data)
            }
            this.componentRoot.classList.toggle(popupStyles.showPopup)
            document.querySelector(`.${popupStyles.modalBody}`).innerHTML = `<div>
            ${data.map((item) => (item))}
            </div>`
            subscribe()
        })

        const urlParams = new URLSearchParams(window.location.search);
        const myParam = urlParams.get('record');
        console.log('myParam: ', Number.isInteger(parseInt(myParam)))
        if (Number.isInteger(parseInt(myParam))) {
            // this.emitter.dispatch('click to open popup', false)
            setTimeout(() => {
                // this.emitter.dispatch('click to open popup', false)
            }, 5000)
        }
    }

    load (e) {
        console.warn('============')
    }

    click (event) {
        const target = event.target
        const modalSelector = document.querySelector(`.${popupStyles.modal}`)
        const isClosest = target.closest(modalSelector)
        console.log('modalSelector: ', modalSelector)
        if (!isClosest) {
            this.emitter.dispatch('click to open popup', false)
            console.log('click popup', event.target.className)
            this.componentRoot.classList.toggle(popupStyles.showPopup)
            history.back()
        }
    }

    toHTML () {
        return `<div class="popup ${popupStyles.modal}">
        <div class="${popupStyles.modalHeader}">
            <h3>Add new reacord</h3>
            <div class="${popupStyles.closeModal} ${commonStyles.icon} ${commonStyles.close}"></div>
        </div>
        <div class="${popupStyles.modalBody}">
            
            <div class="button1">Page 1</div>
            <div class="button2">Page 2</div>
            <div class="button3">Page 3</div>
        </div>
        <div class="modal-footer">
            <button>Close</button>
        </div>
    </div>`
    }

    destroy () {
        super.destroy()
    }
}
