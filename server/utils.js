import { readFileSync } from 'fs'
import path from 'path'
export function readFile (pathToFile) {
    return JSON.parse(readFileSync(path.join(__dirname, pathToFile)))
}

export function lastId (data) {
    const lastRecordRow = data[data.length-1].data
    let lastRecordId = 0
    lastRecordRow.forEach((item) => {
        if (item.columnName === 'ID') {
            lastRecordId = item.value
            return
        }
    })
    return parseInt(lastRecordId)
}
