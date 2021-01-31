import express from 'express'
import { readFile, lastId } from './utils'
import { createClient, setData, getAll, ifKeyExist } from './redis'
import { capitalize } from '../src/core/utils';

const fs = require('fs')

/* Init app*/
const app = express()
app.use(express.json())

/* Init Redis client*/
const client = createClient()

/* methods*/

app.post('/api/create', async (req, res) => {
    fs.writeFile('server/initData333.json', JSON.stringify(req.body.data), (err) => {
        if (err) return console.log(err);
        console.log('Hello World > helloworld.txt');
    });
    console.log('req: ', req.body.data)
    res.end('')
})

app.get('/api/getList', async (req, res) => {
    const allData = await getAll(client, 'list')
    return res.end(allData)
})

app.put('/api/update-record', async (req, res) => {
    const dataFromStorage = await getAll(client, 'list')
    const data = JSON.parse(dataFromStorage)
    const recordId = req.body.data.id

    data.forEach((item, rootIndex) => {
        item.data.forEach((row) => {
            if (row.columnName === 'ID' && row.value == recordId) {
                const info = Object.keys(req.body.data.data)
                const newData = []
                newData.push({'columnName': 'ID', 'value': recordId})
                info.forEach((item) => {
                    const tmp = {
                        'columnName': item,
                        'value': req.body.data.data[item],
                    }
                    newData.push(tmp)
                })
                data[rootIndex].data = newData
            }
        })
    })
    await setData(client, 'list', data)
    // console.log(JSON.stringify(data))
    res.end('{}')
})

app.delete('/api/delete-record', (req, res) => {
    console.log('===>>>>', req.body)
    res.end('{}')
})

app.post('/api/add-column', async (req, res) => {
    const newColumn = req.body.name || 'untitled'
    const dataFromStorage = await getAll(client, 'list')
    const updatedArray = JSON.parse(dataFromStorage).map((record) => {
        record.data.push({ columnName: newColumn, value: '' })
        return record
    })

    await setData(client, 'list', updatedArray)

    res.end(JSON.stringify({ result: 'ok' }))
})

app.post('/api/add-record', async (req, res) => {
    const newRecord = req.body.data
    const dataFromStorage = await getAll(client, 'list')
    const data = JSON.parse(dataFromStorage)
    const lastRecordId = lastId(data)

    const blankObj = {}
    const blankArr = []
    blankArr.push({
        'columnName': 'ID',
        'value': lastRecordId+1,
    })
    Object.keys(req.body.data).map((name) => {
        const tmp = {
            'columnName': capitalize(name),
            'value': newRecord[name],
        }
        blankArr.push(tmp)
    })

    blankObj.data = blankArr

    data.push(blankObj)

    await setData(client, 'list', data)

    return res.end(JSON.stringify(data))
})

process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log('Internal server error ...', err)
    process.exit(1)
})

app.listen(5005, async () => {
    const dbExist = ifKeyExist(client, 'list')
    if (!dbExist) {
        /* Write default data*/
        const obj = readFile('./initData.json')
        await setData(client, 'list', obj)
    }

    console.log('Server is running ...')
})
