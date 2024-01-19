import {Selection} from 'd3'
import EventEmitter from 'eventemitter3'
import {IDescriptionBlockParams, IDescriptionFieldsGroupParams} from '../interfaces/main-grid.interface'
import Storage from '../utils/storage'
import DescriptionField from './DescriptionField'
import DescriptionFieldsGroup from './DescriptionFieldsGroup'
import {BlockType} from '../interfaces/base.interface'

class DescriptionBlock extends EventEmitter {
  params: IDescriptionBlockParams
  blockType: BlockType
  offset: number
  svg: Selection<any, any, HTMLElement, any>
  rotated: boolean
  domain: any[]
  width: number
  cellHeight: number
  cellWidth: number
  fields: DescriptionField[]
  drawGridLines: boolean
  nullSentinel: number
  groupMap: Record<string, DescriptionFieldsGroup> = {}
  groups: DescriptionFieldsGroup[] = []
  container!: Selection<SVGGElement, any, HTMLElement, any>
  parentHeight = 0
  private storage: Storage = Storage.getInstance()

  constructor(
    params: IDescriptionBlockParams,
    blockType: BlockType,
    svg: any,
    rotated: boolean,
    fields: DescriptionField[],
    offset: any
  ) {
    super()
    this.blockType = blockType
    this.offset = offset
    this.params = params
    this.svg = svg
    this.rotated = rotated || false

    this.domain = (this.rotated ? params.genes : params.donors) || []

    this.width = (this.rotated ? params.parentHeight : params.width) || 500

    this.cellHeight = params.height || 10
    this.cellWidth = this.domain.length > 0 ? this.width / this.domain.length : 0

    this.fields = fields || []
    this.drawGridLines = params.grid || false

    this.nullSentinel = params.nullSentinel || -777

    this.parseGroups()
  }

  private getDimensions() {
    return {
      padding: this.params.padding ?? 20,
      margin: this.params.margin || {top: 30, right: 15, bottom: 15, left: 80},
    }
  }

  private isGroupExpandable(group: string): boolean {
    return this.params.expandableGroups?.includes(group) ?? false
  }

  private getDescriptionFieldsGroupParams(expandable: boolean): IDescriptionFieldsGroupParams {
    return {
      cellHeight: this.cellHeight,
      width: this.width,
      grid: this.drawGridLines,
      nullSentinel: this.nullSentinel,
      domain: this.domain,
      label: this.params.label,
      expandable: expandable,
      wrapper: this.params.wrapper,
    }
  }

  /**
   * Parses field groups out of input.
   */
  parseGroups(): void {
    this.fields.forEach((descriptionField) => {
      const fieldsGroupName = descriptionField.group
      if (this.groupMap[fieldsGroupName] !== undefined) {
        const fieldsGroup = new DescriptionFieldsGroup(
          this.getDescriptionFieldsGroupParams(this.isGroupExpandable(fieldsGroupName)),
          this.blockType,
          fieldsGroupName,
          this.rotated
        )
        this.groupMap[fieldsGroupName] = fieldsGroup
        this.groups.push(fieldsGroup)

        fieldsGroup.on('resize', this.emit)
        fieldsGroup.on('update', this.emit)
      }

      this.groupMap[fieldsGroupName].addDescriptionFields([descriptionField])
    })
  }

  /**
   * Initializes the field group data and places container for each group in spaced
   * intervals.
   */
  init(): void {
    this.container = this.svg.append('g')

    const labelHeight = this.rotated ? 16.5 : 0
    this.parentHeight = 0
    const {padding} = this.getDimensions()

    for (const group of this.groups) {
      const descriptionBlockContainer = this.container.append('g').attr('transform', 'translate(0,' + this.parentHeight + ')')
      group.init(descriptionBlockContainer)
      this.parentHeight += group.getTotalHeight() + padding
    }

    const translateDown = this.rotated ? -(this.offset + this.parentHeight) : padding + this.offset

    this.container
      .attr('width', this.width)
      .attr('height', this.parentHeight)
      .attr('class', `${this.storage.prefix}track`)
      .attr('transform', () => {
        return `${this.rotated ? 'rotate(90) ' : ''}translate(0,${translateDown})`
      })

    this.parentHeight += labelHeight
  }

  /** Calls render on all field groups */
  render(): void {
    for (const group of this.groups) {
      group.render()
    }
  }

  /** Resizes all the field groups */
  resize(width: number, height: number, offset: number): void {
    this.offset = offset || this.offset
    this.width = this.rotated ? height : width
    this.parentHeight = 0
    const labelHeight = this.rotated ? 16.5 : 0
    const {padding} = this.getDimensions()

    for (const group of this.groups) {
      group.container.attr('transform', 'translate(0,' + this.parentHeight + ')')
      group.resize(this.width)
      this.parentHeight += group.getTotalHeight() + padding
    }

    const translateDown = this.rotated ? -(this.offset + this.parentHeight) : padding + this.offset

    this.container
      .attr('width', this.width)
      .attr('height', this.parentHeight)
      .attr('transform', () => {
        return `${this.rotated ? 'rotate(90) ' : ''}translate(0,${translateDown})`
      })

    this.parentHeight += labelHeight
  }

  /**
   * Updates the rendering of the fields.
   */
  update(domain: any[]): void {
    this.domain = domain

    for (const group of this.groups) {
      group.update(domain)
    }
  }

  setGridLines(active: boolean): void {
    for (const group of this.groups) {
      group.setGridLines(active)
    }
  }
}

export default DescriptionBlock
