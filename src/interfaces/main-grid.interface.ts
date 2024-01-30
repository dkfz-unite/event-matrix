import {BaseType, ValueFn} from 'd3-selection'
import {BlockType, ColorMap, CssMarginProps} from './base.interface'
import {IColumn, IEntry, IRow} from './bioinformatics.interface'

export interface ICustomFunctions {
  [BlockType.Rows]: {
    opacity: ValueFn<BaseType, IRow, number>
    fill: ValueFn<BaseType, IRow, string>,
  },
  [BlockType.Columns]: {
    opacity: ValueFn<BaseType, IColumn, number>
    fill: ValueFn<BaseType, IColumn, string>,
  },
}

export type MainGridParams = {
  leftTextWidth?: number
  columns?: IColumn[]
  rows?: IRow[]
  wrapper: string
  colorMap?: ColorMap
  width?: number
  height?: number
  margin?: CssMarginProps
  heatMap?: boolean
  grid?: boolean
  heatMapColor?: string,

  columnFields?: IDescriptionField[]
  rowFields?: IDescriptionField[]

  // eslint-disable-next-line no-unused-vars
  columnsOpacityFunc?: ValueFn<BaseType, IColumn, number>,
  // eslint-disable-next-line no-unused-vars
  columnsFillFunc?: ValueFn<BaseType, IColumn, string>,
  // eslint-disable-next-line no-unused-vars
  rowsOpacityFunc?: ValueFn<BaseType, IRow, number>,
  // eslint-disable-next-line no-unused-vars
  rowsFillFunc?: ValueFn<BaseType, IRow, string>,

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
  rows: IRow[],
  columns: IColumn[],
  entries: IEntry[]
  minCellHeight?: number,
  prefix?: string,
  columnsFillFunc?: ValueFn<BaseType, IColumn, string>
  columnsOpacityFunc?: ValueFn<BaseType, IColumn, number>,
  rowsFillFunc?: ValueFn<BaseType, IRow, string>,
  rowsOpacityFunc?: ValueFn<BaseType, IRow, number>,
}

export type EventMatrixParams = {
  prefix?: string
  minCellHeight?: number
  element: string
  entries?: IEntry[]
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

