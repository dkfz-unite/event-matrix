import {IColumn, IEntity, IEntry, IRow} from '../../interfaces/base.interface'
import {IFilter, IMatrix, ISortOrder} from '../../interfaces/main-grid.interface'
import Frame from './Frame'

class Processing {
  private static instance: Processing | null = null

  public rowsOriginal: IRow[] = []
  public rows: IRow[] = []
  public columnsOriginal: IColumn[] = []
  public columns: IColumn[] = []
  private entriesOriginal: IEntry[] = []
  private entries: IEntry[] = []
  private matrix: IMatrix = new Map()
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
    this.entries = entries

    this.reset()
  }

  public reset() {
    this.rows = [...this.rowsOriginal]
    this.columns = [...this.columnsOriginal]
    this.entries = [...this.entriesOriginal]

    this.applyFilters()
    this.generateMatrix()
    this.generateFrame()
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
    const croppedMatrix: IMatrix = new Map()
    const croppedRows = this.rows.slice(y[0], y[1])
    const croppedColumns = this.columns.slice(x[0], x[1])

    croppedRows.forEach((row) => {
      const rowMap = new Map()
      croppedMatrix.set(row.id, rowMap)

      croppedColumns.forEach((column) => {
        const cellEntries = this.matrix.get(row.id)?.get(column.id) ?? []
        const croppedEntries = cellEntries.slice(z[0], z[1])
        rowMap.set(column.id, croppedEntries)
      })
    })

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
      this.updateCellDepth()
    }
  }

  private generateFrame() {
    this.frame = new Frame(this.columns.length - 1, this.rows.length - 1, this.maxCellDepth - 1)
  }


  private updateCellDepth() {
    this.maxCellDepth = 0
    for (const columns of this.matrix.values()) {
      for (const entries of columns.values()) {
        if (entries.length > this.maxCellDepth) {
          this.maxCellDepth = entries.length
        }
      }
    }
  }

  private generateMatrix() {
    const matrix: IMatrix = new Map()

    this.rows.forEach((row) => {
      const rowMap = new Map()
      matrix.set(row.id, rowMap)

      this.columns.forEach((column) => {
        rowMap.set(column.id, [])
      })
    })

    this.entries.forEach(({id, rowId, columnId}) => {
      const rowMatrix = matrix.get(rowId)
      if (!rowMatrix) {
        return
      }

      const columnMatrix = rowMatrix.get(columnId)
      if (!columnMatrix) {
        return
      }
      columnMatrix.push(id)
      if (this.maxCellDepth < columnMatrix.length) {
        this.maxCellDepth = columnMatrix.length
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

  public static getInstance(rows: IRow[], columns: IColumn[], entries: IEntry[]): Processing {
    if (!this.instance) {
      this.instance = new this(rows, columns, entries)
    }
    return this.instance
  }
}

export default Processing
