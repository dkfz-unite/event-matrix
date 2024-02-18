import {pointer, Selection} from 'd3-selection'
import {IEnhancedEvent} from '../../interfaces/main-grid.interface'
import {eventBus, innerEvents, publicEvents} from '../../utils/event-bus'
import {storage} from '../../utils/storage'
import Processing from '../data/Processing'

class CrosshairRender {
  private container: Selection<SVGGElement, unknown, HTMLElement, unknown>
  private processing: Processing

  private width: number
  private height: number
  private visible: boolean

  private verticalCross: Selection<SVGLineElement, unknown, HTMLElement, unknown>
  private horizontalCross: Selection<SVGLineElement, unknown, HTMLElement, unknown>
  private selectionRegion: Selection<SVGRectElement, unknown, HTMLElement, unknown>

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
    this.processing = Processing.getInstance()
  }

  public setContainer(container: Selection<SVGGElement, unknown, HTMLElement, unknown>) {
    this.container = container
  }

  private moveCrossHair(eventType: string, event: IEnhancedEvent) {
    if (!this.visible) {
      return
    }

    const coord = pointer(event, event.target)

    this.verticalCross.attr('x1', coord[0]).attr('opacity', 1)
    this.verticalCross.attr('x2', coord[0]).attr('opacity', 1)
    this.horizontalCross.attr('y1', coord[1]).attr('opacity', 1)
    this.horizontalCross.attr('y2', coord[1]).attr('opacity', 1)

    if (eventType === 'mousemove' && this.selectionRegion !== undefined) {
      this.changeSelection(coord)
    }

    const columnIndex = Math.min(coord[0] / storage.cellWidth)
    const rowIndex = Math.min(coord[1] / storage.cellHeight)
    if (columnIndex > this.processing.columns.length || rowIndex > this.processing.rows.length) {
      return
    }

    const column = this.processing.columns[columnIndex]
    const row = this.processing.rows[rowIndex]

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

  public setVisible(visible: boolean) {
    this.visible = visible
  }

  public render() {
    this.verticalCross = this.container.append('line')
      .attr('class', `${storage.prefix}vertical-cross`)
      .attr('y1', 0)
      .attr('y2', this.height)
      .attr('opacity', 0)
      .attr('style', 'pointer-events: none')

    this.horizontalCross = this.container.append('line')
      .attr('class', `${storage.prefix}horizontal-cross`)
      .attr('x1', 0)
      .attr('x2', this.width)
      .attr('opacity', 0)
      .attr('style', 'pointer-events: none')

    this.container
      .on('mousedown', (event: IEnhancedEvent) => {
        this.startSelection(event)
      })
      .on('mouseover', (event: IEnhancedEvent) => {
        this.moveCrossHair('mouseover', event)
      })
      .on('mousemove', (event: IEnhancedEvent) => {
        this.moveCrossHair('mousemove', event)
      })
      .on('mouseout', () => {
        if (this.visible) {
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
    if (!this.visible || this.selectionRegion !== undefined) {
      return
    }

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

  /**
   * Event behavior when releasing mouse when finishing with a selection
   */
  private finishSelection(event: IEnhancedEvent) {
    if (!this.visible || this.selectionRegion === undefined) {
      return
    }
    event.stopPropagation()

    const x1 = Number(this.selectionRegion.attr('x'))
    const x2 = x1 + Number(this.selectionRegion.attr('width'))

    const y1 = Number(this.selectionRegion.attr('y'))
    const y2 = y1 + Number(this.selectionRegion.attr('height'))

    const columnIndexStart = Math.floor(x1 / storage.cellWidth)
    const columnIndexEnd = Math.floor(x2 / storage.cellWidth)
    const rowIndexStart = Math.floor(y1 / storage.cellHeight)
    const rowIndexEnd = Math.floor(y2 / storage.cellHeight)

    this.processing.getFrame().setSizes([columnIndexStart, columnIndexEnd], [rowIndexStart, rowIndexEnd])

    this.selectionRegion.remove()
    delete this.selectionRegion

    eventBus.emit(publicEvents.GRID_SELECTION_FINISHED, {
      target: event.target,
      x: x2,
      y: y2,
    })
    eventBus.emit(innerEvents.INNER_UPDATE, true)
  }

  destroy() {
    if (this.selectionRegion !== undefined) {
      this.selectionRegion.remove()
      delete this.selectionRegion
    }
    if (this.verticalCross) {
      this.verticalCross.remove()
      delete this.verticalCross
    }
    if (this.horizontalCross) {
      this.horizontalCross.remove()
      delete this.horizontalCross
    }
    this.container.on('mousedown', null)
    this.container.on('mouseover', null)
    this.container.on('mousemove', null)
    this.container.on('mouseout', null)
    this.container.on('mouseup', null)
  }
}

export default CrosshairRender
