import headerStyles from '@scss/header.scss'
import { getFromHistory, setToHistory } from '@core/utils'
import { Component } from '@core/Component'
import { createHeader } from '@/components/header/header.template'

export class Header extends Component {
    static className = 'notes_header'

    constructor ($root, options) {
        super($root, {
            name: 'Header',
            listeners: ['click'],
            ...options,
        })
        console.log('root', $root)
    }

    /* async init () {
        const result = await createRequest('/api/getUsername')
        console.log('init .....', result)
    }*/

    click (event) {
        console.log('target dataset: ', event.target.dataset.type)
        if (event.target.dataset.type && event.target.dataset.type === 'button') {
            console.log('open popup ...')
            this.emitter.dispatch('click to open popup', true)
        }
    }

    toHTML () {
        return createHeader(headerStyles)
    }

    async onClick (evt) {
        // this.emitter.emit('open popup', Math.floor(Math.random() * 1000))

        const datas = {
            id: 123,
            user: 'test',
        }

        setToHistory(datas, '', './userId=' + datas.id)

        /* const result = await createRequest('/api/getUsername')

        setToHistory(result, '', './')*/

        // result.filter((record) => record.id === 4)

        console.log('history --->>>', getFromHistory())

        /* Add new column*/
        /* await createRequest('/api/add-column', 'POST', {
            name: 'test' + Math.floor(Math.random() * 10),
        })*/
    }
}
