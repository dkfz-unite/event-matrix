import {BaseType, Selection} from 'd3-selection'
import {IMatrixDescriptionGroup} from '../../../../interfaces/matrix.interface'
import {storage} from '../../../../utils/storage'
import BottomDescriptionFieldsRender from './BottomDescriptionFieldsRender'

class BottomDescriptionGroupsRender {
  private width: number
  private wrapper: Selection<HTMLElement, unknown, HTMLElement, unknown>
  private groups: Map<string, Selection<BaseType, unknown, HTMLElement, unknown>> = new Map()
  private groupLegends: Map<string, Selection<BaseType, unknown, HTMLElement, unknown>> = new Map()
  private fieldsRenders: Map<string, BottomDescriptionFieldsRender> = new Map()

  private container: Selection<SVGSVGElement, unknown, HTMLElement, unknown>

  constructor(options: any) {
    this.width = storage.gridWidth
  }

  public setContainer(container: Selection<SVGSVGElement, unknown, HTMLElement, unknown>) {
    this.container = container
  }

  public calcHeight() {
    return Array.from(this.fieldsRenders.values()).reduce((sum, fieldsRenderer) => (sum + fieldsRenderer.calcHeight()), 0)
  }

  public draw(groups: IMatrixDescriptionGroup[]) {
    let height = 0
    for (const item of groups) {
      this.drawGroup(item, height)
      height += item.fields.length * 16 + 10 + 16
    }
    this.cleanOldGroups(groups.map((group) => group.id))
  }

  private drawGroup(group: IMatrixDescriptionGroup, heightOffset: number) {
    let groupElement = this.groups.get(group.id)

    if (!groupElement) {
      groupElement = this.container
        .append('svg')
        .attr('id', `${storage.prefix}description-group-${group.id}`)
        .attr('class', `${storage.prefix}description-group ${storage.prefix}description-group--bottom`)

      groupElement.append('text')
        .attr('x', 72)
        .attr('y', 0)
        .attr('dy', '1em')
        .attr('text-anchor', 'end')
        .attr('class', `${storage.prefix}track-group-label ${storage.prefix}description-group__label`)
        .text(group.label)

      const legend = groupElement
        .append('svg:foreignObject')
        .attr('class', `${storage.prefix}description-group__legend-icon`)
        .attr('width', 20)
        .attr('height', 20)
        .attr('x', 80)
        .attr('y', 0)

      this.groupLegends.set(group.id, legend)
      this.groups.set(group.id, groupElement)
    }

    groupElement
      .attr('height', group.fields.length * 16 + 10 + 16)
      // .attr('style', `transform:translateY(${heightOffset}px)`)
      .attr('y', heightOffset)

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
