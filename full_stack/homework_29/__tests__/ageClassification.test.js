const { ageClassification } = require('../main')

describe('ageClassification(num)', () => {
  describe('returns null for negative values', () => {
    test.each([
      [-1],
      [-0.01],
      [-100],
    ])('ageClassification(%p) === null', (input) => {
      expect(ageClassification(input)).toBeNull()
    })
  })

  describe('Дитинство: 0 <= num <= 24', () => {
    test.each([
      [0],
      [1],
      [12.5],
      [24],
    ])('ageClassification(%p) === "Дитинство"', (input) => {
      expect(ageClassification(input)).toBe('Дитинство')
    })
  })

  describe('Молодість: 24 < num <= 44', () => {
    test.each([
      [24.01],
      [30],
      [44],
    ])('ageClassification(%p) === "Молодість"', (input) => {
      expect(ageClassification(input)).toBe('Молодість')
    })
  })

  describe('Зрілість: 44 < num <= 65', () => {
    test.each([
      [44.01],
      [55],
      [65],
    ])('ageClassification(%p) === "Зрілість"', (input) => {
      expect(ageClassification(input)).toBe('Зрілість')
    })
  })

  describe('Старість: 65 < num <= 75', () => {
    test.each([
      [65.1],
      [70],
      [75],
    ])('ageClassification(%p) === "Старість"', (input) => {
      expect(ageClassification(input)).toBe('Старість')
    })
  })

  describe('Довголіття: 75 < num <= 90', () => {
    test.each([
      [75.01],
      [82.5],
      [90],
    ])('ageClassification(%p) === "Довголіття"', (input) => {
      expect(ageClassification(input)).toBe('Довголіття')
    })
  })

  describe('Рекорд: 90 < num <= 122', () => {
    test.each([
      [90.01],
      [110],
      [122],
    ])('ageClassification(%p) === "Рекорд"', (input) => {
      expect(ageClassification(input)).toBe('Рекорд')
    })
  })

  describe('returns null for values greater than 122', () => {
    test.each([
      [122.01],
      [150],
      [1000],
    ])('ageClassification(%p) === null', (input) => {
      expect(ageClassification(input)).toBeNull()
    })
  })
})
