import tableStyles from '@scss/tables.scss'
import { Component } from '@core/Component'
import { createList } from '@/components/list/list.template';
import { saveIcon, editIcon } from '@core/icons'
import {createRequest, setToHistory} from '@core/utils'

export class List extends Component {
    static className = tableStyles.notesTable

    constructor ($root, options) {
        super($root, {
            name: 'List',
            listeners: ['click'],
            ...options,
        })

        this.rt = $root
    }

    async fetchData () {
        const result = await createRequest('/api/getList')
        return result
    }

    prepareData (target, saveDate = true) {
        let recordId = 0
        const updatedData = {}
        for (let i = 0; i < target.length; i++) {
            const className = target[i].className
            if (className === 'data-container') {
                const columnName = target[i].dataset.th
                target[i].toggleAttribute('contenteditable')
                if (saveDate) {
                    updatedData[columnName] = target[i].textContent.replace(/^\s+|\s+$/g, '')
                }
            }
            if (className === 'non-edit') {
                recordId = target[i].textContent.replace(/^\s+|\s+$/g, '')
            }
        }

        if (saveDate) {
            return {id: recordId, data: updatedData}
        }
        return {id: recordId}
    }

    async click (event) {
        const btn = event.target.nodeName !== 'BUTTON' &&
            event.target.closest('button') ||
            event.target
        const action = btn.dataset.action
        const cells = event.target.closest('.rw').children
        switch (action) {
        case 'view':
            // eslint-disable-next-line no-case-declarations
            const dataObject = this.prepareData(cells)
            setToHistory(dataObject, '', `./?record=${dataObject.id}`)
            this.emitter.dispatch('modal', 'open')
            break
        case 'delete':
            this.emitter.dispatch('confirming', {type: 'delete'})
            // eslint-disable-next-line no-case-declarations
            const unsubscribeDelete = this.emitter.subscribe('confirming', async (state) => {
                if (state === 'confirmed') {
                    const dataObject = this.prepareData(cells, false)
                    await createRequest('/api/delete-record', 'DELETE', {
                        data: dataObject,
                    })
                    btn.closest('.rw').remove()
                    // this.rt.innerHTML = createList(data, false)
                }
                unsubscribeDelete()
            })
            break
        case 'save':
            this.emitter.dispatch('confirming', {type: 'update'})
            // eslint-disable-next-line no-case-declarations
            const unsubscribeUpdate = this.emitter.subscribe('confirming', async (state) => {
                console.log('subscribe update record: ', state)
                if (state === 'confirmed') {
                    const dataObject = this.prepareData(cells)
                    await createRequest('/api/update-record', 'PUT', {
                        data: dataObject,
                    })
                }
                btn.dataset.action = 'edit'
                btn.innerHTML = editIcon()
                btn.classList.toggle(tableStyles.activeBtn)

                btn.closest('.rw').classList.toggle(tableStyles.editable)
                unsubscribeUpdate()
            })
            break
        case 'edit':
            // eslint-disable-next-line no-case-declarations
            for (let i = 0; i < cells.length; i++) {
                const className = cells[i].className
                if (className === 'data-container') {
                    cells[i].toggleAttribute('contenteditable')
                }
            }
            btn.dataset.action = 'save'
            btn.innerHTML = saveIcon()
            btn.classList.toggle(tableStyles.activeBtn)

            btn.closest('.rw').classList.toggle(tableStyles.editable)
            break
        default:
            // console.log('event.target: ', action)
            // this.emitter.dispatch('new record', 'canceled')
            break
        }
    }

    toHTML () {
        const requestTime = new Date().getTime()
        this.fetchData().then((data) => {
            const responseTime = new Date().getTime()
            const dif = responseTime - requestTime
            const timeout = dif > 3000 ? 0 : 5000
            setTimeout(() => {
                this.rt.innerHTML = createList(data, false)
            }, timeout)
        })

        return createList()
    }
}
