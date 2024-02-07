import Processing from '../../../classes/data/Processing'
import {IColumn, IEntry, IRow} from '../../../interfaces/base.interface'


function createTestRows(count = 2): IRow[] {
  const rows = []

  for (let i = 0; i < count; i++) {
    rows.push({
      id: `row${i + 1}`,
      symbol: `Row ${i + 1}`,
      y: 0,
      count: 0,
      countByColumn: {},
    })
  }

  return rows
}

function createTestColumns(count = 2): IColumn[] {
  const columns = []

  for (let i = 0; i < count; i++) {
    columns.push({
      id: `col${i + 1}`,
      count: 0,
      countByRow: {},
      x: 0,
    })
  }

  return columns
}

describe('Processing', () => {
  let processing!: Processing
  let rows: IRow[] = []
  let columns: IColumn[] = []
  let entries: IEntry[] = []

  beforeEach(() => {
    rows = createTestRows()
    columns = createTestColumns()
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
      processing.rows.push({
        id: 'row3',
        symbol: 'Row 3',
        y: 0,
        count: 0,
        countByColumn: {},
      })
      processing.columns.push({
        id: 'col3',
        count: 0,
        countByRow: {},
        x: 0,
      })

      processing.reset()

      expect(processing.rows).toEqual(rows)
      expect(processing.columns).toEqual(columns)
    })
  })

  describe('getCroppedMatrix', () => {
    it('should return cropped matrix based on frame settings', () => {
      processing.setFrame([0, 1], [0, 1])
      const frameView = processing.getCroppedMatrix()

      expect(frameView.size).toBe(1)
      expect(frameView.get('row1')?.get('col1')).toBeDefined()
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
      processing = new Processing(createTestRows(4), createTestColumns(4), entries)
      processing.setFrame([1, 2], [1, 2])
      processing.incrementFrameSize(1)

      expect(processing['frame'].x).toEqual([0, 3])
      expect(processing['frame'].y).toEqual([0, 3])
    })
  })

  describe('decrementFrameSize', () => {
    it('should decrement frame size by step', () => {
      processing = new Processing(createTestRows(4), createTestColumns(4), entries)
      processing.setFrame([1, 2], [1, 2])
      processing.decrementFrameSize(1)

      expect(processing['frame'].x).toEqual([2, 1])
      expect(processing['frame'].y).toEqual([2, 1])
    })
  })

  describe('shiftFrameX', () => {
    it('should shift frame along X axis by step', () => {
      processing = new Processing(createTestRows(4), createTestColumns(4), entries)
      processing.setFrame([1, 2], [1, 2])
      processing.shiftFrameX(1)

      expect(processing['frame'].x[0]).toBeGreaterThan(1)
      expect(processing['frame'].x[1]).toBeGreaterThan(2)
    })
  })

  describe('shiftFrameY', () => {
    it('should shift frame along Y axis by step', () => {
      processing = new Processing(createTestRows(4), createTestColumns(4), entries)
      processing.setFrame([1, 2], [1, 2])
      processing.shiftFrameY(1)

      expect(processing['frame'].y[0]).toBeGreaterThan(1)
      expect(processing['frame'].y[1]).toBeGreaterThan(2)
    })
  })

  describe('sortRows', () => {
    it('should sort rows in ascending order', () => {
      const copyRows = [...rows]
      processing.reset()
      processing.sortRows('id')
      expect(processing.rows).toEqual([copyRows[0], copyRows[1]])
    })

    it('should sort rows in descending order', () => {
      const copyRows = [...rows]
      processing.reset()
      processing.sortRows('id')
      processing.sortRows('id')
      expect(processing.rows).toEqual([copyRows[1], copyRows[0]])
    })
  })

  describe('sortColumns', () => {
    it('should sort columns in ascending order', () => {
      const copyColumns = [...columns]
      processing.reset()
      processing.sortColumns('id')
      expect(processing.columns).toEqual([copyColumns[0], copyColumns[1]])
    })

    it('should sort columns in descending order', () => {
      const copyColumns = [...columns]
      processing.reset()
      processing.sortColumns('id')
      processing.sortColumns('id')
      expect(processing.columns).toEqual([copyColumns[1], copyColumns[0]])
    })
  })
})
