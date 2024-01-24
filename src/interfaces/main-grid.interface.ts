import {ColorMap, CssMarginProps} from './base.interface'
import {IDonor, IGene} from './bioinformatics.interface'

export type MainGridParams = {
  scaleToFit?: boolean
  leftTextWidth?: number
  donors?: any[]
  genes?: any[]
  wrapper?: string
  colorMap?: ColorMap
  width?: number
  height?: number
  margin?: CssMarginProps
  heatMap?: boolean
  grid?: boolean
  heatMapColor?: string,

  donorTracks?: any[]
  geneTracks?: any[]

  donorOpacityFunc?: (val: any) => number,
  donorFillFunc?: (val: any) => string,
  geneOpacityFunc?: (val: any) => number,
  geneFillFunc?: (val: any) => string,

  trackPadding?: number
  offset: any
  trackLegendLabel: any
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
  genes?: IGene[]
  donors?: IDonor[]
  margin?: CssMarginProps
  width?: number
  height?: number
  wrapper?: string
}

export type IDomainEntity = IGene & IDonor

export type EventMatrixParams = {
  prefix?: string
  minCellHeight?: number
  element: string
  observations?: any[]
} & MainGridParams

export interface IDescriptionBlockParams {
  padding?: number
  offset: any
  label: string
  margin?: CssMarginProps
  genes?: any[]
  donors?: any[]
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
  fieldName: string // The field of the donor/gene object to read
  type?: string | null // The type of the field data, not used by EventMatrix internally, but allows user to group behaviour
  group?: string | null // the name of the group the field belongs to.
  collapsed?: boolean // if true, and the field group is in the expandableGroups array, then the field by default will not be shown
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
  [donorId: string]: {
    [geneId: string]: Observation['id'][]
  } & { x?: number }
}

export interface Observation {
  id: string
  code: string
  consequence: string
  impact: string
  donorId: string
  geneId: string
}

