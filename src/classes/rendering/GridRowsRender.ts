import {BaseType, select, Selection} from 'd3-selection'
import {IEnhancedEvent, IMatrixRow} from '../../interfaces/main-grid.interface'
import {eventBus, innerEvents, publicEvents} from '../../utils/event-bus'
import {storage} from '../../utils/storage'
import Processing from '../data/Processing'
import GridCellsRender from './GridCellsRender'

class GridRowsRender {
  container: Selection<BaseType, unknown, HTMLElement, unknown>
  rows: Map<string, Selection<BaseType, unknown, HTMLElement, unknown>> = new Map()
  processing: Processing
  gridCellsRenders: Map<string, GridCellsRender>

  constructor(options: any) {
    this.container = select(`.${storage.prefix}container`)
    this.processing = Processing.getInstance()
    this.gridCellsRenders = new Map()
  }

  public setContainer(container: Selection<BaseType, unknown, HTMLElement, unknown>) {
    this.container = container
  }

  public cleanOldRows(activeRowIds: string[]) {
    for (const rowId of this.rows.keys()) {
      if (!activeRowIds.includes(rowId)) {
        this.gridCellsRenders.get(rowId).destroy()
        this.rows.get(rowId).remove()
        this.rows.delete(rowId)
      }
    }
  }

  private getChildrenRender(parentId: string, container) {
    let render = this.gridCellsRenders.get(parentId)
    if (!render) {
      render = new GridCellsRender(parentId, container, {})
      this.gridCellsRenders.set(parentId, render)
    }
    return render
  }

  public draw(matrixRows: IMatrixRow[]) {
    for (let i = 0; i < matrixRows.length; i++) {
      const matrixRow = matrixRows[i]
      this.drawRow(matrixRow, i)
    }
  }

  public drawRow(matrixRow: IMatrixRow, index: number) {
    let rowElement = this.rows.get(matrixRow.id)

    if (!rowElement) {
      rowElement = this.container
        .append('svg')
        .attr('id', `grid-row-${matrixRow.id}`)
        .attr('height', storage.cellHeight)
        .attr('class', `${storage.prefix}row-row ${storage.prefix}grid__row ${storage.prefix}grid-row`)
        .attr('transform', `translate(0,${index * storage.cellHeight})`)

      this.rows.set(matrixRow.id, rowElement)

      rowElement
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
        .text(matrixRow.data.symbol)
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
          this.processing.sortColumns('countByRow', parseInt(rowId))
          eventBus.emit(innerEvents.INNER_UPDATE, false)
          eventBus.emit(publicEvents.GRID_LABEL_CLICK, {
            target,
            rowId,
          })
        })
    } else {
      rowElement
        .attr('transform', `translate(0,${index * storage.cellHeight})`)
        .attr('style', () => {
          if (storage.cellHeight < storage.minCellHeight) {
            return 'display: none;'
          } else {
            return ''
          }
        })
    }

    const render = this.getChildrenRender(matrixRow.id, rowElement)
    render.draw(matrixRow.columns)

    render.cleanOldCells(matrixRow.columns.map((column) => column.id))
    return rowElement
  }


  destroy() {
    for (const rowId of this.rows.keys()) {
      this.gridCellsRenders.get(rowId).destroy()
      this.rows.get(rowId).remove()
      this.rows.delete(rowId)
    }
  }
}

export default GridRowsRender
