import { PopupConfirm } from '@/components/confirmPopup/ConfirmPopup'
import { Popup } from '@/components/popup/Popup'
import { Header } from '@/components/header/Header'
import { Form } from '@/components/form/Form'
import { List } from '@/components/list/List'
import { Footer } from '@/components/footer/Footer'
import { Notes } from '@/components/notes/Notes';
import { Router } from '@/router/router';
import './scss/index.scss'

const notes = new Notes('#app', {
    components: [Header, Popup, PopupConfirm, Form, List, Footer],
})

new Router()

notes.render()
