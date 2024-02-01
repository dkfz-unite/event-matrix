export enum BlockType {
  Rows = 'rows',
  Columns = 'columns',
  Entries = 'entries',
}

export interface CssMarginProps {
  top: number
  right: number
  bottom: number
  left: number
}

export interface ColorMap {
  [key: string]: string
}
