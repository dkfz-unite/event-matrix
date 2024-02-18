import {select, Selection} from 'd3-selection'
import {IEnhancedEvent, IMatrix} from '../../interfaces/main-grid.interface'
import {eventBus, publicEvents, renderEvents} from '../../utils/event-bus'
import {storage} from '../../utils/storage'
import Processing from '../data/Processing'
import CrosshairRender from './CrosshairRender'
import GridLinesRender from './GridLinesRender'
import GridRowsRender from './GridRowsRender'

class GridRender {
  private width = 500
  private height = 500
  private processing: Processing
  private wrapper: Selection<HTMLElement, unknown, HTMLElement, unknown>
  private gridLinesRender: GridLinesRender
  private crosshairRender: CrosshairRender
  private gridRowsRender: GridRowsRender

  // TODO: check this legacy options
  private drawGridLines = true
  private crosshair = false
  private matrix: IMatrix
  private svg: Selection<SVGSVGElement, unknown, HTMLElement, unknown>
  private container: Selection<SVGGElement, unknown, HTMLElement, unknown>
  private background: Selection<SVGRectElement, unknown, HTMLElement, unknown>
  private gridContainer: Selection<SVGGElement, unknown, HTMLElement, unknown>

  constructor(width: number, height: number, options: any) {
    this.width = width
    this.height = height

    this.processing = Processing.getInstance()

    this.initDimensions(width, height)
    this.gridLinesRender = new GridLinesRender(width, height)
    this.crosshairRender = new CrosshairRender(width, height)
    this.gridRowsRender = new GridRowsRender({})
    this.wrapper = select(`.${storage.prefix}container`)
  }

  public render() {
    this.matrix = this.processing.getCroppedMatrix()
    storage.setCellDimensions(this.width / (this.matrix[0]?.columns ?? []).length, this.height / this.matrix.length)

    this.prepareContainer()

    eventBus.emit(renderEvents.RENDER_GRID_START)
    this.drawBackground()
    if (this.drawGridLines) {
      this.gridLinesRender.render()
    } else {
      this.gridLinesRender.destroy()
    }
    this.drawGrid()
    this.addGridEvents()
    this.crosshairRender.render()
    eventBus.emit(renderEvents.RENDER_GRID_END)
  }

  private prepareContainer() {
    if (!this.svg) {
      this.svg = this.wrapper.append('svg')
        .attr('version', '2.0')
        .attr('class', `${storage.prefix}maingrid-svg`)
        .attr('id', `${storage.prefix}maingrid-svg`)
        .attr('width', this.width + 80)
        .attr('height', this.height)
        .attr('viewBox', `0 0 ${this.width + 80} ${this.height}`)
    } else {
      this.svg
        .attr('width', this.width + 80)
        .attr('height', this.height)
        .attr('viewBox', `0 0 ${this.width + 80} ${this.height}`)
    }

    if (!this.container) {
      this.container = this.svg.append('g')
        .attr('transform', 'translate(80,0)')
    } else {
      this.container
        .attr('transform', 'translate(80,0)')
    }

    this.gridRowsRender.setContainer(this.svg)
    this.crosshairRender.setContainer(this.container)
  }

  private drawBackground() {
    if (!this.background) {
      this.background = this.container.append('rect')
        .attr('class', `${storage.prefix}background`)
        .attr('width', this.width)
        .attr('height', this.height)

      this.gridContainer = this.container.append('g')
      this.gridLinesRender.setContainer(this.gridContainer)
    } else {
      this.background
        .attr('width', this.width)
        .attr('height', this.height)
    }
  }

  private addGridEvents() {
    this.removeGridEvents()

    this.svg.on('mouseover', (event: IEnhancedEvent) => {
      const target = event.target
      const entryId = target.dataset.entry

      if (!entryId || this.crosshair) {
        return
      }
      const rowId = target.dataset.row
      const columnId = target.dataset.column
      const row = this.matrix.find((mRow) => mRow.id === rowId)
      const column = row.columns.find((mCol) => mCol.id === columnId)

      eventBus.emit(publicEvents.GRID_CELL_HOVER, {
        target: target,
        entryIds: column.entries.map((entry) => entry.id),
        entryId,
        columnId,
        rowId,
      })
    })

    this.svg.on('mouseout', () => {
      eventBus.emit(publicEvents.GRID_OUT)
    })

    this.svg.on('click', (event: IEnhancedEvent) => {
      const target = event.target
      const rowId = target.dataset.row
      const columnId = target.dataset.column
      const entryId = target.dataset.entry

      eventBus.emit(publicEvents.GRID_CELL_CLICK, {
        target: event.target,
        rowId,
        columnId,
        entryId,
      })
    })
  }

  private drawGrid() {
    this.gridRowsRender.draw(this.matrix)
    this.gridRowsRender.cleanOldRows(this.matrix.map((mRow) => mRow.id))
  }

  private removeGridEvents() {
    this.svg.on('mouseover', null)
    this.svg.on('mouseout', null)
    this.svg.on('click', null)
  }

  public destroy() {
    this.removeGridEvents()
    this.gridRowsRender.destroy()
  }

  private initDimensions(width: number, height: number) {
    this.width = width
    this.height = height
  }

  public resize(width: number, height: number) {
    this.initDimensions(width, height)
    this.destroy()
    this.render()
  }

  // private resizeSvg() {
  //   const histogramHeight = this.horizontalHistogram.getHistogramHeight()
  //   const width = this.margin.left + this.leftTextWidth + this.width + histogramHeight + this.verticalDescriptionBlock.height + this.margin.right
  //   const height = this.margin.top + 10 + histogramHeight + 10 + this.height + this.horizontalDescriptionBlock.height + this.margin.bottom
  //
  //   this.svg
  //     .attr('width', width)
  //     .attr('height', height)
  //     .attr('viewBox', `0 0 ${width} ${height}`)
  //
  //   this.container
  //     .attr('transform', 'translate(' +
  //       (this.margin.left + this.leftTextWidth) + ',' +
  //       (this.margin.top + histogramHeight + 10) +
  //       ')')
  // }

  // /**
  //  * Function that determines the y position of a mutation within a cell
  //  */
  // private getY({id, rowId, columnId}: IEntry): number {
  //   const y = this.rowMap[rowId].y ?? 0
  //   if (this.heatMap) {
  //     return y
  //   }
  //   const obs = storage.lookupTable[columnId][rowId]
  //   if (obs.length === 0) {
  //     return y
  //   }
  //   return y + this.cellHeight / obs.length * obs.indexOf(id)
  // }

  // /**
  //  * Function that determines the x position of a mutation
  //  */
  // private getCellX(entry: IEntry): number {
  //   return storage.lookupTable[entry.columnId].x ?? 0
  // }
  //
  // /**
  //  * Returns the height of an entry cell.
  //  * @returns {number}
  //  */
  // private getHeight({columnId, rowId}: IEntry): number {
  //   const height = this.cellHeight ?? 0
  //   if (this.heatMap) {
  //     return height
  //   }
  //   const count = storage.lookupTable[columnId][rowId].length
  //   if (count === 0) {
  //     return height
  //   }
  //
  //   return height / count
  // }

  // /**
  //  * Returns the correct entry value based on the data type.
  //  */
  // private getValueByType(entry: IEntry) {
  //   return entry.value ?? ''
  // }

  // /**
  //  * Returns rectangular path based on cell dimensions
  //  */
  // private getRectangularPath(entry: IEntry) {
  //   const x1 = this.getCellX(entry)
  //   const y1 = this.getY(entry)
  //   return 'M ' + x1 + ' ' + y1 + ' H ' + (x1 + this.cellWidth) + ' V ' + (y1 + this.getHeight(entry)) + ' H ' + x1 + 'Z'
  // }

  public setHeatmap(active: boolean) {
    storage.heatMap = active
    this.render()
  }

  public setGridLines(active: boolean) {
    this.drawGridLines = active

    // this.verticalDescriptionBlock.setGridLines(this.drawGridLines)
    // this.horizontalDescriptionBlock.setGridLines(this.drawGridLines)
    this.render()
  }

  public setCrosshair(active: boolean) {
    this.crosshair = active
    this.crosshairRender.setVisible(active)
  }

  // /**
  //  * Removes all elements corresponding to the given row and then removes it from the row list.
  //  * @param index of the row to remove.
  //  */
  // public removeRow(i: number) {
  //   const row = storage.rows[i]
  //   if (row) {
  //     selectAll(`.${storage.prefix}${row.id}-cell`).remove()
  //     selectAll(`.${storage.prefix}${row.id}-bar`).remove()
  //     storage.rows.splice(i, 1)
  //   }
  //
  //   eventBus.emit(innerEvents.INNER_UPDATE, true)
  // }

  // private nullableObsLookup(column: any, row: any) {
  //   if (!column || typeof column !== 'object') return null
  //   if (!row || typeof row !== 'object') return null
  //
  //   if (storage.lookupTable?.[column.id]?.[row.id]) {
  //     return storage.lookupTable[column.id][row.id].join(', ') // Table stores arrays, and we want to return a string
  //   } else {
  //     return null
  //   }
  // }

  /**
   * Removes all svg elements for this grid.
   */
  // public destroy() {
  //   this.wrapper.select(`.${storage.prefix}maingrid-svg`).remove()
  // }
}

export default GridRender
