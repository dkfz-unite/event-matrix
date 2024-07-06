import {select, Selection} from 'd3-selection'
import EventEmitter from 'eventemitter3'
import {EventMatrixParams, IRawProcessingParams} from '../interfaces/main-grid.interface'
import {eventBus, innerEvents, renderEvents} from '../utils/event-bus'
import {storage} from '../utils/storage'
import Processing from './data/Processing'
import {ProcessingDataDTO} from './dtos/ProcessingDataDTO'
import GridRender from './rendering/grid/GridRender'
import SideHistogramRender from './rendering/histograms/side/SideHistogramRender'
import TopHistogramRender from './rendering/histograms/top/TopHistogramRender'
import BottomTracksRender from './rendering/tracks/bottom/BottomTracksRender'
import SideTracksRender from './rendering/tracks/side/SideTracksRender'

class EventMatrix extends EventEmitter {
  private container: Selection<HTMLDivElement, unknown, HTMLElement, unknown>
  private heatMapMode = false
  private crosshairMode = false
  private processing: Processing
  private gridRender: GridRender
  private topHistogramRender: TopHistogramRender
  private sideHistogramRender: SideHistogramRender
  private bottomTracksRender: BottomTracksRender
  private sideTracksRender: SideTracksRender

  constructor(params: EventMatrixParams) {
    super()
    storage.setOptions({
      minCellHeight: params.grid?.minCellHeight,
      minCellWidth: params.grid?.minCellWidth,
      prefix: params.prefix,
      columnsAppearanceFunc: params.tracks?.bottom?.appearance,
      rowsAppearanceFunc: params.tracks?.side?.appearance,
      cellAppearanceFunc: params.grid?.appearance,
      columnsCount: params.columns.length,
      rowsCount: params.rows.length,
      gridWidth: params.grid?.width,
      gridHeight: params.grid?.height,
    })

    this.processing = Processing.createInstance(params.rows, params.columns, params.entries, params.tracks?.bottom?.fields, params.tracks?.side?.fields)
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
      .attr('id', `${storage.prefix}bottom-tracks-block`)

    const sideContainer = mainWrapper
      .append('div')
      .attr('id', `${storage.prefix}container-side`)
      .attr('class', `${storage.prefix}container__content ${storage.prefix}container__content--side`)
    sideContainer
      .append('div')
      .attr('id', `${storage.prefix}histogram-container-side`)
    sideContainer
      .append('div')
      .attr('id', `${storage.prefix}side-tracks-block`)
      .attr('class', `${storage.prefix}container__content ${storage.prefix}container__content--side`)

    this.topHistogramRender = new TopHistogramRender(80, params.histogram?.top?.label ?? '', {})
    this.sideHistogramRender = new SideHistogramRender(80, params.histogram?.side?.label ?? '', {})
    this.gridRender = new GridRender({})
    this.bottomTracksRender = new BottomTracksRender({})
    this.sideTracksRender = new SideTracksRender({})

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
      if (params.tracks !== false) {
        if (params.tracks?.bottom !== false) {
          this.bottomTracksRender.render()
        }
        if (params.tracks?.side !== false) {
          this.sideTracksRender.render()
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

  public updateData(rawData: IRawProcessingParams) {
    const processingData = (new ProcessingDataDTO(rawData)).getProcessingData()
    storage.updateOptions({
      columnsCount: processingData.columns.length,
      rowsCount: processingData.rows.length,
    })
    this.processing.updateData(processingData)
    this.gridRender.updateDimensions()
    this.topHistogramRender.updateDimensions()
    this.sideHistogramRender.updateDimensions()
    this.bottomTracksRender.updateDimensions()
    this.sideTracksRender.updateDimensions()
    this.render()
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
    this.sideTracksRender.destroy()
    this.bottomTracksRender.destroy()
    this.gridRender.destroy()
    this.sideHistogramRender.destroy()
    this.topHistogramRender.destroy()
    this.container.remove()
  }
}

export default EventMatrix
