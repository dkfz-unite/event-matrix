import {BlockType, IEntry} from '../interfaces/base.interface'
import {ICustomFunctions, ILookupTable, IStorageOptions} from '../interfaces/main-grid.interface'
import {IMatrixDescriptionCell} from '../interfaces/matrix.interface'

export class Storage {
  private static instance: Storage | null = null

  private constructor() {
  }

  public minCellHeight = 10
  public minCellWidth = 30
  public cellHeight = 10
  public cellWidth = 30
  public gridHeight = 500
  public gridWidth = 1000
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
    minCellHeight,
    minCellWidth,
    prefix,
    heatMap,
    columnsAppearanceFunc,
    rowsAppearanceFunc,
    cellAppearanceFunc,
    columnsCount,
    rowsCount,
    gridHeight,
    gridWidth,
  }: IStorageOptions) {
    this.minCellHeight = minCellHeight ?? this.minCellHeight
    this.minCellWidth = minCellWidth ?? this.minCellWidth
    this.prefix = prefix ?? this.prefix
    this.heatMap = heatMap ?? this.heatMap

    if (rowsAppearanceFunc !== undefined) {
      this.customFunctions[BlockType.Rows] = rowsAppearanceFunc
    }
    if (columnsAppearanceFunc !== undefined) {
      this.customFunctions[BlockType.Columns] = columnsAppearanceFunc
    }
    if (cellAppearanceFunc !== undefined) {
      this.customFunctions[BlockType.Entries] = cellAppearanceFunc
    }
    this.gridHeight = gridHeight ?? ((rowsCount ?? 0) * this.minCellHeight)
    this.gridWidth = gridWidth ?? ((columnsCount ?? 0) * this.minCellWidth)
  }

  public updateOptions({
    minCellHeight,
    minCellWidth,
    prefix,
    heatMap,
    columnsAppearanceFunc,
    rowsAppearanceFunc,
    cellAppearanceFunc,
    columnsCount,
    rowsCount,
    gridHeight,
    gridWidth,
  }: Partial<IStorageOptions>) {
    if (minCellHeight !== undefined) {
      this.minCellHeight = minCellHeight
    }
    if (minCellWidth !== undefined) {
      this.minCellWidth = minCellWidth
    }
    if (prefix !== undefined) {
      this.prefix = prefix
    }
    if (heatMap !== undefined) {
      this.heatMap = heatMap
    }
    if (rowsAppearanceFunc !== undefined) {
      this.customFunctions[BlockType.Rows] = rowsAppearanceFunc
    }
    if (columnsAppearanceFunc !== undefined) {
      this.customFunctions[BlockType.Columns] = columnsAppearanceFunc
    }
    if (cellAppearanceFunc !== undefined) {
      this.customFunctions[BlockType.Entries] = cellAppearanceFunc
    }
    if (gridWidth !== undefined) {
      this.gridWidth = gridWidth
    } else if (columnsCount !== undefined) {
      this.gridWidth = columnsCount * this.minCellWidth
    }
    if (gridHeight !== undefined) {
      this.gridHeight = gridHeight
    } else if (rowsCount !== undefined) {
      this.gridHeight = rowsCount * this.minCellHeight
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
