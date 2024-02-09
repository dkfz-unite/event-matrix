import {Selection} from 'd3-selection'
import {BlockType} from '../../interfaces/base.interface'
import {IMatrixEntry} from '../../interfaces/main-grid.interface'
import {storage} from '../../utils/storage'
import Processing from '../data/Processing'

class GridEntriesRender {
  container: Selection<SVGGElement, unknown, HTMLElement, unknown>
  entries: Map<string, Selection<SVGRectElement, unknown, HTMLElement, unknown>> = new Map()
  cellWidth = 10
  cellHeight = 10
  parentId: string
  processing: Processing

  constructor(parentId: string, container: Selection<SVGGElement, unknown, HTMLElement, unknown>, {
    cellWidth,
    cellHeight,
  }: { cellWidth, cellHeight }) {
    this.cellWidth = cellWidth
    this.cellHeight = cellHeight
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

  public draw(matrixEntries: IMatrixEntry[]) {
    const entryHeight = storage.heatMap ? this.cellHeight : this.cellHeight / matrixEntries.length
    for (let j = 0; j < matrixEntries.length; j++) {
      const matrixEntry = matrixEntries[j]
      this.drawEntry(matrixEntry, entryHeight, j)
    }
  }

  public drawEntry(matrixEntry: IMatrixEntry, entryHeight: number, index: number) {
    const entryId = matrixEntry.id
    let entryElement = this.entries.get(entryId)

    const heatMapColor = storage.heatMapColor
    const heatMap = storage.heatMap

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
        .attr('width', this.cellWidth)
        .attr('height', entryHeight)
        .attr('x', 0)
        .attr('y', heatMap ? 0 : index * entryHeight)
        .attr('class', `${storage.prefix}sortable-rect ${storage.prefix}grid-cell__entry`)
        .attr('data-row', (matrixEntry: IMatrixEntry) => matrixEntry.data.rowId)
        .attr('data-column', (matrixEntry: IMatrixEntry) => matrixEntry.data.columnId)
        .attr('data-entry', (matrixEntry: IMatrixEntry) => matrixEntry.id)
        .attr('fill', color)
        .attr('opacity', opacity)

      this.entries.set(entryId, entryElement)
    } else {
      entryElement
        .attr('width', this.cellWidth)
        .attr('height', entryHeight)
        .attr('x', 0)
        .attr('y', heatMap ? 0 : index * entryHeight)
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
