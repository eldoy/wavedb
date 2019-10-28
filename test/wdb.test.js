const db = require('../index.js')

describe('wdb', () => {
  beforeEach(async function() {
    await db('user').clear()
  })
  afterAll(db.close)

  it('should create a user', async () => {
    const result = await db('user').create({ email: 'vidar@example.com' })
    expect(result.id).toBeDefined()
    const user = await db('user').get({ id: result.id })
    expect(user.email).toBe('vidar@example.com')
  })
})
