import * as d3 from 'd3'
import {ScaleBand} from 'd3'
import EventEmitter from 'eventemitter3'
import {SortFn} from '../interfaces/base.interface'
import {IColumn, IRow} from '../interfaces/bioinformatics.interface'
import {EventMatrixParams, ILookupTable} from '../interfaces/main-grid.interface'
import {eventBus, innerEvents, renderEvents} from '../utils/event-bus'
import {storage} from '../utils/storage'
import MainGrid from './MainGrid'

class EventMatrix extends EventEmitter {
  private params: EventMatrixParams
  private width: number
  private height: number
  private container: d3.Selection<HTMLDivElement, any, HTMLElement, any>
  private mainGrid: MainGrid
  private heatMapMode = false
  private drawGridLines = false
  private crosshairMode = false
  private charts: MainGrid[] = []
  private x!: ScaleBand<string>
  private y!: ScaleBand<string>
  private fullscreen = false

  constructor(params: EventMatrixParams) {
    super()
    storage.setOptions(params)

    this.params = params
    this.width = params.width ?? 500
    this.height = params.height ?? 500

    if (this.height / storage.rows.length < storage.minCellHeight) {
      this.height = storage.rows.length * storage.minCellHeight
    }

    params.wrapper = `.${storage.prefix}container`
    this.container = d3.select(params.element || 'body')
      .append('div')
      .attr('class', `${storage.prefix}container`)
      .style('position', 'relative')
    this.initCharts()

    eventBus.exposeEvents().forEach((eventName) => {
      eventBus.on(eventName, (eventData) => this.emit(eventName, eventData))
    })
  }

  public static create(params: EventMatrixParams) {
    return new EventMatrix(params)
  }

  /**
   * Instantiate charts
   */
  private initCharts(reloading?: boolean) {
    this.createLookupTable()
    this.computeDonorCounts()
    this.computeGeneCounts()
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

    eventBus.off(innerEvents.INNER_RESIZE)
    eventBus.off(innerEvents.INNER_UPDATE)
    eventBus.on(innerEvents.INNER_RESIZE, () => {
      this.resize(this.width, this.height, this.fullscreen)
    })
    eventBus.on(innerEvents.INNER_UPDATE, (donorSort: boolean) => {
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
      .domain(d3.range(storage.columns.length).map(String))
      .range([0, this.width])

    const getY = d3.scaleBand()
      .domain(d3.range(storage.rows.length).map(String))
      .range([0, this.height])

    for (let i = 0; i < storage.columns.length; i++) {
      const donor = storage.columns[i]
      const donorId = donor.id
      const positionX = getX(String(i))!
      donor.x = positionX
      storage.lookupTable[donorId] = storage.lookupTable[donorId] || {}
      storage.lookupTable[donorId].x = positionX as any
    }

    for (let i = 0; i < storage.rows.length; i++) {
      storage.rows[i].y = getY(String(i)) ?? 0
    }

    this.x = getX
    this.y = getY
  }

  /**
   * Creates a for constant time checks if an observation exists for a given donor, gene coordinate.
   */
  private createLookupTable() {
    const lookupTable: ILookupTable = {}
    storage.entries.forEach((entry) => {
      const columnId = entry.columnId
      const rowId = entry.rowId
      if (lookupTable[columnId] === undefined) {
        lookupTable[columnId] = {}
      }
      if (lookupTable[columnId][rowId] === undefined) {
        lookupTable[columnId][rowId] = []
      }
      lookupTable[columnId][rowId].push(entry.id)
    })
    storage.setLookupTable(lookupTable)
  }

  /**
   * Initializes and creates the main SVG with rows and columns. Does prelim sort on data
   */
  public render() {
    eventBus.emit(renderEvents.RENDER_ALL_START)
    setTimeout(() => {
      this.charts.forEach((chart) => {
        chart.render()
      })
      eventBus.emit(renderEvents.RENDER_ALL_END)
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
  public resize(width: number, height: number, fullscreen: boolean) {
    this.fullscreen = fullscreen
    this.mainGrid.fullscreen = fullscreen
    this.width = Number(width)
    this.height = Number(height)

    if (this.height / storage.rows.length < storage.minCellHeight) {
      this.height = storage.rows.length * storage.minCellHeight
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
    storage.columns.sort(this.sortScore)
  }

  private genesSortbyScores() {
    storage.rows.sort(this.sortScore)
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

  public removeDonors(func: any) {
    const removedList = []
    // Remove donors from data
    for (let i = 0; i < storage.columns.length; i++) {
      const donor = storage.columns[i]
      if (func(donor)) {
        removedList.push(donor.id)
        d3.selectAll(`.${storage.prefix}${donor.id}-cell`).remove()
        d3.selectAll(`.${storage.prefix}${donor.id}-bar`).remove()
        storage.columns.splice(i, 1)
        i--
      }
    }
    for (let j = 0; j < storage.entries.length; j++) {
      const obs = storage.entries[j]
      if (storage.columns.find((donor) => donor.id === obs.columnId)) {
        storage.entries.splice(j, 1)
        j--
      }
    }
    this.computeGeneCounts()
    this.computeGeneScoresAndCount()
    this.update(false)
    this.resize(this.width, this.height, false)
  }

  /**
   * Removes genes and updates OncoGrid rendering.
   * @param func function describing the criteria for removing a gene.
   */
  public removeGenes(func: any) {
    const removedList = []
    // Remove genes from data
    for (let i = 0; i < storage.rows.length; i++) {
      const gene = storage.rows[i]
      if (func(gene)) {
        removedList.push(gene.id)
        d3.selectAll(`.${storage.prefix}${gene.id}-cell`).remove()
        d3.selectAll(`.${storage.prefix}${gene.id}-bar`).remove()
        storage.rows.splice(i, 1)
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
  public sortDonors(func: SortFn) {
    storage.columns.sort(func)
    this.update(false)
  }

  /**
   * Sorts genes
   * @param func a comparator function.
   */
  public sortGenes(func: SortFn) {
    this.computeScores()
    this.sortByScores()
    storage.rows.sort(func)
    this.update(false)
  }

  /**
   * set oncogrid between heatmap mode and regular mode showing individual consequence types.
   */
  public setHeatmap(active: boolean) {
    this.heatMapMode = active
    this.mainGrid.setHeatmap(active)
  }

  /**
   * Toggles oncogrid between heatmap mode and regular mode showing individual consequence types.
   */
  public toggleHeatmap() {
    this.setHeatmap(!this.heatMapMode)
  }

  public setGridLines(active: boolean) {
    this.drawGridLines = active
    this.mainGrid.setGridLines(active)
  }

  public toggleGridLines() {
    this.setGridLines(!this.drawGridLines)
  }

  public setCrosshair(active: boolean) {
    this.crosshairMode = active
    this.mainGrid.setCrosshair(active)
  }

  public toggleCrosshair() {
    this.setCrosshair(!this.crosshairMode)
  }

  /**
   * Returns 1 if at least one mutation, 0 otherwise.
   */
  private mutationScore(donor: any, gene: any) {
    if (storage.lookupTable?.[donor]?.[gene] !== undefined) {
      return 1
    } else {
      return 0
    }
  }

  /**
   * Returns # of mutations a gene has as it's score
   */
  private mutationGeneScore(donor: any, gene: any) {
    if (storage.lookupTable?.[donor]?.[gene] !== undefined) {
      // genes are in nested arrays in the lookup table, need to flatten to get the correct count
      const totalGenes = storage.lookupTable[donor][gene]
      return totalGenes.length
    } else {
      return 0
    }
  }

  /**
   * Computes scores for donor sorting.
   */
  private computeScores() {
    for (const donor of storage.columns) {
      donor.score = 0
      for (let j = 0; j < storage.rows.length; j++) {
        const gene = storage.rows[j]
        donor.score += (this.mutationScore(donor.id, gene.id) * Math.pow(2, storage.rows.length + 1 - j))
      }
    }
  }

  /**
   * Computes scores for gene sorting.
   */
  private computeGeneScoresAndCount() {
    for (const gene of storage.rows) {
      gene.score = 0
      for (const donor of storage.columns) {
        gene.score += this.mutationGeneScore(donor.id, gene.id)
      }
      gene.count = gene.score
    }
  }

  /**
   * Computes the number of observations for a given donor.
   */
  private computeDonorCounts() {
    for (const donor of storage.columns) {
      const genes = Object.values(storage.lookupTable[donor.id] ?? {})
      donor.count = 0
      for (const item of genes) {
        donor.count += item.length
      }

      donor.countByRow = {}
      for (const obs of storage.entries) {
        if (donor.id === obs.columnId) {
          if (donor.countByRow[obs.rowId] === undefined) {
            donor.countByRow[obs.rowId] = 0
          }
          donor.countByRow[obs.rowId]++
        }
      }
    }
  }

  /**
   * Computes the number of entries for a given row.
   */
  private computeGeneCounts() {
    for (const gene of storage.rows) {
      gene.count = 0
      gene.countByColumn = {}
      for (const obs of storage.entries) {
        if (gene.id === obs.rowId) {
          gene.count++
          if (gene.countByColumn[obs.columnId] === undefined) {
            gene.countByColumn[obs.columnId] = 0
          }
          gene.countByColumn[obs.columnId]++
        }
      }
    }
  }

  /**
   * Comparator for scores
   */
  private sortScore(a: IRow | IColumn, b: IRow | IColumn): 1 | -1 {
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
    storage.reset()
    this.container = d3.select(this.params.element || 'body')
      .append('div')
      .attr('class', `${storage.prefix}container`)
      .style('position', 'relative')
    this.initCharts(true)
    this.render()
  }
}

export default EventMatrix
