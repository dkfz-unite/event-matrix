import {BlockType, CssMarginProps, IColumn, IEntity, IEntry, IRow} from './base.interface'

export interface ICustomFunctions {
  // eslint-disable-next-line no-unused-vars
  [BlockType.Rows]: (fieldData: IPreparedFieldData) => { color: string, opacity: number },
  // eslint-disable-next-line no-unused-vars
  [BlockType.Columns]: (fieldData: IPreparedFieldData) => { color: string, opacity: number },
  // eslint-disable-next-line no-unused-vars
  [BlockType.Entries]: (entry: IEntry) => { color: string, opacity: number }
}

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

// eslint-disable-next-line no-unused-vars
export type IFilterFunction = (val: IEntity) => boolean
export type IFilter = Record<string, string | IFilterFunction>

export type MainGridParams = {
  leftTextWidth?: number
  columns: IColumn[]
  rows: IRow[]
  wrapper: string
  width?: number
  height?: number
  margin?: CssMarginProps
  heatMap?: boolean
  grid?: boolean
  heatMapColor?: string,

  columnFields?: IDescriptionField[]
  rowFields?: IDescriptionField[]

  // eslint-disable-next-line no-unused-vars
  columnsAppearanceFunc?: (fieldData: IPreparedFieldData) => { color: string, opacity: number }
  // eslint-disable-next-line no-unused-vars
  rowsAppearanceFunc?: (fieldData: IPreparedFieldData) => { color: string, opacity: number }
  // eslint-disable-next-line no-unused-vars
  cellAppearanceFunc?: (entry: IEntry) => { color: string, opacity: number }

  trackPadding?: number
  offset: number
  fieldLegendLabel: string
  fieldHeight?: number
  nullSentinel?: number
  expandableGroups?: string[]
} & HistogramParams

export interface HistogramParams {
  histogramBorderPadding?: {
    left?: number
    bottom?: number
  }
  type?: string
  rows?: IRow[]
  columns?: IColumn[]
  margin?: CssMarginProps
  width?: number
  height?: number
  wrapper?: string
}

export type IDomainEntity = IRow & IColumn

export interface IStorageOptions {
  minCellHeight: number
  prefix: string
  // eslint-disable-next-line no-unused-vars
  columnsAppearanceFunc?: (fieldData: IPreparedFieldData) => { color: string, opacity: number }
  // eslint-disable-next-line no-unused-vars
  rowsAppearanceFunc?: (fieldData: IPreparedFieldData) => { color: string, opacity: number }
  // eslint-disable-next-line no-unused-vars
  cellAppearanceFunc?: (entry: IEntry) => { color: string, opacity: number }
}

export type EventMatrixParams = {
  prefix: string
  minCellHeight: number
  element: string
  topHistogramLabel: string
  sideHistogramLabel: string
  entries: IEntry[]
} & MainGridParams

export interface IDescriptionBlockParams {
  padding?: number
  offset: number
  label: string
  margin?: CssMarginProps
  rows?: IRow[]
  columns?: IColumn[]
  width?: number
  height?: number
  parentHeight?: number
  nullSentinel?: number
  grid?: boolean
  wrapper: string
  expandableGroups?: string[]
}

export interface IDescriptionField {
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

export interface IDescriptionFieldsGroupParams {
  expandable: boolean
  cellHeight: number
  width: number
  nullSentinel?: number
  grid: boolean
  domain: IDomainEntity[]
  wrapper: string
  label: string
}

export type ILookupTable = {
  [columnId: string]: {
    [rowId: string]: IEntry['id'][]
  } & { x?: number }
}

