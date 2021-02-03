// import { viewIcon, deleteIcon } from '@core/icons'
import tableStyles from '@scss/tables.scss'
function createHead (cellItem, isLoading) {
    const cellClass = isLoading ? tableStyles.skeleton : ''
    const contentClass = isLoading ? `${tableStyles.title} ${tableStyles.loading}` : ''
    return `<th class="${cellClass}">
        <span class="${contentClass}">${cellItem}</span>
    </th>`
}

function createCell (cellItem, isLoading, cellName = 'def') {
    const cellClass = isLoading ? tableStyles.skeleton : cellName
    const contentClass = isLoading ? `${tableStyles.title} ${tableStyles.loading}` : ''
    return `<td data-th="${cellItem.columnName || ''}" class="${cellClass}">
        <span class="${contentClass}">${cellItem.value || ''}</span>
    </td>`
}

function createRow (cols = [], type = 'cell', isLoading = true) {
    const info = cols.data && (cols.data) || cols
    let controlHead = ''
    let controlContent = ''
    if (!isLoading) {
        controlHead = '&nbsp;'
        controlContent = `<div class="controls" style="display: flex">
                <button data-action="view">View</button>
                <button class="edit" data-action="edit">Edit</button>
                <button data-action="delete">Delete</button>
        </div>`
    }
    return `<tr>${(info).map((col, index) => {
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
        createCell({value: controlContent}, isLoading, 'ctl')
}
    </tr>`
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
    const colsCount = 6
    const table = document.createElement('table')
    const rows = []
    let cols = new Array(colsCount).fill('')
    data = data.length && data || cols

    if (!isLoading) {
        cols = getColumnName(data)
        console.log('data: ', data)
    }

    rows.push(createRow(cols, 'head', isLoading))

    const rowCount = data.length-1 <= 0 ? 5 : data.length-1

    for (let i=0; i <= rowCount; i++) {
        const itemData = data[i] || cols
        // console.log('itemData: ', itemData)
        rows.push(createRow(itemData, '', isLoading))
    }

    table.insertAdjacentHTML('beforeend', rows.join(''))
    return table.outerHTML
}

