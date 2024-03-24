import {BaseType, Selection} from 'd3-selection'
import {IMatrixDescriptionGroup} from '../../../interfaces/matrix.interface'
import {storage} from '../../../utils/storage'
import BottomDescriptionFieldsRender from './BottomDescriptionFieldsRender'

class BottomDescriptionGroupsRender {
  private width: number
  private wrapper: Selection<HTMLElement, unknown, HTMLElement, unknown>
  private groups: Map<string, Selection<BaseType, unknown, HTMLElement, unknown>> = new Map()
  private groupLegends: Map<string, Selection<BaseType, unknown, HTMLElement, unknown>> = new Map()
  private fieldsRenders: Map<string, BottomDescriptionFieldsRender> = new Map()

  private container: Selection<SVGSVGElement, unknown, HTMLElement, unknown>

  constructor(width: number, options: any) {
    this.width = width
  }

  public setContainer(container: Selection<SVGSVGElement, unknown, HTMLElement, unknown>) {
    this.container = container
  }

  public calcHeight() {
    return Array.from(this.fieldsRenders.values()).reduce((sum, fieldsRenderer) => (sum + fieldsRenderer.calcHeight()), 0)
  }

  public draw(groups: IMatrixDescriptionGroup[]) {
    for (let i = 0; i < groups.length; i++) {
      this.drawGroup(groups[i], i)
    }
    this.cleanOldGroups(groups.map((group) => group.id))
  }

  private drawGroup(group: IMatrixDescriptionGroup, index: number) {
    let groupElement = this.groups.get(group.id)

    if (!groupElement) {
      groupElement = this.container
        .append('g')
        .attr('id', `${storage.prefix}description-group-${group.id}`)
        .attr('class', `${storage.prefix}description-group ${storage.prefix}description-group--bottom`)

      groupElement.append('text')
        .attr('x', -6)
        .attr('y', -11)
        .attr('dy', '.32em')
        .attr('text-anchor', 'end')
        .attr('class', `${storage.prefix}track-group-label ${storage.prefix}description-group__label`)
        .text(group.label)

      const legend = groupElement
        .append('svg:foreignObject')
        .attr('class', `${storage.prefix}description-group__legend-icon`)
        .attr('width', 20)
        .attr('height', 20)


      this.groupLegends.set(group.id, legend)

      const height = group.fields.length * 16
      groupElement
        .append('rect')
        .attr('class', `${storage.prefix}background`)
        .attr('width', this.width)
        .attr('height', height)

      this.groups.set(group.id, groupElement)
    } else {
      groupElement
        .attr('style', `transform:translateY(${index * storage.cellHeight}px)`)

      groupElement
        .select('rect')
        .attr('height', group.fields.length * 16)

      const text = groupElement.select(`.${storage.prefix}row-label`)
      text
        .attr('y', storage.cellHeight / 2)
        .attr('style', () => {
          if (storage.cellHeight < storage.minCellHeight) {
            return 'display: none;'
          } else {
            return ''
          }
        })
    }

    const render = this.getChildrenRender(group.id, groupElement)
    render.draw(group.fields)
    render.cleanOldFields(group.fields.map((field) => field.id))
    return groupElement
  }

  private getChildrenRender(parentId: string, container) {
    let render = this.fieldsRenders.get(parentId)
    if (!render) {
      render = new BottomDescriptionFieldsRender(parentId, container, {})
      this.fieldsRenders.set(parentId, render)
    }
    return render
  }

  public cleanOldGroups(activeGroupIds: string[]) {
    const oldGroupIds = Array.from(this.groups.keys())
    for (const groupId of oldGroupIds) {
      if (!activeGroupIds.includes(groupId)) {
        this.groups.get(groupId).remove()
        this.groups.delete(groupId)
      }
    }
  }

  public destroy() {
    this.container.remove()
    delete this.container
  }
}

export default BottomDescriptionGroupsRender
