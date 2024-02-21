import {ScaleBand} from 'd3-scale'
import {select, Selection} from 'd3-selection'
import EventEmitter from 'eventemitter3'
import {EventMatrixParams} from '../interfaces/main-grid.interface'
import {eventBus, innerEvents, renderEvents} from '../utils/event-bus'
import {storage} from '../utils/storage'
import Processing from './data/Processing'
import MainGrid from './MainGrid'
import GridRender from './rendering/GridRender'
import TopHistogramRender from './rendering/TopHistogramRender'

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
  private processing: Processing
  private gridRender: GridRender
  // private bottomDescriptionRender: BottomDescriptionRender
  // private rightDescriptionRender: RightDescriptionRender
  private topHistogramRender: TopHistogramRender

  // private rightHistogramRender: RightHistogramRender

  constructor(params: EventMatrixParams) {
    super()
    storage.setOptions({
      minCellHeight: params.minCellHeight,
      prefix: params.prefix,
      columnsAppearanceFunc: params.columnsAppearanceFunc,
      rowsAppearanceFunc: params.rowsAppearanceFunc,
      cellAppearanceFunc: params.cellAppearanceFunc,
    })
    this.processing = Processing.createInstance(params.rows, params.columns, params.entries)
    this.container = select(params.element || 'body')
      .append('div')
      .attr('class', `${storage.prefix}container`)
      .style('position', 'relative')

    this.container
      .append('div')
      .attr('id', `${storage.prefix}container__histogram-top`)
    this.container
      .append('div')
      .attr('id', `${storage.prefix}container__grid`)

    const gridWidth = params.width ?? 500
    const gridHeight = params.height ?? 500

    this.topHistogramRender = new TopHistogramRender(gridWidth, 80, {})
    this.gridRender = new GridRender(gridWidth, gridHeight, {})

    eventBus.on(innerEvents.INNER_UPDATE, () => {
      const matrix = this.processing.getCroppedMatrix()
      storage.setCellDimensions(gridWidth / (matrix[0]?.columns ?? []).length, gridHeight / matrix.length)

      this.topHistogramRender.render()
      this.gridRender.render()
    })

    // this.bottomDescriptionRender = new BottomDescriptionRender()
    // this.rightDescriptionRender = new RightDescriptionRender()
    // this.rightHistogramRender = new RightHistogramRender()

    // this.params = params
    // this.width = params.width ?? 500
    // this.height = params.height ?? 500
    //
    // if (this.height / this.processing.getRows().length < storage.minCellHeight) {
    //   this.height = this.processing.getRows().length * storage.minCellHeight
    // }
    //
    // params.wrapper = `.${storage.prefix}container`
    //
    // this.initCharts()

    eventBus.exposeEvents().forEach((eventName) => {
      eventBus.on(eventName, (eventData) => this.emit(eventName, eventData))
    })
  }

  public static create(params: EventMatrixParams) {
    return new EventMatrix(params)
  }

  public setFilter(type: 'rows' | 'columns' | 'entries', filter: Record<string, any>) {
    this.processing.setFilter(type, filter)
    this.render()
  }

  // /**
  //  * Instantiate charts
  //  */
  // private initCharts(reloading?: boolean) {
  //   this.createLookupTable()
  //   this.computeColumnCounts()
  //   this.computeRowCounts()
  //   this.sortColumnsByScores()
  //   this.sortRowsByScores()
  //
  //   this.calculatePositions()
  //   if (reloading) {
  //     this.params.width = this.width
  //     this.params.height = this.height
  //   }
  //   this.mainGrid = new MainGrid(this.params, this.x, this.y)
  //
  //   eventBus.off(innerEvents.INNER_RESIZE)
  //   eventBus.off(innerEvents.INNER_UPDATE)
  //   eventBus.on(innerEvents.INNER_RESIZE, () => {
  //     this.resize(this.width, this.height, this.fullscreen)
  //   })
  //   eventBus.on(innerEvents.INNER_UPDATE, () => {
  //     this.update()
  //   })
  //
  //   this.heatMapMode = this.mainGrid.heatMap
  //   this.drawGridLines = this.mainGrid.drawGridLines
  //   this.crosshairMode = this.mainGrid.crosshair
  //   this.charts = []
  //   this.charts.push(this.mainGrid)
  // }
  //
  // private calculatePositions() {
  //   const getX = scaleBand()
  //     .domain(range(this.processing.getColumns().length).map(String))
  //     .range([0, this.width])
  //
  //   const getY = scaleBand()
  //     .domain(range(this.processing.getRows().length).map(String))
  //     .range([0, this.height])
  //
  //   for (let i = 0; i < this.processing.getColumns().length; i++) {
  //     const column = this.processing.getColumns()[i]
  //     const columnId = column.id
  //     const positionX = getX(String(i))!
  //     column.x = positionX
  //     storage.lookupTable[columnId] = storage.lookupTable[columnId] || {}
  //     storage.lookupTable[columnId].x = positionX as number
  //   }
  //
  //   for (let i = 0; i < this.processing.getRows().length; i++) {
  //     this.processing.getRows()[i].y = getY(String(i)) ?? 0
  //   }
  //
  //   this.x = getX
  //   this.y = getY
  // }

  // /**
  //  * Creates a for constant time checks if an observation exists for a given donor, gene coordinate.
  //  */
  // private createLookupTable() {
  //   const lookupTable: ILookupTable = {}
  //   this.processing.getEntries().forEach((entry) => {
  //     const columnId = entry.columnId
  //     const rowId = entry.rowId
  //     if (lookupTable[columnId] === undefined) {
  //       lookupTable[columnId] = {}
  //     }
  //     if (lookupTable[columnId][rowId] === undefined) {
  //       lookupTable[columnId][rowId] = []
  //     }
  //     lookupTable[columnId][rowId].push(entry.id)
  //   })
  //   storage.setLookupTable(lookupTable)
  // }

  /**
   * Initializes and creates the main SVG with rows and columns. Does prelim sort on data
   */
  public render() {
    eventBus.emit(renderEvents.RENDER_ALL_START)
    eventBus.emit(innerEvents.INNER_UPDATE)
    eventBus.emit(renderEvents.RENDER_ALL_END)
  }

  /**
   * Updates all charts
   */
  public reset() {
    this.processing.reset()
    eventBus.emit(innerEvents.INNER_UPDATE)
  }

  /**
   * set EventMatrix between heatmap mode and regular mode showing individual value types.
   */
  public setHeatmap(active: boolean) {
    this.heatMapMode = active
    this.gridRender.setHeatmap(active)
  }

  /**
   * Toggles EventMatrix between heatmap mode and regular mode showing individual value types.
   */
  public toggleHeatmap() {
    this.setHeatmap(!this.heatMapMode)
  }

  public setGridLines(active: boolean) {
    this.drawGridLines = active
    this.gridRender.setGridLines(active)
  }

  public toggleGridLines() {
    this.setGridLines(!this.drawGridLines)
  }

  public setCrosshair(active: boolean) {
    this.crosshairMode = active
    this.gridRender.setCrosshair(active)
  }

  public toggleCrosshair() {
    this.setCrosshair(!this.crosshairMode)
  }

  public shiftFrame(x: number, y: number) {
    this.processing.getFrame().shiftFrameX(x)
    this.processing.getFrame().shiftFrameY(y)
    eventBus.emit(innerEvents.INNER_UPDATE, true)
  }

  public zoomOut(step: number) {
    this.processing.getFrame().incrementFrameSize(step)
    eventBus.emit(innerEvents.INNER_UPDATE, true)
  }

  public zoomIn(step: number) {
    this.processing.getFrame().decrementFrameSize(step)
    eventBus.emit(innerEvents.INNER_UPDATE, true)
  }

  /**
   *  Cleanup function to ensure the svg and any bindings are removed from the dom.
   */
  public destroy() {
    this.gridRender.destroy()
    this.container.remove()
  }
}

export default EventMatrix
