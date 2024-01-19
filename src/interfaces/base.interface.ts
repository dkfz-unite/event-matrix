export enum BlockType {
  Gene = 'gene',
  Donor = 'donor',
}

export enum BaseType {
  Mutation = 'mutation'
}

export interface CssMarginProps {
  top: number
  right: number
  bottom: number
  left: number
}

export interface ColorMap {
  'missense_variant': string,
  'frameshift_variant': string,
  'stop_gained': string,
  'start_lost': string,
  'stop_lost': string,
  'initiator_codon_variant': string,
}

export type SortFn = any
