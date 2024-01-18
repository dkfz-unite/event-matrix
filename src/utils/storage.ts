import {EventMatrixParams, ILookupTable} from '../interfaces/main-grid.interface'

class Storage {
  private static instance = null

  private constructor() {
  }

  public minCellHeight: number
  public prefix: string
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

  public setOptions(options: EventMatrixParams) {
    this.minCellHeight = options.minCellHeight ?? 10
    this.prefix = options.prefix ?? 'og-'
    if (options.geneFillFunc !== undefined) {
      this.customFunctions.gene.fill = options.geneFillFunc
    }
    if (options.geneOpacityFunc !== undefined) {
      this.customFunctions.gene.opacity = options.geneOpacityFunc
    }
    if (options.donorFillFunc !== undefined) {
      this.customFunctions.donor.fill = options.donorFillFunc
    }
    if (options.donorOpacityFunc !== undefined) {
      this.customFunctions.donor.opacity = options.donorOpacityFunc
    }
  }

  public static getInstance(): Storage {
    return this.instance === null ? new this() : this.instance
  }
}

export default Storage
