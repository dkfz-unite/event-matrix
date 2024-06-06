import {BaseType, Selection} from 'd3-selection'
import {BlockType} from '../../../../interfaces/base.interface'
import {IMatrixDescriptionCell} from '../../../../interfaces/matrix.interface'
import {storage} from '../../../../utils/storage'

class SideDescriptionCellsRender {
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

    const fixedCellHeight = 15
    if (!cellElement) {
      const {color, opacity} = (storage.customFunctions[BlockType.Rows])({
        type: this.parentId,
        ...cell,
      })
      cellElement = this.container
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('fill', color)
        .attr('opacity', opacity)
        .attr('width', fixedCellHeight)
        .attr('height', fixedCellHeight)
        .attr('data-track-data-index', index)
        .attr('class', [
          `${storage.prefix}track-data`,
          `${storage.prefix}description-cell__${cell.id}`,
          `${storage.prefix}${cell.id}-cell`,
        ].join(' '))

      this.cells.set(cellId, cellElement)
    }
    
    cellElement
      .attr('height', storage.cellHeight)
      .attr('style', `transform:translateY(${index * storage.cellHeight + 80 + 6 + 6}px)`)

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

export default SideDescriptionCellsRender
