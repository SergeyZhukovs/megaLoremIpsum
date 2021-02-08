import popupStyles from '@scss/popup.scss'

function modalHeader () {
    return `<div class="${popupStyles.modalHeader}">
                <h3 class="${popupStyles.title}">Record Details</h3>
                <div class="close">
                    <button class="${popupStyles.closeModal}" data-action="close"></button>
                </div>
            </div>`
}

function modalBody (data = {}) {
    const info = Object.keys(data)
    return `<div class="${popupStyles.modalBody}">
                ${(info).map((item, index) => (
        `<div class="${popupStyles.dataHead}">${item}:</div><div>${data[item]}</div>`
    )
    ).join('')}
            </div>`
}

export function createModal (data = {}) {
    return `<div class="${popupStyles.modal}">
            ${modalHeader()}
            ${modalBody(data)}
        </div>`
}

