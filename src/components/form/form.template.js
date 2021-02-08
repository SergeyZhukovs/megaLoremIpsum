import commonStyles from '@scss/common.scss'
import formStyles from '@scss/form.scss'
import { createBtn, createInpt, createLabel, getColumnName } from '@core/utils'

function createCell (cellItem, isLoading) {
    const cellLabelClass = isLoading ? [formStyles.skeleton, commonStyles.label]: ''
    const contentClass = isLoading ? [formStyles.title, formStyles.loading]: ''
    const cellInputClass = isLoading ? [formStyles.skeleton]: ''
    const inputName = cellItem.toLowerCase()

    return `<div class="${formStyles.formItem}">
                ${createLabel(cellItem, cellLabelClass, contentClass)}
                ${createInpt(isLoading, 'text', inputName,
        [formStyles.w100], true, cellInputClass, contentClass)}
            </div>`
}

function createSection (cols = [], isLoading) {
    const info = cols.data && (cols.data) || cols
    return `${(info).map((col) => createCell(col, isLoading)).join('')}`
}

export function createRecordForm (data = [], isLoading = true) {
    const sectionCount = 4
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

    const cellClass = isLoading ? [formStyles.skeleton, formStyles.submitSkeleton]: ''
    const contentClass = isLoading ? [formStyles.title, formStyles.loading]: ''
    btnWrap.innerHTML = createBtn(isLoading, cellClass, contentClass)

    form.insertAdjacentHTML('beforeend', items.join(''))
    form.insertAdjacentHTML('beforeend', btnWrap.outerHTML)

    const formHtml = form.outerHTML

    return formHtml
    /* return `<div>
        <label>${labelName}</label>
        <input type="text" value="">
    </div>`*/
}
