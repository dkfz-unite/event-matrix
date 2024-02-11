import {Selection} from 'd3-selection'
import {storage} from '../../utils/storage'
import Processing from '../data/Processing'

class GridLinesRender {
  container: Selection<SVGGElement, unknown, HTMLElement, unknown>
  processing: Processing
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
      this.container
        .append('line')
        .attr('x1', i * storage.cellWidth)
        .attr('x2', i * storage.cellWidth)
        .attr('y1', 0)
        .attr('y2', this.height)
        .attr('class', `${storage.prefix}column-column ${storage.prefix}gridlines__column ${storage.prefix}gridlines-column`)
        .style('pointer-events', 'none')
    }
    for (let i = 0; i < this.processing.rows.length; i++) {
      this.container
        .append('line')
        .attr('x1', 0)
        .attr('x2', this.width)
        .attr('y1', i * storage.cellHeight)
        .attr('y2', i * storage.cellHeight)
        .attr('class', `${storage.prefix}gridlines__row ${storage.prefix}gridlines-row`)
        .style('pointer-events', 'none')
    }
  }

  destroy() {
    this.container.selectAll(`.${storage.prefix}gridlines__column`).remove()
    this.container.selectAll(`.${storage.prefix}gridlines__row`).remove()
  }
}

export default GridLinesRender
