import {BlockType, IEntry} from '../interfaces/base.interface'
import {ICustomFunctions, ILookupTable, IStorageOptions} from '../interfaces/main-grid.interface'
import {IMatrixDescriptionCell} from '../interfaces/matrix.interface'

export class Storage {
  private static instance: Storage | null = null

  private constructor() {
  }

  public minCellHeight = 10
  public cellHeight = 10
  public cellWidth = 10
  public layer: string | null = null
  public prefix = 'og-'
  public heatMap = false
  public heatMapColor = '#D33682'
  public lookupTable: ILookupTable = {}
  public customFunctions: ICustomFunctions = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [BlockType.Rows]: (cellData: IMatrixDescriptionCell) => ({color: 'black', opacity: 1}),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [BlockType.Columns]: (cellData: IMatrixDescriptionCell) => ({color: 'black', opacity: 1}),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [BlockType.Entries]: (entry: IEntry) => ({color: 'black', opacity: 1}),
  }

  public setLookupTable(lookupTable: ILookupTable) {
    this.lookupTable = lookupTable
  }

  setCellDimensions(width: number, height: number) {
    this.cellWidth = width
    this.cellHeight = height
  }

  public setOptions({
    minCellHeight = this.minCellHeight,
    prefix = this.prefix,
    heatMapColor = this.heatMapColor,
    heatMap = this.heatMap,
    columnsAppearanceFunc,
    rowsAppearanceFunc,
    cellAppearanceFunc,
  }: IStorageOptions) {
    this.minCellHeight = minCellHeight
    this.prefix = prefix
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
