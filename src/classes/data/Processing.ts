import {IColumn, IEntry, IRow} from '../../interfaces/bioinformatics.interface'
import {IFrame, IMatrix, ISortOrder} from '../../interfaces/main-grid.interface'

class Processing {
  public rowsOriginal: IRow[] = []
  public rows: IRow[] = []
  public columnsOriginal: IColumn[] = []
  public columns: IColumn[] = []
  private entries: IEntry[] = []
  private matrix: IMatrix = new Map()
  private frame: IFrame = {
    x: [0, 0],
    y: [0, 0],
    z: [0, 0],
  }
  private maxCellDepth = 0

  private rowsPrevIndex?: string | number
  private rowsOrder?: ISortOrder
  private columnsPrevIndex?: string | number
  private columnsOrder?: ISortOrder

  constructor(rows: IRow[], columns: IColumn[], entries: IEntry[]) {
    this.rowsOriginal = rows
    this.columnsOriginal = columns
    this.entries = entries

    this.reset()
  }

  public reset() {
    this.rows = [...this.rowsOriginal]
    this.columns = [...this.columnsOriginal]

    this.generateMatrix()
    this.generateFrame()
  }

  public getFrameView() {
    const croppedMatrix: IMatrix = new Map()
    const croppedRows = this.rows.slice(this.frame.y[0], this.frame.y[1])
    const croppedColumns = this.columns.slice(this.frame.x[0], this.frame.x[1])

    croppedRows.forEach((row) => {
      const rowMap = new Map()
      croppedMatrix.set(row.id, rowMap)

      croppedColumns.forEach((column) => {
        const cellEntries = this.matrix.get(row.id).get(column.id)
        const croppedEntries = cellEntries.slice(this.frame.z[0], this.frame.z[1])
        rowMap.set(column.id, croppedEntries)
      })
    })

    return croppedMatrix
  }

  public setFrame(x: [number, number], y: [number, number], z?: [number, number]) {
    this.frame.x = x
    this.frame.y = y
    if (z !== undefined) {
      this.frame.z = z
    }
  }

  public incrementFrameSize(step = 1) {
    this.frame.x = [
      Math.max(this.frame.x[0] - step, 0),
      Math.min(this.frame.x[1] + step, this.columns.length - 1),
    ]
    this.frame.y = [
      Math.max(this.frame.y[0] - step, 0),
      Math.min(this.frame.y[1] + step, this.rows.length - 1),
    ]
  }

  public decrementFrameSize(step = 1) {
    if (this.frame.x[1] > this.frame.x[0]) {
      this.frame.x[0] += step
      this.frame.x[1] -= step
    }
    if (this.frame.y[1] > this.frame.y[0]) {
      this.frame.y[0] += step
      this.frame.y[1] -= step
    }
  }

  public shiftFrameX(step = 1) {
    this.frame.x[0] = Math.min(Math.max(this.frame.x[0] + step, 0), this.columns.length - 1)
    this.frame.x[1] = Math.min(Math.max(this.frame.x[0] + step, 0), this.columns.length - 1)
  }

  public shiftFrameY(step = 1) {
    this.frame.y[0] = Math.min(Math.max(this.frame.y[0] + step, 0), this.rows.length - 1)
    this.frame.y[1] = Math.min(Math.max(this.frame.y[0] + step, 0), this.rows.length - 1)
  }

  private generateFrame() {
    this.frame = {
      x: [0, this.columns.length - 1],
      y: [0, this.rows.length - 1],
      z: [0, this.maxCellDepth - 1],
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

  private sortItems(items: IRow[] | IColumn[], fieldName: string, index?: string | number, order?: ISortOrder): void {
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
}

export default Processing
