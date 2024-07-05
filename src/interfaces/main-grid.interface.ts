import {BlockType, IColumn, IEntity, IEntry, IRow} from './base.interface'
import {IMatrixTracksCell} from './matrix.interface'

export interface ICustomFunctions {
  [BlockType.Rows]: IAppearanceFunction
  [BlockType.Columns]: IAppearanceFunction
  [BlockType.Entries]: IAppearanceGridFunction
}

export type IAppearanceFunction = (fieldData: IMatrixTracksCell) => { color: string, opacity: number }
export type IAppearanceGridFunction = (fieldData: IEntry) => { color: string, opacity: number }

export type IMatrix = IMatrixRow[]

export type IMatrixRow = {
  id: string
  data: IRow
  columns: IMatrixColumn[]
}
export type IMatrixColumn = {
  id: string
  data: IColumn
  entries: IMatrixEntry[]
}
export type IMatrixEntry = {
  id: string
  data: IEntry
}

export type ISortOrder = 'ASC' | 'DESC'

export interface IFrame {
  x: [number, number],
  y: [number, number],
  z: [number, number],
}

export type IFilterFunction = (val: IEntity) => boolean
export type IFilter = Record<string, string | IFilterFunction>

export type IRowsLikeData = { rows: IRow[] } | { genes: IRow[] } | { y: IRow[] }
export type IColumnLikeData = { columns: IColumn[] } | { donors: IColumn[] } | { x: IColumn[] }
export type IEntriesLikeData = { entries: IEntry[] } | { observations: IEntry[] }

export type IRawProcessingParams = IRowsLikeData & IColumnLikeData & IEntriesLikeData

export type IProcessingParams = {
  rows: IRow[]
  columns: IColumn[]
  entries: IEntry[]
  columnsFields: ITracksField[]
  rowsFields: ITracksField[]
}

export type MainGridParams = {
  appearance: IAppearanceGridFunction
  width: number
  height: number
  minCellHeight: number
  minCellWidth: number
}

export interface IHistogramParams {
  label: string
}

export interface ITracksParams {
  fields: ITracksField[]
  appearance: IAppearanceFunction
  fieldHeight: number
}

export type IDomainEntity = IRow & IColumn

export interface IStorageOptions {
  minCellHeight?: number
  minCellWidth?: number
  prefix?: string
  columnsAppearanceFunc?: IAppearanceFunction
  rowsAppearanceFunc?: IAppearanceFunction
  cellAppearanceFunc?: IAppearanceGridFunction
  columnsCount?: number
  rowsCount?: number
  gridWidth?: number
  gridHeight?: number
  heatMap?: boolean
}

export type EventMatrixParams = {
  prefix: string
  element: string
  columns: IColumn[]
  rows: IRow[]
  entries: IEntry[]
  grid?: MainGridParams
  histogram?: {
    side?: IHistogramParams
    top?: IHistogramParams
  }
  tracks?: {
    side?: ITracksParams
    bottom?: ITracksParams
  }
}

export interface ITracksField {
  name: string
  fieldName: string
  type: string | null
  group: string
  collapsed?: boolean
}

export interface IEnhancedEvent extends Event {
  target: HTMLElement & {
    dataset: Record<string, string>,
    timeout?: unknown
  }
}

export interface IPreparedFieldData {
  id: string
  displayId?: string
  domainIndex: number
  value: string | number
  displayValue: string
  notNullSentinel: boolean
  displayName: string
  fieldName: string
  type: string | null
}

export type ILookupTable = {
  [columnId: string]: {
    [rowId: string]: IEntry['id'][]
  } & { x?: number }
}

