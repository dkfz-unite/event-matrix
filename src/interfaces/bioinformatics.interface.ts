export interface IEntry {
  id: string,
  columnId: string
  rowId: string
  code?: string,
  value?: string,
  impact?: string
}

export interface IRow {
  id: string
  symbol: string

  // situational params
  y: number
  score: number
  count: number
  countByColumn: Record<string, number>
}

export interface IColumn {
  id: string
  displayId?: string
  gender?: string
  age?: number

  count: number
  countByRow: Record<string, number>
  score: number

  // situational params
  x: number
}
