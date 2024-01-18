import * as d3 from 'd3'
import {ScaleBand} from 'd3'
import EventEmitter from 'eventemitter3'
import {EventMatrixParams, ILookupTable, Observation} from '../interfaces/main-grid.interface'
import Storage from '../utils/storage'
import MainGrid from './MainGrid'

class EventMatrix extends EventEmitter {
  private params: EventMatrixParams
  private width: number
  private height: number
  private container: any
  private donors: any[]
  private genes: any[]
  private observations: Observation[]
  private types: string[]
  private mainGrid: any
  private heatMapMode: boolean
  private drawGridLines: boolean
  private crosshairMode: boolean
  private charts: any[]
  private x: ScaleBand<string>
  private y: ScaleBand<string>
  private fullscreen = false
  private storage: Storage = Storage.getInstance()

  constructor(params: EventMatrixParams) {
    super()

    this.storage.setOptions(params)
    this.params = params
    this.width = params.width ?? 500
    this.height = params.height ?? 500
    const genes = params.genes ?? []

    if (this.height / genes.length < this.storage.minCellHeight) {
      this.height = genes.length * this.storage.minCellHeight
    }

    params.wrapper = `.${this.storage.prefix}container`
    this.container = d3.select(params.element || 'body')
      .append('div')
      .attr('class', `${this.storage.prefix}container`)
      .style('position', 'relative')
    this.initCharts()
  }

  public static create(params: EventMatrixParams) {
    return new EventMatrix(params)
  }

  /**
   * Instantiate charts
   */
  private initCharts(reloading?: boolean) {
    this.donors = this.params.donors || []
    this.genes = this.params.genes || []
    this.observations = this.params.observations || []
    this.types = []

    this.createLookupTable()
    this.computeDonorCounts()
    this.computeGeneScoresAndCount()
    this.genesSortbyScores()
    this.computeScores()
    this.sortByScores()
    this.calculatePositions()
    if (reloading) {
      this.params.width = this.width
      this.params.height = this.height
    }
    this.mainGrid = new MainGrid(this.params, this.x, this.y)

    this.mainGrid.on('resize', () => {
      this.resize(this.width, this.height, this.fullscreen)
    })
    this.mainGrid.on('update', (donorSort) => {
      this.update(donorSort)
    })

    this.heatMapMode = this.mainGrid.heatMap
    this.drawGridLines = this.mainGrid.drawGridLines
    this.crosshairMode = this.mainGrid.crosshair
    this.charts = []
    this.charts.push(this.mainGrid)
  }

  private calculatePositions() {
    const getX = d3.scaleBand()
      .domain(d3.range(this.donors.length).map(String))
      .range([0, this.width])

    const getY = d3.scaleBand()
      .domain(d3.range(this.genes.length).map(String))
      .range([0, this.height])

    for (let i = 0; i < this.donors.length; i++) {
      const donor = this.donors[i]
      const donorId = donor.id
      const positionX = getX(String(i))
      donor.x = positionX
      this.storage.lookupTable[donorId] = this.storage.lookupTable[donorId] || {}
      this.storage.lookupTable[donorId].x = positionX
    }

    for (let i = 0; i < this.genes.length; i++) {
      this.genes[i].y = getY(String(i))
    }

    this.y = getY
    this.x = getX
  }

  /**
   * Creates a for constant time checks if an observation exists for a given donor, gene coordinate.
   */
  private createLookupTable() {
    const lookupTable: ILookupTable = {}
    this.observations.forEach((obs) => {
      const donorId = obs.donorId
      const geneId = obs.geneId
      if (lookupTable[donorId] === undefined) {
        lookupTable[donorId] = {}
      }
      if (lookupTable[donorId][geneId] === undefined) {
        lookupTable[donorId][geneId] = []
      }
      lookupTable[donorId][geneId].push(obs.id)
    })
    this.storage.setLookupTable(lookupTable)
  }

  /**
   * Initializes and creates the main SVG with rows and columns. Does prelim sort on data
   */
  public render() {
    this.emit('render:all:start')
    setTimeout(() => {
      this.charts.forEach((chart) => {
        chart.render()
      })
      this.emit('render:all:end')
    })
  }

  /**
   * Updates all charts
   */
  private update(donorSort = false) {
    if (donorSort) {
      this.computeScores()
      this.sortByScores()
    }
    this.calculatePositions()
    this.charts.forEach((chart) => {
      chart.update(this.x, this.y)
    })
  }

  /**
   * Triggers a resize of OncoGrid to desired width and height.
   */
  public resize(width, height, fullscreen) {
    this.fullscreen = fullscreen
    this.mainGrid.fullscreen = fullscreen
    this.width = Number(width)
    this.height = Number(height)

    if (this.height / this.genes.length < this.storage.minCellHeight) {
      this.height = this.genes.length * this.storage.minCellHeight
    }
    this.calculatePositions()
    this.charts.forEach((chart) => {
      chart.fullscreen = fullscreen
      chart.resize(this.width, this.height, this.x, this.y)
    })
  }

  /**
   * Sorts donors by score
   */
  private sortByScores() {
    this.donors.sort(this.sortScore)
  }

  private genesSortbyScores() {
    this.genes.sort(this.sortScore)
  }

  /**
   * Sorts genes by scores and recomputes and sorts donors.
   * Clusters towards top left corner of grid.
   */
  public cluster() {
    this.genesSortbyScores()
    this.computeScores()
    this.sortByScores()
    this.update(false)
  }

  public removeDonors(func) {
    const removedList = []
    // Remove donors from data
    for (let i = 0; i < this.donors.length; i++) {
      const donor = this.donors[i]
      if (func(donor)) {
        removedList.push(donor.id)
        d3.selectAll(`.${this.storage.prefix}${donor.id}-cell`).remove()
        d3.selectAll(`.${this.storage.prefix}${donor.id}-bar`).remove()
        this.donors.splice(i, 1)
        i--
      }
    }
    for (let j = 0; j < this.observations.length; j++) {
      const obs = this.observations[j]
      if (this.donors.includes(obs.id)) {
        this.observations.splice(j, 1)
        j--
      }
    }
    this.computeGeneScoresAndCount()
    this.update(false)
    this.resize(this.width, this.height, false)
  }

  /**
   * Removes genes and updates OncoGrid rendering.
   * @param func function describing the criteria for removing a gene.
   */
  public removeGenes(func) {
    const removedList = []
    // Remove genes from data
    for (let i = 0; i < this.genes.length; i++) {
      const gene = this.genes[i]
      if (func(gene)) {
        removedList.push(gene.id)
        d3.selectAll(`.${this.storage.prefix}${gene.id}-cell`).remove()
        d3.selectAll(`.${this.storage.prefix}${gene.id}-bar`).remove()
        this.genes.splice(i, 1)
        i--
      }
    }
    this.update(false)
    this.resize(this.width, this.height, false)
  }

  /**
   * Sorts donors
   * @param func a comparator function.
   */
  public sortDonors(func) {
    this.donors.sort(func)
    this.update(false)
  }

  /**
   * Sorts genes
   * @param func a comparator function.
   */
  public sortGenes(func) {
    this.computeScores()
    this.sortByScores()
    this.genes.sort(func)
    this.update(false)
  }

  /**
   * set oncogrid between heatmap mode and regular mode showing individual consequence types.
   */
  public setHeatmap(active) {
    this.heatMapMode = active
    this.mainGrid.setHeatmap(active)
  }

  /**
   * Toggles oncogrid between heatmap mode and regular mode showing individual consequence types.
   */
  public toggleHeatmap() {
    this.setHeatmap(!this.heatMapMode)
  }

  public setGridLines(active) {
    this.drawGridLines = active
    this.mainGrid.setGridLines(active)
  }

  public toggleGridLines() {
    this.setGridLines(!this.drawGridLines)
  }

  public setCrosshair(active) {
    this.crosshairMode = active
    this.mainGrid.setCrosshair(active)
  }

  public toggleCrosshair() {
    this.setCrosshair(!this.crosshairMode)
  }

  /**
   * Returns 1 if at least one mutation, 0 otherwise.
   */
  private mutationScore(donor, gene) {
    if (this.storage.lookupTable?.[donor]?.[gene] !== undefined) {
      return 1
    } else {
      return 0
    }
  }

  /**
   * Returns # of mutations a gene has as it's score
   */
  private mutationGeneScore(donor, gene) {
    if (this.storage.lookupTable?.[donor]?.[gene] !== undefined) {
      // genes are in nested arrays in the lookup table, need to flatten to get the correct count
      const totalGenes = this.storage.lookupTable[donor][gene]
      return totalGenes.length
    } else {
      return 0
    }
  }

  /**
   * Computes scores for donor sorting.
   */
  private computeScores() {
    for (const donor of this.donors) {
      donor.score = 0
      for (let j = 0; j < this.genes.length; j++) {
        const gene = this.genes[j]
        donor.score += (this.mutationScore(donor.id, gene.id) * Math.pow(2, this.genes.length + 1 - j))
      }
    }
  }

  /**
   * Computes scores for gene sorting.
   */
  private computeGeneScoresAndCount() {
    for (const gene of this.genes) {
      gene.score = 0
      for (const donor of this.donors) {
        gene.score += this.mutationGeneScore(donor.id, gene.id)
      }
      gene.count = gene.score
    }
  }

  /**
   * Computes the number of observations for a given donor.
   */
  private computeDonorCounts() {
    for (const donor of this.donors) {
      const genes = Object.values(this.storage.lookupTable[donor.id] ?? {})
      donor.count = 0
      for (const item of genes) {
        donor.count += item.length
      }
    }
  }

  /**
   * Computes the number of observations for a given gene.
   */
  private computeGeneCounts() {
    for (const gene of this.genes) {
      gene.count = 0
      for (const obs of this.observations) {
        if (gene.id === obs.geneId) {
          gene.count += 1
        }
      }
    }
  }

  /**
   * Comparator for scores
   */
  private sortScore(a, b) {
    if (a.score < b.score) {
      return 1
    } else if (a.score > b.score) {
      return -1
    } else {
      return a.id >= b.id ? 1 : -1
    }
  }

  /**
   *  Cleanup function to ensure the svg and any bindings are removed from the dom.
   */
  public destroy() {
    this.charts.forEach((chart) => {
      chart.destroy()
    })
    this.container.remove()
  }

  public reload() {
    this.charts.forEach((chart) => {
      chart.destroy()
    })
    this.initCharts(true)
    this.render()
  }
}

export default EventMatrix
