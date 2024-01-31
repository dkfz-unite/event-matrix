import {range} from 'd3-array'
import {scaleBand, ScaleBand} from 'd3-scale'
import {select, Selection} from 'd3-selection'
import EventEmitter from 'eventemitter3'
import {IColumn, IRow} from '../interfaces/bioinformatics.interface'
import {EventMatrixParams, ILookupTable} from '../interfaces/main-grid.interface'
import {eventBus, innerEvents, renderEvents} from '../utils/event-bus'
import {storage} from '../utils/storage'
import MainGrid from './MainGrid'

class EventMatrix extends EventEmitter {
  private readonly params: EventMatrixParams
  private width: number
  private height: number
  private container: Selection<HTMLDivElement, unknown, HTMLElement, unknown>
  private mainGrid: MainGrid
  private heatMapMode = false
  private drawGridLines = false
  private crosshairMode = false
  private charts: MainGrid[] = []
  private x: ScaleBand<string>
  private y: ScaleBand<string>
  private fullscreen = false

  constructor(params: EventMatrixParams) {
    super()
    storage.setOptions({
      minCellHeight: params.minCellHeight,
      prefix: params.prefix,
      rows: params.rows,
      columns: params.columns,
      entries: params.entries,
      columnsFillFunc: params.columnsFillFunc,
      rowsOpacityFunc: params.rowsOpacityFunc,
      rowsFillFunc: params.rowsFillFunc,
      columnsOpacityFunc: params.columnsOpacityFunc,
    })

    this.params = params
    this.width = params.width ?? 500
    this.height = params.height ?? 500

    if (this.height / storage.rows.length < storage.minCellHeight) {
      this.height = storage.rows.length * storage.minCellHeight
    }

    params.wrapper = `.${storage.prefix}container`
    this.container = select(params.element || 'body')
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

  public setLayer(layer: string | null) {
    if (storage.layer !== layer) {
      storage.setLayer(layer)

      this.createLookupTable()
      this.computeColumnCounts()
      this.computeRowCounts()
      this.calculatePositions()

      this.charts.forEach((chart) => {
        chart.render()
      })
    }
  }

  /**
   * Instantiate charts
   */
  private initCharts(reloading?: boolean) {
    this.createLookupTable()
    this.computeColumnCounts()
    this.computeRowCounts()
    this.sortColumnsByScores()
    this.sortRowsByScores()

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
    eventBus.on(innerEvents.INNER_UPDATE, (columnSort: boolean) => {
      this.update()
    })

    this.heatMapMode = this.mainGrid.heatMap
    this.drawGridLines = this.mainGrid.drawGridLines
    this.crosshairMode = this.mainGrid.crosshair
    this.charts = []
    this.charts.push(this.mainGrid)
  }

  private calculatePositions() {
    const getX = scaleBand()
      .domain(range(storage.columns.length).map(String))
      .range([0, this.width])

    const getY = scaleBand()
      .domain(range(storage.rows.length).map(String))
      .range([0, this.height])

    for (let i = 0; i < storage.columns.length; i++) {
      const column = storage.columns[i]
      const columnId = column.id
      const positionX = getX(String(i))!
      column.x = positionX
      storage.lookupTable[columnId] = storage.lookupTable[columnId] || {}
      storage.lookupTable[columnId].x = positionX as number
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
  private update() {
    this.calculatePositions()
    this.charts.forEach((chart) => {
      chart.update(this.x, this.y)
    })
  }

  /**
   * Triggers a resize of EventMatrix to desired width and height.
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
  private sortColumnsByScores() {
    storage.columns.sort((columnA: IColumn, columnB: IColumn) => {
      const scoreA = Object.values(columnA.countByRow).reduce((sum, num) => (sum + (num ?? 0)), 0)
      const scoreB = Object.values(columnB.countByRow).reduce((sum, num) => (sum + (num ?? 0)), 0)
      if (scoreA < scoreB) {
        return 1
      } else if (scoreA > scoreB) {
        return -1
      } else {
        return columnA.id >= columnB.id ? 1 : -1
      }
    })
  }

  private sortRowsByScores() {
    storage.rows.sort((rowA: IRow, rowB: IRow) => {
      const scoreA = Object.values(rowA.countByColumn).reduce((sum, num) => (sum + (num ?? 0)), 0)
      const scoreB = Object.values(rowB.countByColumn).reduce((sum, num) => (sum + (num ?? 0)), 0)
      if (scoreA < scoreB) {
        return 1
      } else if (scoreA > scoreB) {
        return -1
      } else {
        return rowA.id >= rowB.id ? 1 : -1
      }
    })
  }

  /**
   * Sorts genes by scores and recomputes and sorts donors.
   * Clusters towards top left corner of grid.
   */
  public cluster() {
    this.sortColumnsByScores()
    this.sortRowsByScores()
    this.update()
  }

  /**
   * set EventMatrix between heatmap mode and regular mode showing individual value types.
   */
  public setHeatmap(active: boolean) {
    this.heatMapMode = active
    this.mainGrid.setHeatmap(active)
  }

  /**
   * Toggles EventMatrix between heatmap mode and regular mode showing individual value types.
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
   * Computes the number of observations for a given donor.
   */
  private computeColumnCounts() {
    for (const column of storage.columns) {
      const rows = Object.values(storage.lookupTable[column.id] ?? {})
      column.count = 0
      for (const item of rows) {
        column.count += item.length
      }

      column.countByRow = {}
      for (const obs of storage.entries) {
        if (column.id === obs.columnId) {
          if (column.countByRow[obs.rowId] === undefined) {
            column.countByRow[obs.rowId] = 0
          }
          column.countByRow[obs.rowId]++
        }
      }
    }
  }

  /**
   * Computes the number of entries for a given row.
   */
  private computeRowCounts() {
    for (const row of storage.rows) {
      row.count = 0
      row.countByColumn = {}
      for (const obs of storage.entries) {
        if (row.id === obs.rowId) {
          row.count++
          if (row.countByColumn[obs.columnId] === undefined) {
            row.countByColumn[obs.columnId] = 0
          }
          row.countByColumn[obs.columnId]++
        }
      }
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
    this.container = select(this.params.element || 'body')
      .append('div')
      .attr('class', `${storage.prefix}container`)
      .style('position', 'relative')
    this.initCharts(true)
    this.render()
  }
}

export default EventMatrix
