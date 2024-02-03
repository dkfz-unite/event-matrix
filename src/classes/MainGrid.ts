import {ScaleBand} from 'd3-scale'
import {pointer, select, selectAll, Selection} from 'd3-selection'
import {BlockType, CssMarginProps} from '../interfaces/base.interface'
import {IColumn, IEntry, IRow} from '../interfaces/bioinformatics.interface'
import {
  HistogramParams,
  IDescriptionBlockParams,
  IDomainEntity,
  IEnhancedEvent,
  MainGridParams
} from '../interfaces/main-grid.interface'
import {eventBus, innerEvents, publicEvents, renderEvents} from '../utils/event-bus'
import {storage} from '../utils/storage'
import DescriptionBlock from './DescriptionBlock'
import Histogram from './Histogram'

class MainGrid {
  private params: MainGridParams
  private x: ScaleBand<string>
  private y: ScaleBand<string>
  private horizontalDescriptionBlock: DescriptionBlock
  private verticalHistogram: Histogram
  private horizontalHistogram: Histogram
  private verticalDescriptionBlock: DescriptionBlock
  private leftTextWidth = 80
  private wrapper: Selection<HTMLElement, unknown, HTMLElement, unknown>
  private svg: Selection<SVGSVGElement, unknown, HTMLElement, unknown>
  private container: Selection<SVGGElement, unknown, HTMLElement, unknown>
  private background: Selection<SVGRectElement, unknown, HTMLElement, unknown>
  private gridContainer: Selection<SVGGElement, unknown, HTMLElement, unknown>
  private width = 500
  private height = 500
  private inputWidth = 500
  private inputHeight = 500
  private cellWidth: number
  private cellHeight: number
  private margin: CssMarginProps = {top: 30, right: 100, bottom: 15, left: 80}
  public heatMap = false
  public drawGridLines = false
  public crosshair = false
  private heatMapColor = '#D33682'
  private verticalCross: Selection<SVGLineElement, unknown, HTMLElement, unknown>
  private horizontalCross: Selection<SVGLineElement, unknown, HTMLElement, unknown>
  private selectionRegion: Selection<SVGRectElement, unknown, HTMLElement, unknown>
  private column: Selection<SVGLineElement, unknown, SVGGElement, unknown>
  private row: Selection<SVGGElement, IRow, SVGGElement, unknown>
  private rowMap: Record<string, IRow>
  public fullscreen = false

  constructor(params: MainGridParams, x: ScaleBand<string>, y: ScaleBand<string>) {
    this.params = params
    this.x = x
    this.y = y

    this.loadParams(params)
    this.createRowMap()
    this.init()

    const descriptionBlockParams = this.getDescriptionBlockParams()
    const histogramParams = this.getHistogramParams()
    this.horizontalHistogram = new Histogram(histogramParams, this.container, false)
    this.horizontalDescriptionBlock = new DescriptionBlock(
      descriptionBlockParams,
      BlockType.Columns,
      this.container,
      false,
      params.columnFields ?? [],
      this.height + 10
    )
    this.horizontalDescriptionBlock.init()

    this.verticalHistogram = new Histogram(histogramParams, this.container, true)
    this.verticalDescriptionBlock =
      new DescriptionBlock(
        descriptionBlockParams,
        BlockType.Rows,
        this.container,
        true,
        params.rowFields ?? [],
        this.width + 10 + this.verticalHistogram.getHistogramHeight() + 10 + storage.minCellHeight
      )
    this.verticalDescriptionBlock.init()
  }

  private getDescriptionBlockParams(): IDescriptionBlockParams {
    return {
      padding: this.params.trackPadding,
      offset: this.params.offset,
      label: this.params.fieldLegendLabel,
      margin: this.params.margin,
      rows: this.params.rows,
      columns: this.params.columns,
      width: this.params.width,
      parentHeight: this.params.height,
      height: this.params.fieldHeight,
      nullSentinel: this.params.nullSentinel,
      grid: this.params.grid,
      wrapper: this.params.wrapper,
      expandableGroups: this.params.expandableGroups,
    }
  }

  private getHistogramParams(): HistogramParams {
    return {
      histogramBorderPadding: this.params.histogramBorderPadding,
      type: this.params.type,
      rows: this.params.rows,
      columns: this.params.columns,
      margin: this.params.margin,
      width: this.params.width,
      height: this.params.height,
      wrapper: this.params.wrapper,
    }
  }

  /**
   * Responsible for initializing instance fields of MainGrid from the provided params object.
   * @param params
   */
  private loadParams({
    leftTextWidth,
    wrapper,
    width,
    height,
    margin,
    heatMap,
    heatMapColor,
    grid,
  }: MainGridParams) {
    if (leftTextWidth !== undefined) {
      this.leftTextWidth = leftTextWidth
    }
    this.wrapper = select(wrapper || 'body')

    if (width !== undefined) {
      this.inputWidth = width
    }
    if (height !== undefined) {
      this.inputHeight = height
    }

    this.initDimensions(width, height)

    if (margin !== undefined) {
      this.margin = margin
    }
    if (heatMap !== undefined) {
      this.heatMap = heatMap
    }
    if (grid !== undefined) {
      this.drawGridLines = grid
    }
    if (heatMapColor !== undefined) {
      this.heatMapColor = heatMapColor
    }
  }

  /**
   * Creates main svg element, background, and tooltip.
   */
  private init() {
    this.svg = this.wrapper.append('svg')
      .attr('class', `${storage.prefix}maingrid-svg`)
      .attr('id', `${storage.prefix}maingrid-svg`)
      .attr('width', '100%')

    this.container = this.svg.append('g')

    this.background = this.container.append('rect')
      .attr('class', `${storage.prefix}background`)
      .attr('width', this.width)
      .attr('height', this.height)

    this.gridContainer = this.container.append('g')
  }

  public clear() {
    this.container?.selectAll(`.${storage.prefix}sortable-rect`)?.remove()
    this.horizontalHistogram?.clear()
    this.verticalHistogram?.clear()
  }

  /**
   * Only to be called the first time the EventMatrix is rendered. It creates the rects representing the
   * mutation occurrences.
   */
  public render() {
    eventBus.emit(renderEvents.RENDER_GRID_START)
    this.clear()
    this.computeCoordinates()

    this.svg.on('mouseover', (event: IEnhancedEvent) => {
      const target = event.target
      const coord = pointer(event, target)

      const xIndex = this.getIndexFromScaleBand(this.x, coord[0])
      const yIndex = this.getIndexFromScaleBand(this.y, coord[1])

      if (!target.dataset.obsIndex || this.crosshair) {
        return
      }
      const obsIds = target.dataset.obsIndex.split(' ')
      const obs = storage.entries.filter((entry: IEntry) => {
        return entry.columnId === obsIds[0] && entry.rowId === obsIds[1]
      })
      const targetEntry = obs.find((entry: IEntry) => {
        return entry.id == obsIds[2]
      })

      eventBus.emit(publicEvents.GRID_CELL_HOVER, {
        target: target,
        entryIds: obs.map((ob) => ob.id),
        entryId: targetEntry.id,
        columnId: storage.columns[xIndex].id,
        rowId: storage.rows[yIndex].id,
      })
    })

    this.svg.on('mouseout', () => {
      eventBus.emit(publicEvents.GRID_OUT)
    })

    this.svg.on('click', (event: IEnhancedEvent) => {
      const obsIds = event.target.dataset.obsIndex?.split(' ')
      if (!obsIds) {
        return
      }

      eventBus.emit(publicEvents.GRID_CELL_CLICK, {
        target: event.target,
        columnId: obsIds[0],
        rowId: obsIds[1],
        entryId: obsIds[2],
      })
    })

    const heatMap = this.heatMap
    const heatMapColor = this.heatMapColor

    this.container
      .selectAll(`.${storage.prefix}maingrid-svg`)
      .data(storage.entries)
      .enter()
      .append('path')
      .attr('data-obs-index', (obs: IEntry) => {
        return `${obs.columnId} ${obs.rowId} ${obs.id}`
      })
      .attr('class', (obs: IEntry) => {
        return `${storage.prefix}sortable-rect ${storage.prefix}${obs.columnId}-cell ${storage.prefix}${obs.rowId}-cell`
      })
      .attr('cons', (obs: IEntry) => {
        return this.getValueByType(obs)
      })
      .attr('d', (obs: IEntry) => {
        return this.getRectangularPath(obs)
      })
      .each(function (entry: IEntry) {
        let color = heatMapColor
        let opacity = heatMap ? 0.25 : 1
        if (!heatMap) {
          const appearance = (storage.customFunctions[BlockType.Entries])(entry)
          color = appearance.color
          opacity = appearance.opacity
        }

        // "this" in the context is a selected DOM element. If you see an error below, everything is fine
        // "this as string" - is just a trick to bypass WebStorm types check
        const element = select(this as string)
        element.attr('fill', color)
        element.attr('opacity', opacity)
      })

    eventBus.emit(renderEvents.RENDER_GRID_END)

    if (storage.entries.length) {
      eventBus.emit(renderEvents.RENDER_X_HISTOGRAM_START)
      this.horizontalHistogram.render()
      eventBus.emit(renderEvents.RENDER_X_HISTOGRAM_END)

      eventBus.emit(renderEvents.RENDER_Y_HISTOGRAM_START)
      this.verticalHistogram.render()
      eventBus.emit(renderEvents.RENDER_Y_HISTOGRAM_END)
    }

    eventBus.emit(renderEvents.RENDER_X_DESCRIPTION_BLOCK_START)
    this.horizontalDescriptionBlock.render()
    eventBus.emit(renderEvents.RENDER_X_DESCRIPTION_BLOCK_END)

    eventBus.emit(renderEvents.RENDER_Y_DESCRIPTION_BLOCK_START)
    this.verticalDescriptionBlock.render()
    eventBus.emit(renderEvents.RENDER_Y_DESCRIPTION_BLOCK_END)

    this.defineCrosshairBehaviour()

    this.resizeSvg()
  }

  /**
   * Render function ensures presentation matches the data. Called after modifying data.
   */
  public update(x: ScaleBand<string>, y: ScaleBand<string>) {
    this.computeCoordinates()
    this.createRowMap()

    this.x = x
    this.y = y

    this.row.selectAll('text').attr('style', () => {
      if (this.cellHeight < storage.minCellHeight) {
        return 'display: none;'
      } else {
        return ''
      }
    })

    this.row
      .attr('transform', (row: IRow) => {
        return 'translate( 0, ' + row.y + ')'
      })

    this.container
      .selectAll(`.${storage.prefix}sortable-rect`)
      .attr('d', (obs: IEntry) => {
        return this.getRectangularPath(obs)
      })

    this.horizontalDescriptionBlock.update(storage.columns as IDomainEntity[])
    this.verticalDescriptionBlock.update(storage.rows as IDomainEntity[])
    this.horizontalHistogram.update(storage.columns as IDomainEntity[])
    this.verticalHistogram.update(storage.rows as IDomainEntity[])
  }


  /**
   * Updates coordinate system and renders the lines of the grid.
   */
  private computeCoordinates() {
    this.cellWidth = this.width / storage.columns.length

    this.column?.remove()

    if (this.drawGridLines) {
      this.column = this.gridContainer.selectAll(`.${storage.prefix}column-column`)
        .data(storage.columns)
        .enter()
        .append('line')
        .attr('x1', (column: IColumn) => column.x)
        .attr('x2', (column: IColumn) => column.x)
        .attr('y1', 0)
        .attr('y2', this.height)
        .attr('class', `${storage.prefix}column-column`)
        .style('pointer-events', 'none')
    }

    this.cellHeight = this.height / storage.rows.length
    this.row?.remove()

    this.row = this.gridContainer.selectAll(`.${storage.prefix}row-row`)
      .data(storage.rows)
      .enter()
      .append('g')
      .attr('class', `${storage.prefix}row-row`)
      .attr('transform', (row: IRow) => {
        return 'translate(0,' + row.y + ')'
      })

    if (this.drawGridLines) {
      this.row.append('line')
        .attr('x2', this.width)
        .style('pointer-events', 'none')
    }

    this.row
      .append('text')
      .attr('class', (row: IRow) => {
        return `${storage.prefix}${row.id}-label ${storage.prefix}row-label ${storage.prefix}label-text-font`
      })
      .attr('data-row', (row: IRow) => row.id)
      .attr('x', -8)
      .attr('y', this.cellHeight / 2)
      .attr('dy', '.32em')
      .attr('text-anchor', 'end')
      .attr('style', () => {
        if (this.cellHeight < storage.minCellHeight) {
          return 'display: none;'
        } else {
          return ''
        }
      })
      .text((row: IRow) => {
        return row.symbol
      })
      .on('mouseover', (event: IEnhancedEvent) => {
        const target = event.target
        const rowId = target.dataset.row
        if (!rowId) {
          return
        }
        eventBus.emit(publicEvents.GRID_LABEL_HOVER, {
          target,
          rowId,
        })
      })
      .on('click', (event: IEnhancedEvent) => {
        const target = event.target
        const rowId = target.dataset.row
        if (!rowId) {
          return
        }
        storage.sortColumns('countByRow', parseInt(rowId))
        eventBus.emit(innerEvents.INNER_UPDATE, false)
        eventBus.emit(publicEvents.GRID_LABEL_CLICK, {
          target,
          rowId,
        })
      })
  }

  private initDimensions(width?: number, height?: number) {
    if (width !== undefined) {
      this.width = width
    }
    if (height !== undefined) {
      this.height = height
    }

    this.cellWidth = this.width / storage.columns.length
    this.cellHeight = this.height / storage.rows.length

    if (this.cellHeight < storage.minCellHeight) {
      this.cellHeight = storage.minCellHeight
      this.height = storage.rows.length * storage.minCellHeight
    }
  }

  public resize(width: number, height: number, x: ScaleBand<string>, y: ScaleBand<string>) {
    this.createRowMap()

    this.x = x
    this.y = y

    this.initDimensions(width, height)

    this.background
      .attr('width', this.width)
      .attr('height', this.height)

    this.computeCoordinates()

    if (storage.entries.length) {
      this.horizontalHistogram.resize(width, this.height)
      this.verticalHistogram.resize(width, this.height)
    }
    const histogramHeight = this.horizontalHistogram.getHistogramHeight()
    this.horizontalDescriptionBlock.resize(width, this.height, this.height)
    this.verticalDescriptionBlock.resize(width, this.height, this.width + histogramHeight + 120)

    this.resizeSvg()
    this.update(this.x, this.y)

    this.verticalCross.attr('y2', this.height + this.horizontalDescriptionBlock.height)
    this.horizontalCross.attr('x2', this.width + histogramHeight + this.verticalDescriptionBlock.height)
  }

  private resizeSvg() {
    const histogramHeight = this.horizontalHistogram.getHistogramHeight()
    const width = this.margin.left + this.leftTextWidth + this.width + histogramHeight + this.verticalDescriptionBlock.height + this.margin.right
    const height = this.margin.top + 10 + histogramHeight + 10 + this.height + this.horizontalDescriptionBlock.height + this.margin.bottom

    this.svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)

    this.container
      .attr('transform', 'translate(' +
        (this.margin.left + this.leftTextWidth) + ',' +
        (this.margin.top + histogramHeight + 10) +
        ')')
  }

  private defineCrosshairBehaviour() {
    const moveCrossHair = (eventType: string, event: IEnhancedEvent) => {
      if (this.crosshair) {
        const coord = pointer(event, event.target)

        this.verticalCross.attr('x1', coord[0]).attr('opacity', 1)
        this.verticalCross.attr('x2', coord[0]).attr('opacity', 1)
        this.horizontalCross.attr('y1', coord[1]).attr('opacity', 1)
        this.horizontalCross.attr('y2', coord[1]).attr('opacity', 1)

        if (eventType === 'mousemove' && this.selectionRegion !== undefined) {
          this.changeSelection(coord)
        }

        const xIndex = this.width < coord[0] ? -1 : this.getIndexFromScaleBand(this.x, coord[0])
        const yIndex = this.height < coord[1] ? -1 : this.getIndexFromScaleBand(this.y, coord[1])

        const column = storage.columns[xIndex]
        const row = storage.rows[yIndex]

        if (!column || !row) {
          return
        }

        if (eventType === 'mouseover') {
          eventBus.emit(publicEvents.GRID_CROSSHAIR_HOVER, {
            target: event.target,
            columnId: column.id,
            rowId: row.id,
          })
        }
      }
    }

    const histogramHeight = this.horizontalHistogram.getHistogramHeight()

    this.verticalCross = this.container.append('line')
      .attr('class', `${storage.prefix}vertical-cross`)
      .attr('y1', -histogramHeight)
      .attr('y2', this.height + this.horizontalDescriptionBlock.height)
      .attr('opacity', 0)
      .attr('style', 'pointer-events: none')

    this.horizontalCross = this.container.append('line')
      .attr('class', `${storage.prefix}horizontal-cross`)
      .attr('x1', 0)
      .attr('x2', this.width + histogramHeight + this.verticalDescriptionBlock.height)
      .attr('opacity', 0)
      .attr('style', 'pointer-events: none')

    this.container
      .on('mousedown', (event: IEnhancedEvent) => {
        this.startSelection(event)
      })
      .on('mouseover', (event: IEnhancedEvent) => {
        moveCrossHair('mouseover', event)
      })
      .on('mousemove', (event: IEnhancedEvent) => {
        moveCrossHair('mousemove', event)
      })
      .on('mouseout', () => {
        if (this.crosshair) {
          this.verticalCross.attr('opacity', 0)
          this.horizontalCross.attr('opacity', 0)

          eventBus.emit(publicEvents.GRID_CROSSHAIR_OUT)
        }
      })
      .on('mouseup', (event: IEnhancedEvent) => {
        this.verticalCross.attr('opacity', 0)
        this.horizontalCross.attr('opacity', 0)
        this.finishSelection(event)
      })
  }

  /**
   * Event behavior when pressing down on the mouse to make a selection
   */
  private startSelection(event: IEnhancedEvent) {
    if (this.crosshair && this.selectionRegion === undefined) {
      event.stopPropagation()
      const coord = pointer(event, event.target)
      eventBus.emit(publicEvents.GRID_SELECTION_STARTED, {
        target: event.target,
        x: coord[0],
        y: coord[1],
      })

      this.selectionRegion = this.container.append('rect')
        .attr('x', coord[0])
        .attr('y', coord[1])
        .attr('width', 1)
        .attr('height', 1)
        .attr('class', `${storage.prefix}selection-region`)
        .attr('stroke', 'black')
        .attr('stroke-width', '2')
        .attr('opacity', 0.2)
    }
  }

  /**
   * Event behavior as you drag selected region around
   */
  private changeSelection(coord: number[]) {
    const rect = {
      x: parseInt(this.selectionRegion.attr('x'), 10),
      y: parseInt(this.selectionRegion.attr('y'), 10),
      width: parseInt(this.selectionRegion.attr('width'), 10),
      height: parseInt(this.selectionRegion.attr('height'), 10),
    }

    const move = {
      x: coord[0] - Number(this.selectionRegion.attr('x')),
      y: coord[1] - Number(this.selectionRegion.attr('y')),
    }

    if (move.x < 1 || (move.x * 2 < rect.width)) {
      rect.x = coord[0]
      rect.width -= move.x
    } else {
      rect.width = move.x
    }

    if (move.y < 1 || (move.y * 2 < rect.height)) {
      rect.y = coord[1]
      rect.height -= move.y
    } else {
      rect.height = move.y
    }

    this.selectionRegion.attr('x', rect.x)
    this.selectionRegion.attr('y', rect.y)
    this.selectionRegion.attr('width', rect.width)
    this.selectionRegion.attr('height', rect.height)
  }

  private getIndexFromScaleBand(scaleBand: ScaleBand<string>, coord: number) {
    const step = scaleBand.step()
    const index = Math.floor(coord / step)
    return scaleBand.domain()[index]
  }

  /**
   * Event behavior when releasing mouse when finishing with a selection
   */
  private finishSelection(event: IEnhancedEvent) {
    if (this.crosshair && this.selectionRegion !== undefined) {
      event.stopPropagation()

      const x1 = Number(this.selectionRegion.attr('x'))
      const x2 = x1 + Number(this.selectionRegion.attr('width'))

      const y1 = Number(this.selectionRegion.attr('y'))
      const y2 = y1 + Number(this.selectionRegion.attr('height'))

      const xStart = this.getIndexFromScaleBand(this.x, x1)
      const xStop = this.getIndexFromScaleBand(this.x, x2)

      const yStart = this.getIndexFromScaleBand(this.y, y1)
      const yStop = this.getIndexFromScaleBand(this.y, y2)

      this.sliceColumns(parseInt(xStart), parseInt(xStop))
      this.sliceRows(parseInt(yStart), parseInt(yStop))

      this.selectionRegion.remove()
      delete this.selectionRegion

      eventBus.emit(publicEvents.GRID_SELECTION_FINISHED, {
        target: event.target,
        x: x2,
        y: y2,
      })
      eventBus.emit(innerEvents.INNER_UPDATE, true)
    }
  }

  /**
   * Used when resizing grid
   * @param start - start index of the selection
   * @param stop - end index of the selection
   */
  private sliceRows(start: number, stop: number) {
    for (let i = 0; i < storage.rows.length; i++) {
      const row = storage.rows[i]
      if (i < start || i > stop) {
        selectAll(`.${storage.prefix}${row.id}-cell`).remove()
        selectAll(`.${storage.prefix}${row.id}-bar`).remove()
        storage.rows.splice(i, 1)
        i--
        start--
        stop--
      }
    }
  }

  /**
   * Used when resizing grid
   * @param start - start index of the selection
   * @param stop - end index of the selection
   */
  private sliceColumns(start: number, stop: number) {
    for (let i = 0; i < storage.columns.length; i++) {
      const column = storage.columns[i]
      if (i < start || i > stop) {
        selectAll(`.${storage.prefix}${column.id}-cell`).remove()
        selectAll(`.${storage.prefix}${column.id}-bar`).remove()
        storage.columns.splice(i, 1)
        i--
        start--
        stop--
      }
    }
  }

  private createRowMap() {
    const rowMap = {}
    for (const row of storage.rows) {
      rowMap[row.id] = row
    }
    this.rowMap = rowMap
  }

  /**
   * Function that determines the y position of a mutation within a cell
   */
  private getY({id, rowId, columnId}: IEntry): number {
    const y = this.rowMap[rowId].y ?? 0
    if (this.heatMap) {
      return y
    }
    const obs = storage.lookupTable[columnId][rowId]
    if (obs.length === 0) {
      return y
    }
    return y + this.cellHeight / obs.length * obs.indexOf(id)
  }

  /**
   * Function that determines the x position of a mutation
   */
  private getCellX(entry: IEntry): number {
    return storage.lookupTable[entry.columnId].x ?? 0
  }

  /**
   * Returns the height of an entry cell.
   * @returns {number}
   */
  private getHeight({columnId, rowId}: IEntry): number {
    const height = this.cellHeight ?? 0
    if (this.heatMap) {
      return height
    }
    const count = storage.lookupTable[columnId][rowId].length
    if (count === 0) {
      return height
    }

    return height / count
  }

  /**
   * Returns the correct entry value based on the data type.
   */
  private getValueByType(entry: IEntry) {
    return entry.value ?? ''
  }

  /**
   * Returns rectangular path based on cell dimensions
   */
  private getRectangularPath(entry: IEntry) {
    const x1 = this.getCellX(entry)
    const y1 = this.getY(entry)
    return 'M ' + x1 + ' ' + y1 + ' H ' + (x1 + this.cellWidth) + ' V ' + (y1 + this.getHeight(entry)) + ' H ' + x1 + 'Z'
  }

  /**
   * set the entry rects between heatmap and regular mode.
   */
  public setHeatmap(active: boolean) {
    if (active === this.heatMap) return this.heatMap
    this.heatMap = active
    const heatMapColor = this.heatMapColor

    selectAll(`.${storage.prefix}sortable-rect`)
      .attr('d', (obs: IEntry) => {
        return this.getRectangularPath(obs)
      })
      .each(function (entry: IEntry) {
        let color = heatMapColor
        let opacity = active ? 0.25 : 1
        if (!active) {
          const appearance = (storage.customFunctions[BlockType.Entries])(entry)
          color = appearance.color
          opacity = appearance.opacity
        }

        // "this" in the context is a selected DOM element. If you see an error below, everything is fine
        // "this as string" - is just a trick to bypass WebStorm types check
        const element = select(this as string)
        element.attr('fill', color)
        element.attr('opacity', opacity)
      })

    return this.heatMap
  }

  public setGridLines(active: boolean) {
    if (this.drawGridLines === active) return this.drawGridLines
    this.drawGridLines = active

    this.verticalDescriptionBlock.setGridLines(this.drawGridLines)
    this.horizontalDescriptionBlock.setGridLines(this.drawGridLines)

    this.computeCoordinates()

    return this.drawGridLines
  }

  public setCrosshair(active: boolean) {
    this.crosshair = active

    return this.crosshair
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
  public destroy() {
    this.wrapper.select(`.${storage.prefix}maingrid-svg`).remove()
  }
}

export default MainGrid
