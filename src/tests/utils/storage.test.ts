import {IColumn, IRow} from '../../interfaces/bioinformatics.interface'
import {IStorageOptions} from '../../interfaces/main-grid.interface'
import {Storage} from '../../utils/storage'

function createDefaultOptions(): IStorageOptions {
  return {
    minCellHeight: 0,
    prefix: 'og-',
    rows: [],
    columns: [],
    entries: [],
  }
}

function createTestRows(): IRow[] {
  return [
    {
      id: 'row_1',
      symbol: 'Row 1',
      y: 0,
      count: 0,
      countByColumn: {},
    },
    {
      id: 'row_2',
      symbol: 'Row 2',
      y: 0,
      count: 0,
      countByColumn: {},
    },
  ]
}

function createTestColumns(): IColumn[] {
  return [
    {
      id: 'column_1',
      count: 0,
      countByRow: {},
      x: 0,
    },
    {
      id: 'column_2',
      count: 0,
      countByRow: {},
      x: 0,
    },
  ]
}

describe('Storage', () => {
  it('should create a singleton instance', () => {
    const instance1 = Storage.getInstance()
    const instance2 = Storage.getInstance()
    expect(instance1).toBe(instance2)
  })

  it('should set options correctly', () => {
    const storage = Storage.getInstance()
    const testRows = createTestRows()
    const testColumns = createTestColumns()
    const minCellHeight = 20
    const prefix = 'test-'

    const options = createDefaultOptions()

    storage.setOptions({
      ...options,
      minCellHeight,
      prefix,
      rows: testRows,
      columns: testColumns,
    })

    expect(storage.minCellHeight).toBe(minCellHeight)
    expect(storage.prefix).toBe(prefix)
    expect(storage.rows).toEqual(testRows)
    expect(storage.columns).toEqual(testColumns)
  })

  it('should reset to original rows and columns', () => {
    const storage = Storage.getInstance()
    const originalRows = createTestRows()
    const originalColumns = createTestColumns()
    const options = createDefaultOptions()
    storage.setOptions({
      ...options,
      rows: originalRows,
      columns: originalColumns,
    })

    storage.reset()
    expect(storage.rows).toEqual(originalRows)
    expect(storage.columns).toEqual(originalColumns)
  })

  describe('Sorting', () => {
    const storage = Storage.getInstance()
    const rows = createTestRows()
    const copyRows = [...rows]
    const columns = createTestColumns()
    const copyColumns = [...columns]
    const options = createDefaultOptions()

    beforeEach(() => {
      storage.setOptions({
        ...options,
        rows,
        columns,
      })
    })

    it('should sort rows in ascending order', () => {
      storage.reset()
      storage.sortRows('id')
      expect(storage.rows).toEqual([copyRows[0], copyRows[1]])
    })

    it('should sort rows in descending order', () => {
      storage.reset()
      storage.sortRows('id')
      storage.sortRows('id')
      expect(storage.rows).toEqual([copyRows[1], copyRows[0]])
    })

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
