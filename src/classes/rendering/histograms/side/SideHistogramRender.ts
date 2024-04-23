import {select, Selection} from 'd3-selection'
import {BlockType} from '../../../../interfaces/base.interface'
import {IMatrix, IMatrixRow} from '../../../../interfaces/main-grid.interface'
import {eventBus, innerEvents, publicEvents, renderEvents} from '../../../../utils/event-bus'
import {storage} from '../../../../utils/storage'
import Processing from '../../../data/Processing'
import SideHistogramAxisRender from './SideHistogramAxisRender'

class SideHistogramRender {
  private width = 500
  private height = 500
  private processing: Processing
  private wrapper: Selection<HTMLElement, unknown, HTMLElement, unknown>
  private bars: Map<string, Selection<SVGRectElement, unknown, HTMLElement, unknown>> = new Map()

  private matrix: IMatrix
  private container: Selection<SVGSVGElement, unknown, HTMLElement, unknown>
  private containerInsides: Selection<SVGSVGElement, unknown, HTMLElement, unknown>
  private axisRender: SideHistogramAxisRender

  constructor(width: number, height: number, label: string, options: any) {
    this.width = width
    this.height = height
    this.processing = Processing.getInstance()
    this.axisRender = new SideHistogramAxisRender(width, height, label, {})

    this.wrapper = select(`#${storage.prefix}histogram-container-side`)
  }

  public render() {
    this.matrix = this.processing.getCroppedMatrix()

    this.prepareContainer()

    eventBus.emit(renderEvents.RENDER_X_HISTOGRAM_START)
    this.draw()
    this.addEvents()
    eventBus.emit(renderEvents.RENDER_X_HISTOGRAM_END)
  }

  private prepareContainer() {
    if (!this.container) {
      this.container = this.wrapper
        .append('svg')
        .attr('version', '2.0')
        .attr('class', `${storage.prefix}histogram ${storage.prefix}histogram--side`)
        .attr('id', `${storage.prefix}histogram-side`)

      this.containerInsides = this.container
        .append('svg')
        .attr('version', '2.0')

      this.axisRender.setContainer(this.containerInsides)
    }

    this.container
      .attr('width', this.width + 6)
      .attr('height', this.height + 80 + 6)
      .attr('viewBox', `0 0 ${this.width + 6} ${this.height + 80 + 6}`)

    this.containerInsides
      .attr('width', this.width + 6)
      .attr('height', this.height)
      .attr('y', 80 + 6)
      .attr('viewBox', `0 0 ${this.width + 6} ${this.height}`)
  }

  private addEvents() {
    this.removeEvents()

    this.containerInsides
      .on('mouseover', (event) => {
        const target = event.target
        const rowId = target.dataset.row
        if (!rowId) {
          return
        }
        eventBus.emit(publicEvents.HISTOGRAM_HOVER, {
          target,
          domainId: rowId,
          type: BlockType.Rows,
        })
      })
      .on('mouseout', () => {
        eventBus.emit(publicEvents.HISTOGRAM_OUT)
      })
      .on('click', (event) => {
        const target = event.target
        const rowId = target.dataset.row
        if (!rowId) {
          return
        }
        this.processing.sortMatrixColumnsByEntries(rowId)
        eventBus.emit(innerEvents.INNER_UPDATE, false)
        eventBus.emit(publicEvents.HISTOGRAM_CLICK, {
          target,
          domainId: rowId,
          type: BlockType.Rows,
        })
      })
  }

  private draw() {
    const matrixRows = this.matrix ?? []
    const topTotal = Math.max(...matrixRows.map((mRow) => mRow.data.total))
    for (let i = 0; i < matrixRows.length; i++) {
      this.drawBar(matrixRows[i], i, topTotal)
    }
    this.cleanOldBars(matrixRows.map((mRow) => mRow.id))

    this.axisRender.render(topTotal)
  }

  private drawBar(matrixRow: IMatrixRow, index: number, topTotal: number) {
    let barElement = this.bars.get(matrixRow.id)
    const barHeight = this.width * matrixRow.data.total / topTotal

    if (!barElement) {
      barElement = this.containerInsides
        .append('rect')
        .attr('class', `${storage.prefix}sortable-bar`)
        .attr('data-row', matrixRow.id)
        .attr('fill', '#1693C0')
      this.bars.set(matrixRow.id, barElement)
    }

    barElement
      .attr('width', barHeight) // If bars are small, do not use whitespace.
      .attr('height', storage.cellHeight - (storage.cellHeight < 3 ? 0 : 1))
      .attr('x', 5)
      .attr('y', index * storage.cellHeight)
  }

  public cleanOldBars(activeRowIds: string[]) {
    const oldBars = Array.from(this.bars.keys())
    for (const rowId of oldBars) {
      if (!activeRowIds.includes(rowId)) {
        this.bars.get(rowId).remove()
        this.bars.delete(rowId)
      }
    }
  }

  private removeEvents() {
    this.containerInsides.on('mouseover', null)
    this.containerInsides.on('mouseout', null)
    this.containerInsides.on('click', null)
  }

  public destroy() {
    this.removeEvents()
    this.containerInsides.remove()
    this.container.remove()
    delete this.containerInsides
    delete this.container
  }
}

export default SideHistogramRender
