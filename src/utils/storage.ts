import {BlockType, IEntry} from '../interfaces/base.interface'
import {ICustomFunctions, ILookupTable, IPreparedFieldData, IStorageOptions} from '../interfaces/main-grid.interface'

export class Storage {
  private static instance: Storage | null = null

  private constructor() {
  }

  public minCellHeight = 10
  public layer: string | null = null
  public prefix = 'og-'
  public heatMap = false
  public heatMapColor = '#D33682'
  public lookupTable: ILookupTable = {}
  public customFunctions: ICustomFunctions = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [BlockType.Rows]: (fieldData: IPreparedFieldData) => ({color: 'black', opacity: 1}),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [BlockType.Columns]: (fieldData: IPreparedFieldData) => ({color: 'black', opacity: 1}),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [BlockType.Entries]: (entry: IEntry) => ({color: 'black', opacity: 1}),
  }

  public setLookupTable(lookupTable: ILookupTable) {
    this.lookupTable = lookupTable
  }

  public setOptions({
    minCellHeight,
    prefix = this.prefix,
    heatMapColor = this.heatMapColor,
    heatMap = this.heatMap,
    columnsAppearanceFunc,
    rowsAppearanceFunc,
    cellAppearanceFunc,
  }: IStorageOptions) {
    this.minCellHeight = minCellHeight ?? 10
    this.prefix = prefix ?? 'og-'
    this.heatMapColor = heatMapColor
    this.heatMap = heatMap

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
  }

  public static getInstance(): Storage {
    if (!this.instance) {
      this.instance = new this()
    }
    return this.instance
  }
}

export const storage = Storage.getInstance()
