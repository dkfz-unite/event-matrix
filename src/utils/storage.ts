import {BlockType} from '../interfaces/base.interface'
import {IDonor, IGene, IObservation} from '../interfaces/bioinformatics.interface'
import {EventMatrixParams, ILookupTable} from '../interfaces/main-grid.interface'

class Storage {
  private static instance: Storage | null = null

  private constructor() {
  }

  public minCellHeight = 10
  public prefix = 'og-'
  public lookupTable: ILookupTable = {}
  public genesOriginal: IGene[] = []
  public genes: IGene[] = []
  public donorsOriginal: IDonor[] = []
  public donors: IDonor[] = []
  public observations: IObservation[] = []
  public customFunctions = {
    [BlockType.Gene]: {
      opacity: (val: any) => 1,
      fill: (val: any) => 'black',
    },
    [BlockType.Donor]: {
      opacity: (val: any) => 1,
      fill: (val: any) => 'black',
    },
  }

  private genesOrder: 'ASC' | 'DESC' | null = null
  private donorsOrder: 'ASC' | 'DESC' | null = null

  public setLookupTable(lookupTable: ILookupTable) {
    this.lookupTable = lookupTable
  }

  public setOptions({
    minCellHeight,
    prefix,
    genes,
    donors,
    observations,
    geneFillFunc,
    geneOpacityFunc,
    donorFillFunc,
    donorOpacityFunc,
  }: EventMatrixParams) {
    if (minCellHeight !== undefined) {
      this.minCellHeight = minCellHeight
    }
    if (prefix !== undefined) {
      this.prefix = prefix
    }
    if (genes !== undefined) {
      this.genesOriginal = [...genes]
      this.genes = genes
    }
    if (donors !== undefined) {
      this.donorsOriginal = [...donors]
      this.donors = donors
    }
    if (observations !== undefined) {
      this.observations = observations.map((obs) => ({
        ...obs,
        type: obs.type ?? 'mutation',
      }))
    }
    if (geneFillFunc !== undefined) {
      this.customFunctions.gene.fill = geneFillFunc
    }
    if (geneOpacityFunc !== undefined) {
      this.customFunctions.gene.opacity = geneOpacityFunc
    }
    if (donorFillFunc !== undefined) {
      this.customFunctions.donor.fill = donorFillFunc
    }
    if (donorOpacityFunc !== undefined) {
      this.customFunctions.donor.opacity = donorOpacityFunc
    }
  }

  public reset() {
    this.genes = [...this.genesOriginal]
    this.donors = [...this.donorsOriginal]
    this.genesOrder = null
    this.donorsOrder = null
  }

  public static getInstance(): Storage {
    if (this.instance === null) {
      this.instance = new this()
    }
    return this.instance
  }

  public sortGenes(fieldName = 'id') {
    if (this.genesOrder === null) {
      this.genesOrder = 'ASC'
    } else {
      this.genesOrder = this.genesOrder === 'ASC' ? 'DESC' : 'ASC'
    }

    this.genes.sort((a, b) => {
      const aVal = a[fieldName] ?? '0'
      const bVal = b[fieldName] ?? '0'
      if (aVal === bVal) return 0
      if (this.genesOrder === 'ASC') {
        return aVal < bVal ? 1 : -1
      } else {
        return aVal > bVal ? 1 : -1
      }
    })
  }

  public sortDonors(fieldName = 'id') {
    if (this.donorsOrder === null) {
      this.donorsOrder = 'ASC'
    } else {
      this.donorsOrder = this.donorsOrder === 'ASC' ? 'DESC' : 'ASC'
    }

    this.donors.sort((a, b) => {
      const aVal = a[fieldName] ?? '0'
      const bVal = b[fieldName] ?? '0'
      if (aVal === bVal) return 0
      if (this.donorsOrder === 'ASC') {
        return aVal < bVal ? 1 : -1
      } else {
        return aVal > bVal ? 1 : -1
      }
    })
  }
}

export const storage = Storage.getInstance()
