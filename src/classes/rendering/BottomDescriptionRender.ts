import {BaseType, select, Selection} from 'd3-selection'
import {BlockType} from '../../interfaces/base.interface'
import {IMatrix, IMatrixColumn} from '../../interfaces/main-grid.interface'
import {eventBus, innerEvents, publicEvents, renderEvents} from '../../utils/event-bus'
import {storage} from '../../utils/storage'
import Processing from '../data/Processing'
import TopHistogramAxisRender from './TopHistogramAxisRender'

class BottomDescriptionRender {
  private width = 500
  private height = 500
  private processing: Processing
  private wrapper: Selection<HTMLElement, unknown, HTMLElement, unknown>
  private groups: Map<string, Selection<BaseType, unknown, HTMLElement, unknown>> = new Map()

  // TODO: check this legacy options
  private matrix: IMatrix
  private container: Selection<SVGSVGElement, unknown, HTMLElement, unknown>
  private axisRender: TopHistogramAxisRender

  constructor(width: number, height: number, label: string, options: any) {
    this.width = width
    this.height = height
    this.processing = Processing.getInstance()
    this.axisRender = new TopHistogramAxisRender(width, height, label, {})

    this.wrapper = select(`#${storage.prefix}histogram-container-top`)
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
      this.container = this.wrapper.append('svg')
        .attr('version', '2.0')
        .attr('class', `${storage.prefix}description-block ${storage.prefix}description-block--bottom`)
        .attr('id', `${storage.prefix}description-block-bottom`)

      this.axisRender.setContainer(this.container)
    }

    this.container
      .attr('width', this.width + 80)
      .attr('height', this.height + 6)
      .attr('viewBox', `0 0 ${this.width + 80} ${this.height + 6}`)
  }

  private addEvents() {
    this.removeEvents()

    this.container
      .on('mouseover', (event) => {
        const target = event.target
        const columnId = target.dataset.column
        if (!columnId) {
          return
        }
        eventBus.emit(publicEvents.HISTOGRAM_HOVER, {
          target,
          domainId: columnId,
          type: BlockType.Columns,
        })
      })
      .on('mouseout', () => {
        eventBus.emit(publicEvents.HISTOGRAM_OUT)
      })
      .on('click', (event) => {
        const target = event.target
        const columnId = target.dataset.column
        if (!columnId) {
          return
        }
        this.processing.sortMatrixRowsByEntries(columnId)
        eventBus.emit(innerEvents.INNER_UPDATE, false)
        eventBus.emit(publicEvents.HISTOGRAM_CLICK, {
          target,
          domainId: columnId,
          type: BlockType.Columns,
        })
      })
  }

  private draw() {
    const matrixColumns = this.matrix[0]?.columns ?? []
    const topTotal = Math.max(...matrixColumns.map((mColumn) => mColumn.data.total))
    for (let i = 0; i < matrixColumns.length; i++) {
      this.drawBar(matrixColumns[i], i, topTotal)
    }
    this.cleanOldBars(matrixColumns.map((mColumn) => mColumn.id))

    this.axisRender.render(topTotal)
  }

  private drawBar(matrixColumn: IMatrixColumn, index: number, topTotal: number) {
    let barElement = this.bars.get(matrixColumn.id)
    const barHeight = this.height * matrixColumn.data.total / topTotal

    if (!barElement) {
      barElement = this.container
        .append('rect')
        .attr('class', `${storage.prefix}sortable-bar`)
        .attr('data-column', matrixColumn.id)
        .attr('width', storage.cellWidth - (storage.cellWidth < 3 ? 0 : 1)) // If bars are small, do not use whitespace.
        .attr('height', barHeight)
        .attr('x', 80 + index * storage.cellWidth)
        .attr('y', this.height - barHeight)
        .attr('fill', '#1693C0')
      this.bars.set(matrixColumn.id, barElement)
    } else {
      barElement
        .attr('width', storage.cellWidth - (storage.cellWidth < 3 ? 0 : 1)) // If bars are small, do not use whitespace.
        .attr('height', barHeight)
        .attr('x', 80 + index * storage.cellWidth)
        .attr('y', this.height - barHeight)
    }
  }

  public cleanOldBars(activeColumnIds: string[]) {
    const oldBars = Array.from(this.bars.keys())
    for (const columnId of oldBars) {
      if (!activeColumnIds.includes(columnId)) {
        this.bars.get(columnId).remove()
        this.bars.delete(columnId)
      }
    }
  }

  private removeEvents() {
    this.container.on('mouseover', null)
    this.container.on('mouseout', null)
    this.container.on('click', null)
  }

  public destroy() {
    this.removeEvents()
    this.container.remove()
    delete this.container
  }
}

export default BottomDescriptionRender
