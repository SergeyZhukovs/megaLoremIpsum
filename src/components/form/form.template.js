import formStyles from '@scss/form.scss'
import { createBtn, createInpt, createLabel, getColumnName } from '@core/utils'

function createCell (cellItem, isLoading) {
    const cellClass = isLoading ? formStyles.skeleton : ''
    const contentClass = isLoading ? [formStyles.title, formStyles.loading] : ''
    const inputName = cellItem.toLowerCase()

    return `<div class="${formStyles.formItem}">
                ${createLabel(cellItem, cellClass, contentClass)}
                ${createInpt('text', inputName, 'inpt w-100', true)}
            </div>`
}

function createSection (cols = [], isLoading) {
    const info = cols.data && (cols.data) || cols
    return `${(info).map((col) => createCell(col, isLoading)).join('')}`
}

export function createRecordForm (data = [], isLoading = true) {
    const sectionCount = 5
    const items = []
    let sections = new Array(sectionCount).fill('')
    data = data.length && data || sections

    if (!isLoading) {
        sections = getColumnName(data)
    }

    items.push(createSection(sections, isLoading))

    const form = document.createElement('form')
    form.classList.add(formStyles.inlineForm)

    const btnWrap = document.createElement('div')
    btnWrap.classList.add(formStyles.w100)
    btnWrap.innerHTML = createBtn()

    form.insertAdjacentHTML('beforeend', items.join(''))
    form.insertAdjacentHTML('beforeend', btnWrap.outerHTML)

    const formHtml = form.outerHTML

    return formHtml
    /* return `<div>
        <label>${labelName}</label>
        <input type="text" value="">
    </div>`*/
}
