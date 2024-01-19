import {EventMatrixParams, ILookupTable} from '../interfaces/main-grid.interface'

class Storage {
  private static instance = null

  private constructor() {
  }

  public minCellHeight = 10
  public prefix = 'og-'
  public lookupTable: ILookupTable = {}
  public customFunctions = {
    gene: {
      opacity: (val: any) => 1,
      fill: (val: any) => 'black',
    },
    donor: {
      opacity: (val: any) => 1,
      fill: (val: any) => 'black',
    },
  }

  public setLookupTable(lookupTable: ILookupTable) {
    this.lookupTable = lookupTable
  }

  public setOptions({
    minCellHeight,
    prefix,
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

  public static getInstance(): Storage {
    return this.instance === null ? new this() : this.instance
  }
}

export default Storage
