export interface IEntry {
  id: string,
  columnId: string
  rowId: string
  code?: string,
  value?: string,
  consequence?: string,
  impact?: string
}

export interface IRow {
  [key: string]: any

  id: string
  symbol: string

  // situational params
  y: number
  count: number
  countByColumn: Record<string, number>

  opacity?: number
  fill?: string
}

export interface IColumn {
  [key: string]: any
  
  id: string
  displayId?: string
  gender?: string
  age?: number

  count: number
  countByRow: Record<string, number>

  // situational params
  x: number

  opacity?: number
  fill?: string
}
