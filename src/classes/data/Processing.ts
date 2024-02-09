import {IColumn, IEntity, IEntry, IRow} from '../../interfaces/base.interface'
import {
  IFilter,
  IMatrix,
  IMatrixColumn,
  IMatrixEntry,
  IMatrixRow,
  ISortOrder
} from '../../interfaces/main-grid.interface'
import Frame from './Frame'

class Processing {
  private static instance: Processing | null = null

  public rowsOriginal: IRow[] = []
  public rows: IRow[] = []
  public columnsOriginal: IColumn[] = []
  public columns: IColumn[] = []
  private entriesOriginal: IEntry[] = []
  private entries: IEntry[] = []
  private entriesMap: Map<string, IEntry> = new Map()
  private matrix: IMatrix = []
  private frame: Frame
  private filters = {
    entries: {},
    rows: {},
    columns: {},
  }
  private maxCellDepth = 0

  private rowsPrevIndex?: string | number
  private rowsOrder?: ISortOrder
  private columnsPrevIndex?: string | number
  private columnsOrder?: ISortOrder

  constructor(rows: IRow[], columns: IColumn[], entries: IEntry[]) {
    this.rowsOriginal = rows
    this.columnsOriginal = columns
    this.entriesOriginal = entries

    this.reset()
  }

  public reset() {
    this.rows = [...this.rowsOriginal]
    this.columns = [...this.columnsOriginal]
    this.entries = [...this.entriesOriginal]
    this.entriesMap = new Map()
    this.entries.forEach((entry) => this.entriesMap.set(entry.id, entry))

    this.applyFilters()
    this.generateMatrix()
    this.generateFrame()
  }

  public getEntriesMap() {
    return this.entriesMap
  }

  public getRows() {
    return this.rows
  }

  public getColumns() {
    return this.columns
  }

  public getEntries() {
    return this.entries
  }

  public setFilter(type: 'rows' | 'columns' | 'entries', filterObj: IFilter) {
    this.filters[type] = filterObj
  }

  public getCroppedMatrix() {
    const {x, y, z} = this.frame.getSizes()
    const croppedMatrix: IMatrix = []
    console.log('matrix:')
    console.log(this.matrix)
    console.log('frame sizes:')
    console.log(x, y, z)

    for (let i = y[0]; i <= y[1]; i++) {
      const row = this.matrix[i]
      const mRow: IMatrixRow = {
        id: row.id,
        data: row.data,
        columns: [],
      }
      croppedMatrix.push(mRow)
      for (let j = x[0]; j <= x[1]; j++) {
        const column = row.columns[j]
        const mColumn: IMatrixColumn = {
          id: column.id,
          data: column.data,
          entries: [],
        }
        mRow.columns.push(mColumn)
        for (let k = z[0]; k < Math.min(column.entries.length, z[1] + 1); k++) {
          const entry = column.entries[k]
          const mEntry: IMatrixEntry = {
            id: entry.id,
            data: entry.data,
          }
          mColumn.entries.push(mEntry)
        }
      }
    }

    return croppedMatrix
  }

  public getFrame() {
    return this.frame
  }

  private applyFilters() {
    const filterFunc = (filter: IFilter) => ((entity: IEntity) => {
      Object.keys(filter).every((field) => {
        const value = filter[field]
        if (typeof value === 'function') {
          return value.call(entity[field], entity)
        } else {
          return entity[field] === value
        }
      })
    })

    if (Object.keys(this.filters.rows).length > 0) {
      this.rows = this.rows.filter(filterFunc(this.filters.rows))
    }
    if (Object.keys(this.filters.columns).length > 0) {
      this.columns = this.columns.filter(filterFunc(this.filters.columns))
    }
    if (Object.keys(this.filters.entries).length > 0) {
      this.entries = this.entries.filter(filterFunc(this.filters.entries))
    }
  }

  private generateFrame() {
    this.frame = new Frame(this.columns.length - 1, this.rows.length - 1, this.maxCellDepth - 1)
  }

  private generateMatrix() {
    const matrix: IMatrix = this.rows.map((row) => {
      const columns = this.columns.map((column) => {
        return {
          id: column.id,
          data: column,
          entries: [],
        }
      })
      return {
        id: row.id,
        data: row,
        columns,
      }
    })

    this.entries.forEach((entry) => {
      const {id, rowId, columnId} = entry
      const rowMatrix = matrix.find((mRow) => mRow.id === rowId)
      if (!rowMatrix) {
        return
      }

      const columnMatrix = rowMatrix.columns.find((mCol) => mCol.id === columnId)
      if (!columnMatrix) {
        return
      }
      columnMatrix.entries.push({
        id,
        data: entry,
      })
      if (this.maxCellDepth < columnMatrix.entries.length) {
        this.maxCellDepth = columnMatrix.entries.length
      }
    })

    this.matrix = matrix
  }

  private toggleOrder(currentOrder?: ISortOrder): ISortOrder {
    return currentOrder === 'ASC' ? 'DESC' : 'ASC'
  }

  private sortItems(items: IEntity[], fieldName: string, index?: string | number, order?: ISortOrder): void {
    items.sort((a, b) => {
      const aVal = (index === undefined ? a[fieldName] : a[fieldName][index]) ?? '0'
      const bVal = (index === undefined ? b[fieldName] : b[fieldName][index]) ?? '0'

      if (aVal === bVal) {
        return 0
      }

      return order === 'ASC' ? aVal.toString().localeCompare(bVal) : bVal.toString().localeCompare(aVal)
    })
  }

  public sortRows(fieldName = 'id', index?: string | number) {
    if (index === undefined || index === this.rowsPrevIndex) {
      this.rowsOrder = this.toggleOrder(this.rowsOrder)
    }
    this.rowsPrevIndex = index
    this.sortItems(this.rows, fieldName, index, this.rowsOrder)
  }

  public sortColumns(fieldName = 'id', index?: string | number) {
    if (index === undefined || index === this.columnsPrevIndex) {
      this.columnsOrder = this.toggleOrder(this.columnsOrder)
    }
    this.columnsPrevIndex = index
    this.sortItems(this.columns, fieldName, index, this.columnsOrder)
  }

  public static createInstance(rows: IRow[], columns: IColumn[], entries: IEntry[]): Processing {
    if (!this.instance) {
      this.instance = new this(rows, columns, entries)
    }
    return this.instance
  }

  public static getInstance(): Processing {
    return this.instance as Processing
  }
}

export default Processing
