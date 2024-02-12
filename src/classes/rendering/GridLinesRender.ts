import {Selection} from 'd3-selection'
import {storage} from '../../utils/storage'
import Processing from '../data/Processing'

class GridLinesRender {
  container: Selection<SVGGElement, unknown, HTMLElement, unknown>
  processing: Processing
  lines: Selection<SVGLineElement, unknown, HTMLElement, unknown>[] = []
  columns: Selection<SVGLineElement, unknown, HTMLElement, unknown>[] = []
  width: number
  height: number

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
    this.processing = Processing.getInstance()
  }

  public setContainer(container: Selection<SVGGElement, unknown, HTMLElement, unknown>) {
    this.container = container
  }

  public render() {
    for (let i = 0; i < this.processing.columns.length; i++) {
      let column = this.columns[i]
      if (!column) {
        column = this.container
          .append('line')
          .attr('x1', i * storage.cellWidth)
          .attr('x2', i * storage.cellWidth)
          .attr('y1', 0)
          .attr('y2', this.height)
          .attr('class', `${storage.prefix}column-column ${storage.prefix}gridlines__column ${storage.prefix}gridlines-column`)
          .style('pointer-events', 'none')
        this.columns.push(column)
      } else {
        column
          .attr('x1', i * storage.cellWidth)
          .attr('x2', i * storage.cellWidth)
          .attr('y2', this.height)
      }
    }
    if (this.processing.columns.length < this.columns.length) {
      for (let i = this.processing.columns.length - 1; i < this.columns.length; i++) {
        this.columns[i].remove()
      }
      this.columns.splice(this.processing.columns.length - 1, this.columns.length - this.processing.columns.length)
    }

    for (let i = 0; i < this.processing.rows.length; i++) {
      let line = this.lines[i]
      if (!line) {
        line = this.container
          .append('line')
          .attr('x1', 0)
          .attr('x2', this.width)
          .attr('y1', i * storage.cellHeight)
          .attr('y2', i * storage.cellHeight)
          .attr('class', `${storage.prefix}gridlines__row ${storage.prefix}gridlines-row`)
          .style('pointer-events', 'none')
        this.lines.push(line)
      } else {
        line
          .attr('x2', this.width)
          .attr('y1', i * storage.cellHeight)
          .attr('y2', i * storage.cellHeight)
      }
    }
    if (this.processing.rows.length < this.lines.length) {
      for (let i = this.processing.rows.length - 1; i < this.lines.length; i++) {
        this.lines[i].remove()
      }
      this.lines.splice(this.processing.rows.length - 1, this.lines.length - this.processing.rows.length)
    }
  }

  destroy() {
    this.container.selectAll(`.${storage.prefix}gridlines__column`).remove()
    this.container.selectAll(`.${storage.prefix}gridlines__row`).remove()
  }
}

export default GridLinesRender
