import {BaseType, Selection} from 'd3-selection'
import {BlockType} from '../../../../interfaces/base.interface'
import {IMatrixTracksCell} from '../../../../interfaces/matrix.interface'
import {storage} from '../../../../utils/storage'

class BottomTracksCellsRender {
  container: Selection<SVGGElement, unknown, HTMLElement, unknown>
  parentId: string
  cells: Map<string, Selection<BaseType, unknown, HTMLElement, unknown>> = new Map()

  constructor(parentId: string, container: Selection<SVGGElement, unknown, HTMLElement, unknown>, options: any) {
    this.parentId = parentId
    this.container = container
  }

  public draw(cells: IMatrixTracksCell[]) {
    for (let j = 0; j < cells.length; j++) {
      const cell = cells[j]
      this.drawCell(cell, j)
    }
  }

  public drawCell(cell: IMatrixTracksCell, index: number) {
    const cellId = cell.id
    let cellElement = this.cells.get(cellId)

    const fixedCellHeight = 15
    if (!cellElement) {
      const {color, opacity} = (storage.customFunctions[BlockType.Columns])({
        type: this.parentId,
        ...cell,
      })
      cellElement = this.container
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('fill', color)
        .attr('opacity', opacity)
        .attr('width', storage.cellWidth)
        .attr('height', fixedCellHeight)
        .attr('data-track-data-index', index)
        .attr('class', [
          `${storage.prefix}track-data`,
          `${storage.prefix}tracks-cell__${cell.id}`,
          `${storage.prefix}${cell.id}-cell`,
        ].join(' '))

      this.cells.set(cellId, cellElement)
    }

    cellElement
      .attr('width', storage.cellWidth)
      .attr('style', `transform:translateX(${80 + index * storage.cellWidth}px)`)

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

export default BottomTracksCellsRender
