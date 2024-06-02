import {select, Selection} from 'd3-selection'
import EventEmitter from 'eventemitter3'
import {EventMatrixParams} from '../interfaces/main-grid.interface'
import {eventBus, innerEvents, renderEvents} from '../utils/event-bus'
import {storage} from '../utils/storage'
import Processing from './data/Processing'
import BottomDescriptionRender from './rendering/descriptions/bottom/BottomDescriptionRender'
import SideDescriptionRender from './rendering/descriptions/side/SideDescriptionRender'
import GridRender from './rendering/grid/GridRender'
import SideHistogramRender from './rendering/histograms/side/SideHistogramRender'
import TopHistogramRender from './rendering/histograms/top/TopHistogramRender'

class EventMatrix extends EventEmitter {
  private container: Selection<HTMLDivElement, unknown, HTMLElement, unknown>
  private heatMapMode = false
  private crosshairMode = false
  private processing: Processing
  private gridRender: GridRender
  private topHistogramRender: TopHistogramRender
  private sideHistogramRender: SideHistogramRender
  private bottomDescriptionRender: BottomDescriptionRender
  private sideDescriptionRender: SideDescriptionRender

  constructor(params: EventMatrixParams) {
    super()
    storage.setOptions({
      minCellHeight: params.grid?.minCellHeight,
      minCellWidth: params.grid?.minCellWidth,
      prefix: params.prefix,
      columnsAppearanceFunc: params.description?.bottom?.appearance,
      rowsAppearanceFunc: params.description?.side?.appearance,
      cellAppearanceFunc: params.grid?.appearance,
      columnsCount: params.columns.length,
      rowsCount: params.rows.length,
      gridWidth: params.grid?.width,
      gridHeight: params.grid?.height,
    })

    this.processing = Processing.createInstance(params.rows, params.columns, params.entries, params.description?.bottom?.fields, params.description?.side?.fields)
    this.container = select(params.element || 'body')
      .append('div')
      .attr('class', `${storage.prefix}container`)
      .style('position', 'relative')
    const mainWrapper = this.container
      .append('div')
      .attr('class', `${storage.prefix}container-wrapper`)
      .style('display', 'flex')

    const mainContainer = mainWrapper
      .append('div')
      .attr('id', `${storage.prefix}container-main`)
      .attr('class', `${storage.prefix}container__content ${storage.prefix}container__content--main`)
    mainContainer
      .append('div')
      .attr('id', `${storage.prefix}histogram-container-top`)
    mainContainer
      .append('div')
      .attr('id', `${storage.prefix}grid-container`)
    mainContainer
      .append('div')
      .attr('id', `${storage.prefix}bottom-description-block`)

    const sideContainer = mainWrapper
      .append('div')
      .attr('id', `${storage.prefix}container-side`)
      .attr('class', `${storage.prefix}container__content ${storage.prefix}container__content--side`)
    sideContainer
      .append('div')
      .attr('id', `${storage.prefix}histogram-container-side`)
    sideContainer
      .append('div')
      .attr('id', `${storage.prefix}side-description-block`)
      .attr('class', `${storage.prefix}container__content ${storage.prefix}container__content--side`)

    this.topHistogramRender = new TopHistogramRender(80, params.histogram?.top?.label ?? '', {})
    this.sideHistogramRender = new SideHistogramRender(80, params.histogram?.side?.label ?? '', {})
    this.gridRender = new GridRender({})
    this.bottomDescriptionRender = new BottomDescriptionRender({})
    this.sideDescriptionRender = new SideDescriptionRender({})

    eventBus.on(innerEvents.INNER_UPDATE, () => {
      const matrix = this.processing.getCroppedMatrix()
      storage.setCellDimensions(storage.gridWidth / (matrix[0]?.columns ?? []).length, storage.gridHeight / matrix.length)

      if (params.histogram !== false) {
        if (params.histogram?.top !== false) {
          this.topHistogramRender.render()
        }
        if (params.histogram?.side !== false) {
          this.sideHistogramRender.render()
        }
      }
      this.gridRender.render()
      if (params.description !== false) {
        if (params.description?.bottom !== false) {
          this.bottomDescriptionRender.render()
        }
        if (params.description?.side !== false) {
          this.sideDescriptionRender.render()
        }
      }
    })

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
    console.log('EventMatrix', active)
    this.gridRender.setGridLines(active)
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
    this.sideDescriptionRender.destroy()
    this.bottomDescriptionRender.destroy()
    this.gridRender.destroy()
    this.sideHistogramRender.destroy()
    this.topHistogramRender.destroy()
    this.container.remove()
  }
}

export default EventMatrix
