const operators = require('../lib/operators.js')

describe('operators', () => {
  it('should match $eq', async () => {
    expect(operators({ $eq: 2 }, 2)).toBe(true)
    expect(operators({ $eq: 2 }, 3)).toBe(false)
  })

  it('should match $ne', async () => {
    expect(operators({ $ne: 2 }, 2)).toBe(false)
    expect(operators({ $ne: 2 }, 3)).toBe(true)
    expect(operators({ $ne: 2 }, 1)).toBe(true)
  })

  it('should match $gt', async () => {
    expect(operators({ $gt: 2 }, 2)).toBe(false)
    expect(operators({ $gt: 2 }, 3)).toBe(true)
    expect(operators({ $gt: 2 }, 1)).toBe(false)
  })

  it('should match $gte', async () => {
    expect(operators({ $gte: 2 }, 2)).toBe(true)
    expect(operators({ $gte: 2 }, 3)).toBe(true)
    expect(operators({ $gte: 2 }, 1)).toBe(false)
  })

  it('should match $lt', async () => {
    expect(operators({ $lt: 2 }, 2)).toBe(false)
    expect(operators({ $lt: 2 }, 3)).toBe(false)
    expect(operators({ $lt: 2 }, 1)).toBe(true)
  })

  it('should match $lte', async () => {
    expect(operators({ $lte: 2 }, 2)).toBe(true)
    expect(operators({ $lte: 2 }, 3)).toBe(false)
    expect(operators({ $lte: 2 }, 1)).toBe(true)
  })

  it('should match $in', async () => {
    expect(operators({ $in: [1, 2, 3] }, 2)).toBe(true)
    expect(operators({ $in: [1, 2, 3] }, 1)).toBe(true)
    expect(operators({ $in: [1, 2, 3] }, 3)).toBe(true)
    expect(operators({ $in: [1, 2, 3] }, 0)).toBe(false)
    expect(operators({ $in: [1, 2, 3] }, 5)).toBe(false)
  })

  it('should match $nin', async () => {
    expect(operators({ $nin: [1, 2, 3] }, 2)).toBe(false)
    expect(operators({ $nin: [1, 2, 3] }, 1)).toBe(false)
    expect(operators({ $nin: [1, 2, 3] }, 3)).toBe(false)
    expect(operators({ $nin: [1, 2, 3] }, 0)).toBe(true)
    expect(operators({ $nin: [1, 2, 3] }, 5)).toBe(true)
  })
})