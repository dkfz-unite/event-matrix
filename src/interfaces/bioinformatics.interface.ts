export interface IObservation {
  id: string,
  donorId: string
  geneId: string
  code?: string,
  consequence?: string,
  impact?: string
}

export interface IGene {
  id: string
  symbol: string

  // situational params
  y: number
  score: number
  count: number
  countByDonor: Record<string, number>
}

export interface IDonor {
  id: string
  displayId?: string
  gender?: string
  age?: number

  count: number
  countByGene: Record<string, number>
  score: number

  // situational params
  x: number
}
