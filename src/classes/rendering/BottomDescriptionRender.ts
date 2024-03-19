import {BaseType, select, Selection} from 'd3-selection'
import {IEnhancedEvent, IMatrix} from '../../interfaces/main-grid.interface'
import {eventBus, innerEvents, publicEvents, renderEvents} from '../../utils/event-bus'
import {storage} from '../../utils/storage'
import Processing from '../data/Processing'
import BottomDescriptionFieldRender from './BottomDescriptionFieldRender'
import TopHistogramAxisRender from './TopHistogramAxisRender'

class BottomDescriptionRender {
  private width = 500
  private height = 500
  private processing: Processing
  private wrapper: Selection<HTMLElement, unknown, HTMLElement, unknown>
  private groups: Map<string, Selection<BaseType, unknown, HTMLElement, unknown>> = new Map()
  private descriptionFieldRenders: Map<string, BottomDescriptionFieldRender> = new Map()

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
    let groupElement = this.groups.get(group.id)

    if (!groupElement) {
      groupElement = this.container
        .append('g')
        .attr('id', `grid-row-${group.id}`)
        .attr('class', `${storage.prefix}grid__row-wrapper`)
        .attr('style', `transform:translateY(${index * storage.cellHeight}px)`)

      groupElement
        .append('svg')
        .attr('version', '2.0')
        .attr('height', storage.cellHeight)
        .attr('class', `${storage.prefix}row-row ${storage.prefix}grid__row ${storage.prefix}grid-row`)
      // .attr('y', index * storage.cellHeight)

      this.groups.set(groupElement.id, groupElement)

      groupElement
        .select('svg')
        .append('text')
        .attr('class', `${storage.prefix}${matrixRow.id}-label ${storage.prefix}row-label ${storage.prefix}label-text-font ${storage.prefix}grid-row__label`)
        .attr('data-row', matrixRow.id)
        .attr('x', 80 - 8)
        .attr('y', storage.cellHeight / 2)
        .attr('dy', '.32em')
        .attr('text-anchor', 'end')
        .attr('style', () => {
          if (storage.cellHeight < storage.minCellHeight) {
            return 'display: none;'
          } else {
            return ''
          }
        })
        .text(groupElement.data.symbol)
        .on('mouseover', (event: IEnhancedEvent) => {
          const target = event.target
          const rowId = target.dataset.row
          if (!rowId) {
            return
          }
          eventBus.emit(publicEvents.GRID_LABEL_HOVER, {
            target,
            rowId,
          })
        })
        .on('click', (event: IEnhancedEvent) => {
          const target = event.target
          const rowId = target.dataset.row
          if (!rowId) {
            return
          }
          this.processing.sortMatrixColumnsByEntries(rowId)
          eventBus.emit(innerEvents.INNER_UPDATE, false)
          eventBus.emit(publicEvents.GRID_LABEL_CLICK, {
            target,
            rowId,
          })
        })
    } else {
      groupElement
        .attr('style', `transform:translateY(${index * storage.cellHeight}px)`)

      groupElement
        .select('svg')
        .attr('height', storage.cellHeight)

      const text = groupElement.select(`.${storage.prefix}row-label`)
      text
        .attr('y', storage.cellHeight / 2)
        .attr('style', () => {
          if (storage.cellHeight < storage.minCellHeight) {
            return 'display: none;'
          } else {
            return ''
          }
        })
    }

    const render = this.getChildrenRender(group.id, groupElement)
    render.draw(group.fields)

    render.cleanOldGroups(group.fields.map((field) => field.id))
    return groupElement
  }

  private getChildrenRender(parentId: string, container) {
    let render = this.descriptionFieldRenders.get(parentId)
    if (!render) {
      render = new BottomDescriptionFieldRender(parentId, container, {})
      this.descriptionFieldRenders.set(parentId, render)
    }
    return render
  }

  public cleanOldGroups(activeGroupIds: string[]) {
    const oldGroupIds = Array.from(this.groups.keys())
    for (const groupId of oldGroupIds) {
      if (!activeGroupIds.includes(groupId)) {
        this.groups.get(groupId).remove()
        this.groups.delete(groupId)
      }
    }
  }

  public destroy() {
    this.container.remove()
    delete this.container
  }
}

export default BottomDescriptionRender
