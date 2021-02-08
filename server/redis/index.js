import redis from 'redis'

export const createClient = () => {
    const client = redis.createClient(6379, '46.101.137.213')
    client.auth('redisPass', (err) => {})
    return client
}

export const onRedisConnect = (client) => {
    client.on('connect', (error) => {
        console.error('connected ....')
    })
}

export const onRedisError = (client) => {
    client.on('error', (error) => {
        console.error('error ....')
    })
}

export const setData = async (client, key = 'untitled', data = {}) => {
    client.set(key, JSON.stringify(data))
}

export const getAll = async (client, key = 'untitled') => {
    const data = new Promise((resolve, reject) => {
        client.get(key, async (error, result) => {
            if (!error && result) {
                resolve(result)
            }

            reject(new Error('Sorry, goodbye ...'))
        })
    })
    return await data
}

export const ifKeyExist = async (client, key) => {
    const data = new Promise((resolve, reject) => {
        client.get(key, async (error, result) => {
            if (!error && result) {
                resolve(true)
            }
            resolve(false)
        })
    })
    return await data
}

export const removeAll = async (client) => {
    client.flush()
}

export const getDataById = async (client, key, id) => {
    const data = await getAll(client, key)
    const list = JSON.parse(data)
    let result = null
    list.forEach((item, rootIndex) => {
        item.data.forEach((row) => {
            if (row.columnName === 'ID' && row.value == id) {
                result = item
                return
            }
        })
        if (result) return
    })
    return result
}
