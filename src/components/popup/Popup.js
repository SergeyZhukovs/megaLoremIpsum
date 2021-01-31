import commonStyles from '@scss/common.scss'
import popupStyles from '@scss/popup.scss'
import { Component } from '@core/Component'

export class Popup extends Component {
    static className = popupStyles.notesPopup

    constructor ($root, options) {
        super($root, {
            name: 'Popup',
            listeners: ['click'],
            ...options,
        })

        this.openPopup = false

        window.onpopstate = function (event) {
            console.warn(`location: ${document.location}, state: ${JSON.stringify(event.state)}`)
        }

        this.emitter.subscribe('click to open popup', (state) => {
            this.openPopup = state
            document.querySelector('.popup').parentElement.classList.add(popupStyles.showPopup)
            console.log('event from header', state)
        })
    }

    click (event) {
        const target = event.target
        const modalSelector = `.popup`
        const isClosest = target.closest(modalSelector)
        console.log('modalSelector: ', modalSelector)
        if (!isClosest) {
            this.emitter.dispatch('click to open popup', false)
            console.log('click popup', event.target.className)
            const popupElem = document.querySelector('.popup')
            // popupElem.parentElement.classList.add(popupStyles.hidePopup)
            popupElem.parentElement.classList.remove(popupStyles.showPopup)
        }
    }

    toHTML () {
        return `<div class="popup ${popupStyles.modal}">
        <div class="${popupStyles.modalHeader}">
            <h3>Add new reacord</h3>
            <div class="${popupStyles.closeModal} ${commonStyles.icon} ${commonStyles.close}"></div>
        </div>
        <div class="modal-body">
            <div>
                <input name="record" type="text"/>
            </div>
            <div>
                <input name="record" type="text"/>
            </div>
            <div>
                <input name="record" type="text"/>
            </div>
            <div>
                <input name="record" type="text"/>
            </div>
            <div class="button1">Page 1</div>
            <div class="button2">Page 2</div>
            <div class="button3">Page 3</div>
        </div>
        <div class="modal-footer">
            <button>Save</button>
            <button>Close</button>
        </div>
        <div class="buttonBack">Back</div>
    </div>`
    }

    destroy () {
        super.destroy()
    }
}
