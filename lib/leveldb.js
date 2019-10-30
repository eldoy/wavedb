const level = require('level')
const sub = require('subleveldown')
const path = require('path')
const cuid = require('cuid')
const operators = require('./operators.js')
const dbPath = process.env.WAVEDB_PATH || path.join(process.cwd(), process.env.WAVEDB_NAME || 'wdb')

let main
const dbs = {}

function search(db, options = {}, query) {
  const hasQuery = query && Object.keys(query).length
  // TODO: Set default limit?
  // if (typeof options.limit === 'undefined') {
  //   options.limit = 20
  //}
  const results = []
  return new Promise(function(resolve, reject) {
    db.createReadStream(options)
    .on('data', function (data) {
      if (hasQuery) {
        for (const key in query) {
          if (operators(query[key], data.value[key])) {
            results.push(data.value)
          }
          // query: { name: 'asdf' }
          // query: { name: { $eq: 'asdf' } }

          // data.value[key]

          // if (data.value[key] === query[key]) {
          //   results.push(data.value)
          // }
        }
      } else {
        results.push(data.value)
      }
    })
    .on('error', function (err) {
      reject(err)
    })
    .on('close', function () {
      resolve(results)
    })
    .on('end', function () {
      resolve(results)
    })
  })
}

function leveldb(name) {
  if (!main) {
    main = level(dbPath, { valueEncoding: 'json' })
  }
  let db = dbs[name]
  if (!db) {
    db = dbs[name] = sub(main, name, { valueEncoding: 'json' })
  }

  return {
    clear: async function() {
      return db.clear()
    },
    create: async function(values) {
      let id = values.id
      if (!id) {
        id = values.id = cuid()
      }
      await db.put(id, values)
      return { id }
    },
    update: async function(query, values) {
      const results = await search(db, {}, query)
      for (let i = 0; i < results.length; i++) {
        const r = results[i]
        await db.put(r.id, { ...r, ...values })
      }
      return { n: results.length }
    },
    delete: async function(query) {
      const results = await search(db, {}, query)
      for (let i = 0; i < results.length; i++) {
        await db.del(results[i].id)
      }
      return { n: results.length }
    },
    get: async function(query) {
      const results = await search(db, {}, query)
      return results[0]
      // OPTIMIZE: This is way faster if we have the id
      // return db.get(query.id)
    },
    find: async function(query) {
      const results = await search(db, {}, query)
      return results
    },
    count: async function(query) {
      // OPTIMIZE: Use leveldb iterator length instead?
      const results = await search(db, {}, query)
      return results.length
    }
  }
}

leveldb.close = async function() {
  for(const key in dbs) {
    const db = dbs[key]
    await new Promise(function(resolve) {
      db.close(resolve)
    })
  }
}

module.exports = leveldb