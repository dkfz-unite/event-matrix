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

    processing = new Processing(rows, columns, entries, [], [])
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
})
