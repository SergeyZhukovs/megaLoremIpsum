import tableStyles from '@scss/tables.scss'
import { Component } from '@core/Component'
import { createList } from '@/components/list/list.template';
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

        // this.emitter.dispatch('open modal', true)
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
        const action = event.target.dataset.action
        const cells = event.target.closest('tr').children
        console.log('click', event)
        switch (action) {
        case 'view':
            // eslint-disable-next-line no-case-declarations
            const dataObject = this.prepareData(cells)
            setToHistory(dataObject, '', `./?record=${dataObject.id}`)
            this.emitter.dispatch('click to open popup', false)
            break
        case 'delete':
            this.emitter.dispatch('confirming', {type: 'delete'})
            // eslint-disable-next-line no-case-declarations
            const unsubscribeDelete = this.emitter.subscribe('confirming', async (state) => {
                console.log('delete !!!!!')
                if (state === 'confirmed') {
                    console.log('delete <---->')
                    const dataObject = this.prepareData(cells, false)
                    /* let recordId = 0
                    for (let i = 0; i < cells.length; i++) {
                        const className = cells[i].className
                        if (className === 'non-edit') {
                            recordId = cells[i].textContent.replace(/^\s+|\s+$/g, '')
                            break
                        }
                    }*/
                    const result = await createRequest('/api/delete-record', 'DELETE', {
                        data: dataObject,
                    })
                    event.target.closest('tr').remove()
                    console.log('result: ', result)
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
                event.target.dataset.action = 'edit'
                event.target.textContent = 'Edit'
                event.target.closest('tr').classList.toggle('editable')
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
            event.target.dataset.action = 'save'
            event.target.textContent = 'Save'

            event.target.closest('tr').classList.toggle('editable')
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
            const timeout = dif > 3000 ? 0 : 3000
            setTimeout(() => {
                this.rt.innerHTML = createList(data, false)
            }, timeout)
        })

        return createList()
    }
}
