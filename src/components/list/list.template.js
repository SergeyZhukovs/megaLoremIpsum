import { viewIcon, deleteIcon, editIcon } from '@core/icons'
import tableStyles from '@scss/tables.scss'

function createHead (cellItem, isLoading) {
    const cellClass = isLoading ? tableStyles.skeleton : ''
    const contentClass = isLoading ? `${tableStyles.title} ${tableStyles.loading}` : ''
    return isLoading ?
        `<div class="${cellClass} ${tableStyles.tableHeader}">
            <span class="${contentClass}"></span>
        </div>` :
        `<div class="${cellClass} ${tableStyles.tableHeader}">${cellItem}</div>`
}

function createCell (cellItem, isLoading, cellName = 'def') {
    const cellClass = isLoading ? tableStyles.skeleton : cellName
    const contentClass = isLoading ? `${tableStyles.title} ${tableStyles.loading}` : ''
    return isLoading ?
        `<div data-th="${cellItem.columnName || ''}" class="${cellClass}">
            <span class="${contentClass}">${cellItem.value || ''}</span>
        </div>` :
        `<div data-th="${cellItem.columnName || ''}" class="${cellClass}">
            ${cellItem.value || ''}
        </div>`
}

function createRow (cols = [], type = 'cell', isLoading = true) {
    const info = cols.data && (cols.data) || cols
    let controlHead = ''
    let controlContent = ''
    if (!isLoading) {
        controlHead = '&nbsp;'
        controlContent = `<div class="${tableStyles.controls}">
                <button data-action="view">${viewIcon()}</button>
                <button data-action="edit">${editIcon()}</button>
                <button data-action="delete">${deleteIcon()}</button>
        </div>`
    }
    return `<div class="${tableStyles.row} ${type === 'head' ? tableStyles.headRow : 'rw'}">
${(info).map((col, index) => {
        const cellCl = !index ? 'non-edit' : 'data-container'
        return (
            type === 'head' ?
                createHead(col, isLoading) :
                createCell(col, isLoading, cellCl)
        )
    }).join('')}
<!--Add column with controls (view, edit and delete buttons)-->
    ${
    type === 'head' ?
        createHead(controlHead, isLoading) :
        createCell({value: controlContent}, isLoading, tableStyles.ctl)
}
    </div>`
}

function getColumnName (data) {
    const columns = []
    data.forEach((item) => {
        item.data.forEach((column, index) => {
            if (columns.includes(column.columnName)) return
            columns.push(column.columnName)
        })
    })
    return columns
}

export function createList (data = [], isLoading = true ) {
    const colsCount = 5
    const table = document.createElement('div')
    table.classList.add(tableStyles.table)
    const rows = []
    let cols = new Array(colsCount).fill('')
    data = data.length && data || cols

    if (!isLoading) {
        cols = getColumnName(data)
    }

    rows.push(createRow(cols, 'head', isLoading))

    const rowCount = data.length-1 <= 0 ? 5 : data.length-1

    for (let i=0; i <= rowCount; i++) {
        const itemData = data[i] || cols
        rows.push(createRow(itemData, '', isLoading))
    }

    table.insertAdjacentHTML('beforeend', rows.join(''))
    return table.outerHTML
}

