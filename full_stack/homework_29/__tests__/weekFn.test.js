const { weekFn } = require('../main')

describe('weekFn(cond)', () => {
  describe('returns the correct weekday name for numbers 1..7', () => {
    test.each([
      [1, 'Понеділок'],
      [2, 'Вівторок'],
      [3, 'Середа'],
      [4, 'Четвер'],
      [5, 'П\'ятниця'],
      [6, 'Субота'],
      [7, 'Неділя'],
    ])('weekFn(%p) === %p', (input, expected) => {
      expect(weekFn(input)).toBe(expected)
    })
  })

  describe('returns null for numbers outside the 1..7 range', () => {
    test.each([
      [0],
      [8],
      [9],
      [-1],
      [100],
    ])('weekFn(%p) === null', (input) => {
      expect(weekFn(input)).toBeNull()
    })
  })

  describe('returns null for non-integer numbers', () => {
    test.each([
      [1.5],
      [2.1],
      [7.0001],
    ])('weekFn(%p) === null', (input) => {
      expect(weekFn(input)).toBeNull()
    })
  })

  describe('returns null for string values', () => {
    test.each([
      ['1'],
      ['2'],
      ['Понеділок'],
      [''],
    ])('weekFn(%p) === null', (input) => {
      expect(weekFn(input)).toBeNull()
    })
  })

  describe('returns null for other data types', () => {
    test.each([
      [null],
      [undefined],
      [true],
      [false],
      [{}],
      [[]],
      [[1]],
    ])('weekFn(%p) === null', (input) => {
      expect(weekFn(input)).toBeNull()
    })
  })
})
