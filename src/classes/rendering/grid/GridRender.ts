import {select, Selection} from 'd3-selection'
import {IEnhancedEvent, IMatrix} from '../../../interfaces/main-grid.interface'
import {eventBus, innerEvents, publicEvents, renderEvents} from '../../../utils/event-bus'
import {storage} from '../../../utils/storage'
import Processing from '../../data/Processing'
import CrosshairRender from './crosshair/CrosshairRender'
import GridRowsRender from './GridRowsRender'
import GridLinesRender from './lines/GridLinesRender'

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

  constructor(options: any) {
    this.processing = Processing.getInstance()

    this.updateDimensions()
    this.gridLinesRender = new GridLinesRender()
    this.crosshairRender = new CrosshairRender()
    this.gridRowsRender = new GridRowsRender({})
    this.wrapper = select(`#${storage.prefix}grid-container`)
  }

  public updateDimensions() {
    this.initDimensions(storage.gridWidth, storage.gridHeight)
  }

  public render() {
    this.matrix = this.processing.getCroppedMatrix()

    this.prepareContainer()

    eventBus.emit(renderEvents.RENDER_GRID_START)
    this.drawBackground()
    console.log('GridRender:render', this.drawGridLines)
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
      if (this.crosshair) {
        return
      }

      const target = event.target
      const entryId = target.dataset.entry

      if (!entryId) {
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

    eventBus.on(innerEvents.INNER_EVENTS_LOCK, () => {
      const hasClass = this.svg.attr('class').split(' ').includes(`${storage.prefix}maingrid-svg--locked`)
      if (!hasClass) {
        this.svg.attr('class', `${this.svg.attr('class')} ${storage.prefix}maingrid-svg--locked`)
      }
    })
    eventBus.on(innerEvents.INNER_EVENTS_UNLOCK, () => {
      const classes = this.svg.attr('class').split(' ')
      const classIndex = classes.indexOf(`${storage.prefix}maingrid-svg--locked`)
      if (classIndex !== -1) {
        classes.splice(classIndex, 1)
        this.svg.attr('class', classes.join(' '))
      }
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

  public setHeatmap(active: boolean) {
    storage.heatMap = active
    this.render()
  }

  public setGridLines(active: boolean) {
    console.log('GridRender', active)
    this.drawGridLines = active

    this.render()
  }

  public setCrosshair(active: boolean) {
    this.crosshair = active
    // hack, until I find the way to handle entries events while moving the crosshair
    this.crosshairRender.setVisible(active)
    if (active) {
      eventBus.emit(innerEvents.INNER_EVENTS_LOCK)
    } else {
      eventBus.emit(innerEvents.INNER_EVENTS_UNLOCK)
    }
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
