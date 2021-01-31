import tableStyles from '@scss/tables.scss'
import { Component } from '@core/Component'
import { createList } from '@/components/list/list.template';
import { createRequest } from '@core/utils'

export class List extends Component {
    static className = tableStyles.notesTable

    constructor ($root, options) {
        super($root, {
            name: 'List',
            listeners: ['click'],
            ...options,
        })

        this.rt = $root

        this.emitter.dispatch('open modal', true)
    }

    async fetchData () {
        const result = await createRequest('/api/getList')
        return result
    }

    async click (event) {
        const action = event.target.dataset.action
        const cells = event.target.closest('tr').children
        console.log('click', event)
        switch (action) {
        case 'view':
            this.emitter.dispatch('click to open popup', false)
            break
        case 'delete':
            this.emitter.dispatch('delete record')
            // eslint-disable-next-line no-case-declarations
            const unsubscribeDelete = this.emitter.subscribe('delete record', async (state) => {
                if (state === 'confirmed') {
                    await createRequest('/api/delete-record', 'DELETE', {
                        data: {},
                    })
                }
                unsubscribeDelete()
            })
            break
        case 'save':
            this.emitter.dispatch('update record', 'confirm')
            // eslint-disable-next-line no-case-declarations
            const unsubscribeUpdate = this.emitter.subscribe('update record', async (state) => {
                console.log('subscribe update record: ', state)
                if (state === 'confirmed') {
                    let recordId = 0
                    const updatedData = {}
                    for (let i = 0; i < cells.length; i++) {
                        const className = cells[i].className
                        if (className === 'data-container') {
                            const columnName = cells[i].dataset.th
                            cells[i].toggleAttribute('contenteditable')
                            updatedData[columnName] = cells[i].textContent.replace(/^\s+|\s+$/g, '')
                        }
                        if (className === 'non-edit') {
                            recordId = cells[i].textContent.replace(/^\s+|\s+$/g, '')
                        }
                    }
                    event.target.dataset.action = 'edit'
                    event.target.textContent = 'Edit'
                    event.target.closest('tr').classList.toggle('editable')
                    console.log('cells: ', cells)
                    await createRequest('/api/update-record', 'PUT', {
                        data: {id: recordId, data: updatedData},
                    })
                }
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

            // console.log('cells', cells)
            break
        default:
            // console.log('event.target: ', action)
            // this.emitter.dispatch('new record', 'canceled')
            break
        }
    }

    /* ToDo: get list columns names and values from history*/

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
