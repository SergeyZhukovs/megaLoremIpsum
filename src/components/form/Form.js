import formStyles from '@scss/form.scss'
import { Component } from '@core/Component'
import { createRecordForm } from '@/components/form/form.template';
import { createRequest } from '@core/utils'

export class Form extends Component {
    static className = formStyles.formContainer

    constructor ($root, options) {
        super($root, {
            name: 'Form',
            listeners: ['submit'],
            ...options,
        })

        this.rt = $root
    }

    async submit (event) {
        event.preventDefault()
        const elements = document.querySelector(event.target.localName).elements
        const data = {}
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].type === 'submit' ) continue
            data[elements[i].name] = elements[i].value
        }

        this.emitter.dispatch('confirming', 'create')

        const unsubscribe = this.emitter.subscribe('confirming', async (state) => {
            if (state === 'confirmed') {
                await createRequest('/api/add-record', 'POST', {
                    data: data,
                })
                this.clearData(event)
                this.emitter.dispatch('rerender', 'afterSubmit')
            }
            unsubscribe()
        })
    }

    clearData (event) {
        document.querySelector(event.target.localName).reset()
    }

    async fetchData () {
        const result = await createRequest('/api/getList')
        return result
    }

    toHTML () {
        const requestTime = new Date().getTime()
        this.fetchData().then((data) => {
            const responseTime = new Date().getTime()
            const dif = responseTime - requestTime
            const timeout = dif > 3000 ? 0 : 5000
            setTimeout(() => {
                this.rt.innerHTML = createRecordForm(data, false)
            }, timeout)
        })

        return createRecordForm()
    }
}
