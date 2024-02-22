import {ScaleBand} from 'd3-scale'
import {select, Selection} from 'd3-selection'
import EventEmitter from 'eventemitter3'
import {EventMatrixParams} from '../interfaces/main-grid.interface'
import {eventBus, innerEvents, renderEvents} from '../utils/event-bus'
import {storage} from '../utils/storage'
import Processing from './data/Processing'
import MainGrid from './MainGrid'
import GridRender from './rendering/GridRender'
import SideHistogramRender from './rendering/SideHistogramRender'
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
  private sideHistogramRender: SideHistogramRender

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
      .attr('id', `${storage.prefix}container__histogram-side`)
    this.container
      .append('div')
      .attr('id', `${storage.prefix}container__grid`)

    const gridWidth = params.width ?? 500
    const gridHeight = params.height ?? 500

    this.topHistogramRender = new TopHistogramRender(gridWidth, 80, params.topHistogramLabel ?? '', {})
    this.sideHistogramRender = new SideHistogramRender(gridHeight, 80, params.sideHistogramLabel ?? '', {})
    this.gridRender = new GridRender(gridWidth, gridHeight, {})

    eventBus.on(innerEvents.INNER_UPDATE, () => {
      const matrix = this.processing.getCroppedMatrix()
      storage.setCellDimensions(gridWidth / (matrix[0]?.columns ?? []).length, gridHeight / matrix.length)

      this.topHistogramRender.render()
      this.sideHistogramRender.render()
      this.gridRender.render()
    })

    // this.bottomDescriptionRender = new BottomDescriptionRender()
    // this.rightDescriptionRender = new RightDescriptionRender()

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
