import {range} from 'd3-array'
import {ScaleBand, scaleBand} from 'd3-scale'
import {BaseType, select, Selection} from 'd3-selection'
import {BlockType} from '../interfaces/base.interface'
import {
  IDescriptionField,
  IDescriptionFieldsGroupParams,
  IDomainEntity,
  IEnhancedEvent,
  IPreparedFieldData
} from '../interfaces/main-grid.interface'
import {eventBus, innerEvents, publicEvents} from '../utils/event-bus'
import {storage} from '../utils/storage'

class DescriptionFieldsGroup {
  private container: Selection<SVGGElement, unknown, HTMLElement, unknown>
  private rendered = false
  private params: IDescriptionFieldsGroupParams
  private readonly expandable: boolean
  private readonly name: string
  private height: number
  private width: number
  private fields: IDescriptionField[] = []
  private collapsedFields: IDescriptionField[] = []
  private readonly nullSentinel: number
  private readonly rotated: boolean
  private drawGridLines: boolean
  private domain: IDomainEntity[]
  private fieldsData: IPreparedFieldData[] = []
  private wrapper: Selection<HTMLElement, unknown, HTMLElement, unknown>
  private label: Selection<SVGTextElement, unknown, HTMLElement, unknown>
  private legendObject: Selection<BaseType, unknown, HTMLElement, unknown>
  private legend: Selection<BaseType, unknown, HTMLElement, unknown>
  private background: Selection<SVGRectElement, unknown, HTMLElement, unknown>
  private column: Selection<SVGLineElement, IDomainEntity, SVGGElement, unknown>
  private row: Selection<SVGGElement, unknown, SVGGElement, unknown>
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
    this.wrapper = select(params.wrapper || 'body')
  }

  public setTransform(x: number, y: number) {
    this.container.attr('transform', `translate(${x},${y})`)
  }

  /**
   * Method for adding a field to the field group.
   */
  addDescriptionFields(fields: IDescriptionField[]) {
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
  }

  public getTotalHeight() {
    const fieldDimensions = this.getFieldDimensions()
    const {height} = this.getFieldsGroupDimensions()
    return height + (this.collapsedFields.length ? fieldDimensions.height : 0)
  }

  /**
   * Initializes the container for the field groups.
   */
  init(container: Selection<SVGGElement, unknown, HTMLElement, unknown>) {
    this.container = container

    this.label = this.container.append('text')
      .attr('x', -6)
      .attr('y', -11)
      .attr('dy', '.32em')
      .attr('text-anchor', 'end')
      .attr('class', `${storage.prefix}track-group-label`)
      .text(this.name)

    this.legendObject = this.container
      .append('svg:foreignObject')
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
   * Renders the field group. Takes the x-axis range, and the div for tooltips.
   */
  render() {
    this.rendered = true
    this.computeCoordinates()

    this.renderData()
    this.legend
      .on('mouseover', (event) => {
        eventBus.emit(publicEvents.DESCRIPTION_LEGEND_HOVER, {
          target: event.target,
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
    this.computeCoordinates()

    const {width} = this.getFieldDimensions()

    this.container
      .selectAll(`.${storage.prefix}track-data`)
      .data(this.fieldsData)
      .attr('x', ({domainIndex}: IPreparedFieldData) => {
        const domain = this.domain[domainIndex]
        return (this.rotated ? domain.y : domain.x) ?? 0
      })
      .attr('data-track-data-index', (fieldData, i) => i)
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
    this.y = scaleBand()
      .domain(range(this.fields.length).map(String))
      .range([0, height])

    // append columns
    if (this.column) {
      this.column.remove()
    }

    if (this.drawGridLines) {
      this.column = this.container
        .selectAll(`.${storage.prefix}column`)
        .data(this.domain)
        .enter()
        .append('line')
        .attr('class', `${storage.prefix}column`)
        .attr('column', (domain) => domain.id)
        .attr('transform', (domain: IDomainEntity) => `translate(${this.rotated ? domain.y : domain.x}),rotate(-90)`)
        .style('pointer-events', 'none')
        .attr('x1', -height)
    }

    // append rows
    if (this.row !== undefined) {
      this.row.remove()
    }

    this.row = this.container
      .selectAll(`.${storage.prefix}row`)
      .data(this.fields)
      .enter()
      .append('g')
      .attr('class', `${storage.prefix}row`)
      .attr('transform', (field: IDescriptionField, i) => {
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
      .attr('data-field', (field) => field.fieldName)
      .on('click', (event: IEnhancedEvent) => {
        if (this.rotated) {
          storage.sortRows(event.target.dataset.field)
        } else {
          storage.sortColumns(event.target.dataset.field)
        }

        eventBus.emit(innerEvents.INNER_UPDATE, false)
      })
      .attr('x', -6)
      .attr('y', cellHeight / 2)
      .attr('dy', '.32em')
      .attr('text-anchor', 'end')
      .text((field) => field.name)

    if (this.expandable) {
      setTimeout(() => {
        const removeFieldClass = `${storage.prefix}remove-track`
        this.container.selectAll(`.${removeFieldClass}`).remove()

        const textLengths = {}
        labels.each((text) => {
          textLengths[text.name] = text.getComputedTextLength()
        })
        this.row
          .append('text')
          .attr('class', removeFieldClass)
          .text('-')
          .attr('y', cellHeight / 2)
          .attr('dy', '.32em')
          .on('click', (event, i: number) => {
            this.removeField(i)
          })
          .attr('x', function (text) {
            return -(textLengths[text.name] + 12 + text.getComputedTextLength())
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
          }) as Selection<BaseType, unknown, SVGGElement, unknown>
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
          target: target,
          domainId: fieldData.id,
          type: this.rotated ? BlockType.Rows : BlockType.Columns,
          field: fieldData.fieldName,
        })
      })
      .on('mouseover', (event: IEnhancedEvent) => {
        const target = event.target
        const fieldData = this.fieldsData[target.dataset.trackDataIndex]
        if (!fieldData) return

        eventBus.emit(publicEvents.DESCRIPTION_CELL_HOVER, {
          target: target,
          domainId: fieldData.id,
          type: this.rotated ? BlockType.Rows : BlockType.Columns,
          field: fieldData.fieldName,
        })
      })
      .on('mouseout', () => {
        eventBus.emit(publicEvents.DESCRIPTION_CELL_OUT)
      })

    const {height, width} = this.getFieldDimensions()

    const selection = this.container.selectAll(`.${storage.prefix}track-data`)
      .data(this.fieldsData)

    const blockType = this.blockType

    selection.enter()
      .append('rect')
      .attr('x', ({domainIndex}: IPreparedFieldData) => {
        const domain = this.domain[domainIndex]
        return (this.rotated ? domain.y : domain.x) ?? 0
      })
      .attr('y', ({fieldName}: IPreparedFieldData) => {
        return this.y(yIndexLookup[fieldName]) ?? 0
      })
      .each(function (fieldData, i) {
        const element = select(this)
        const {color, opacity} = (storage.customFunctions[blockType])(fieldData)
        element.attr('fill', color)
        element.attr('opacity', opacity)

        element.attr('width', width)
        element.attr('height', height)
        element.attr('data-track-data-index', i)
        element.attr('class', [
          `${storage.prefix}track-data`,
          `${storage.prefix}track-${fieldData.fieldName}`,
          `${storage.prefix}track-${fieldData.value}`,
          `${storage.prefix}${fieldData.id}-cell`,
        ].join(' '))
      })

    selection.exit().remove()
  }
}

export default DescriptionFieldsGroup
