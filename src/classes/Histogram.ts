import * as d3 from 'd3'
import EventEmitter from 'eventemitter3'
import {Domain, HistogramParams} from '../interfaces/main-grid.interface'
import Storage from '../utils/storage'
import { Selection } from 'd3'

class Histogram extends EventEmitter {
  private lineWidthOffset: number
  private lineHeightOffset: number
  private padding: number
  private centerText: number
  private svg: Selection<any, any, HTMLElement, any>
  private rotated: boolean
  private domain: Domain[]
  private margin: {
    top: number
    right: number
    bottom: number
    left: number
  }
  private width: number
  private height: number
  private histogramWidth: number
  private histogramHeight: number
  private numDomain: number
  private barWidth: number
  private totalHeight: number
  private wrapper: d3.Selection<Element, unknown, Element, unknown>
  private topCount = 1
  private container!: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>
  private histogram!: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>
  private bottomAxis: any
  private leftAxis: any
  private topText: any
  private middleText: any
  private leftLabel: any
  private storage: Storage = Storage.getInstance()

  constructor(params: HistogramParams, svg: Selection<any, any, HTMLElement, any>, rotated?: boolean) {
    super()
    this.lineWidthOffset = params.histogramBorderPadding?.left || 10
    this.lineHeightOffset = params.histogramBorderPadding?.bottom || 5
    this.padding = 20
    this.centerText = -6
    this.svg = svg
    this.rotated = rotated || false
    this.domain = (this.rotated ? params.genes : params.donors) || []
    this.margin = params.margin || {top: 30, right: 15, bottom: 15, left: 80}
    this.width = params.width || 500
    this.height = params.height || 500
    this.histogramWidth = this.rotated ? this.height : this.width
    this.histogramHeight = 80
    this.numDomain = this.domain.length
    this.barWidth = (this.rotated ? this.height : this.width) / this.domain.length
    this.totalHeight = this.histogramHeight + this.lineHeightOffset + this.padding
    this.wrapper = d3.select<Element, unknown>(params.wrapper || 'body')
  }

  public render(): void {
    const topCount = this.getLargestCount(this.domain)
    this.topCount = topCount

    this.container = this.svg.append('g')
      .attr('class', `${this.storage.prefix}histogram`)
      .attr('width', () => {
        if (this.rotated) {
          return this.height
        } else {
          return this.width + this.margin.left + this.margin.right
        }
      })
      .attr('height', this.histogramHeight)
      .style('margin-left', this.margin.left + 'px')
      .attr('transform', () => {
        if (this.rotated) {
          return 'rotate(90)translate(0,-' + (this.width) + ')'
        } else {
          return ''
        }
      })

    this.histogram = this.container.append('g')
      .attr('transform', 'translate(0,-' + (this.totalHeight + this.centerText) + ')')

    this.renderAxis(topCount)

    this.histogram
      .on('mouseover', (event) => {
        const target = event.target
        const domain = this.domain[target.dataset.domainIndex]
        if (!domain) return
        this.emit('histogramMouseOver', {domain: domain})
      })
      .on('mouseout', () => {
        this.emit('histogramMouseOut')
      })
      .on('click', (event) => {
        const target = event.target
        const domain = this.domain[target.dataset.domainIndex]
        if (!domain) return
        this.emit('histogramClick', {
          type: this.rotated ? 'gene' : 'donor',
          domain: domain,
        })
      })

    this.histogram.selectAll('rect')
      .data(this.domain)
      .enter()
      .append('rect')
      .attr('class', (d: Domain) => {
        return `${this.storage.prefix}sortable-bar ${this.storage.prefix}${d.id}-bar`
      })
      .attr('data-domain-index', (d: Domain, i: number) => i)
      .attr('width', this.barWidth - (this.barWidth < 3 ? 0 : 1)) // If bars are small, do not use whitespace.
      .attr('height', (d: Domain) => {
        return this.histogramHeight * d.count / topCount
      })
      .attr('x', (d: Domain) => {
        return this.rotated ? d.y : d.x
      })
      .attr('y', (d: Domain) => {
        return this.histogramHeight - this.histogramHeight * d.count / topCount
      })
      .attr('fill', '#1693C0')
  }

  public update(domain: Domain[]): void {
    this.domain = domain
    this.barWidth = (this.rotated ? this.height : this.width) / this.domain.length

    const topCount = this.topCount || this.getLargestCount(this.domain)

    this.updateAxis(topCount)

    this.histogram.selectAll('rect')
      .data(this.domain)
      .attr('data-domain-index', (d: Domain, i: number) => i)
      .transition()
      .attr('width', this.barWidth - (this.barWidth < 3 ? 0 : 1)) // If bars are small, do not use whitespace.
      .attr('height', (d: Domain) => {
        return this.histogramHeight * d.count / topCount
      })
      .attr('y', (d: Domain) => {
        return this.histogramHeight - this.histogramHeight * d.count / topCount
      })
      .attr('x', (d: Domain) => {
        return this.rotated ? d.y : d.x
      })
  }

  public resize(width: number, height: number): void {
    this.width = width
    this.height = height

    this.histogramWidth = this.rotated ? this.height : this.width
    this.container
      .attr('width', () => {
        if (this.rotated) {
          return this.height
        } else {
          return this.width + this.margin.left + this.margin.right
        }
      })
      .attr('transform', () => {
        if (this.rotated) {
          return 'rotate(90)translate(0,-' + (this.width) + ')'
        } else {
          return ''
        }
      })

    this.histogram
      .attr('transform', 'translate(0,-' + (this.totalHeight + this.centerText) + ')')

    this.bottomAxis.attr('x2', this.histogramWidth + 10)
  }

  private renderAxis(topCount: number): void {
    this.bottomAxis = this.histogram.append('line')
      .attr('class', `${this.storage.prefix}histogram-axis`)

    this.leftAxis = this.histogram.append('line')
      .attr('class', `${this.storage.prefix}histogram-axis`)

    this.topText = this.histogram.append('text')
      .attr('class', `${this.storage.prefix}label-text-font`)
      .attr('dy', '.32em')
      .attr('text-anchor', 'end')

    this.middleText = this.histogram.append('text')
      .attr('class', `${this.storage.prefix}label-text-font`)
      .attr('dy', '.32em')
      .attr('text-anchor', 'end')

    this.leftLabel = this.histogram.append('text')
      .text('Mutation freq.')
      .attr('class', `${this.storage.prefix}label-text-font`)
      .attr('text-anchor', 'middle')
      .attr('rotate', 'rotate(-90)')

    this.updateAxis(topCount)
  }

  private updateAxis(topCount: number): void {
    this.bottomAxis
      .attr('y1', this.histogramHeight + this.lineHeightOffset)
      .attr('y2', this.histogramHeight + this.lineHeightOffset)
      .attr('x2', this.histogramWidth + this.lineWidthOffset)
      .attr('transform', 'translate(-' + this.lineHeightOffset + ',0)')

    this.leftAxis
      .attr('y1', 0)
      .attr('y2', this.histogramHeight + this.lineHeightOffset)
      .attr('transform', 'translate(-' + this.lineHeightOffset + ',0)')

    this.topText
      .attr('x', this.centerText)
      .text(topCount)

    // Round to a nice round number and then adjust position accordingly
    const halfInt = parseInt(String(topCount / 2))
    const secondHeight = this.histogramHeight - this.histogramHeight / (topCount / halfInt)

    this.middleText
      .attr('x', this.centerText)
      .attr('y', secondHeight)
      .text(halfInt)

    this.leftLabel
      .attr({
        x: -this.histogramHeight / 2,
        y: -this.lineHeightOffset - this.padding,
      })
  }

  private getLargestCount(domain: Domain[]): number {
    let retVal = 1

    for (const item of domain) {
      retVal = Math.max(retVal, item.count)
    }

    return retVal
  }

  public destroy(): void {
    this.histogram.remove()
    this.container.remove()
  }
}

export default Histogram
