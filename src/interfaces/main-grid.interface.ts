export type MainGridParams = {
  scaleToFit?: boolean
  leftTextWidth?: number
  prefix?: string
  minCellHeight?: number
  donors?: any[]
  genes?: any[]
  wrapper?: string
  colorMap?: any
  width?: number
  height?: number
  margin?: { top: number, right: number, bottom: number, left: number }
  heatMap?: boolean
  grid?: boolean
  heatMapColor?: string,

  donorTracks?: any[]
  geneTracks?: any[]

  donorOpacityFunc?: (val: any) => number,
  donorFillFunc?: (val: any) => string,
  geneOpacityFunc?: (val: any) => number,
  geneFillFunc?: (val: any) => string,
} & HistogramParams & OncoTrackParams

export interface HistogramParams {
  histogramBorderPadding?: {
    left?: number
    bottom?: number
  }
  prefix?: string
  type?: string
  genes?: Domain[]
  donors?: Domain[]
  margin?: {
    top: number
    right: number
    bottom: number
    left: number
  }
  width?: number
  height?: number
  wrapper?: string
}

export interface Domain {
  cnv: number
  count: number
  displayId?: string
  symbol?: string
  id: string
  x: number
  y: number
}

export type EventMatrixParams = {
  element: string
  minCellHeight?: number
  observations?: any[]
} & MainGridParams

export interface OncoTrackParams {
  trackPadding?: number
  offset: any
  prefix?: string
  trackLegendLabel: any
  margin?: {
    top: number
    right: number
    bottom: number
    left: number
  }
  genes?: any[]
  donors?: any[]
  width?: number
  height?: number
  trackHeight?: number
  nullSentinel?: number
  grid?: boolean
  wrapper: any
  expandableGroups?: string[]
}

export interface OncoTrackGroupParams {
  prefix?: string
  expandable: boolean
  cellHeight?: number
  width: number
  nullSentinel?: number
  grid?: boolean
  domain: any[]
  wrapper?: string
  trackLegendLabel: any
}

export interface IComputedProps {
  opacity: undefined | ((val: any) => number),
  fill: undefined | ((val: any) => string),
}

export interface LookupTable {
  [key: string]: Record<string, string[]>
}

export interface Observation {
  id: string
  code: string
  consequence: string
  impact: string
  donorId: string
  geneId: string
}

