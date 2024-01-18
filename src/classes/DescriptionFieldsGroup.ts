import * as d3 from 'd3'
import EventEmitter from 'eventemitter3'
import {
  Domain,
  IComputedProps,
  IDescriptionFieldsGroupParams,
  IEnhancedEvent,
  IPreparedFieldData
} from '../interfaces/main-grid.interface'
import DescriptionField from './DescriptionField'

class DescriptionFieldsGroup extends EventEmitter {
  private prefix: string
  private rendered = false
  private params: IDescriptionFieldsGroupParams
  private computedProps: IComputedProps = {
    opacity: (val: any) => 1,
    fill: (val: any) => 'black',
  }
  private expandable: boolean
  private name: string
  private height: number
  private totalHeight: number
  private width: number
  private fields: DescriptionField[] = []
  private collapsedFields: DescriptionField[] = []
  private length: number
  private nullSentinel: number
  private rotated: boolean
  private drawGridLines: boolean
  private domain: Domain[]
  private fieldsData: IPreparedFieldData[] = []
  private wrapper: any
  private container: any
  private label: any
  private legendObject: any
  private legend: any
  private background: any
  private column: any
  private row: any

  constructor(
    params: IDescriptionFieldsGroupParams,
    computed: IComputedProps,
    name: string,
    rotated: boolean
  ) {
    super()
    this.computedProps = {
      ...this.computedProps,
      ...computed,
    }
    this.params = params
    this.prefix = params.prefix || 'og-'
    this.expandable = params.expandable
    this.name = name
    this.totalHeight = 0
    this.width = params.width
    this.nullSentinel = params.nullSentinel || -777
    this.rotated = rotated
    this.drawGridLines = params.grid ?? false
    this.domain = params.domain
    this.wrapper = d3.select(params.wrapper || 'body')
  }


  /**
   * Method for adding a field to the field group.
   */
  addDescriptionFields(fields: DescriptionField[]) {
    for (const descriptionField of fields) {
      if (!this.rendered && descriptionField.collapsed && this.expandable) {
        this.collapsedFields.push(descriptionField)
      } else {
        this.fields.push(descriptionField)
      }
    }

    this.collapsedFields = this.collapsedFields.filter((collapsedFields) => {
      return !this.fields.some((field) => {
        return collapsedFields.fieldName === field.fieldName
      })
    })

    this.fields = [...new Set(this.fields)]

    // const { height: cellHeight, length } = this.getDimensions()

    // this.height = cellHeight * length

    if (this.rendered) {
      this.refreshData()
      this.emit('resize')
    }
  }

  /**
   * Method for removing a field from the fields group.
   */
  removeField(i: number) {
    const removed = this.fields.splice(i, 1)
    this.collapsedFields = this.collapsedFields.concat(removed)

    this.refreshData()
    this.emit('resize')
  }

  /**
   * Refreshes the data after adding a new field.
   */
  refreshData() {
    this.fieldsData = []
    for (let i = 0; i < this.domain.length; i++) {
      const domain = this.domain[i]

      for (const field of this.fields) {
        const value = domain[field.fieldName]
        const isNullSentinel = value === this.nullSentinel
        this.fieldsData.push({
          id: domain.id,
          displayId: domain.displayId ?? (this.rotated ? domain.symbol : domain.id),
          domainIndex: i,
          value: value,
          displayValue: isNullSentinel ? 'Not Verified' : value,
          notNullSentinel: !isNullSentinel,
          displayName: field.name,
          fieldName: field.fieldName,
          type: field.type,
        })
      }
    }
  }

  /**
   * Initializes the container for the field groups.
   */
  init(container: HTMLElement) {
    this.container = container

    this.label = this.container.append('text')
      .attr('x', -6)
      .attr('y', -11)
      .attr('dy', '.32em')
      .attr('text-anchor', 'end')
      .attr('class', this.prefix + 'track-group-label')
      .text(this.name)

    this.legendObject = this.container.append('svg:foreignObject')
      .attr('width', 20)
      .attr('height', 20)

    this.legend = this.legendObject
      .attr('x', 0)
      .attr('y', -22)
      .append('xhtml:div')
      .html(this.params.label)

    this.background = this.container.append('rect')
      .attr('class', 'background')
      .attr('width', this.width)
      .attr('height', this.height)

    this.refreshData()

    const {height: cellHeight} = this.getDimensions()
    this.totalHeight = this.height + (this.collapsedFields.length ? cellHeight : 0)
  }

  /**
   * Renders the field group. Takes the x axis range, and the div for tooltips.
   */
  render() {
    this.rendered = true
    this.computeCoordinates()

    this.renderData()
    this.legend
      .on('mouseover', () => {
        this.emit('trackLegendMouseOver', {
          group: this.name,
        })
      })
      .on('mouseout', () => {
        this.emit('trackLegendMouseOut')
      })
  }

  private getDimensions() {
    return {
      width: this.domain?.length > 0 ? this.width / this.domain.length : 0,
      height: this.params.cellHeight ?? 20,
      length: this.fields?.length ?? 0,
    }
  }

  /**
   * Updates the field group rendering based on the given domain and range for axis.
   */
  update(domain: Domain[]) {
    this.domain = domain

    const map = {}
    for (let i = 0; i < domain.length; i += 1) {
      map[domain[i].id] = i
    }

    const groupData = []
    for (const data of this.fieldsData) {
      const domainIndex = map[data.id]
      if (domainIndex || domainIndex === 0) {
        data.domainIndex = domainIndex
        groupData.push(data)
      }
    }
    this.fieldsData = groupData

    this.computeCoordinates()

    const {width: cellWidth} = this.getDimensions()

    this.container.selectAll('.' + this.prefix + 'track-data')
      .data(this.fieldsData)
      .attr('x', (d) => {
        const domain = this.domain[d.domainIndex]
        return this.rotated ? domain.y : domain.x
      })
      .attr('data-track-data-index', (d, i) => i)
      .attr('width', cellWidth)
  }

  /**
   * Resizes to the given width.
   */
  resize(width: number) {
    const {height: cellHeight, length} = this.getDimensions()

    this.width = width
    this.height = cellHeight * length
    if (this.collapsedFields.length) {
      this.totalHeight = this.height + cellHeight
    }

    this.background
      .attr('class', 'background')
      .attr('width', this.width)
      .attr('height', this.height)

    this.computeCoordinates()

    this.totalHeight = this.height + (this.collapsedFields.length ? cellHeight : 0)

    this.renderData()
  }

  /**
   * Updates coordinate system
   */
  computeCoordinates() {
    const {height: cellHeight, length} = this.getDimensions()

    this.y = d3.scale.ordinal()
      .domain(d3.range(length))
      .rangeBands([0, this.height])

    // append columns
    if (this.column) {
      this.column.remove()
    }

    if (this.drawGridLines) {
      this.column = this.container.selectAll('.' + this.prefix + 'column')
        .data(this.domain)
        .enter()
        .append('line')
        .attr('class', this.prefix + 'column')
        .attr('donor', (d) => d.id)
        .attr('transform', (d, i) => 'translate(' + (this.rotated ? d.y : d.x) + ')rotate(-90)')
        .style('pointer-events', 'none')
        .attr('x1', -this.height)
    }

    // append rows
    if (typeof this.row !== 'undefined') {
      this.row.remove()
    }

    this.row = this.container.selectAll('.' + this.prefix + 'row')
      .data(this.fields)
      .enter().append('g')
      .attr('class', this.prefix + 'row')
      .attr('transform', (d, i) => 'translate(0,' + this.y(i) + ')')

    if (this.drawGridLines) {
      this.row.append('line')
        .style('pointer-events', 'none')
        .attr('x2', this.width)
    }

    const labels = this.row.append('text')

    labels.attr('class', this.prefix + 'track-label ' + this.prefix + 'label-text-font')
      .on('click', (d) => {
        this.domain.sort(d.sort(d.fieldName))
        this.emit('update', false)
      })
      .transition()
      .attr('x', -6)
      .attr('y', cellHeight / 2)
      .attr('dy', '.32em')
      .attr('text-anchor', 'end')
      .text((d, i) => {
        return this.fields[i].name
      })

    if (this.expandable) {
      setTimeout(() => {
        const removeFieldClass = `${this.prefix}remove-track`
        this.container.selectAll(`.${removeFieldClass}`).remove()

        const textLengths = {}
        labels.each(function (d) {
          textLengths[d.name] = this.getComputedTextLength()
        })
        this.row
          .append('text')
          .attr('class', removeFieldClass)
          .text('-')
          .attr('y', cellHeight / 2)
          .attr('dy', '.32em')
          .on('click', (d, i) => {
            this.removeField(i)
          })
          .attr('x', function (d) {
            return -(textLengths[d.name] + 12 + this.getComputedTextLength())
          })
      })
    }

    // append or remove add field button
    let addButton = this.container.selectAll('.' + this.prefix + 'add-track')

    if (this.collapsedFields.length && this.expandable) {
      if (addButton.empty()) {
        addButton = this.container.append('text')
          .text('+')
          .attr('class', '' + this.prefix + 'add-track')
          .attr('x', -6)
          .attr('dy', '.32em')
          .attr('text-anchor', 'end')
          .on('click', () => {
            this.emit('addTrackClick', {
              hiddenTracks: this.collapsedFields.slice(),
              addTrack: this.addDescriptionFields.bind(this),
            })
          })
      }

      addButton.attr('y', (cellHeight / 2) + (length && cellHeight + this.y(length - 1)))
    } else {
      addButton.remove()
    }
  }

  setGridLines(active: boolean) {
    if (this.drawGridLines === active) return
    this.drawGridLines = active
    this.computeCoordinates()
  }

  renderData() {
    const selection = this.container.selectAll('.' + this.prefix + 'track-data')
      .data(this.fieldsData)

    selection.enter()
      .append('rect')

    const yIndexLookup = {}
    for (let i = 0; i < this.fields.length; i += 1) {
      yIndexLookup[this.fields[i].fieldName] = i
    }

    this.container
      .on('click', (event: IEnhancedEvent) => {
        const target = event.target
        const d = this.fieldsData[target.dataset.fieldDataIndex]
        if (!d) return
        this.emit('trackClick', {
          domain: d,
          type: this.rotated ? 'gene' : 'donor',
        })
      })
      .on('mouseover', (event: IEnhancedEvent) => {
        const target = event.target
        const d = this.fieldsData[target.dataset.fieldDataIndex]
        if (!d) return

        this.emit('trackMouseOver', {
          domain: d,
          type: this.rotated ? 'gene' : 'donor',
        })
      })
      .on('mouseout', () => {
        this.emit('trackMouseOut')
      })

    const {height: cellHeight, width: cellWidth} = this.getDimensions()

    selection
      .attr('data-track-data-index', (d, i) => i)
      .attr('x', (d) => {
        const domain = this.domain[d.domainIndex]
        return this.rotated ? domain.y : domain.x
      })
      .attr('y', (d) => this.y(yIndexLookup[d.fieldName]))
      .attr('width', cellWidth)
      .attr('height', cellHeight)
      .attr('fill', this.computedProps.fill)
      .attr('opacity', this.computedProps.opacity)
      .attr('class', (d) => {
        return [
          `${this.prefix}track-data`,
          `${this.prefix}track-${d.fieldName}`,
          `${this.prefix}track-${d.value}`,
          `${this.prefix}${d.id}-cell`,
        ].join(' ')
      })

    selection.exit().remove()
  }
}

export default DescriptionFieldsGroup
