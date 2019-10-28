const level = require('level')
const sub = require('subleveldown')
const path = require('path')
const cuid = require('cuid')
const dbPath = process.env.DB_PATH || path.join(__dirname, 'wdb')

let main
const dbs = {}


function stream(db, options = {}, query = {}) {
  const results = []
  return new Promise(function(resolve, reject) {
    db.createReadStream(options)
    .on('data', function (data) {
      console.log(data.key, '=', data.value)
      results.push(data.value)
    })
    .on('error', function (err) {
      console.log('Oh my!', err)
      reject(err)
    })
    .on('close', function () {
      console.log('Stream closed')
      resolve(results)
    })
    .on('end', function () {
      console.log('Stream ended')
      resolve(results)
    })
  })
}

function wdb(name) {
  if (!main) {
    main = level(dbPath, { valueEncoding: 'json' })
  }
  let db = dbs[name]
  if (!db) {
    console.log('Creating user db')
    db = dbs[name] = sub(main, name, { valueEncoding: 'json' })
  }

  return {
    clear: async function() {
      return db.clear()
    },
    create: async function(values, options) {
      if (!values.id) {
        values.id = cuid()
      }
      await db.put(values.id, values)
      return values
    },
    update: async function(query, values, options) {

    },
    delete: async function(query, options) {

    },
    get: async function(query, options) {
      const results = await stream(db)
      console.log(results)
      return results[0]
      // return db.get(query.id)
    },
    find: async function(query, options) {

    },
    count: async function(query, options) {

    }
  }
}

wdb.close = async function () {
  for(const key in dbs) {
    const db = dbs[key]
    console.log('CLOSING', key)
    await new Promise(function(resolve) {
      db.close(function (err){
        resolve()
      })
    })
  }
}

module.exports = wdb

// How it works:
// db.createCollection('user', { index: ['id'] })

// same as
// db.createCollection('user'
// { index: ['id'] } is default


// Alternatives:


// 1. Store as 'user::<id>'

// 2. Store with index: user ->

// 3. Store as sublevel.
