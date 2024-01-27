import {ColorMap, CssMarginProps} from './base.interface'
import {IColumn, IEntry, IRow} from './bioinformatics.interface'

export type MainGridParams = {
  scaleToFit?: boolean
  leftTextWidth?: number
  columns?: IColumn[]
  rows?: IRow[]
  wrapper?: string
  colorMap?: ColorMap
  width?: number
  height?: number
  margin?: CssMarginProps
  heatMap?: boolean
  grid?: boolean
  heatMapColor?: string,

  columnFields?: IDescriptionField[]
  rowFields?: IDescriptionField[]

  columnsOpacityFunc?: (val: any) => number,
  columnsFillFunc?: (val: any) => string,
  rowsOpacityFunc?: (val: any) => number,
  rowsFillFunc?: (val: any) => string,

  trackPadding?: number
  offset: any
  fieldLegendLabel: any
  trackHeight?: number
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

export type EventMatrixParams = {
  prefix?: string
  minCellHeight?: number
  element: string
  entries?: any[]
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
  wrapper: any
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
    timeout?: any
  }
}

export interface IPreparedFieldData {
  id: string
  displayId?: string
  domainIndex: number
  value: any
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
  grid?: boolean
  domain: any[]
  wrapper?: string
  label?: string
}

export type ILookupTable = {
  [columnId: string]: {
    [rowId: string]: IEntry['id'][]
  } & { x?: number }
}

