import {select, Selection} from 'd3-selection'
import {eventBus, renderEvents} from '../../../../utils/event-bus'
import {storage} from '../../../../utils/storage'
import Processing from '../../../data/Processing'
import BottomTracksGroupsRender from './BottomTracksGroupsRender'

class BottomTracksRender {
  private width = 0
  private height = 0
  private processing: Processing
  private wrapper: Selection<HTMLElement, unknown, HTMLElement, unknown>

  private container: Selection<SVGSVGElement, unknown, HTMLElement, unknown>
  private groupsRenderer: BottomTracksGroupsRender

  constructor(options: any) {
    this.updateDimensions()

    this.groupsRenderer = new BottomTracksGroupsRender({})
    this.processing = Processing.getInstance()
    // Initial height calculates approximately
    const groups = this.processing.getBottomTracksGroups()
    this.height = groups.reduce((sum, group) => {
      return sum + group.fields.length * 16 + 10
    }, 0)

    this.processing = Processing.getInstance()

    this.wrapper = select(`#${storage.prefix}bottom-tracks-block`)
  }

  public updateDimensions() {
    this.width = storage.gridWidth
  }

  public render() {
    this.prepareContainer()

    eventBus.emit(renderEvents.RENDER_X_HISTOGRAM_START)
    this.draw()
    eventBus.emit(renderEvents.RENDER_X_HISTOGRAM_END)
    this.calcHeight()
  }

  public calcHeight() {
    this.height = this.groupsRenderer.calcHeight()
    this.container
      .attr('height', this.height + 6)
      .attr('viewBox', `0 0 ${this.width + 80} ${this.height + 6}`)
  }

  private prepareContainer() {
    if (!this.container) {
      this.container = this.wrapper.append('svg')
        .attr('version', '2.0')
        .attr('class', `${storage.prefix}tracks-block ${storage.prefix}tracks-block--bottom`)
        .attr('id', `${storage.prefix}tracks-block-bottom`)

      this.groupsRenderer.setContainer(this.container)
    }

    this.container
      .attr('width', this.width + 80)
      .attr('height', this.height + 6)
      .attr('viewBox', `0 0 ${this.width + 80} ${this.height + 6}`)
  }

  private draw() {
    const groups = this.processing.getBottomTracksGroups()
    // console.log(groups)
    this.groupsRenderer.draw(groups)
  }

  public destroy() {
    this.container.remove()
    delete this.container
  }
}

export default BottomTracksRender
