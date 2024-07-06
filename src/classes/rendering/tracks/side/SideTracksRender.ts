import {select, Selection} from 'd3-selection'
import {eventBus, renderEvents} from '../../../../utils/event-bus'
import {storage} from '../../../../utils/storage'
import Processing from '../../../data/Processing'
import SideTracksGroupsRender from './SideTracksGroupsRender'

class SideTracksRender {
  private width = 0
  private height = 0
  private processing: Processing
  private wrapper: Selection<HTMLElement, unknown, HTMLElement, unknown>

  private container: Selection<SVGSVGElement, unknown, HTMLElement, unknown>
  private groupsRenderer: SideTracksGroupsRender

  constructor(options: any) {
    this.updateDimensions()

    this.groupsRenderer = new SideTracksGroupsRender({})
    this.processing = Processing.getInstance()
    // Initial width calculates approximately
    const groups = this.processing.getBottomTracksGroups()
    this.width = groups.reduce((sum, group) => {
      return sum + group.fields.length * 16 + 10
    }, 0)

    this.processing = Processing.getInstance()

    this.wrapper = select(`#${storage.prefix}side-tracks-block`)
  }

  public updateDimensions() {
    this.height = storage.gridHeight
  }

  public render() {
    this.prepareContainer()

    eventBus.emit(renderEvents.RENDER_Y_TRACKS_BLOCK_START)
    this.draw()
    eventBus.emit(renderEvents.RENDER_Y_TRACKS_BLOCK_END)
    this.calcWidth()
  }

  public calcWidth() {
    this.width = this.groupsRenderer.calcWidth()
    this.container
      .attr('width', this.width + 6)
      .attr('height', this.height + 6 + 80 + 6)
      .attr('viewBox', `0 0 ${this.width + 6} ${this.height + 6 + 80 + 6}`)
  }

  private prepareContainer() {
    if (!this.container) {
      this.container = this.wrapper.append('svg')
        .attr('version', '2.0')
        .attr('class', `${storage.prefix}tracks-block ${storage.prefix}tracks-block--side`)
        .attr('id', `${storage.prefix}tracks-block-side`)

      this.groupsRenderer.setContainer(this.container)
    }

    this.container
      .attr('width', this.width + 6)
      .attr('height', this.height + 6 + 80 + 6)
      .attr('viewBox', `0 0 ${this.width + 6} ${this.height + 6 + 80 + 6}`)
  }

  private draw() {
    const groups = this.processing.getSideTracksGroups()
    // console.log(groups)
    this.groupsRenderer.draw(groups)
  }

  public destroy() {
    this.container.remove()
    delete this.container
  }
}

export default SideTracksRender
