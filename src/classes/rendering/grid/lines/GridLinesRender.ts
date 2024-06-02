import {Selection} from 'd3-selection'
import {storage} from '../../../../utils/storage'
import Processing from '../../../data/Processing'

class GridLinesRender {
  container: Selection<SVGGElement, unknown, HTMLElement, unknown>
  processing: Processing
  lines: Selection<SVGLineElement, unknown, HTMLElement, unknown>[] = []
  columns: Selection<SVGLineElement, unknown, HTMLElement, unknown>[] = []
  width: number
  height: number

  constructor() {
    this.width = storage.gridWidth
    this.height = storage.gridHeight
    this.processing = Processing.getInstance()
  }

  public setContainer(container: Selection<SVGGElement, unknown, HTMLElement, unknown>) {
    this.container = container
  }

  public render() {
    const matrix = this.processing.getCroppedMatrix()
    const columnsCount = matrix.length > 0 ? matrix[0].columns.length : 0
    const rowsCount = matrix.length
    // console.log('draw some columns. Before:')
    // console.log([...this.columns])
    for (let i = 0; i < columnsCount; i++) {
      let column = this.columns[i]
      if (!column) {
        column = this.container
          .append('line')
          .attr('id', `grid-column-${i}`)
          .attr('x1', 0)
          .attr('x2', 0)
          .attr('style', `transform:translateX(${i * storage.cellWidth}px)`)
          .attr('y1', 0)
          .attr('y2', this.height)
          .attr('class', `${storage.prefix}column-column ${storage.prefix}gridlines__column ${storage.prefix}gridlines-column`)
          .attr('data-num', i)
          .style('pointer-events', 'none')
        this.columns.push(column)
      } else {
        column
          .attr('style', `transform:translateX(${i * storage.cellWidth}px)`)
          .attr('y2', this.height)
      }
    }
    // console.log('draw some columns. After:')
    // console.log([...this.columns])
    // console.log(columnsCount)
    if (columnsCount < this.columns.length) {
      for (let i = columnsCount; i < this.columns.length; i++) {
        // console.log(`remove obsolete column ${i}: `, JSON.stringify(this.columns[i]))
        this.columns[i].remove()
      }
      // console.log(`splice ${this.columns.length - columnsCount} from ${columnsCount}`)
      this.columns.splice(columnsCount, this.columns.length - columnsCount)
    }
    // console.log([...this.columns])

    for (let i = 0; i < rowsCount; i++) {
      let line = this.lines[i]
      if (!line) {
        line = this.container
          .append('line')
          .attr('id', `grid-row-${i}`)
          .attr('x1', 0)
          .attr('x2', this.width)
          .attr('y1', 0)
          .attr('y2', 0)
          .attr('style', `transform:translateY(${i * storage.cellHeight}px)`)
          .attr('class', `${storage.prefix}gridlines__row ${storage.prefix}gridlines-row`)
          .attr('data-num', i)
          .style('pointer-events', 'none')
        this.lines.push(line)
      } else {
        line
          .attr('x2', this.width)
          .attr('style', `transform:translateY(${i * storage.cellHeight}px)`)
        // .attr('y1', i * storage.cellHeight)
        // .attr('y2', i * storage.cellHeight)
      }
    }
    if (rowsCount < this.lines.length) {
      for (let i = rowsCount; i < this.lines.length; i++) {
        this.lines[i].remove()
      }
      this.lines.splice(rowsCount, this.lines.length - rowsCount)
    }
  }

  destroy() {
    this.columns = []
    this.lines = []
    this.container.selectAll(`.${storage.prefix}gridlines__column`).remove()
    this.container.selectAll(`.${storage.prefix}gridlines__row`).remove()
  }
}

export default GridLinesRender
