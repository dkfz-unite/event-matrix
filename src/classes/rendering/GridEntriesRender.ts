import {Selection} from 'd3-selection'
import {BlockType} from '../../interfaces/base.interface'
import {IMatrixEntry} from '../../interfaces/main-grid.interface'
import {storage} from '../../utils/storage'
import Processing from '../data/Processing'

class GridEntriesRender {
  container: Selection<SVGGElement, unknown, HTMLElement, unknown>
  entries: Map<string, Selection<SVGRectElement, unknown, HTMLElement, unknown>> = new Map()
  parentId: string
  processing: Processing

  constructor(parentId: string, container: Selection<SVGGElement, unknown, HTMLElement, unknown>, options: any) {
    this.parentId = parentId
    this.container = container
    this.processing = Processing.getInstance()
  }

  public cleanOldEntries(activeEntryIds: string[]) {
    for (const entryId of this.entries.keys()) {
      if (!activeEntryIds.includes(entryId)) {
        this.entries.get(entryId).remove()
        this.entries.delete(entryId)
      }
    }
  }

  public draw(matrixEntries: IMatrixEntry[], indexX: number) {
    const entryHeight = storage.heatMap ? storage.cellHeight : storage.cellHeight / matrixEntries.length
    for (let j = 0; j < matrixEntries.length; j++) {
      const matrixEntry = matrixEntries[j]
      this.drawEntry(matrixEntry, entryHeight, indexX, j)
    }
  }

  public drawEntry(matrixEntry: IMatrixEntry, entryHeight: number, indexX: number, indexY: number) {
    // console.log(matrixEntry, entryHeight, indexX, indexY)
    const entryId = matrixEntry.id
    let entryElement = this.entries.get(entryId)

    const heatMapColor = storage.heatMapColor
    const heatMap = storage.heatMap
    const entryX = indexX * storage.cellWidth
    const entryY = heatMap ? 0 : indexY * entryHeight

    let color = heatMapColor
    let opacity = heatMap ? 0.25 : 1
    if (!heatMap) {
      const appearance = (storage.customFunctions[BlockType.Entries])(matrixEntry.data)
      color = appearance.color
      opacity = appearance.opacity
    }

    if (!entryElement) {
      // Draw the entries inside the cell container
      entryElement = this.container
        .append('rect')
        .attr('width', storage.cellWidth)
        .attr('height', entryHeight)
        .attr('x', entryX)
        .attr('y', entryY)
        .attr('class', `${storage.prefix}sortable-rect ${storage.prefix}grid-cell__entry`)
        .attr('data-row', matrixEntry.data.rowId)
        .attr('data-column', matrixEntry.data.columnId)
        .attr('data-entry', matrixEntry.id)
        .attr('fill', color)
        .attr('opacity', opacity)

      this.entries.set(entryId, entryElement)
    } else {
      entryElement
        .attr('width', storage.cellWidth)
        .attr('height', entryHeight)
        .attr('x', entryX)
        .attr('y', entryY)
        .attr('fill', color)
        .attr('opacity', opacity)
    }

    return entryElement
  }

  destroy() {
    for (const entryId of this.entries.keys()) {
      this.entries.get(entryId).remove()
      this.entries.delete(entryId)
    }
  }
}

export default GridEntriesRender
