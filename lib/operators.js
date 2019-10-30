function operators(query, value) {
  return query.$eq && value === query.$eq ||
    query.$ne && value !== query.$ne ||
    query.$gt && value > query.$gt ||
    query.$gte && value >= query.$gte ||
    query.$lt && value < query.$lt ||
    query.$lte && value <= query.$lte ||
    query.$in && query.$in.includes(value) ||
    query.$nin && !query.$nin.includes(value) ||
    query === value
}

module.exports = operators
