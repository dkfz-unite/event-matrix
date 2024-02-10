import {select, Selection} from 'd3-selection'
import {IEnhancedEvent, IMatrix} from '../../interfaces/main-grid.interface'
import {eventBus, publicEvents, renderEvents} from '../../utils/event-bus'
import {storage} from '../../utils/storage'
import Processing from '../data/Processing'
import GridRowsRender from './GridRowsRender'

class GridRender {
  private width = 500
  private height = 500
  private processing: Processing
  private wrapper: Selection<HTMLElement, unknown, HTMLElement, unknown>
  // private gridLinesRender: GridLinesRender
  // private crosshairRender: CrosshairRender
  private gridRowsRender: GridRowsRender

  // TODO: check this legacy options
  private minCellHeight = 10
  private drawGridLines = false
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
    // this.gridLinesRender = new GridLinesRender()
    // this.crosshairRender = new CrosshairRender()
    this.gridRowsRender = new GridRowsRender({})
    this.wrapper = select(`.${storage.prefix}container`)
  }

  public render() {
    this.matrix = this.processing.getCroppedMatrix()
    this.prepareContainer()

    eventBus.emit(renderEvents.RENDER_GRID_START)
    this.drawBackground()
    // if (this.drawGridLines) {
    //   this.gridLinesRender.render()
    // } else {
    //   this.gridLinesRender.destroy()
    // }
    // if (this.crosshair) {
    //   this.crosshairRender.render()
    // } else {
    //   this.crosshairRender.destroy()
    // }
    this.drawGrid()
    this.addGridEvents()
    eventBus.emit(renderEvents.RENDER_GRID_END)

    // this.defineCrosshairBehaviour()
  }

  private prepareContainer() {
    this.svg = this.wrapper.append('svg')
      .attr('class', `${storage.prefix}maingrid-svg`)
      .attr('id', `${storage.prefix}maingrid-svg`)
      .attr('width', '100%')
    //     .attr('width', width)
    //     .attr('height', height)
    //     .attr('viewBox', `0 0 ${width} ${height}`)
    //
    //   this.container
    //     .attr('transform', 'translate(' +
    //       (this.margin.left + this.leftTextWidth) + ',' +
    //       (this.margin.top + histogramHeight + 10) +
    //       ')')


    this.gridRowsRender.setContainer(this.svg)
  }

  private drawBackground() {
    this.container = this.svg.append('g')

    this.background = this.container.append('rect')
      .attr('class', `${storage.prefix}background`)
      .attr('width', this.width)
      .attr('height', this.height)

    this.gridContainer = this.container.append('g')
  }

  private addGridEvents() {
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


  // /**
  //  * Updates coordinate system and renders the lines of the grid.
  //  */
  // private computeCoordinates() {
  //   this.cellWidth = this.width / storage.columns.length
  //
  //   this.column?.remove()
  //
  //   if (this.drawGridLines) {
  //     this.column = this.gridContainer.selectAll(`.${storage.prefix}column-column`)
  //       .data(storage.columns)
  //       .enter()
  //       .append('line')
  //       .attr('x1', (column: IColumn) => column.x)
  //       .attr('x2', (column: IColumn) => column.x)
  //       .attr('y1', 0)
  //       .attr('y2', this.height)
  //       .attr('class', `${storage.prefix}column-column`)
  //       .style('pointer-events', 'none')
  //   }
  //
  //   this.cellHeight = this.height / storage.rows.length
  //   this.row?.remove()
  //
  //   this.row = this.gridContainer.selectAll(`.${storage.prefix}row-row`)
  //     .data(storage.rows)
  //     .enter()
  //     .append('g')
  //     .attr('class', `${storage.prefix}row-row`)
  //     .attr('transform', (row: IRow) => {
  //       return 'translate(0,' + row.y + ')'
  //     })
  //
  //   if (this.drawGridLines) {
  //     this.row.append('line')
  //       .attr('x2', this.width)
  //       .style('pointer-events', 'none')
  //   }
  //
  //   this.row
  //     .append('text')
  //     .attr('class', (row: IRow) => {
  //       return `${storage.prefix}${row.id}-label ${storage.prefix}row-label ${storage.prefix}label-text-font`
  //     })
  //     .attr('data-row', (row: IRow) => row.id)
  //     .attr('x', -8)
  //     .attr('y', this.cellHeight / 2)
  //     .attr('dy', '.32em')
  //     .attr('text-anchor', 'end')
  //     .attr('style', () => {
  //       if (this.cellHeight < storage.minCellHeight) {
  //         return 'display: none;'
  //       } else {
  //         return ''
  //       }
  //     })
  //     .text((row: IRow) => {
  //       return row.symbol
  //     })
  //     .on('mouseover', (event: IEnhancedEvent) => {
  //       const target = event.target
  //       const rowId = target.dataset.row
  //       if (!rowId) {
  //         return
  //       }
  //       eventBus.emit(publicEvents.GRID_LABEL_HOVER, {
  //         target,
  //         rowId,
  //       })
  //     })
  //     .on('click', (event: IEnhancedEvent) => {
  //       const target = event.target
  //       const rowId = target.dataset.row
  //       if (!rowId) {
  //         return
  //       }
  //       storage.sortColumns('countByRow', parseInt(rowId))
  //       eventBus.emit(innerEvents.INNER_UPDATE, false)
  //       eventBus.emit(publicEvents.GRID_LABEL_CLICK, {
  //         target,
  //         rowId,
  //       })
  //     })
  // }

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

  // private defineCrosshairBehaviour() {
  //   const moveCrossHair = (eventType: string, event: IEnhancedEvent) => {
  //     if (this.crosshair) {
  //       const coord = pointer(event, event.target)
  //
  //       this.verticalCross.attr('x1', coord[0]).attr('opacity', 1)
  //       this.verticalCross.attr('x2', coord[0]).attr('opacity', 1)
  //       this.horizontalCross.attr('y1', coord[1]).attr('opacity', 1)
  //       this.horizontalCross.attr('y2', coord[1]).attr('opacity', 1)
  //
  //       if (eventType === 'mousemove' && this.selectionRegion !== undefined) {
  //         this.changeSelection(coord)
  //       }
  //
  //       const xIndex = this.width < coord[0] ? -1 : this.getIndexFromScaleBand(this.x, coord[0])
  //       const yIndex = this.height < coord[1] ? -1 : this.getIndexFromScaleBand(this.y, coord[1])
  //
  //       const column = storage.columns[xIndex]
  //       const row = storage.rows[yIndex]
  //
  //       if (!column || !row) {
  //         return
  //       }
  //
  //       if (eventType === 'mouseover') {
  //         eventBus.emit(publicEvents.GRID_CROSSHAIR_HOVER, {
  //           target: event.target,
  //           columnId: column.id,
  //           rowId: row.id,
  //         })
  //       }
  //     }
  //   }
  //
  //   const histogramHeight = this.horizontalHistogram.getHistogramHeight()
  //
  //   this.verticalCross = this.container.append('line')
  //     .attr('class', `${storage.prefix}vertical-cross`)
  //     .attr('y1', -histogramHeight)
  //     .attr('y2', this.height + this.horizontalDescriptionBlock.height)
  //     .attr('opacity', 0)
  //     .attr('style', 'pointer-events: none')
  //
  //   this.horizontalCross = this.container.append('line')
  //     .attr('class', `${storage.prefix}horizontal-cross`)
  //     .attr('x1', 0)
  //     .attr('x2', this.width + histogramHeight + this.verticalDescriptionBlock.height)
  //     .attr('opacity', 0)
  //     .attr('style', 'pointer-events: none')
  //
  //   this.container
  //     .on('mousedown', (event: IEnhancedEvent) => {
  //       this.startSelection(event)
  //     })
  //     .on('mouseover', (event: IEnhancedEvent) => {
  //       moveCrossHair('mouseover', event)
  //     })
  //     .on('mousemove', (event: IEnhancedEvent) => {
  //       moveCrossHair('mousemove', event)
  //     })
  //     .on('mouseout', () => {
  //       if (this.crosshair) {
  //         this.verticalCross.attr('opacity', 0)
  //         this.horizontalCross.attr('opacity', 0)
  //
  //         eventBus.emit(publicEvents.GRID_CROSSHAIR_OUT)
  //       }
  //     })
  //     .on('mouseup', (event: IEnhancedEvent) => {
  //       this.verticalCross.attr('opacity', 0)
  //       this.horizontalCross.attr('opacity', 0)
  //       this.finishSelection(event)
  //     })
  // }

  // /**
  //  * Event behavior when pressing down on the mouse to make a selection
  //  */
  // private startSelection(event: IEnhancedEvent) {
  //   if (this.crosshair && this.selectionRegion === undefined) {
  //     event.stopPropagation()
  //     const coord = pointer(event, event.target)
  //     eventBus.emit(publicEvents.GRID_SELECTION_STARTED, {
  //       target: event.target,
  //       x: coord[0],
  //       y: coord[1],
  //     })
  //
  //     this.selectionRegion = this.container.append('rect')
  //       .attr('x', coord[0])
  //       .attr('y', coord[1])
  //       .attr('width', 1)
  //       .attr('height', 1)
  //       .attr('class', `${storage.prefix}selection-region`)
  //       .attr('stroke', 'black')
  //       .attr('stroke-width', '2')
  //       .attr('opacity', 0.2)
  //   }
  // }

  // /**
  //  * Event behavior as you drag selected region around
  //  */
  // private changeSelection(coord: number[]) {
  //   const rect = {
  //     x: parseInt(this.selectionRegion.attr('x'), 10),
  //     y: parseInt(this.selectionRegion.attr('y'), 10),
  //     width: parseInt(this.selectionRegion.attr('width'), 10),
  //     height: parseInt(this.selectionRegion.attr('height'), 10),
  //   }
  //
  //   const move = {
  //     x: coord[0] - Number(this.selectionRegion.attr('x')),
  //     y: coord[1] - Number(this.selectionRegion.attr('y')),
  //   }
  //
  //   if (move.x < 1 || (move.x * 2 < rect.width)) {
  //     rect.x = coord[0]
  //     rect.width -= move.x
  //   } else {
  //     rect.width = move.x
  //   }
  //
  //   if (move.y < 1 || (move.y * 2 < rect.height)) {
  //     rect.y = coord[1]
  //     rect.height -= move.y
  //   } else {
  //     rect.height = move.y
  //   }
  //
  //   this.selectionRegion.attr('x', rect.x)
  //   this.selectionRegion.attr('y', rect.y)
  //   this.selectionRegion.attr('width', rect.width)
  //   this.selectionRegion.attr('height', rect.height)
  // }

  // private getIndexFromScaleBand(scaleBand: ScaleBand<string>, coord: number) {
  //   const step = scaleBand.step()
  //   const index = Math.floor(coord / step)
  //   return scaleBand.domain()[index]
  // }

  // /**
  //  * Event behavior when releasing mouse when finishing with a selection
  //  */
  // private finishSelection(event: IEnhancedEvent) {
  //   if (this.crosshair && this.selectionRegion !== undefined) {
  //     event.stopPropagation()
  //
  //     const x1 = Number(this.selectionRegion.attr('x'))
  //     const x2 = x1 + Number(this.selectionRegion.attr('width'))
  //
  //     const y1 = Number(this.selectionRegion.attr('y'))
  //     const y2 = y1 + Number(this.selectionRegion.attr('height'))
  //
  //     const xStart = this.getIndexFromScaleBand(this.x, x1)
  //     const xStop = this.getIndexFromScaleBand(this.x, x2)
  //
  //     const yStart = this.getIndexFromScaleBand(this.y, y1)
  //     const yStop = this.getIndexFromScaleBand(this.y, y2)
  //
  //     this.sliceColumns(parseInt(xStart), parseInt(xStop))
  //     this.sliceRows(parseInt(yStart), parseInt(yStop))
  //
  //     this.selectionRegion.remove()
  //     delete this.selectionRegion
  //
  //     eventBus.emit(publicEvents.GRID_SELECTION_FINISHED, {
  //       target: event.target,
  //       x: x2,
  //       y: y2,
  //     })
  //     eventBus.emit(innerEvents.INNER_UPDATE, true)
  //   }
  // }

  // /**
  //  * Used when resizing grid
  //  * @param start - start index of the selection
  //  * @param stop - end index of the selection
  //  */
  // private sliceRows(start: number, stop: number) {
  //   for (let i = 0; i < storage.rows.length; i++) {
  //     const row = storage.rows[i]
  //     if (i < start || i > stop) {
  //       selectAll(`.${storage.prefix}${row.id}-cell`).remove()
  //       selectAll(`.${storage.prefix}${row.id}-bar`).remove()
  //       storage.rows.splice(i, 1)
  //       i--
  //       start--
  //       stop--
  //     }
  //   }
  // }

  // /**
  //  * Used when resizing grid
  //  * @param start - start index of the selection
  //  * @param stop - end index of the selection
  //  */
  // private sliceColumns(start: number, stop: number) {
  //   for (let i = 0; i < storage.columns.length; i++) {
  //     const column = storage.columns[i]
  //     if (i < start || i > stop) {
  //       selectAll(`.${storage.prefix}${column.id}-cell`).remove()
  //       selectAll(`.${storage.prefix}${column.id}-bar`).remove()
  //       storage.columns.splice(i, 1)
  //       i--
  //       start--
  //       stop--
  //     }
  //   }
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

  // /**
  //  * set the entry rects between heatmap and regular mode.
  //  */
  // public setHeatmap(active: boolean) {
  //   if (active === this.heatMap) return this.heatMap
  //   this.heatMap = active
  //   const heatMapColor = this.heatMapColor
  //
  //   selectAll(`.${storage.prefix}sortable-rect`)
  //     .attr('d', (obs: IEntry) => {
  //       return this.getRectangularPath(obs)
  //     })
  //     .each(function (entry: IEntry) {
  //       let color = heatMapColor
  //       let opacity = active ? 0.25 : 1
  //       if (!active) {
  //         const appearance = (storage.customFunctions[BlockType.Entries])(entry)
  //         color = appearance.color
  //         opacity = appearance.opacity
  //       }
  //
  //       // "this" in the context is a selected DOM element. If you see an error below, everything is fine
  //       // "this as string" - is just a trick to bypass WebStorm types check
  //       const element = select(this as string)
  //       element.attr('fill', color)
  //       element.attr('opacity', opacity)
  //     })
  //
  //   return this.heatMap
  // }
  //
  // public setGridLines(active: boolean) {
  //   if (this.drawGridLines === active) return this.drawGridLines
  //   this.drawGridLines = active
  //
  //   this.verticalDescriptionBlock.setGridLines(this.drawGridLines)
  //   this.horizontalDescriptionBlock.setGridLines(this.drawGridLines)
  //
  //   this.computeCoordinates()
  //
  //   return this.drawGridLines
  // }

  // public setCrosshair(active: boolean) {
  //   this.crosshair = active
  //
  //   return this.crosshair
  // }

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
