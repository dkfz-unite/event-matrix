import {Selection} from 'd3-selection'
import {storage} from '../../../../utils/storage'

class SideHistogramAxisRender {
  private width = 500
  private height = 80

  private container: Selection<SVGSVGElement, unknown, HTMLElement, unknown>
  private leftAxis: Selection<SVGLineElement, unknown, HTMLElement, unknown>
  private topAxis: Selection<SVGLineElement, unknown, HTMLElement, unknown>
  private topText: Selection<SVGTextElement, unknown, HTMLElement, unknown>
  private middleText: Selection<SVGTextElement, unknown, HTMLElement, unknown>
  private topLabel: Selection<SVGTextElement, unknown, HTMLElement, unknown>
  private label: string

  constructor(width: number, label: string, options: any) {
    this.width = width
    this.height = storage.gridHeight
    this.label = label
  }

  public setContainer(container: Selection<SVGSVGElement, unknown, HTMLElement, unknown>) {
    this.container = container
  }

  public render(topTotal: number) {
    this.draw(topTotal)
  }

  private draw(topTotal: number) {
    this.drawLeftAxis()
    this.drawTopAxis()
    this.drawTopText(topTotal)
    this.drawMiddleText(topTotal)
    this.drawTopLabel()
  }

  private drawLeftAxis() {
    if (!this.leftAxis) {
      this.leftAxis = this.container
        .append('line')
        .attr('class', `${storage.prefix}histogram-axis`)
    }

    this.leftAxis
      .attr('y1', 33)
      .attr('y2', 33 + this.height + 6)
      .attr('x1', 0)
      .attr('x2', 0)
  }

  private drawTopAxis() {
    if (!this.topAxis) {
      this.topAxis = this.container
        .append('line')
        .attr('class', `${storage.prefix}histogram-axis`)
    }

    this.topAxis
      .attr('y1', 33)
      .attr('y2', 33)
      .attr('x1', 0)
      .attr('x2', this.width + 5)
  }

  private drawTopLabel() {
    if (!this.topLabel) {
      this.topLabel = this.container
        .append('text')
        .text(this.label)
        .attr('class', `${storage.prefix}label-text-font`)
        .attr('text-anchor', 'middle')
        .attr('dy', '0')
    }

    this.topLabel
      .attr('x', this.width / 2)
      .attr('y', 10)
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
      .attr('x', this.width)
      .attr('y', 20)
      .text(topTotal)
  }

  private drawMiddleText(topTotal) {
    if (!this.middleText) {
      this.middleText = this.container
        .append('text')
        .attr('class', `${storage.prefix}label-text-font`)
        .attr('dy', '1em')
        .attr('text-anchor', 'end')
    }

    // Round to a nice round number and then adjust position accordingly
    const halfInt = Math.round(topTotal / 2)
    const secondWidth = this.width / 2

    this.middleText
      .attr('x', secondWidth)
      .attr('y', 20)
      .text(halfInt)
  }

  public destroy() {
    this.leftAxis.remove()
    delete this.leftAxis
    this.topAxis.remove()
    delete this.topAxis
    this.topLabel.remove()
    delete this.topLabel
    this.topText.remove()
    delete this.topText
    this.middleText.remove()
    delete this.middleText
  }
}

export default SideHistogramAxisRender
