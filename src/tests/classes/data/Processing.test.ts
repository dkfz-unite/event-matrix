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

  describe('makeCalculations', () => {
    it('should correctly calculate totals for rows and columns', () => {
      const rows = createTestRows(3)
      const columns = createTestColumns(3)
      const entries = [
        {id: 'entry1', rowId: 'row1', columnId: 'col1'},
        {id: 'entry2', rowId: 'row2', columnId: 'col2'},
        {id: 'entry3', rowId: 'row2', columnId: 'col3'},
        {id: 'entry4', rowId: 'row3', columnId: 'col1'},
        {id: 'entry5', rowId: 'row3', columnId: 'col2'},
        {id: 'entry6', rowId: 'row3', columnId: 'col3'},
      ]

      const processing = new Processing(rows, columns, entries, [], [])
      processing['makeCalculations'].call(processing)

      expect(processing.getRows()[0].total).toEqual(1)
      expect(processing.getRows()[1].total).toEqual(2)
      expect(processing.getRows()[2].total).toEqual(3)

      expect(processing.getColumns()[0].total).toEqual(2)
      expect(processing.getColumns()[1].total).toEqual(2)
      expect(processing.getColumns()[2].total).toEqual(2)
    })
  })

  describe('getCroppedMatrix', () => {
    it('should correctly return a cropped matrix', () => {
      const rows = createTestRows(3)
      const columns = createTestColumns(3)
      const entries = [
        {id: 'entry1', rowId: 'row1', columnId: 'col1'},
        {id: 'entry2', rowId: 'row2', columnId: 'col2'},
        {id: 'entry3', rowId: 'row2', columnId: 'col3'},
        {id: 'entry4', rowId: 'row3', columnId: 'col1'},
        {id: 'entry5', rowId: 'row3', columnId: 'col2'},
        {id: 'entry6', rowId: 'row3', columnId: 'col3'},
      ]

      const processing = new Processing(rows, columns, entries, [], [])
      const croppedMatrix = processing.getCroppedMatrix()

      expect(croppedMatrix.length).toEqual(3)
      croppedMatrix.forEach((row, index) => {
        expect(row.id).toEqual(`row${3 - index}`)
        expect(row.data.total).toEqual(3 - index)
        expect(row.columns.length).toEqual(3)
        row.columns.forEach((column, columnIndex) => {
          expect(column.id).toEqual(`col${columnIndex + 1}`)
          expect(column.entries.length).toEqual(entries.filter((entry) => entry.rowId === row.id && entry.columnId === column.id).length)
        })
      })
    })
  })

  describe('applyFilters', () => {
    it('should correctly filter rows, columns, and entries', () => {
      const rows = createTestRows(3)
      const columns = createTestColumns(3)
      const entries = [
        {id: 'entry1', rowId: 'row1', columnId: 'col1'},
        {id: 'entry2', rowId: 'row2', columnId: 'col2'},
        {id: 'entry3', rowId: 'row2', columnId: 'col3'},
        {id: 'entry4', rowId: 'row3', columnId: 'col1'},
        {id: 'entry5', rowId: 'row3', columnId: 'col2'},
        {id: 'entry6', rowId: 'row3', columnId: 'col3'},
      ]

      const processing = new Processing(rows, columns, entries, [], [])

      // Устанавливаем фильтры
      processing.setFilter('rows', {id: 'row1'})
      processing.setFilter('columns', {id: 'col1'})
      processing.setFilter('entries', {id: 'entry1'})

      // Вызываем функцию applyFilters
      processing['applyFilters'].call(processing)

      // Проверяем, что строки, столбцы и записи были правильно отфильтрованы
      expect(processing.getRows().length).toEqual(1)
      expect(processing.getColumns().length).toEqual(1)
      expect(processing.getEntries().length).toEqual(1)

      expect(processing.getRows()[0].id).toEqual('row1')
      expect(processing.getColumns()[0].id).toEqual('col1')
      expect(processing.getEntries()[0].id).toEqual('entry1')
    })
  })

  describe('generateMatrix', () => {
    it('should correctly generate a matrix', () => {
      const rows = createTestRows(3)
      const columns = createTestColumns(3)
      const entries = [
        {id: 'entry1', rowId: 'row1', columnId: 'col1'},
        {id: 'entry2', rowId: 'row2', columnId: 'col2'},
        {id: 'entry3', rowId: 'row2', columnId: 'col3'},
        {id: 'entry4', rowId: 'row3', columnId: 'col1'},
        {id: 'entry5', rowId: 'row3', columnId: 'col2'},
        {id: 'entry6', rowId: 'row3', columnId: 'col3'},
      ]

      const processing = new Processing(rows, columns, entries, [], [])
      processing['generateMatrix'].call(processing)
      const matrix = processing.getMatrix()

      expect(matrix.length).toEqual(3)
      matrix.forEach((row, index) => {
        expect(row.id).toEqual(`row${index + 1}`)
        expect(row.data.total).toEqual(index + 1)
        expect(row.columns.length).toEqual(3)
        row.columns.forEach((column, columnIndex) => {
          expect(column.id).toEqual(`col${columnIndex + 1}`)
          expect(column.entries.length).toEqual(entries.filter((entry) => entry.rowId === row.id && entry.columnId === column.id).length)
        })
      })
    })
  })

  describe('sortMatrixColumnsByEntries', () => {
    it('should correctly sort columns by entries', () => {
      const rows = createTestRows(3)
      const columns = createTestColumns(3)
      const entries = [
        {id: 'entry1', rowId: 'row1', columnId: 'col1'},
        {id: 'entry2', rowId: 'row2', columnId: 'col2'},
        {id: 'entry3', rowId: 'row2', columnId: 'col3'},
        {id: 'entry4', rowId: 'row3', columnId: 'col1'},
        {id: 'entry5', rowId: 'row3', columnId: 'col2'},
        {id: 'entry6', rowId: 'row3', columnId: 'col3'},
      ]

      const processing = new Processing(rows, columns, entries, [], [])
      processing.sortMatrixColumnsByEntries('row3')

      const matrix = processing.getMatrix()
      expect(matrix[0].columns.map((column) => column.id)).toEqual(['col1', 'col2', 'col3'])
    })
  })

  describe('sortMatrixRowsByEntries', () => {
    it('should correctly sort rows by entries', () => {
      const rows = createTestRows(3)
      const columns = createTestColumns(3)
      const entries = [
        {id: 'entry1', rowId: 'row1', columnId: 'col1'},
        {id: 'entry2', rowId: 'row2', columnId: 'col2'},
        {id: 'entry3', rowId: 'row2', columnId: 'col3'},
        {id: 'entry4', rowId: 'row3', columnId: 'col1'},
        {id: 'entry5', rowId: 'row3', columnId: 'col2'},
        {id: 'entry6', rowId: 'row3', columnId: 'col3'},
      ]

      const processing = new Processing(rows, columns, entries, [], [])
      processing.sortMatrixRowsByEntries('col2')

      const matrix = processing.getMatrix()
      expect(matrix.map((row) => row.id)).toEqual(['row3', 'row2', 'row1'])
    })
  })

  describe('sortMatrixRowsByTotal', () => {
    it('should correctly sort rows by total', () => {
      const rows = createTestRows(3)
      const columns = createTestColumns(3)
      const entries = [
        {id: 'entry1', rowId: 'row1', columnId: 'col1'},
        {id: 'entry2', rowId: 'row2', columnId: 'col2'},
        {id: 'entry3', rowId: 'row2', columnId: 'col3'},
        {id: 'entry4', rowId: 'row3', columnId: 'col1'},
        {id: 'entry5', rowId: 'row3', columnId: 'col2'},
        {id: 'entry6', rowId: 'row3', columnId: 'col3'},
      ]

      const processing = new Processing(rows, columns, entries, [], [])
      processing.sortMatrixRows('total')

      const matrix = processing.getMatrix()
      expect(matrix.map((row) => row.id)).toEqual(['row3', 'row2', 'row1'])
    })
  })

  describe('sortMatrixColumnsByTotal', () => {
    it('should correctly sort columns by total', () => {
      const rows = createTestRows(3)
      const columns = createTestColumns(3)
      const entries = [
        {id: 'entry1', rowId: 'row1', columnId: 'col1'},
        {id: 'entry2', rowId: 'row2', columnId: 'col2'},
        {id: 'entry3', rowId: 'row2', columnId: 'col3'},
        {id: 'entry4', rowId: 'row3', columnId: 'col1'},
        {id: 'entry5', rowId: 'row3', columnId: 'col2'},
        {id: 'entry6', rowId: 'row3', columnId: 'col3'},
      ]

      const processing = new Processing(rows, columns, entries, [], [])
      processing.sortMatrixColumns('total')

      const matrix = processing.getMatrix()
      expect(matrix[0].columns.map((column) => column.id)).toEqual(['col1', 'col2', 'col3'])
    })
  })

  describe('getRows', () => {
    it('should return rows', () => {
      expect(processing.getRows()).toEqual(rows)
    })
  })

  describe('getColumns', () => {
    it('should return columns', () => {
      expect(processing.getColumns()).toEqual(columns)
    })
  })

  describe('getEntries', () => {
    it('should return entries', () => {
      expect(processing.getEntries()).toEqual(entries)
    })
  })

  describe('getMatrix', () => {
    it('should return matrix', () => {
      const matrix = processing.getMatrix()
      expect(matrix.length).toEqual(2)
      expect(matrix[0].id).toEqual('row1')
      expect(matrix[1].id).toEqual('row2')
    })
  })

  describe('setFilter', () => {
    it('should set filter', () => {
      processing.setFilter('rows', {id: 'row1'})
      processing.setFilter('columns', {id: 'col1'})
      processing.setFilter('entries', {id: 'entry1'})

      expect(processing['filters']).toEqual({
        rows: {id: 'row1'},
        columns: {id: 'col1'},
        entries: {id: 'entry1'},
      })
    })
  })

  describe('getFilter', () => {
    it('should return filter', () => {
      processing.setFilter('rows', {id: 'row1'})
      processing.setFilter('columns', {id: 'col1'})
      processing.setFilter('entries', {id: 'entry1'})

      expect(processing['getFilter'].call(processing, 'rows')).toEqual({id: 'row1'})
      expect(processing['getFilter'].call(processing, 'columns')).toEqual({id: 'col1'})
      expect(processing['getFilter'].call(processing, 'entries')).toEqual({id: 'entry1'})
    })
  })

  describe('removeFilter', () => {
    it('should remove filter', () => {
      processing.setFilter('rows', {id: 'row1'})
      processing.setFilter('columns', {id: 'col1'})
      processing.setFilter('entries', {id: 'entry1'})

      processing.removeFilter('rows')
      processing.removeFilter('columns')
      processing.removeFilter('entries')

      expect(processing['filters']).toEqual({
        rows: {},
        columns: {},
        entries: {},
      })
    })
  })
})
