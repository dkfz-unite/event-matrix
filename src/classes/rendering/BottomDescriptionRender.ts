import {BaseType, select, Selection} from 'd3-selection'
import {IMatrix} from '../../interfaces/main-grid.interface'
import {eventBus, renderEvents} from '../../utils/event-bus'
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
    this.prepareContainer()

    eventBus.emit(renderEvents.RENDER_X_HISTOGRAM_START)
    this.draw()
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

  private draw() {
    const groups = this.processing.getBottomDescriptionGroups()
    for (let i = 0; i < groups.length; i++) {
      this.drawGroup(groups[i], i)
    }
    this.cleanOldGroups(groups.map((group) => group.id))
  }

  private drawGroup(group: IMatrixDescriptionGroup, index: number) {
    const groupElement = this.groups.get(group.id)
    const groupHeight = this.height * matrixColumn.data.total / topTotal

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

  public destroy() {
    this.container.remove()
    delete this.container
  }
}

export default BottomDescriptionRender
