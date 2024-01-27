import * as d3 from 'd3'
import {Selection} from 'd3'
import {innerEvents} from 'event-matrix/src/utils/event-bus'
import {HistogramParams, IDomainEntity} from '../interfaces/main-grid.interface'
import {eventBus, publicEvents} from '../utils/event-bus'
import {storage} from '../utils/storage'

class Histogram {
  private lineWidthOffset: number
  private lineHeightOffset: number
  private padding = 10
  private centerText = 0
  private svg: Selection<any, any, HTMLElement, any>
  private rotated: boolean
  private domain: IDomainEntity[]
  private margin: {
    top: number
    right: number
    bottom: number
    left: number
  }
  private width: number
  private height: number
  private histogramWidth: number
  private histogramHeight = 80
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

  constructor(params: HistogramParams, svg: Selection<any, any, HTMLElement, any>, rotated?: boolean) {
    this.lineWidthOffset = params.histogramBorderPadding?.left || 10
    this.lineHeightOffset = params.histogramBorderPadding?.bottom || 5
    this.svg = svg
    this.rotated = rotated || false
    this.domain = (this.rotated ? storage.genes : storage.donors) as IDomainEntity[]
    this.margin = params.margin || {top: 15, right: 15, bottom: 15, left: 80}
    this.width = params.width || 500
    this.height = params.height || 500
    this.histogramWidth = this.rotated ? this.height : this.width
    this.numDomain = this.domain.length
    this.barWidth = (this.rotated ? this.height : this.width) / this.domain.length

    console.log(this.histogramHeight, this.lineHeightOffset, this.padding)
    this.totalHeight = this.histogramHeight + this.lineHeightOffset + this.padding
    this.wrapper = d3.select<Element, unknown>(params.wrapper || 'body')
  }

  public getHistogramHeight() {
    return this.totalHeight
  }

  public render(): void {
    const topCount = this.getLargestCount(this.domain)
    this.topCount = topCount

    this.container = this.svg.append('g')
      .attr('class', `${storage.prefix}histogram`)
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

    console.log(this.totalHeight, this.centerText)
    this.histogram = this.container.append('g')
      .attr('transform', 'translate(0,-' + (this.totalHeight + this.centerText) + ')')

    this.renderAxis(topCount)

    this.histogram
      .on('mouseover', (event) => {
        const target = event.target
        const domain = this.domain[target.dataset.domainIndex]
        if (!domain) return
        eventBus.emit(publicEvents.HISTOGRAM_HOVER, {
          domainId: domain.id,
          type: this.rotated ? 'gene' : 'donor',
          target,
        })
      })
      .on('mouseout', () => {
        eventBus.emit(publicEvents.HISTOGRAM_OUT)
      })
      .on('click', (event) => {
        const target = event.target
        const domain = this.domain[target.dataset.domainIndex]
        if (!domain) {
          return
        }
        if (this.rotated) {
          storage.sortDonors('countByGene', domain.id)
        } else {
          storage.sortGenes('countByDonor', domain.id)
        }
        eventBus.emit(innerEvents.INNER_UPDATE, false)
        eventBus.emit(publicEvents.HISTOGRAM_CLICK, {
          type: this.rotated ? 'gene' : 'donor',
          domainId: domain.id,
          target,
        })
      })

    this.histogram.selectAll('rect')
      .data(this.domain)
      .enter()
      .append('rect')
      .attr('class', (d: IDomainEntity) => {
        return `${storage.prefix}sortable-bar ${storage.prefix}${d.id}-bar`
      })
      .attr('data-domain-index', (d: IDomainEntity, i: number) => i)
      .attr('width', this.barWidth - (this.barWidth < 3 ? 0 : 1)) // If bars are small, do not use whitespace.
      .attr('height', (d: IDomainEntity) => {
        return this.histogramHeight * d.count / topCount
      })
      .attr('x', (d: IDomainEntity) => {
        return this.rotated ? d.y : d.x
      })
      .attr('y', (d: IDomainEntity) => {
        return this.histogramHeight - this.histogramHeight * d.count / topCount
      })
      .attr('fill', '#1693C0')
  }

  public update(domain: IDomainEntity[]): void {
    this.domain = domain
    this.barWidth = (this.rotated ? this.height : this.width) / this.domain.length

    const topCount = this.topCount || this.getLargestCount(this.domain)

    this.updateAxis(topCount)

    this.histogram.selectAll('rect')
      .data(this.domain)
      .attr('data-domain-index', (d: IDomainEntity, i: number) => i)
      .transition()
      .attr('width', this.barWidth - (this.barWidth < 3 ? 0 : 1)) // If bars are small, do not use whitespace.
      .attr('height', (d: IDomainEntity) => {
        return this.histogramHeight * d.count / topCount
      })
      .attr('y', (d: IDomainEntity) => {
        return this.histogramHeight - this.histogramHeight * d.count / topCount
      })
      .attr('x', (d: IDomainEntity) => {
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
      .attr('class', `${storage.prefix}histogram-axis`)

    this.leftAxis = this.histogram.append('line')
      .attr('class', `${storage.prefix}histogram-axis`)

    this.topText = this.histogram.append('text')
      .attr('class', `${storage.prefix}label-text-font`)
      .attr('dy', '.32em')
      .attr('text-anchor', 'end')

    this.middleText = this.histogram.append('text')
      .attr('class', `${storage.prefix}label-text-font`)
      .attr('dy', '.32em')
      .attr('text-anchor', 'end')

    this.leftLabel = this.histogram.append('text')
      .text('Mutation freq.')
      .attr('class', `${storage.prefix}label-text-font`)
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('x', '-40')
      .attr('y', '-25')

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

  private getLargestCount(domain: IDomainEntity[]): number {
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
