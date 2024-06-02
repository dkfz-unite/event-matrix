import {BaseType, Selection} from 'd3-selection'
import {IMatrixColumn} from '../../../interfaces/main-grid.interface'
import {storage} from '../../../utils/storage'
import Processing from '../../data/Processing'
import GridEntriesRender from './GridEntriesRender'

class GridCellsRender {
  container: Selection<SVGGElement, unknown, HTMLElement, unknown>
  parentId: string
  processing: Processing
  gridEntitiesRenders: Map<string, GridEntriesRender>
  cells: Map<string, Selection<BaseType, unknown, HTMLElement, unknown>> = new Map()

  constructor(parentId: string, container: Selection<SVGGElement, unknown, HTMLElement, unknown>, options: any) {
    this.parentId = parentId
    this.container = container
    this.processing = Processing.getInstance()
    this.gridEntitiesRenders = new Map()
  }

  private getChildrenRender(parentId: string, container) {
    let render = this.gridEntitiesRenders.get(parentId)
    if (!render) {
      render = new GridEntriesRender(parentId, container, {})
      this.gridEntitiesRenders.set(parentId, render)
    }
    return render
  }

  public cleanOldCells(activeColumnIds: string[]) {
    const oldCells = Array.from(this.gridEntitiesRenders.keys())
    for (const cellId of oldCells) {
      if (!activeColumnIds.includes(cellId)) {
        this.gridEntitiesRenders.get(cellId).destroy()
        this.gridEntitiesRenders.delete(cellId)
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

    if (!cellElement) {
      cellElement = this.container
        .select('svg')
        .append('g')
        .attr('id', `grid-row-${this.parentId}-cell-${cellId}`)
        .attr('class', `${storage.prefix}grid__row-cell ${storage.prefix}grid-row__cell ${storage.prefix}grid-cell`)
        .attr('style', `transform:translateX(${80 + index * storage.cellWidth}px)`)

      this.cells.set(cellId, cellElement)
    } else {
      cellElement
        .attr('style', `transform:translateX(${80 + index * storage.cellWidth}px)`)
    }

    const render = this.getChildrenRender(cellId, cellElement)
    render.draw(matrixColumn.entries)
    render.cleanOldEntries(matrixColumn.entries.map((entry) => entry.id))
    return cellElement
  }

  destroy() {
    const cellIds = Array.from(this.cells.keys())
    for (const cellId of cellIds) {
      this.gridEntitiesRenders.get(cellId).destroy()
      this.gridEntitiesRenders.delete(cellId)
      this.cells.get(cellId).remove()
      this.cells.delete(cellId)
    }
  }
}

export default GridCellsRender
