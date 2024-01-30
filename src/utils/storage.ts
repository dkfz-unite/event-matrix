import {BlockType} from '../interfaces/base.interface'
import {IColumn, IEntry, IRow} from '../interfaces/bioinformatics.interface'
import {EventMatrixParams, ILookupTable} from '../interfaces/main-grid.interface'

class Storage {
  private static instance: Storage | null = null

  private constructor() {
  }

  public minCellHeight = 10
  public prefix = 'og-'
  public lookupTable: ILookupTable = {}
  public rowsOriginal: IRow[] = []
  public rows: IRow[] = []
  public columnsOriginal: IColumn[] = []
  public columns: IColumn[] = []
  public entries: IEntry[] = []
  public customFunctions = {
    [BlockType.Rows]: {
      opacity: (val: any) => 1,
      fill: (val: any) => 'black',
    },
    [BlockType.Columns]: {
      opacity: (val: any) => 1,
      fill: (val: any) => 'black',
    },
  }

  private rowsPrevIndex: null
  private rowsOrder: 'ASC' | 'DESC' | null = null
  private columnsPrevIndex: null
  private columnsOrder: 'ASC' | 'DESC' | null = null

  public setLookupTable(lookupTable: ILookupTable) {
    this.lookupTable = lookupTable
  }

  public setOptions({
    minCellHeight,
    prefix,
    rows,
    columns,
    entries,
    columnsFillFunc,
    rowsOpacityFunc,
    rowsFillFunc,
    columnsOpacityFunc,
  }: EventMatrixParams) {
    if (minCellHeight !== undefined) {
      this.minCellHeight = minCellHeight
    }
    if (prefix !== undefined) {
      this.prefix = prefix
    }
    if (rows !== undefined) {
      this.rowsOriginal = [...rows]
      this.rows = rows
    }
    if (columns !== undefined) {
      this.columnsOriginal = [...columns]
      this.columns = columns
    }
    if (entries !== undefined) {
      this.entries = entries
    }
    if (rowsFillFunc !== undefined) {
      this.customFunctions[BlockType.Rows].fill = rowsFillFunc
    }
    if (rowsOpacityFunc !== undefined) {
      this.customFunctions[BlockType.Rows].opacity = rowsOpacityFunc
    }
    if (columnsFillFunc !== undefined) {
      this.customFunctions[BlockType.Columns].fill = columnsFillFunc
    }
    if (columnsOpacityFunc !== undefined) {
      this.customFunctions[BlockType.Columns].opacity = columnsOpacityFunc
    }
  }

  public reset() {
    this.rows = [...this.rowsOriginal]
    this.columns = [...this.columnsOriginal]
    this.rowsOrder = null
    this.rowsPrevIndex = null
    this.columnsOrder = null
    this.columnsPrevIndex = null
  }

  public static getInstance(): Storage {
    if (this.instance === null) {
      this.instance = new this()
    }
    return this.instance
  }

  public sortRows(fieldName = 'id', index = null) {
    if (index === null || index === this.rowsPrevIndex) {
      if (this.rowsOrder === null) {
        this.rowsOrder = 'ASC'
      } else {
        this.rowsOrder = this.rowsOrder === 'ASC' ? 'DESC' : 'ASC'
      }
    }
    this.rowsPrevIndex = index

    this.rows.sort((a, b) => {
      const aVal = (index === null ? a[fieldName] : a[fieldName][index]) ?? '0'
      const bVal = (index === null ? b[fieldName] : b[fieldName][index]) ?? '0'
      if (aVal === bVal) return 0
      if (this.rowsOrder === 'ASC') {
        return aVal < bVal ? 1 : -1
      } else {
        return aVal > bVal ? 1 : -1
      }
    })
  }

  public sortColumns(fieldName = 'id', index = null) {
    if (index === null || index === this.columnsPrevIndex) {
      if (this.columnsOrder === null) {
        this.columnsOrder = 'ASC'
      } else {
        this.columnsOrder = this.columnsOrder === 'ASC' ? 'DESC' : 'ASC'
      }
    }
    this.columnsPrevIndex = index

    this.columns.sort((a, b) => {
      const aVal = (index === null ? a[fieldName] : a[fieldName][index]) ?? '0'
      const bVal = (index === null ? b[fieldName] : b[fieldName][index]) ?? '0'
      if (aVal === bVal) return 0
      if (this.columnsOrder === 'ASC') {
        return aVal < bVal ? 1 : -1
      } else {
        return aVal > bVal ? 1 : -1
      }
    })
  }
}

export const storage = Storage.getInstance()
