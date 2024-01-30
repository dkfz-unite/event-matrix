import {BlockType} from '../interfaces/base.interface'
import {IColumn, IEntry, IRow} from '../interfaces/bioinformatics.interface'
import {ICustomFunctions, ILookupTable, IStorageOptions} from '../interfaces/main-grid.interface'

export class Storage {
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
  public customFunctions: ICustomFunctions = {
    [BlockType.Rows]: {
      opacity: ({opacity}: IRow) => opacity ?? 1,
      fill: ({fill}: IRow) => fill ?? 'black',
    },
    [BlockType.Columns]: {
      opacity: ({opacity}: IColumn) => opacity ?? 1,
      fill: ({fill}: IColumn) => fill ?? 'black',
    },
  }

  private rowsPrevIndex: number | null = null
  private rowsOrder: 'ASC' | 'DESC' | null = null
  private columnsPrevIndex: number | null = null
  private columnsOrder: 'ASC' | 'DESC' | null = null

  public setLookupTable(lookupTable: ILookupTable) {
    this.lookupTable = lookupTable
  }

  public setOptions({
    minCellHeight,
    prefix = this.prefix,
    rows = this.rowsOriginal,
    columns = this.columnsOriginal,
    entries = this.entries,
    columnsFillFunc,
    rowsOpacityFunc,
    rowsFillFunc,
    columnsOpacityFunc,
  }: IStorageOptions) {
    this.minCellHeight = minCellHeight ?? 10
    this.prefix = prefix ?? 'og-'
    this.rowsOriginal = [...rows]
    this.rows = [...rows]
    this.columnsOriginal = [...columns]
    this.columns = [...columns]
    this.entries = [...entries]

    if (rowsFillFunc) {
      this.customFunctions[BlockType.Rows] = {
        ...this.customFunctions[BlockType.Rows],
        fill: rowsFillFunc,
      }
    }
    if (rowsOpacityFunc) {
      this.customFunctions[BlockType.Rows] = {
        ...this.customFunctions[BlockType.Rows],
        opacity: rowsOpacityFunc,
      }
    }
    if (columnsFillFunc) {
      this.customFunctions[BlockType.Columns] = {
        ...this.customFunctions[BlockType.Columns],
        fill: columnsFillFunc,
      }
    }
    if (columnsOpacityFunc) {
      this.customFunctions[BlockType.Columns] = {
        ...this.customFunctions[BlockType.Columns],
        opacity: columnsOpacityFunc,
      }
    }
  }

  public reset() {
    this.rows = [...this.rowsOriginal]
    this.columns = [...this.columnsOriginal]
    this.rowsOrder = null
    this.columnsOrder = null
    this.rowsPrevIndex = null
    this.columnsPrevIndex = null
  }

  public static getInstance(): Storage {
    if (!this.instance) {
      this.instance = new this()
    }
    return this.instance
  }

  private toggleOrder(currentOrder: 'ASC' | 'DESC' | null): 'ASC' | 'DESC' {
    return currentOrder === 'ASC' ? 'DESC' : 'ASC'
  }

  private sortItems(items: IRow[] | IColumn[], fieldName: string, index: number | null, order: 'ASC' | 'DESC' | null): void {
    items.sort((a, b) => {
      const aVal = (index === null ? a[fieldName] : a[fieldName][index]) ?? '0'
      const bVal = (index === null ? b[fieldName] : b[fieldName][index]) ?? '0'

      if (aVal === bVal) {
        return 0
      }

      return order === 'ASC' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    })
  }

  public sortRows(fieldName = 'id', index: number | null = null) {
    if (index === null || index === this.rowsPrevIndex) {
      this.rowsOrder = this.toggleOrder(this.rowsOrder)
    }
    this.rowsPrevIndex = index
    this.sortItems(this.rows, fieldName, index, this.rowsOrder)
  }

  public sortColumns(fieldName = 'id', index: number | null = null) {
    if (index === null || index === this.columnsPrevIndex) {
      this.columnsOrder = this.toggleOrder(this.columnsOrder)
    }
    this.columnsPrevIndex = index
    this.sortItems(this.columns, fieldName, index, this.columnsOrder)
  }
}

export const storage = Storage.getInstance()
