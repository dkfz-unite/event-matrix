import Processing from '../../../classes/data/Processing'

describe('Processing', () => {
  let processing: Processing
  let rows
  let columns
  let entries

  beforeEach(() => {
    rows = [{id: 'row1'}, {id: 'row2'}]
    columns = [{id: 'col1'}, {id: 'col2'}]
    entries = [{id: 'entry1', rowId: 'row1', columnId: 'col1'}]

    processing = new Processing(rows, columns, entries)
  })

  describe('constructor', () => {
    it('should initialize with given rows, columns, and entries', () => {
      expect(processing.rowsOriginal).toEqual(rows)
      expect(processing.columnsOriginal).toEqual(columns)
      expect(processing['entries']).toEqual(entries)
    })
  })

  describe('reset', () => {
    it('should reset rows and columns to original', () => {
      // Модифицируем rows и columns
      processing.rows.push({id: 'row3'})
      processing.columns.push({id: 'col3'})

      processing.reset()

      expect(processing.rows).toEqual(rows)
      expect(processing.columns).toEqual(columns)
    })
  })

  describe('getFrameView', () => {
    it('should return cropped matrix based on frame settings', () => {
      processing.setFrame([0, 1], [0, 1])
      const frameView = processing.getFrameView()

      expect(frameView.size).toBe(1)
      expect(frameView.get('row1').get('col1')).toBeDefined()
    })
  })

  describe('setFrame', () => {
    it('should correctly set the frame boundaries', () => {
      processing.setFrame([0, 1], [0, 1], [0, 1])
      expect(processing['frame'].x).toEqual([0, 1])
      expect(processing['frame'].y).toEqual([0, 1])
      expect(processing['frame'].z).toEqual([0, 1])
    })
  })

  describe('incrementFrameSize', () => {
    it('should increment frame size by step', () => {
      processing.setFrame([1, 2], [1, 2])
      processing.incrementFrameSize(1)

      expect(processing['frame'].x).toEqual([0, 3])
      expect(processing['frame'].y).toEqual([0, 3])
    })
  })

  describe('decrementFrameSize', () => {
    it('should decrement frame size by step', () => {
      processing.setFrame([1, 2], [1, 2])
      processing.decrementFrameSize(1)

      expect(processing['frame'].x).toEqual([2, 1])
      expect(processing['frame'].y).toEqual([2, 1])
    })
  })

  describe('shiftFrameX', () => {
    it('should shift frame along X axis by step', () => {
      processing.setFrame([1, 2], [1, 2])
      processing.shiftFrameX(1)

      expect(processing['frame'].x[0]).toBeGreaterThan(1)
      expect(processing['frame'].x[1]).toBeGreaterThan(2)
    })
  })

  describe('shiftFrameY', () => {
    it('should shift frame along Y axis by step', () => {
      processing.setFrame([1, 2], [1, 2])
      processing.shiftFrameY(1)

      expect(processing['frame'].y[0]).toBeGreaterThan(1)
      expect(processing['frame'].y[1]).toBeGreaterThan(2)
    })
  })

  describe('sortRows', () => {
    it('should sort rows in ascending order', () => {
      processing.reset()
      processing.sortRows('id')
      expect(processing.rows).toEqual([copyRows[0], copyRows[1]])
    })

    it('should sort rows in descending order', () => {
      storage.reset()
      storage.sortRows('id')
      storage.sortRows('id')
      expect(storage.rows).toEqual([copyRows[1], copyRows[0]])
    })
  })

  describe('sortColumns', () => {
    it('should sort columns in ascending order', () => {
      storage.reset()
      storage.sortColumns('id')
      expect(storage.columns).toEqual([copyColumns[0], copyColumns[1]])
    })

    it('should sort columns in descending order', () => {
      storage.reset()
      storage.sortColumns('id')
      storage.sortColumns('id')
      expect(storage.columns).toEqual([copyColumns[1], copyColumns[0]])
    })
  })
})
