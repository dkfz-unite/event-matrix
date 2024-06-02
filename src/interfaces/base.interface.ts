export enum BlockType {
  Rows = 'rows',
  Columns = 'columns',
  Entries = 'entries',
  TEST = 'test'
}

export interface CssMarginProps {
  top: number
  right: number
  bottom: number
  left: number
}

export interface IEntity extends Record<string, any> {
  id: string
}

export interface IEntry extends IEntity {
  columnId: string
  rowId: string
  code?: string,
  value?: string,
  consequence?: string,
  impact?: string
  layer?: string
}

export interface IRow extends IEntity {
  [key: string]: any

  symbol: string

  // situational params
  y: number
  count: number
  countByColumn: Record<string, number>

  opacity?: number
  fill?: string
}

export interface IColumn extends IEntity {
  [key: string]: any

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
