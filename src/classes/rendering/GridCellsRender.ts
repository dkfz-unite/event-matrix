import {Selection} from 'd3-selection'
import {IMatrixColumn} from '../../interfaces/main-grid.interface'
import Processing from '../data/Processing'
import GridEntriesRender from './GridEntriesRender'

class GridCellsRender {
  container: Selection<SVGGElement, unknown, HTMLElement, unknown>
  parentId: string
  processing: Processing
  gridEntitiesRenders: Map<string, GridEntriesRender>

  constructor(parentId: string, container: Selection<SVGGElement, unknown, HTMLElement, unknown>, options: any) {
    this.parentId = parentId
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
    const render = this.getChildrenRender(cellId, this.container)
    render.draw(matrixColumn.entries, index)
    render.cleanOldEntries(matrixColumn.entries.map((entry) => entry.id))
  }

  destroy() {
    const rendererIds = Array.from(this.gridEntitiesRenders.keys())
    for (const rendererId of rendererIds) {
      this.gridEntitiesRenders.get(rendererId).destroy()
      this.gridEntitiesRenders.delete(rendererId)
    }
  }
}

export default GridCellsRender
