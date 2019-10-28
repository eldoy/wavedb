const db = require('../index.js')
const cuid = require('cuid')

describe('wdb', () => {
  beforeEach(async function() {
    await db('user').clear()
  })
  afterAll(db.close)

  it('should create and find a user with an id', async () => {
    const id = cuid()
    const result = await db('user').create({ id, email: 'vidar@example.com' })
    expect(result.id).toBeDefined()
    const user = await db('user').get({ id })
    expect(user.id).toBe(id)
  })

  it('should create and find a user without an id', async () => {
    const first = await db('user').create({ email: 'vidar@example.com' })
    expect(first.id).toBeDefined()
    const second = await db('user').create({ email: 'vidar@example.com' })
    expect(second.id).toBeDefined()
    expect(second.id).not.toBe(first.id)
    const user = await db('user').get({ id: second.id })
    expect(user.id).toBe(second.id)
    expect(user.email).toBe('vidar@example.com')
  })

  it('should find documents', async () => {
    const first = await db('user').create({ email: 'vidar@example.com' })
    expect(first.id).toBeDefined()
    const second = await db('user').create({ email: 'vidar@example.com' })
    expect(second.id).toBeDefined()
    let result = await db('user').find()
    expect(result.length).toBe(2)
    expect(result[0].id).toBe(first.id)
    expect(result[1].id).toBe(second.id)

    result = await db('user').find({ id: second.id })
    expect(result.length).toBe(1)
    expect(result[0].id).toBe(second.id)
  })

  it('should count documents', async () => {
    const first = await db('user').create({ email: 'vidar@example.com' })
    expect(first.id).toBeDefined()
    const second = await db('user').create({ email: 'vidar@example.com' })
    expect(second.id).toBeDefined()
    let result = await db('user').count()
    expect(result).toBe(2)

    result = await db('user').count({ id: second.id })
    expect(result).toBe(1)
  })

  it('should update documents', async () => {
    const first = await db('user').create({ email: 'vidar@example.com' })
    expect(first.id).toBeDefined()
    const second = await db('user').create({ email: 'vidar@example.com' })
    expect(second.id).toBeDefined()
    let update = await db('user').update({}, { email: 'other@example.com' })
    expect(update.n).toBe(2)

    let result = await db('user').find()
    expect(result.length).toBe(2)
    expect(result[0].email).toBe('other@example.com')
    expect(result[1].email).toBe('other@example.com')

    update = await db('user').update({ id: second.id }, { email: 'third@example.com' })
    expect(update.n).toBe(1)
    result = await db('user').get({ id: second.id })
    expect(result.email).toBe('third@example.com')
  })

  it('should delete documents', async () => {
    const first = await db('user').create({ email: 'vidar@example.com' })
    expect(first.id).toBeDefined()
    const second = await db('user').create({ email: 'vidar@example.com' })
    expect(second.id).toBeDefined()
    expect(second.id).not.toBe(first.id)
    const user = await db('user').delete({ id: second.id })

    let result = await db('user').find()
    expect(result.length).toBe(1)
    expect(result[0].email).toBe('vidar@example.com')
  })
})
