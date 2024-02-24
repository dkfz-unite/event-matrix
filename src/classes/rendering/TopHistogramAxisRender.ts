import {Selection} from 'd3-selection'
import {storage} from '../../utils/storage'

class TopHistogramAxisRender {
  private width = 500
  private height = 80

  private container: Selection<SVGSVGElement, unknown, HTMLElement, unknown>
  private bottomAxis: Selection<SVGLineElement, unknown, HTMLElement, unknown>
  private leftAxis: Selection<SVGLineElement, unknown, HTMLElement, unknown>
  private topText: Selection<SVGTextElement, unknown, HTMLElement, unknown>
  private middleText: Selection<SVGTextElement, unknown, HTMLElement, unknown>
  private leftLabel: Selection<SVGTextElement, unknown, HTMLElement, unknown>
  private label: string

  constructor(width: number, height: number, label: string, options: any) {
    this.width = width
    this.height = height
    this.label = label
  }

  public setContainer(container: Selection<SVGSVGElement, unknown, HTMLElement, unknown>) {
    this.container = container
  }

  public render(topTotal: number) {
    this.draw(topTotal)
  }

  private draw(topTotal: number) {
    this.drawBottomAxis()
    this.drawLeftAxis()
    this.drawTopText(topTotal)
    this.drawMiddleText(topTotal)
    this.drawLeftLabel()
  }

  private drawBottomAxis() {
    if (!this.bottomAxis) {
      this.bottomAxis = this.container
        .append('line')
        .attr('class', `${storage.prefix}histogram-axis`)
    }

    this.bottomAxis
      .attr('y1', this.height + 5)
      .attr('y2', this.height + 5)
      .attr('x1', 80 - 5)
      .attr('x2', this.width + 80)
  }

  private drawLeftAxis() {
    if (!this.leftAxis) {
      this.leftAxis = this.container
        .append('line')
        .attr('class', `${storage.prefix}histogram-axis`)
    }

    this.leftAxis
      .attr('y1', 0)
      .attr('y2', this.height + 5)
      .attr('x1', 80 - 5)
      .attr('x2', 80 - 5)
  }

  private drawLeftLabel() {
    if (!this.leftLabel) {
      this.leftLabel = this.container
        .append('text')
        .text(this.label)
        .attr('class', `${storage.prefix}label-text-font`)
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
    }

    this.leftLabel
      .attr('x', -this.height / 2)
      .attr('y', 80 - 12 - 15)
  }

  private drawTopText(topTotal) {
    if (!this.topText) {
      this.topText = this.container
        .append('text')
        .attr('class', `${storage.prefix}label-text-font`)
        .attr('dy', '1em')
        .attr('text-anchor', 'end')
    }

    this.topText
      .attr('x', 80 - 12)
      .text(topTotal)
  }

  private drawMiddleText(topTotal) {
    if (!this.middleText) {
      this.middleText = this.container
        .append('text')
        .attr('class', `${storage.prefix}label-text-font`)
        .attr('dy', '.32em')
        .attr('text-anchor', 'end')
    }

    // Round to a nice round number and then adjust position accordingly
    const halfInt = Math.round(topTotal / 2)
    const secondHeight = this.height / 2

    this.middleText
      .attr('x', 80 - 12)
      .attr('y', secondHeight)
      .text(halfInt)
  }

  public destroy() {
    this.bottomAxis.remove()
    delete this.bottomAxis
    this.leftAxis.remove()
    delete this.leftAxis
    this.leftLabel.remove()
    delete this.leftLabel
    this.topText.remove()
    delete this.topText
    this.middleText.remove()
    delete this.middleText
  }
}

export default TopHistogramAxisRender
