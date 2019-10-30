# WaveDB
Javascript document database based on LevelDB.

This library is meant for sites with low to medium traffic demands running on a single machine. It does not require installing a separate database server and is portable, moving your data is just zipping up the database directory and copying it somewhere else.

### Install
In Node.js:
`npm i wavedb`

### Usage
```javascript
// Require library
const db = require('wavedb')

// Create document, 'user' is the name of the model/collection
const result = await db('user').create({ email: 'vidar@example.com' })

// Returns an object with the id
{ id: 'ck2a5xf2c0000okk3dbvz4n3i' }

// Update documents, changes all matches
const result = await db('user').update({ email: 'vidar@example.com' }, { email: 'hello@example.com' })

// Returns the number of changed documents
{ n: 1 }

// Delete documents, deletes all matches
const result = await db('user').delete({ email: 'vidar@example.com' })

// Returns the number of deleted documents
{ n: 1 }

// Get a single document
const result = await db('user').get({ email: 'vidar@example.com' })

// Returns the document as a javascript object
{ id: 'ck2a5xf2c0000okk3dbvz4n3i', email: 'vidar@example.com' }

// Get multiple documents
const result = await db('user').find({ email: 'vidar@example.com' })

// Returns an array of the documents
[{ id: 'ck2a5xf2c0000okk3dbvz4n3i', email: 'vidar@example.com' }]

// Count documents
const result = await db('user').count({ email: 'vidar@example.com' })

// Returns the count as an integer
2

// Clear collection. WARNING: will wipe all your data for this collection
await db('user').clear()

// Close connections manually, useful for testing
await db.close()
```
ISC licensed. Enjoy!
