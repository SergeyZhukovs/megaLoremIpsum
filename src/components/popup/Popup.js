import popupStyles from '@scss/popup.scss'
import { Component } from '@core/Component'
import {createRequest, getFromHistory} from '@core/utils';
import { createModal } from '@/components/popup/popup.template';

export class Popup extends Component {
    static className = popupStyles.notesPopup

    constructor ($root, options) {
        super($root, {
            name: 'Popup',
            listeners: ['click', 'keydown', 'load'],
            ...options,
        })

        this.root = $root
        this.content = {}

        this.emitter.subscribe('modal', (state) => {
            switch (state) {
            case 'open':
                this.content = getFromHistory()
                $root.focus()
                $root.classList.toggle(popupStyles.active)
                this.root.innerHTML = createModal(this.content.data)
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

    async load () {
        const urlParams = new URLSearchParams(window.location.search);
        const myParam = urlParams.get('record');
        if (Number.isInteger(parseInt(myParam))) {
            /* make request*/
            const result = await createRequest(`/api/record/${myParam}`)
            const recordDetail = {}
            result.data.forEach((item) => {
                recordDetail[item.columnName] = item.value
            })
            this.content = {
                data: recordDetail,
            }
            this.emitter.dispatch('modal', 'open')
        }
    }

    toHTML () {
        return createModal()
    }
}
