import {BaseType, Selection} from 'd3-selection'
import {IMatrixDescriptionCell} from '../../../interfaces/matrix.interface'
import {storage} from '../../../utils/storage'

class BottomDescriptionCellsRender {
  container: Selection<SVGGElement, unknown, HTMLElement, unknown>
  parentId: string
  cells: Map<string, Selection<BaseType, unknown, HTMLElement, unknown>> = new Map()

  constructor(parentId: string, container: Selection<SVGGElement, unknown, HTMLElement, unknown>, options: any) {
    this.parentId = parentId
    this.container = container
  }

  public draw(cells: IMatrixDescriptionCell[]) {
    for (let j = 0; j < cells.length; j++) {
      const cell = cells[j]
      this.drawCell(cell, j)
    }
  }

  public drawCell(cell: IMatrixDescriptionCell, index: number) {
    const cellId = cell.id
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

    return cellElement
  }

  public cleanOldCells(activeCellIds: string[]) {
    const oldCellIds = Array.from(this.cells.keys())
    for (const cellId of oldCellIds) {
      if (!activeCellIds.includes(cellId)) {
        this.cells.get(cellId).remove()
        this.cells.delete(cellId)
      }
    }
  }

  destroy() {
    const cellIds = Array.from(this.cells.keys())
    for (const cellId of cellIds) {
      this.cells.get(cellId).remove()
      this.cells.delete(cellId)
    }
  }
}

export default BottomDescriptionCellsRender
