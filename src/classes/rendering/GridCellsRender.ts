import {Selection} from 'd3-selection'
import {IMatrixColumn} from '../../interfaces/main-grid.interface'
import {storage} from '../../utils/storage'
import Processing from '../data/Processing'
import GridEntriesRender from './GridEntriesRender'

class GridCellsRender {
  container: Selection<SVGGElement, unknown, HTMLElement, unknown>
  cells: Map<string, Selection<SVGGElement, unknown, HTMLElement, unknown>> = new Map()
  cellWidth = 10
  cellHeight = 10
  parentId: string
  processing: Processing
  gridEntitiesRenders: Map<string, GridEntriesRender>

  constructor(parentId: string, container: Selection<SVGGElement, unknown, HTMLElement, unknown>, {
    cellWidth,
    cellHeight,
  }: { cellWidth: number, cellHeight: number }) {
    this.parentId = parentId
    this.cellWidth = cellWidth
    this.cellHeight = cellHeight
    this.container = container
    this.processing = Processing.getInstance()
    this.gridEntitiesRenders = new Map()
  }

  public setContainer(container: Selection<SVGGElement, unknown, HTMLElement, unknown>) {
    this.container = container
  }

  private getChildrenRender(parentId: string, container) {
    let render = this.gridEntitiesRenders.get(parentId)
    if (!render) {
      render = new GridEntriesRender(parentId, container, {
        cellWidth: this.cellWidth,
        cellHeight: this.cellHeight,
      })
      this.gridEntitiesRenders.set(parentId, render)
    }
    return render
  }

  public cleanOldCells(activeColumnIds: string[]) {
    for (const cellId of this.cells.keys()) {
      if (!activeColumnIds.includes(cellId)) {
        this.gridEntitiesRenders.get(cellId).destroy()
        this.cells.get(cellId).remove()
        this.cells.delete(cellId)
      }
    }
  }

  public draw(matrixColumns: IMatrixColumn[]) {
    for (let j = 0; j < matrixColumns.length; j++) {
      const matrixColumn = matrixColumns[j]
      this.drawCell(matrixColumn, j)
    }
  }

  public drawCell(matrixColumn: IMatrixColumn, index: number) {
    const cellId = matrixColumn.id
    let cellElement = this.cells.get(cellId)
    const cellX = index * this.cellWidth

    if (!cellElement) {
      // Define cell container itself
      cellElement = this.container
        .append('svg')
        .attr('id', `grid-row-${this.parentId}-cell-${matrixColumn.id}`)
        .attr('width', this.cellWidth)
        .attr('height', this.cellHeight)
        .attr('x', cellX)
        .attr('y', 0)
        .attr('data-row', this.parentId)
        .attr('data-column', matrixColumn.id)
        .attr('class', `${storage.prefix}grid__cell ${storage.prefix}grid-cell`)

      this.cells.set(cellId, cellElement)
    } else {
      cellElement
        .attr('x', cellX)
    }

    const render = this.getChildrenRender(cellId, cellElement)
    render.draw(matrixColumn.entries)

    render.cleanOldEntries(matrixColumn.entries.map((entry) => entry.id))

    return cellElement
  }

  destroy() {
    for (const cellId of this.cells.keys()) {
      this.gridEntitiesRenders.get(cellId).destroy()
      this.cells.get(cellId).remove()
      this.cells.delete(cellId)
    }
  }
}

export default GridCellsRender
