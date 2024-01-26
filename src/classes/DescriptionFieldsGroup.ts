import * as d3 from 'd3'
import {BaseType, ScaleBand} from 'd3'
import {BlockType} from '../interfaces/base.interface'
import {
  IDescriptionFieldsGroupParams,
  IDomainEntity,
  IEnhancedEvent,
  IPreparedFieldData
} from '../interfaces/main-grid.interface'
import {eventBus, innerEvents, publicEvents} from '../utils/event-bus'
import {storage} from '../utils/storage'
import DescriptionField from './DescriptionField'

class DescriptionFieldsGroup {
  public container!: d3.Selection<SVGGElement, any, HTMLElement, any>

  private rendered = false
  private params: IDescriptionFieldsGroupParams
  private expandable: boolean
  private name: string
  private height: number
  private width: number
  private fields: DescriptionField[] = []
  private collapsedFields: DescriptionField[] = []
  private length: number
  private nullSentinel: number
  private rotated: boolean
  private drawGridLines: boolean
  private domain: IDomainEntity[]
  private fieldsData: IPreparedFieldData[] = []
  private wrapper: any
  private label: any
  private legendObject: any
  private legend: any
  private background: any
  private column: any
  private row: any
  private blockType: BlockType
  private y: ScaleBand<string>

  constructor(
    params: IDescriptionFieldsGroupParams,
    blockType: BlockType,
    name: string,
    rotated: boolean
  ) {
    this.params = params
    this.expandable = params.expandable
    this.name = name
    this.width = params.width
    this.nullSentinel = params.nullSentinel || -777
    this.rotated = rotated
    this.drawGridLines = params.grid ?? false
    this.domain = params.domain
    this.blockType = blockType
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
      eventBus.emit(innerEvents.INNER_RESIZE)
    }
  }

  /**
   * Method for removing a field from the fields group.
   */
  removeField(i: number) {
    const removed = this.fields.splice(i, 1)
    this.collapsedFields = this.collapsedFields.concat(removed)

    this.refreshData()
    eventBus.emit(innerEvents.INNER_RESIZE)
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
    console.log(this.fieldsData[0])
  }

  public getTotalHeight() {
    const fieldDimensions = this.getFieldDimensions()
    const {height} = this.getFieldsGroupDimensions()
    return height + (this.collapsedFields.length ? fieldDimensions.height : 0)
  }

  /**
   * Initializes the container for the field groups.
   */
  init(container: d3.Selection<SVGGElement, any, HTMLElement, any>) {
    this.container = container

    this.label = this.container.append('text')
      .attr('x', -6)
      .attr('y', -11)
      .attr('dy', '.32em')
      .attr('text-anchor', 'end')
      .attr('class', `${storage.prefix}track-group-label`)
      .text(this.name)

    this.legendObject = this.container.append('svg:foreignObject')
      .attr('width', 20)
      .attr('height', 20)

    this.legend = this.legendObject
      .attr('x', 0)
      .attr('y', -22)
      .append('xhtml:div')
      .html(this.params.label)

    const {height, width} = this.getFieldsGroupDimensions()

    this.background = this.container.append('rect')
      .attr('class', `${storage.prefix}background`)
      .attr('width', width)
      .attr('height', height)

    this.refreshData()
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
        eventBus.emit(publicEvents.DESCRIPTION_LEGEND_HOVER, {
          group: this.name,
        })
      })
      .on('mouseout', () => {
        eventBus.emit(publicEvents.DESCRIPTION_LEGEND_OUT)
      })
  }

  private getFieldsGroupDimensions() {
    return {
      width: this.width,
      height: this.params.cellHeight * this.fields.length,
      length: this.fields.length,
    }
  }

  private getFieldDimensions() {
    console.log(this.width)
    console.log(this.domain)
    console.log(this.domain.length > 0 ? this.width / this.domain.length : 0)
    return {
      width: this.domain.length > 0 ? this.width / this.domain.length : 0,
      height: this.params.cellHeight,
    }
  }

  /**
   * Updates the field group rendering based on the given domain and range for axis.
   */
  update(domain: IDomainEntity[]) {
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
    console.log(this.fieldsData)

    this.computeCoordinates()

    const {width} = this.getFieldDimensions()

    this.container.selectAll(`.${storage.prefix}track-data`)
      .data(this.fieldsData)
      .attr('x', ({domainIndex}: IPreparedFieldData) => {
        const domain = this.domain[domainIndex]
        return (this.rotated ? domain.y : domain.x) ?? 0
      })
      .attr('data-track-data-index', (d, i) => i)
      .attr('width', width)
  }

  /**
   * Resizes to the given width.
   */
  resize(width: number) {
    const {height} = this.getFieldsGroupDimensions()

    this.width = width

    this.background
      .attr('class', 'background')
      .attr('width', width)
      .attr('height', height)

    this.computeCoordinates()
    this.renderData()
  }

  /**
   * Updates coordinate system
   */
  computeCoordinates() {
    const {height, length} = this.getFieldsGroupDimensions()
    const {height: cellHeight} = this.getFieldDimensions()

    // Изменение на scaleBand
    this.y = d3.scaleBand()
      .domain(d3.range(this.fields.length).map(String))
      .range([0, height])
      .padding(0.1) // Добавлен padding, его значение можно скорректировать

    // append columns
    if (this.column) {
      this.column.remove()
    }

    if (this.drawGridLines) {
      this.column = this.container.selectAll(`.${storage.prefix}column`)
        .data(this.domain)
        .enter()
        .append('line')
        .attr('class', `${storage.prefix}column`)
        .attr('donor', (d) => d.id)
        .attr('transform', (d: IDomainEntity, i) => `translate(${this.rotated ? d.y : d.x}),rotate(-90)`)
        .style('pointer-events', 'none')
        .attr('x1', -height)
    }

    // append rows
    if (this.row !== undefined) {
      this.row.remove()
    }

    this.row = this.container.selectAll(`.${storage.prefix}row`)
      .data(this.fields)
      .enter().append('g')
      .attr('class', `${storage.prefix}row`)
      .attr('transform', (d: DescriptionField, i) => {
        console.log(i)
        console.log(this.y(String(i)))
        return `translate(0,${this.y(String(i))})`
      })

    if (this.drawGridLines) {
      this.row.append('line')
        .style('pointer-events', 'none')
        .attr('x2', this.width)
    }

    const labels = this.row.append('text')

    labels
      .attr('class', `${storage.prefix}track-label ${storage.prefix}label-text-font`)
      .attr('data-field', (d) => d.fieldName)
      .on('click', (event: IEnhancedEvent) => {
        if (this.rotated) {
          storage.sortGenes(event.target.dataset.field)
        } else {
          storage.sortDonors(event.target.dataset.field)
        }

        eventBus.emit(innerEvents.INNER_UPDATE, false)
      })
      .transition()
      .attr('x', -6)
      .attr('y', cellHeight / 2)
      .attr('dy', '.32em')
      .attr('text-anchor', 'end')
      .text((d, i) => this.fields[i].name)

    if (this.expandable) {
      setTimeout(() => {
        const removeFieldClass = `${storage.prefix}remove-track`
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
    let addButton = this.container.selectAll(`.${storage.prefix}add-track`)

    if (this.collapsedFields.length && this.expandable) {
      if (addButton.empty()) {
        addButton = this.container.append('text')
          .text('+')
          .attr('class', `${storage.prefix}add-track`)
          .attr('x', -6)
          .attr('dy', '.32em')
          .attr('text-anchor', 'end')
          .on('click', () => {
            eventBus.emit(publicEvents.DESCRIPTION_BUTTONS_ADD_CLICK, {
              hiddenTracks: this.collapsedFields.slice(),
              addTrack: this.addDescriptionFields.bind(this),
            })
          }) as d3.Selection<BaseType, any, SVGGElement, any>
      }

      addButton.attr('y', (cellHeight / 2) + (length * cellHeight + this.y((length - 1).toString())))
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
    const yIndexLookup = {}
    for (let i = 0; i < this.fields.length; i++) {
      yIndexLookup[this.fields[i].fieldName] = i.toString()
    }

    this.container
      .on('click', (event: IEnhancedEvent) => {
        const target = event.target
        const fieldData = this.fieldsData[target.dataset.trackDataIndex]
        if (!fieldData) return
        eventBus.emit(publicEvents.DESCRIPTION_FIELD_CLICK, {
          domain: fieldData,
          target: target,
          type: this.rotated ? 'gene' : 'donor',
        })
      })
      .on('mouseover', (event: IEnhancedEvent) => {
        const target = event.target
        const fieldData = this.fieldsData[target.dataset.trackDataIndex]
        if (!fieldData) return

        eventBus.emit(publicEvents.DESCRIPTION_CELL_HOVER, {
          domain: fieldData,
          target: target,
          type: this.rotated ? 'gene' : 'donor',
        })
      })
      .on('mouseout', () => {
        eventBus.emit(publicEvents.DESCRIPTION_CELL_OUT)
      })

    const {height, width} = this.getFieldDimensions()

    const selection = this.container.selectAll(`.${storage.prefix}track-data`)
      .data(this.fieldsData)

    selection.enter()
      .append('rect')
      .attr('data-track-data-index', (dom: IPreparedFieldData, i) => i)
      .attr('x', ({domainIndex}: IPreparedFieldData) => {
        const domain = this.domain[domainIndex]
        return (this.rotated ? domain.y : domain.x) ?? 0
      })
      .attr('y', ({fieldName}: IPreparedFieldData) => {
        return this.y(yIndexLookup[fieldName]) ?? 0
      })
      .attr('width', width)
      .attr('height', height)
      .attr('fill', storage.customFunctions[this.blockType].fill)
      .attr('opacity', storage.customFunctions[this.blockType].opacity)
      .attr('class', ({id, value, fieldName}: IPreparedFieldData) => {
        return [
          `${storage.prefix}track-data`,
          `${storage.prefix}track-${fieldName}`,
          `${storage.prefix}track-${value}`,
          `${storage.prefix}${id}-cell`,
        ].join(' ')
      })

    selection.exit().remove()
  }
}

export default DescriptionFieldsGroup
