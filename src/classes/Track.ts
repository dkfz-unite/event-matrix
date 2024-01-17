import EventEmitter from 'eventemitter3'
import {IComputedProps, OncoTrackParams} from '../interfaces/main-grid.interface'
import TrackGroup from './TrackGroup'

class Track extends EventEmitter {
  params: OncoTrackParams
  computedProps: IComputedProps
  offset: any
  svg: any
  rotated: boolean
  domain: any[]
  width: number
  cellHeight: number
  cellWidth: number
  availableTracks: any[]
  drawGridLines: boolean
  nullSentinel: number
  groupMap: any
  groups: TrackGroup[]
  container: any
  height: number

  constructor(
    params: OncoTrackParams,
    computedProps: IComputedProps,
    svg: any,
    rotated: boolean,
    tracks: any[],
    offset: any
  ) {
    super()
    this.computedProps = computedProps
    this.offset = offset
    this.params = params
    this.svg = svg
    this.rotated = rotated || false

    this.domain = (this.rotated ? params.genes : params.donors) || []

    this.width = (this.rotated ? params.height : params.width) || 500

    this.cellHeight = params.trackHeight || 10
    this.cellWidth = this.domain.length > 0 ? this.width / this.domain.length : 0

    this.availableTracks = tracks || []
    this.drawGridLines = params.grid || false

    this.nullSentinel = params.nullSentinel || -777

    this.parseGroups()
  }

  private getPrefix() {
    return this.params.prefix ?? 'og-'
  }

  private getDimensions() {
    return {
      padding: this.params.trackPadding ?? 20,
      margin: this.params.margin || {top: 30, right: 15, bottom: 15, left: 80},
    }
  }

  private isGroupExpandable(group: string) {
    return this.params.expandableGroups?.includes(group) ?? false
  }

  private getTrackGroupParams(groupType) {
    return {
      cellHeight: this.cellHeight,
      width: this.width,
      grid: this.drawGridLines,
      nullSentinel: this.nullSentinel,
      domain: this.domain,
      trackLegendLabel: this.params.trackLegendLabel,
      expandable: this.isGroupExpandable(groupType),
      wrapper: this.params.wrapper,
    }
  }

  /**
   * Parses track groups out of input.
   */
  parseGroups(): void {
    this.groupMap = {} // Nice for lookups and existence checks
    this.groups = [] // Nice for direct iteration
    this.availableTracks.forEach((track) => {
      const groupType = track.group || 'Tracks'
      if (this.groupMap[groupType] !== undefined) {
        const trackGroup = new TrackGroup(
          this.getTrackGroupParams(groupType),
          this.computedProps,
          groupType,
          this.rotated
        )
        trackGroup.on('resize', this.emit)
        trackGroup.on('update', this.emit)
        this.groupMap[groupType] = trackGroup
        this.groups.push(trackGroup)
      }

      this.groupMap[groupType].addTrack(track)
    })
  }

  /**
   * Initializes the track group data and places container for each group in spaced
   * intervals.
   */
  init(): void {
    this.container = this.svg.append('g')

    const labelHeight = this.rotated ? 16.5 : 0
    this.height = 0
    const {padding} = this.getDimensions()

    for (const group of this.groups) {
      const trackContainer = this.container.append('g').attr('transform', 'translate(0,' + this.height + ')')
      group.init(trackContainer)
      this.height += Number(group.totalHeight) + padding
    }

    const translateDown = this.rotated ? -(this.offset + this.height) : padding + this.offset

    this.container
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('class', this.getPrefix() + 'track')
      .attr('transform', function () {
        return (this.rotated ? 'rotate(90)' : '') + 'translate(0,' + translateDown + ')'
      })

    this.height += labelHeight
  }

  /** Calls render on all track groups */
  render(): void {
    for (const group of this.groups) {
      group.render()
    }
  }

  /** Resizes all the track groups */
  resize(width: number, height: number, offset: any): void {
    this.offset = offset || this.offset
    this.width = this.rotated ? height : width
    this.height = 0
    const labelHeight = this.rotated ? 16.5 : 0
    const {padding} = this.getDimensions()

    for (const group of this.groups) {
      group.container.attr('transform', 'translate(0,' + this.height + ')')
      group.resize(this.width)
      this.height += Number(group.totalHeight) + padding
    }

    const translateDown = this.rotated ? -(this.offset + this.height) : padding + this.offset

    this.container
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('transform', function () {
        return (this.rotated ? 'rotate(90)' : '') + 'translate(0,' + translateDown + ')'
      })

    this.height += labelHeight
  }

  /**
   * Updates the rendering of the tracks.
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

export default Track
