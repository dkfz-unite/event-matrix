import {select, Selection} from 'd3-selection'
import {BlockType} from '../interfaces/base.interface'
import {HistogramParams, IDomainEntity} from '../interfaces/main-grid.interface'
import {eventBus, innerEvents, publicEvents} from '../utils/event-bus'
import {storage} from '../utils/storage'

class Histogram {
  private readonly lineWidthOffset: number
  private readonly lineHeightOffset: number
  private padding = 10
  private centerText = -10
  private svg: Selection<SVGGElement, unknown, HTMLElement, unknown>
  private readonly rotated: boolean
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
  private readonly totalHeight: number
  private wrapper: Selection<Element, unknown, Element, unknown>
  private topCount = 1
  private container: Selection<SVGGElement, unknown, HTMLElement, unknown> | null = null
  private histogram: Selection<SVGGElement, unknown, HTMLElement, unknown>
  private bottomAxis: Selection<SVGLineElement, unknown, HTMLElement, unknown>
  private leftAxis: Selection<SVGLineElement, unknown, HTMLElement, unknown>
  private topText: Selection<SVGTextElement, unknown, HTMLElement, unknown>
  private middleText: Selection<SVGTextElement, unknown, HTMLElement, unknown>
  private leftLabel: Selection<SVGTextElement, unknown, HTMLElement, unknown>

  constructor(params: HistogramParams, svg: Selection<SVGGElement, unknown, HTMLElement, unknown>, rotated?: boolean) {
    this.lineWidthOffset = params.histogramBorderPadding?.left || 10
    this.lineHeightOffset = params.histogramBorderPadding?.bottom || 5
    this.svg = svg
    this.rotated = rotated || false
    this.domain = (this.rotated ? storage.rows : storage.columns) as IDomainEntity[]
    this.margin = params.margin || {top: 15, right: 15, bottom: 15, left: 80}
    this.width = params.width || 500
    this.height = params.height || 500
    this.histogramWidth = this.rotated ? this.height : this.width
    this.numDomain = this.domain.length
    this.barWidth = (this.rotated ? this.height : this.width) / this.domain.length

    this.totalHeight = this.histogramHeight + this.lineHeightOffset + this.padding
    this.wrapper = select<Element, unknown>(params.wrapper || 'body')
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

    this.histogram = this.container.append('g')
      .attr('transform', 'translate(0,-' + (this.totalHeight + this.centerText) + ')')

    this.renderAxis(topCount)

    this.histogram
      .on('mouseover', (event) => {
        const target = event.target
        const domain = this.domain[target.dataset.domainIndex]
        if (!domain) return
        eventBus.emit(publicEvents.HISTOGRAM_HOVER, {
          target,
          domainId: domain.id,
          type: this.rotated ? BlockType.Rows : BlockType.Columns,
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
          storage.sortColumns('countByRow', domain.id)
        } else {
          storage.sortRows('countByColumn', domain.id)
        }
        eventBus.emit(innerEvents.INNER_UPDATE, false)
        eventBus.emit(publicEvents.HISTOGRAM_CLICK, {
          target,
          domainId: domain.id,
          type: this.rotated ? BlockType.Rows : BlockType.Columns,
        })
      })

    this.histogram.selectAll('rect')
      .data(this.domain)
      .enter()
      .append('rect')
      .attr('class', (domain: IDomainEntity) => {
        return `${storage.prefix}sortable-bar ${storage.prefix}${domain.id}-bar`
      })
      .attr('data-domain-index', (domain: IDomainEntity, i: number) => i)
      .attr('width', this.barWidth - (this.barWidth < 3 ? 0 : 1)) // If bars are small, do not use whitespace.
      .attr('height', (domain: IDomainEntity) => {
        return this.histogramHeight * domain.count / topCount
      })
      .attr('x', (domain: IDomainEntity) => {
        return this.rotated ? domain.y : domain.x
      })
      .attr('y', (domain: IDomainEntity) => {
        return this.histogramHeight - this.histogramHeight * domain.count / topCount
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
      .attr('data-domain-index', (domain: IDomainEntity, i: number) => i)
      .attr('width', this.barWidth - (this.barWidth < 3 ? 0 : 1)) // If bars are small, do not use whitespace.
      .attr('height', (domain: IDomainEntity) => {
        return this.histogramHeight * domain.count / topCount
      })
      .attr('y', (domain: IDomainEntity) => {
        return this.histogramHeight - this.histogramHeight * domain.count / topCount
      })
      .attr('x', (domain: IDomainEntity) => {
        return this.rotated ? domain.y : domain.x
      })
  }

  public resize(width: number, height: number): void {
    if (this.container === null) {
      return
    }

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

  public clear() {
    this.histogram?.remove()
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
      .attr('x', -this.histogramHeight / 2)
      .attr('y', -this.lineHeightOffset - this.padding)
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
    this.container?.remove()
  }
}

export default Histogram
