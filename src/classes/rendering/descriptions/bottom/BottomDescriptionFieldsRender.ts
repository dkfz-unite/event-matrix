import {BaseType, Selection} from 'd3-selection'
import {IEnhancedEvent} from '../../../../interfaces/main-grid.interface'
import {IMatrixDescriptionField} from '../../../../interfaces/matrix.interface'
import {eventBus, innerEvents, publicEvents} from '../../../../utils/event-bus'
import {storage} from '../../../../utils/storage'
import Processing from '../../../data/Processing'
import BottomDescriptionCellsRender from './BottomDescriptionCellsRender'

class BottomDescriptionFieldsRender {
  private parentId
  private processing: Processing
  private fields: Map<string, Selection<BaseType, unknown, HTMLElement, unknown>> = new Map()
  private cellsRenders: Map<string, BottomDescriptionCellsRender> = new Map()

  // TODO: check this legacy options
  private container: Selection<SVGSVGElement, unknown, HTMLElement, unknown>

  constructor(parentId: string, container: Selection<SVGSVGElement, unknown, HTMLElement, unknown>, options: any) {
    this.parentId = parentId
    this.container = container
    this.processing = Processing.getInstance()
  }

  public calcHeight() {
    return this.fields.size * 16 + 16 + 10
  }

  public draw(fields: IMatrixDescriptionField[]) {
    for (let i = 0; i < fields.length; i++) {
      this.drawField(fields[i], i)
    }
    this.cleanOldFields(fields.map((field) => field.id))
  }

  private drawField(field: IMatrixDescriptionField, index: number) {
    let fieldElement = this.fields.get(field.id)

    const fixedCellHeight = 15
    if (!fieldElement) {
      fieldElement = this.container
        .append('svg')
        .attr('version', '2.0')
        .attr('class', `${storage.prefix}description-group__field ${storage.prefix}description-field`)

      // fieldElement
      //   .append('svg')
      //   .attr('version', '2.0')
      //   .attr('height', storage.cellHeight)
      //   .attr('class', `${storage.prefix}description-group__field ${storage.prefix}description-field`)

      this.fields.set(field.id, fieldElement)

      fieldElement
        .append('text')
        .attr('class', `${storage.prefix}${field.id}-label ${storage.prefix}row-label ${storage.prefix}label-text-font ${storage.prefix}grid-row__label`)
        .attr('data-row', field.id)
        .attr('x', 80 - 8)
        .attr('y', fixedCellHeight / 2)
        .attr('dy', '.32em')
        .attr('text-anchor', 'end')
        .attr('style', () => {
          if (fixedCellHeight < storage.minCellHeight) {
            return 'display: none;'
          } else {
            return ''
          }
        })
        .text(field.label)
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
          const field = target.dataset.row
          if (!field) {
            return
          }
          this.processing.sortColumns(field)
          eventBus.emit(innerEvents.INNER_UPDATE, false)
          eventBus.emit(publicEvents.GRID_LABEL_CLICK, {
            target,
            field,
          })
        })
    } else {
      const text = fieldElement.select(`.${storage.prefix}row-label`)
      text
        .attr('y', fixedCellHeight / 2)
        .attr('style', () => {
          if (fixedCellHeight < storage.minCellHeight) {
            return 'display: none;'
          } else {
            return ''
          }
        })
    }
    fieldElement
      .attr('height', fixedCellHeight)
      .attr('style', `transform:translateY(${index * fixedCellHeight + 16}px)`)

    const render = this.getChildrenRender(field.id, fieldElement)
    render.draw(field.cells)

    render.cleanOldCells(field.cells.map((field) => field.id))
    return fieldElement
  }

  private getChildrenRender(parentId: string, container) {
    let render = this.cellsRenders.get(parentId)
    if (!render) {
      render = new BottomDescriptionCellsRender(parentId, container, {})
      this.cellsRenders.set(parentId, render)
    }
    return render
  }

  public cleanOldFields(activeFieldIds: string[]) {
    const oldFieldIds = Array.from(this.fields.keys())
    for (const fieldId of oldFieldIds) {
      if (!activeFieldIds.includes(fieldId)) {
        this.fields.get(fieldId).remove()
        this.fields.delete(fieldId)
      }
    }
  }

  public destroy() {
    this.container.remove()
    delete this.container
  }
}

export default BottomDescriptionFieldsRender
