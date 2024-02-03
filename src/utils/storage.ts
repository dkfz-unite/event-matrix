import {BlockType} from '../interfaces/base.interface'
import {IColumn, IEntry, IRow} from '../interfaces/bioinformatics.interface'
import {ICustomFunctions, ILookupTable, IPreparedFieldData, IStorageOptions} from '../interfaces/main-grid.interface'

export class Storage {
  private static instance: Storage | null = null

  private constructor() {
  }

  public minCellHeight = 10
  public layer: string | null = null
  public prefix = 'og-'
  public lookupTable: ILookupTable = {}
  public rowsOriginal: IRow[] = []
  public rows: IRow[] = []
  public columnsOriginal: IColumn[] = []
  public columns: IColumn[] = []
  public entriesOriginal: IEntry[] = []
  public entries: IEntry[] = []
  public customFunctions: ICustomFunctions = {
    [BlockType.Rows]: (fieldData: IPreparedFieldData) => ({color: 'black', opacity: 1}),
    [BlockType.Columns]: (fieldData: IPreparedFieldData) => ({color: 'black', opacity: 1}),
    [BlockType.Entries]: (entry: IEntry) => ({color: 'black', opacity: 1}),
  }

  private rowsPrevIndex: string | number | null = null
  private rowsOrder: 'ASC' | 'DESC' | null = null
  private columnsPrevIndex: string | number | null = null
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
    columnsAppearanceFunc,
    rowsAppearanceFunc,
    cellAppearanceFunc,
  }: IStorageOptions) {
    this.minCellHeight = minCellHeight ?? 10
    this.prefix = prefix ?? 'og-'
    this.rowsOriginal = [...rows]
    this.rows = [...rows]
    this.columnsOriginal = [...columns]
    this.columns = [...columns]
    this.entriesOriginal = [...entries]
    this.entries = [...entries]

    if (rowsAppearanceFunc !== undefined) {
      this.customFunctions[BlockType.Rows] = rowsAppearanceFunc
    }
    if (columnsAppearanceFunc !== undefined) {
      this.customFunctions[BlockType.Columns] = columnsAppearanceFunc
    }
    if (cellAppearanceFunc !== undefined) {
      this.customFunctions[BlockType.Entries] = cellAppearanceFunc
    }
  }


  public reset() {
    this.rows = [...this.rowsOriginal]
    this.columns = [...this.columnsOriginal]
    this.entries = [...this.entriesOriginal.filter((entry) => this.layer === null ? true : entry.layer === this.layer)]
    this.rowsOrder = null
    this.columnsOrder = null
    this.rowsPrevIndex = null
    this.columnsPrevIndex = null
  }

  public setLayer(layer: string | null) {
    this.layer = layer
    console.log(JSON.parse(JSON.stringify(this.rows)))
    console.log(JSON.parse(JSON.stringify(this.columns)))
    this.entries = [...this.entriesOriginal.filter((entry) => this.layer === null ? true : entry.layer === this.layer)]
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

  private sortItems(items: IRow[] | IColumn[], fieldName: string, index: string | number | null, order: 'ASC' | 'DESC' | null): void {
    items.sort((a, b) => {
      const aVal = (index === null ? a[fieldName] : a[fieldName][index]) ?? '0'
      const bVal = (index === null ? b[fieldName] : b[fieldName][index]) ?? '0'

      if (aVal === bVal) {
        return 0
      }

      return order === 'ASC' ? aVal.toString().localeCompare(bVal) : bVal.toString().localeCompare(aVal)
    })
  }

  public sortRows(fieldName = 'id', index: string | number | null = null) {
    if (index === null || index === this.rowsPrevIndex) {
      this.rowsOrder = this.toggleOrder(this.rowsOrder)
    }
    this.rowsPrevIndex = index
    this.sortItems(this.rows, fieldName, index, this.rowsOrder)
  }

  public sortColumns(fieldName = 'id', index: string | number | null = null) {
    if (index === null || index === this.columnsPrevIndex) {
      this.columnsOrder = this.toggleOrder(this.columnsOrder)
    }
    this.columnsPrevIndex = index
    this.sortItems(this.columns, fieldName, index, this.columnsOrder)
  }
}

export const storage = Storage.getInstance()
