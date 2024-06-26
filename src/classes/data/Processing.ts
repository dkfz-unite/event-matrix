import {IColumn, IEntity, IEntry, IRow} from '../../interfaces/base.interface'
import {
  IDescriptionField,
  IFilter,
  IMatrix,
  IMatrixColumn,
  IMatrixEntry,
  IMatrixRow,
  IProcessingParams,
  ISortOrder
} from '../../interfaces/main-grid.interface'
import {IMatrixDescriptionGroup} from '../../interfaces/matrix.interface'
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
  private frame: Frame = new Frame(0, 0, 0)
  private filters = {
    entries: {},
    rows: {},
    columns: {},
  }
  private maxCellDepth = 0

  private rowsPrevFieldName?: string
  private rowsPrevIndex?: string
  private rowsOrder?: ISortOrder
  private columnsPrevFieldName?: string
  private columnsPrevIndex?: string
  private columnsOrder?: ISortOrder

  private descriptionFields: {
    columns: IDescriptionField[]
    rows: IDescriptionField[]
  } = {
    columns: [],
    rows: [],
  }

  constructor(rows: IRow[] = [], columns: IColumn[] = [], entries: IEntry[] = [], columnsFields: IDescriptionField[] = [], rowsFields: IDescriptionField[]) {
    this.rowsOriginal = rows
    this.columnsOriginal = columns
    this.entriesOriginal = entries
    this.descriptionFields.columns = columnsFields
    this.descriptionFields.rows = rowsFields

    this.reset()
  }

  public reset() {
    this.rows = [...this.rowsOriginal]
    this.columns = [...this.columnsOriginal]
    this.entries = [...this.entriesOriginal]

    this.applyFilters()
    this.makeCalculations()
    this.generateMatrix()
    this.applyDefaultSort()
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

    this.rows = [...this.rowsOriginal]
    this.columns = [...this.columnsOriginal]
    this.entries = [...this.entriesOriginal]
    this.applyFilters()
    this.makeCalculations()
    this.generateMatrix()
    this.applySort()
  }

  public removeFilter(type: 'rows' | 'columns' | 'entries' | null = null) {
    if (type === null) {
      this.filters = {
        entries: {},
        rows: {},
        columns: {},
      }

      this.rows = [...this.rowsOriginal]
      this.columns = [...this.columnsOriginal]
      this.entries = [...this.entriesOriginal]
      this.applyFilters()
      this.makeCalculations()
      this.generateMatrix()
      this.applySort()
      return
    } else {
      this.setFilter(type, {})
    }
  }

  private makeCalculations() {
    this.rows.forEach((row) => {
      row.total = 0
    })
    this.columns.forEach((column) => {
      column.total = 0
    })
    const rowsMap = new Map(Object.entries(this.rows).map((entry) => ([entry[1].id, entry[1]])))
    const columnsMap = new Map(Object.entries(this.columns).map((entry) => ([entry[1].id, entry[1]])))

    this.entries.forEach((entry) => {
      const row = rowsMap.get(entry.rowId)
      if (row) {
        row.total++
      }
      const column = columnsMap.get(entry.columnId)
      if (column) {
        column.total++
      }
    })
  }

  private applySort() {
    if (this.rowsPrevIndex !== undefined) {
      this.sortMatrixRowsByEntries(this.rowsPrevIndex, true)
    } else {
      this.sortRows(this.rowsPrevFieldName ?? 'total', true)
    }
    if (this.columnsPrevIndex !== undefined) {
      this.sortMatrixColumnsByEntries(this.columnsPrevIndex, true)
    } else {
      this.sortColumns(this.columnsPrevFieldName ?? 'total', true)
    }
  }

  public getCroppedMatrix() {
    const {x, y, z} = this.frame.getSizes()
    const croppedMatrix: IMatrix = []

    const totalByColumn: Record<string, number> = {}
    for (let i = y[0]; i <= y[1]; i++) {
      const row = this.matrix[i]
      const mRow: IMatrixRow = {
        id: row.id,
        data: {
          ...row.data,
          total: 0,
        },
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
        mRow.data.total += mColumn.entries.length
        if (totalByColumn[mColumn.id] === undefined) {
          totalByColumn[mColumn.id] = 0
        }
        totalByColumn[mColumn.id] += mColumn.entries.length
      }
    }

    croppedMatrix.forEach((mRow) => {
      mRow.columns.forEach((mCol) => {
        mCol.data.total = totalByColumn[mCol.id] ?? 0
      })
    })

    return croppedMatrix
  }

  public getFrame() {
    return this.frame
  }

  private applyFilters() {
    const filterFunc = (filter: IFilter) => {
      return (entity: IEntity) => {
        return Object.keys(filter).filter((field) => filter[field] !== undefined).every((field) => {
          const value = filter[field]
          if (typeof value === 'function') {
            return value.call(entity[field], entity)
          } else {
            return entity[field] === value
          }
        })
      }
    }

    const rowsFilter = filterFunc(this.filters.rows)
    const columnsFilter = filterFunc(this.filters.columns)
    const entriesFilter = filterFunc(this.filters.entries)

    // console.log('applyFilters')
    // console.log(JSON.parse(JSON.stringify(this.filters.entries)))
    // console.log(JSON.parse(JSON.stringify(this.entries)), entriesFilter(this.entries[0] ?? {}))
    // console.log(JSON.parse(JSON.stringify(this.entries.filter(entriesFilter))))

    if (Object.keys(this.filters.rows).length > 0) {
      this.rows = this.rows.filter(rowsFilter)
    }
    if (Object.keys(this.filters.columns).length > 0) {
      this.columns = this.columns.filter(columnsFilter)
    }
    if (Object.keys(this.filters.entries).length > 0) {
      this.entries = this.entries.filter(entriesFilter)
    }
  }

  private generateFrame() {
    this.frame = new Frame(this.columns.length - 1, this.rows.length - 1, this.maxCellDepth - 1)
  }

  public setFrame(frame: Frame) {
    this.frame = frame
  }

  public getMatrix() {
    return this.matrix
  }

  public getFilter(type: 'rows' | 'columns' | 'entries') {
    return this.filters[type]
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

  private sortItems(items: IEntity[], fieldName: string, order?: ISortOrder): void {
    items.sort((a, b) => {
      const aVal = a[fieldName] ?? '0'
      const bVal = b[fieldName] ?? '0'

      if (aVal === bVal) {
        return 0
      }

      const delta = aVal > bVal ? 1 : -1

      return order === 'ASC' ? delta : -delta
    })
  }

  public sortMatrixRowsByEntries(columnId: string, lockOrder = false) {
    if (!lockOrder && this.rowsPrevIndex === columnId) {
      this.rowsOrder = this.toggleOrder(this.rowsOrder)
    }
    this.rowsPrevIndex = columnId
    const columnIndex = this.matrix.length > 0 ? this.matrix[0].columns.findIndex((c) => c.id === columnId) : -1
    if (columnIndex !== -1) {
      const frameSizes = this.getFrame().getSizes()
      const rows = this.matrix
      this.matrix = [
        ...rows.slice(0, frameSizes.y[0]),
        ...rows.slice(frameSizes.y[0], frameSizes.y[1] + 1).sort((mRowA, mRowB) => {
          const delta = mRowA.columns[columnIndex].entries.length - mRowB.columns[columnIndex].entries.length
          return this.rowsOrder === 'ASC' ? delta : -delta
        }),
        ...rows.slice(frameSizes.y[1] + 1),
      ]
    }
  }

  public sortMatrixColumnsByEntries(rowId: string, lockOrder = false) {
    if (!lockOrder && this.columnsPrevIndex === rowId) {
      this.columnsOrder = this.toggleOrder(this.columnsOrder)
    }
    this.columnsPrevIndex = rowId
    const rowIndex = this.matrix.findIndex((mRow) => mRow.id === rowId)

    const frameSizes = this.getFrame().getSizes()
    const columns = this.matrix[rowIndex].columns
    const sortedColumns = [
      ...columns.slice(0, frameSizes.x[0]),
      ...columns.slice(frameSizes.x[0], frameSizes.x[1] + 1).sort((mColA, mColB) => {
        const delta = mColA.entries.length - mColB.entries.length
        return this.columnsOrder === 'ASC' ? delta : -delta
      }),
      ...columns.slice(frameSizes.x[1] + 1),
    ]
    const columnIndexOrders = sortedColumns.map((mCol) => mCol.id)

    for (const mRow of this.matrix) {
      const arrayCopy = [...mRow.columns]
      for (let i = 0; i < columnIndexOrders.length; i++) {
        const col = arrayCopy.find((col) => col.id === columnIndexOrders[i])
        if (col !== undefined) {
          mRow.columns[i] = col
        }
      }
    }
  }

  public sortMatrixRows(fieldName: string) {
    this.matrix.sort((mRowA, mRowB) => {
      const aVal = mRowA.data[fieldName]
      const bVal = mRowB.data[fieldName]
      if (bVal === undefined) {
        return this.rowsOrder === 'ASC' ? -1 : 1
      }
      const delta = aVal === bVal ? 0 : (aVal > bVal ? 1 : -1)
      return this.rowsOrder === 'ASC' ? delta : -delta
    })
  }

  public sortMatrixColumns(fieldName: string) {
    if (this.matrix.length === 0) {
      return
    }

    const columnIndexOrders = this.matrix[0].columns.sort((mColA, mColB) => {
      const aVal = mColA.data[fieldName]
      const bVal = mColB.data[fieldName]
      if (bVal === undefined) {
        return this.rowsOrder === 'ASC' ? -1 : 1
      }
      const delta = aVal === bVal ? 0 : (aVal > bVal ? 1 : -1)
      return this.columnsOrder === 'ASC' ? delta : -delta
    }).map((mCol) => mCol.id)

    for (const mRow of this.matrix) {
      const arrayCopy = [...mRow.columns]
      for (let i = 0; i < columnIndexOrders.length; i++) {
        const col = arrayCopy.find((col) => col.id === columnIndexOrders[i])
        if (col !== undefined) {
          mRow.columns[i] = col
        }
      }
    }
  }

  public sortRows(fieldName = 'total', lockOrder = false) {
    if (!lockOrder && fieldName === this.rowsPrevFieldName) {
      this.rowsOrder = this.toggleOrder(this.rowsOrder)
    }
    this.rowsPrevFieldName = fieldName

    this.sortMatrixRows(fieldName)
  }

  public sortColumns(fieldName = 'total', lockOrder = false) {
    if (!lockOrder && fieldName === this.columnsPrevFieldName) {
      this.columnsOrder = this.toggleOrder(this.columnsOrder)
    }
    this.columnsPrevFieldName = fieldName
    this.sortMatrixColumns(fieldName)
  }

  public static createInstance(rows: IRow[], columns: IColumn[], entries: IEntry[], columnsFields = [], rowsFields = []): Processing {
    if (!this.instance) {
      this.instance = new this(rows, columns, entries, columnsFields, rowsFields)
    }
    return this.instance
  }

  public applyDefaultSort() {
    this.rowsOrder = 'DESC'
    this.columnsOrder = 'DESC'
    this.sortMatrixRows('total')
    this.sortMatrixColumns('total')
  }

  public getCroppedColumns() {
    const {x} = this.frame.getSizes()
    const croppedColumns: IMatrixColumn[] = []

    const row = this.matrix[0]
    for (let i = x[0]; i <= x[1]; i++) {
      croppedColumns.push({
        ...row.columns[i],
        entries: [],
      })
    }
    return croppedColumns
  }

  public getCroppedRows() {
    const {y} = this.frame.getSizes()
    const croppedRows: IMatrixRow[] = []

    for (let i = y[0]; i <= y[1]; i++) {
      croppedRows.push({
        ...this.matrix[i],
        columns: [],
      })
    }
    return croppedRows
  }

  public getBottomDescriptionGroups(): IMatrixDescriptionGroup[] {
    const groups: IMatrixDescriptionGroup[] = []
    let id = 0
    for (const columnField of this.descriptionFields.columns) {
      let existedGroup = groups.find((group) => group.label === columnField.group)
      if (!existedGroup) {
        existedGroup = {
          id: (++id).toString(),
          label: columnField.group,
          fields: [],
        }
        groups.push(existedGroup)
      }

      existedGroup.fields.push({
        id: columnField.fieldName,
        field: columnField.fieldName,
        type: columnField.type,
        label: columnField.name,
        cells: [],
      })
    }

    const croppedColumns = this.getCroppedColumns()
    for (const matrixColumn of croppedColumns) {
      for (const group of groups) {
        for (const field of group.fields) {
          field.cells.push({
            value: matrixColumn.data[field.field],
            displayValue: matrixColumn.data[field.field] ?? null,
            id: matrixColumn.id,
          })
        }
      }
    }

    return groups
  }

  public getSideDescriptionGroups(): IMatrixDescriptionGroup[] {
    const groups: IMatrixDescriptionGroup[] = []
    let id = 0
    for (const rowField of this.descriptionFields.rows) {
      let existedGroup = groups.find((group) => group.label === rowField.group)
      if (!existedGroup) {
        existedGroup = {
          id: (++id).toString(),
          label: rowField.group,
          fields: [],
        }
        groups.push(existedGroup)
      }

      existedGroup.fields.push({
        id: rowField.fieldName,
        field: rowField.fieldName,
        type: rowField.type,
        label: rowField.name,
        cells: [],
      })
    }

    const croppedRows = this.getCroppedRows()
    for (const matrixRow of croppedRows) {
      for (const group of groups) {
        for (const field of group.fields) {
          field.cells.push({
            value: matrixRow.data[field.field],
            displayValue: matrixRow.data[field.field] ?? null,
            id: matrixRow.id,
          })
        }
      }
    }

    // console.log(croppedRows)
    // console.log(groups)
    return groups
  }

  public updateData({columns, rows, entries}: IProcessingParams) {
    this.rowsOriginal = rows
    this.columnsOriginal = columns
    this.entriesOriginal = entries
    // this.descriptionFields.columns = columnsFields
    // this.descriptionFields.rows = rowsFields

    this.reset()
  }

  public static getInstance(): Processing {
    return this.instance as Processing
  }
}

export default Processing
