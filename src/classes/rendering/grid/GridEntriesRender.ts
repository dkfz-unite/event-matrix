import {Selection} from 'd3-selection'
import {BlockType} from '../../../interfaces/base.interface'
import {IMatrixEntry} from '../../../interfaces/main-grid.interface'
import {storage} from '../../../utils/storage'
import Processing from '../../data/Processing'

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
    const oldEntries = Array.from(this.entries.keys())
    for (const entryId of oldEntries) {
      if (!activeEntryIds.includes(entryId)) {
        this.entries.get(entryId).remove()
        this.entries.delete(entryId)
      }
    }
  }

  public draw(matrixEntries: IMatrixEntry[]) {
    if (matrixEntries.length === 0) {
      return
    }
    const entryHeight = storage.heatMap ? storage.cellHeight : (storage.cellHeight / matrixEntries.length)
    for (let j = 0; j < matrixEntries.length; j++) {
      const matrixEntry = matrixEntries[j]
      this.drawEntry(matrixEntry, entryHeight, 0, j)
    }
  }

  public drawEntry(matrixEntry: IMatrixEntry, entryHeight: number, indexX: number, indexY: number) {
    const entryId = matrixEntry.id
    let entryElement = this.entries.get(entryId)

    const heatMapColor = storage.heatMapColor
    const heatMap = storage.heatMap
    const entryX = 0
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
    const entryIds = Array.from(this.entries.keys())
    for (const entryId of entryIds) {
      this.entries.get(entryId).remove()
      this.entries.delete(entryId)
    }
  }
}

export default GridEntriesRender
