import * as d3 from 'd3'
import EventEmitter from 'eventemitter3'
import {HistogramParams, MainGridParams, OncoTrackParams} from '../interfaces/main-grid.interface'

import Histogram from './Histogram'
import Track from './Track'

class MainGrid extends EventEmitter {
  private params: MainGridParams
  private x: any
  private y: any
  private lookupTable: any
  private updateCallback: () => void
  private histogramHeight: any
  private donorTrack: any
  private geneHistogram: any
  private geneTrack: any
  private cnvGeneHistogram: any
  private scaleToFit: boolean
  private leftTextWidth: number
  private prefix: string
  private minCellHeight: number
  private donors: any[]
  private genes: any[]
  private types: any[]
  private ssmObservations: any[]
  private cnvObservations: any[]
  private observations: any[]
  private wrapper: any
  private colorMap: any
  private numDonors: number
  private numGenes: number
  private numTypes: number
  private width: number
  private height: number
  private inputWidth: number
  private inputHeight: number
  private cellWidth: number
  private cellHeight: number
  private margin: { top: number, right: number, bottom: number, left: number }
  private heatMap: boolean
  private drawGridLines: boolean
  private crosshair: boolean
  private heatMapColor: string
  private svg: any

  private container: any
  private background: any
  private gridContainer: any
  private verticalCross: any
  private horizontalCross: any
  private selectionRegion: any
  private column: any
  private row: any
  private geneMap: any

  constructor(params: MainGridParams, lookupTable: any, x: any, y: any) {
    super()
    this.params =
      this.x = x
    this.y = y
    this.lookupTable = lookupTable

    this.loadParams(params)
    this.createGeneMap()
    this.init()

    const trackParams = this.getTrackParams()
    const histogramParams = this.getHistogramParams()

    this.donorTrack = new Track(
      trackParams,
      {
        opacity: params.donorOpacityFunc,
        fill: params.donorFillFunc,
      },
      this.container,
      false,
      params.donorTracks ?? [],
      this.height
    )
    this.donorTrack.on('resize', this.emit)
    this.donorTrack.on('update', this.emit)

    this.donorTrack.init()

    this.geneHistogram = new Histogram(histogramParams, this.container, true)
    this.geneTrack =
      new Track(
        trackParams,
        {
          opacity: params.geneOpacityFunc,
          fill: params.geneFillFunc,
        },
        this.container,
        true,
        params.geneTracks ?? [],
        this.width + (this.histogramHeight * this.numTypes)
      )
    this.geneTrack.on('resize', this.emit)
    this.donorTrack.on('update', this.emit)
    this.geneTrack.init()

    this.cnvGeneHistogram = new Histogram(histogramParams, this.container, true, 'cnv')
  }

  private getTrackParams(): OncoTrackParams {
    return {
      trackPadding: this.params.trackPadding,
      offset: this.params.offset,
      prefix: this.params.prefix,
      trackLegendLabel: this.params.trackLegendLabel,
      margin: this.params.margin,
      genes: this.params.genes,
      donors: this.params.donors,
      width: this.params.width,
      height: this.params.height,
      trackHeight: this.params.trackHeight,
      nullSentinel: this.params.nullSentinel,
      grid: this.params.grid,
      wrapper: this.params.wrapper,
      expandableGroups: this.params.expandableGroups,
    }
  }

  private getHistogramParams(): HistogramParams {
    return {
      histogramBorderPadding: this.params.histogramBorderPadding,
      prefix: this.params.prefix,
      type: this.params.type,
      genes: this.params.genes,
      donors: this.params.donors,
      margin: this.params.margin,
      width: this.params.width,
      height: this.params.height,
      wrapper: this.params.wrapper,
    }
  }

  /**
   * Responsible for initializing instance fields of MainGrid from the provided params object.
   * @param params
   */
  private loadParams(params: MainGridParams) {
    this.scaleToFit = typeof params.scaleToFit === 'boolean' ? params.scaleToFit : true
    this.leftTextWidth = params.leftTextWidth || 80
    this.prefix = params.prefix || 'og-'

    this.minCellHeight = params.minCellHeight || 10
    this.donors = params.donors || []
    this.genes = params.genes || []
    this.types = []
    this.ssmObservations = params.ssmObservations || []
    this.cnvObservations = params.cnvObservations || []
    this.observations = this.cnvObservations.concat(this.ssmObservations) || []
    if (this.cnvObservations.length) {
      this.types.push('cnv')
    }
    if (this.ssmObservations.length) {
      this.types.push('mutation')
    }

    this.wrapper = d3.select(params.wrapper || 'body')

    this.colorMap = params.colorMap || {
      'missense_variant': '#ff9b6c',
      'frameshift_variant': '#57dba4',
      'stop_gained': '#af57db',
      'start_lost': '#ff2323',
      'stop_lost': '#d3ec00',
      'initiator_codon_variant': '#5abaff',
    }

    this.numDonors = this.donors.length
    this.numGenes = this.genes.length
    this.numTypes = this.types.length

    this.width = params.width || 500
    this.height = params.height || 500
    this.inputWidth = params.width || 500
    this.inputHeight = params.height || 500

    this.cellWidth = this.width / this.donors.length

    this.cellHeight = this.height / this.numGenes

    if (this.cellHeight < this.minCellHeight) {
      this.cellHeight = this.minCellHeight
      params.height = this.numGenes * this.minCellHeight
      this.height = params.height
    }

    this.margin = params.margin || {top: 30, right: 100, bottom: 15, left: 80}
    this.heatMap = params.heatMap

    this.drawGridLines = params.grid || false
    this.crosshair = false
    this.heatMapColor = params.heatMapColor || '#D33682'
  }

  /**
   * Creates main svg element, background, and tooltip.
   */
  private init() {
    this.svg = this.wrapper.append('svg')
      .attr('class', this.prefix + 'maingrid-svg')
      .attr('id', this.prefix + 'maingrid-svg')
      .attr('width', '100%')
      .style('position', 'absolute')
      .style('top', 0)
      .style('left', 0)

    this.container = this.svg
      .append('g')

    this.background = this.container.append('rect')
      .attr('class', 'background')
      .attr('width', this.width)
      .attr('height', this.height)

    this.gridContainer = this.container.append('g')
  }

  /**
   * Only to be called the first time the OncoGrid is rendered. It creates the rects representing the
   * mutation occurrences.
   */
  public render() {
    this.emit('render:mainGrid:start')
    this.computeCoordinates()

    this.svg.on('mouseover', (d: any) => {
      const target = d3.event.target
      const coord = d3.mouse(target)

      const xIndex = this.rangeToDomain(this.x, coord[0])
      const yIndex = this.rangeToDomain(this.y, coord[1])

      if (!target.dataset.obsIndex || this.crosshair) {
        return
      }
      const obsIds = target.dataset.obsIndex.split(' ')
      const obs = this.observations.filter((o: any) => {
        return o.donorId === obsIds[0] && o.geneId === obsIds[1]
      })

      this.emit('gridMouseOver', {
        observation: obs,
        donor: this.donors[xIndex],
        gene: this.genes[yIndex],
      })
    })

    this.svg.on('mouseout', () => {
      this.emit('gridMouseOut')
    })

    this.svg.on('click', () => {
      const obsIds = d3.event.target.dataset.obsIndex?.split(' ')
      if (!obsIds) {
        return
      }

      const observation = this.observations.filter((o: any) => {
        return o.donorId === obsIds[0] && o.geneId === obsIds[1]
      })
      if (!observation) {
        return
      }
      this.emit('gridClick', {donorId: obsIds[0], geneId: obsIds[1]})
    })

    this.container
      .selectAll(`.${this.prefix}maingrid-svg`)
      .data(this.observations)
      .enter()
      .append('path')
      .attr('data-obs-index', (d: any, i: number) => {
        return `${d.donorId} ${d.geneId}`
      })
      .attr('class', (d: any) => {
        return `${this.prefix}sortable-rect-${d.type} ${this.prefix}${d.donorId}-cell ${this.prefix}${d.geneId}-cell`
      })
      .attr('cons', (d: any) => {
        return this.getValueByType(d)
      })
      .attr('d', (d: any) => {
        if (d.type === 'cnv' || this.heatMap) {
          return this.getRectangularPath(d)
        }
        return this.getCircularPath(d)
      })
      .attr('fill', (d: any) => {
        return this.getColor(d)
      })
      .attr('opacity', (d: any) => {
        return this.getOpacity(d)
      })

    this.emit('render:mainGrid:end')

    if (this.cnvObservations.length) {
      this.emit('render:cnvDonorHistogram:start')
      this.cnvDonorHistogram.render()
      this.emit('render:cnvDonorHistogram:end')

      this.emit('render:cnvGeneHistogram:start')
      this.cnvGeneHistogram.render()
      this.emit('render:cnvGeneHistogram:end')
    }

    if (this.ssmObservations.length) {
      this.emit('render:donorHistogram:start')
      this.donorHistogram.render()
      this.emit('render:donorHistogram:end')

      this.emit('render:geneHistogram:start')
      this.geneHistogram.render()
      this.emit('render:geneHistogram:end')
    }

    this.emit('render:donorTrack:start')
    this.donorTrack.render()
    this.emit('render:donorTrack:end')

    this.emit('render:geneTrack:start')
    this.geneTrack.render()
    this.emit('render:geneTrack:end')

    this.defineCrosshairBehaviour()

    this.resizeSvg()
  }

  /**
   * Render function ensures presentation matches the data. Called after modifying data.
   */
  public update(x: number, y: number) {
    this.createGeneMap()

    this.x = x
    this.y = y

    // Recalculate positions and dimensions of cells only on change in number of elements
    if (this.numDonors !== this.donors.length || this.numGenes !== this.genes.length) {
      this.numDonors = this.donors.length
      this.numGenes = this.genes.length
      this.cellWidth = this.width / this.donors.length
      this.cellHeight = this.height / this.genes.length
      this.computeCoordinates()
    } else {
      this.row.selectAll('text').attr('style', () => {
        if (this.cellHeight < this.minCellHeight) {
          return 'display: none;'
        } else {
          return ''
        }
      })
    }

    this.row
      .transition()
      .attr('transform', (d: any) => {
        return 'translate( 0, ' + d.y + ')'
      })

    for (let i = 0; i < this.numTypes; i++) {
      this.container
        .selectAll('.' + this.prefix + 'sortable-rect-' + this.types[i])
        .transition()
        .attr('d', (d: any) => {
          if (d.type === 'cnv' || this.heatMap) {
            return this.getRectangularPath(d)
          }
          return this.getCircularPath(d)
        })
    }

    this.donorTrack.update(this.donors)
    this.geneTrack.update(this.genes)
  }


  /**
   * Updates coordinate system and renders the lines of the grid.
   */
  private computeCoordinates() {
    this.cellWidth = this.width / this.donors.length

    if (typeof this.column !== 'undefined') {
      this.column.remove()
    }

    if (this.drawGridLines) {
      this.column = this.gridContainer.selectAll('.' + this.prefix + 'donor-column')
        .data(this.donors)
        .enter()
        .append('line')
        .attr({
          x1: (d: any) => d.x,
          x2: (d: any) => d.x,
          y2: this.height,
          'class': this.prefix + 'donor-column',
        })
        .style('pointer-events', 'none')
    }

    this.cellHeight = this.height / this.genes.length

    if (typeof this.row !== 'undefined') {
      this.row.remove()
    }

    this.row = this.gridContainer.selectAll('.' + this.prefix + 'gene-row')
      .data(this.genes)
      .enter().append('g')
      .attr('class', this.prefix + 'gene-row')
      .attr('transform', (d: any) => {
        return 'translate(0,' + d.y + ')'
      })

    if (this.drawGridLines) {
      this.row.append('line')
        .attr('x2', this.width)
        .style('pointer-events', 'none')
    }

    this.row.append('text')
      .attr('class', (g: any) => {
        return this.prefix + g.id + '-label ' + this.prefix + 'gene-label ' + this.prefix + 'label-text-font'
      })
      .attr('x', -8)
      .attr('y', this.cellHeight / 2)
      .attr('dy', '.32em')
      .attr('text-anchor', 'end')
      .attr('style', () => {
        if (this.cellHeight < this.minCellHeight) {
          return 'display: none;'
        } else {
          return ''
        }
      })
      .text((d: any, i: number) => {
        return this.genes[i].symbol
      })

    this.defineRowDragBehaviour()
  }

  public resize(width: number, height: number, x: any, y: any) {
    this.createGeneMap()

    this.x = x
    this.y = y
    this.width = width
    this.height = height

    this.cellWidth = this.width / this.donors.length
    this.cellHeight = this.height / this.genes.length

    if (this.cellHeight < this.minCellHeight) {
      this.cellHeight = this.minCellHeight
      this.height = this.genes.length * this.minCellHeight
    }

    this.background
      .attr('width', this.width)
      .attr('height', this.height)

    this.computeCoordinates()

    if (this.ssmObservations.length) {
      this.donorHistogram.resize(width, this.height)
      this.geneHistogram.resize(width, this.height)
    }

    if (this.cnvObservations.length) {
      this.cnvDonorHistogram.resize(width, this.height)
      this.cnvGeneHistogram.resize(width, this.height)
    }

    this.donorTrack.resize(width, this.height, this.height)
    this.geneTrack.resize(width, this.height, this.width + this.histogramHeight + 120)

    this.resizeSvg()
    this.update(this.x, this.x)

    this.verticalCross.attr('y2', this.height + this.donorTrack.height)
    this.horizontalCross.attr('x2', this.width + (this.histogramHeight * this.numTypes) + this.geneTrack.height)
  }

  private resizeSvg() {
    const width = this.margin.left + this.leftTextWidth + this.width + (this.histogramHeight * this.numTypes) + this.geneTrack.height + this.margin.right

    const height = this.margin.top + (this.histogramHeight * this.numTypes) + this.height + this.donorTrack.height + this.margin.bottom

    this.svg
      .attr('width', width).attr('height', height)

    this.container
      .attr('transform', 'translate(' +
        (this.margin.left + this.leftTextWidth) + ',' +
        (this.margin.top + (this.histogramHeight * this.numTypes)) +
        ')')
  }

  private defineCrosshairBehaviour() {
    const moveCrossHair = (eventType: string, target: any) => {
      if (this.crosshair) {
        const coord = d3.mouse(target)

        this.verticalCross.attr('x1', coord[0]).attr('opacity', 1)
        this.verticalCross.attr('x2', coord[0]).attr('opacity', 1)
        this.horizontalCross.attr('y1', coord[1]).attr('opacity', 1)
        this.horizontalCross.attr('y2', coord[1]).attr('opacity', 1)

        if (eventType === 'mousemove' && typeof this.selectionRegion !== 'undefined') {
          this.changeSelection(coord)
        }

        const xIndex = this.width < coord[0] ? -1 : this.rangeToDomain(this.x, coord[0])
        const yIndex = this.height < coord[1] ? -1 : this.rangeToDomain(this.y, coord[1])

        const donor = this.donors[xIndex]
        const gene = this.genes[yIndex]

        if (!donor || !gene) {
          return
        }

        this.emit('gridCrosshairMouseOver', {
          donor: donor,
          gene: gene,
        })
      }
    }

    this.verticalCross = this.container.append('line')
      .attr('class', this.prefix + 'vertical-cross')
      .attr('y1', -this.histogramHeight)
      .attr('y2', this.height + this.donorTrack.height)
      .attr('opacity', 0)
      .attr('style', 'pointer-events: none')

    this.horizontalCross = this.container.append('line')
      .attr('class', this.prefix + 'horizontal-cross')
      .attr('x1', 0)
      .attr('x2', this.width + this.histogramHeight + this.geneTrack.height)
      .attr('opacity', 0)
      .attr('style', 'pointer-events: none')

    this.container
      .on('mousedown', () => {
        this.startSelection(this)
      })
      .on('mouseover', () => {
        moveCrossHair('mouseover', this)
      })
      .on('mousemove', () => {
        moveCrossHair('mousemove', this)
      })
      .on('mouseout', () => {
        if (this.crosshair) {
          this.verticalCross.attr('opacity', 0)
          this.horizontalCross.attr('opacity', 0)
          this.emit('gridCrosshairMouseOut')
        }
      })
      .on('mouseup', () => {
        this.finishSelection()
      })
  }

  /**
   * Event behavior when pressing down on the mouse to make a selection
   */
  private startSelection(e: any) {
    if (this.crosshair && typeof this.selectionRegion === 'undefined') {
      d3.event.stopPropagation()
      const coord = d3.mouse(e)

      this.selectionRegion = this.container.append('rect')
        .attr('x', coord[0])
        .attr('y', coord[1])
        .attr('width', 1)
        .attr('height', 1)
        .attr('class', this.prefix + 'selection-region')
        .attr('stroke', 'black')
        .attr('stroke-width', '2')
        .attr('opacity', 0.2)
    }
  }

  /**
   * Event behavior as you drag selected region around
   */
  private changeSelection(coord: number[]) {
    const rect = {
      x: parseInt(this.selectionRegion.attr('x'), 10),
      y: parseInt(this.selectionRegion.attr('y'), 10),
      width: parseInt(this.selectionRegion.attr('width'), 10),
      height: parseInt(this.selectionRegion.attr('height'), 10),
    }

    const move = {
      x: coord[0] - Number(this.selectionRegion.attr('x')),
      y: coord[1] - Number(this.selectionRegion.attr('y')),
    }

    if (move.x < 1 || (move.x * 2 < rect.width)) {
      rect.x = coord[0]
      rect.width -= move.x
    } else {
      rect.width = move.x
    }

    if (move.y < 1 || (move.y * 2 < rect.height)) {
      rect.y = coord[1]
      rect.height -= move.y
    } else {
      rect.height = move.y
    }

    this.selectionRegion.attr(rect)
  }

  /**
   * Event behavior when releasing mouse when finishing with a selection
   */
  private finishSelection() {
    if (this.crosshair && typeof this.selectionRegion !== 'undefined') {
      d3.event.stopPropagation()

      const x1 = Number(this.selectionRegion.attr('x'))
      const x2 = x1 + Number(this.selectionRegion.attr('width'))

      const y1 = Number(this.selectionRegion.attr('y'))
      const y2 = y1 + Number(this.selectionRegion.attr('height'))

      const xStart = this.rangeToDomain(this.x, x1)
      const xStop = this.rangeToDomain(this.x, x2)

      const yStart = this.rangeToDomain(this.y, y1)
      const yStop = this.rangeToDomain(this.y, y2)

      this.sliceDonors(xStart, xStop)
      this.sliceGenes(yStart, yStop)

      this.selectionRegion.remove()
      delete this.selectionRegion

      this.emit('update', true)
    }
  }

  /**
   * Used when resizing grid
   * @param start - start index of the selection
   * @param stop - end index of the selection
   */
  private sliceGenes(start: number, stop: number) {
    for (let i = 0; i < this.genes.length; i++) {
      const gene = this.genes[i]
      if (i < start || i > stop) {
        d3.selectAll('.' + this.prefix + gene.id + '-cell').remove()
        d3.selectAll('.' + this.prefix + gene.id + '-bar').remove()
        this.genes.splice(i, 1)
        i--
        start--
        stop--
      }
    }
  }

  /**
   * Used when resizing grid
   * @param start - start index of the selection
   * @param stop - end index of the selection
   */
  private sliceDonors(start: number, stop: number) {
    for (let i = 0; i < this.donors.length; i++) {
      const donor = this.donors[i]
      if (i < start || i > stop) {
        d3.selectAll('.' + this.prefix + donor.id + '-cell').remove()
        d3.selectAll('.' + this.prefix + donor.id + '-bar').remove()
        this.donors.splice(i, 1)
        i--
        start--
        stop--
      }
    }
  }

  /**
   * Defines the row drag behaviour for moving genes and binds it to the row elements.
   */
  private defineRowDragBehaviour() {
    const drag = d3.behavior.drag()
    drag.on('dragstart', () => {
      d3.event.sourceEvent.stopPropagation() // silence other listeners
    })
    drag.on('drag', () => {
      const trans = d3.event.dy
      const selection = d3.select(this)

      selection.attr('transform', () => {
        const transform = d3.transform(d3.select(this).attr('transform'))
        return 'translate( 0, ' + (parseInt(transform.translate[1]) + trans) + ')'
      })
    })

    drag.on('dragend', (d: any) => {
      const coord = d3.mouse(this.container.node())
      const dragged = this.genes.indexOf(d)
      const yIndex = this.rangeToDomain(this.y, coord[1])

      this.genes.splice(dragged, 1)
      this.genes.splice(yIndex, 0, d)

      this.updateCallback(true)
    })

    const dragSelection = this.row.call(drag)
    dragSelection.on('click', () => {
      if (d3.event.defaultPrevented) {
      }
    })

    this.row.on('mouseover', () => {
      const curElement = this
      if (typeof curElement.timeout !== 'undefined') {
        clearTimeout(curElement.timeout)
      }

      d3.select(this)
        .select('.' + this.prefix + 'remove-gene')
        .attr('style', 'display: block')
    })

    this.row.on('mouseout', () => {
      const curElement = this
      curElement.timeout = setTimeout(() => {
        d3.select(curElement).select('.' + this.prefix + 'remove-gene')
          .attr('style', 'display: none')
      }, 500)
    })
  }

  private createGeneMap() {
    const geneMap = {}
    for (let i = 0; i < this.genes.length; i += 1) {
      const gene = this.genes[i]
      geneMap[gene.id] = gene
    }
    this.geneMap = geneMap
  }

  /**
   * Function that determines the y position of a mutation within a cell
   */
  private getY(d: any) {
    const y = this.geneMap[d.geneId].y

    if (!this.heatMap && d.type === 'mutation') {
      const yPosition = y + this.cellHeight / 2
      if (yPosition < 0) {
        return 0
      }
      return yPosition
    }
    return y
  }

  /**
   * Function that determines the x position of a mutation or cnv within a cell
   */
  private getCellX(d: any) {
    const x = this.lookupTable[d.type][d.donorId].x

    if (!this.heatMap && d.type === 'mutation') {
      return x + (this.cellWidth / 4)
    }
    return x
  }

  /**
   * Returns the color for the given observation.
   * @param d observation.
   */
  private getColor(d: any) {
    const colorKey = d.type === 'cnv' ? d.cnvChange : d.consequence
    if (this.heatMap === true) {
      return this.heatMapColor
    } else {
      return this.colorMap[d.type][colorKey]
    }
  }

  /**
   * Returns the desired opacity of observation rects. This changes between heatmap and regular mode.
   * @returns {number}
   */
  private getOpacity(d: any) {
    if (this.heatMap === true) {
      return 0.25
    } else {
      return 1
    }
  }

  /**
   * Returns the height of an observation cell.
   * @returns {number}
   */
  private getHeight(d: any) {
    if (typeof d !== 'undefined') {
      if (!this.heatMap === true && d.type === 'mutation') {
        if (this.cellWidth > this.cellHeight) {
          return this.cellHeight / 2
        }
        return (this.cellWidth / 2)
      } else {
        return this.cellHeight
      }
    } else {
      return 0
    }
  }

  private getCellWidth(d: any) {
    if (this.heatMap || d.type === 'cnv') {
      return this.cellWidth
    }
    if (this.cellWidth > this.cellHeight) {
      return this.cellHeight / 4
    }
    return this.cellWidth / 4
  }

  /**
   * Returns the correct observation value based on the data type.
   */
  private getValueByType(d: any) {
    if (d.type === 'cnv') {
      return d.cnvChange
    }
    return d.consequence
  }

  /**
   * Returns circular path based on cell dimensions
   */
  private getCircularPath(d: any) {
    const x1 = this.getCellX(d)
    const y1 = this.getY(d)
    return 'M ' + (x1 + this.cellWidth / 4) + ', ' + y1 + ' m ' + (-1 * this.getCellWidth(d)) + ', 0 ' + 'a ' + this.getCellWidth(d) + ', ' + this.getCellWidth(d) + ' 0 1,0 ' + (2 * this.getCellWidth(d)) + ',0 a ' + this.getCellWidth(d) + ',' + this.getCellWidth(d) + ' 0 1,0 ' + (-1 * (2 * this.getCellWidth(d))) + ',0'
  }

  /**
   * Returns rectangular path based on cell dimensions
   */
  private getRectangularPath(d: any) {
    const x1 = this.getCellX(d)
    const y1 = this.getY(d)
    return 'M ' + x1 + ' ' + y1 + ' H ' + (x1 + this.cellWidth) + ' V ' + (y1 + this.getHeight(d)) + ' H ' + x1 + 'Z'
  }

  /**
   * set the observation rects between heatmap and regular mode.
   */
  public setHeatmap(active: boolean) {
    if (active === this.heatMap) return this.heatMap
    this.heatMap = active

    for (let i = 0; i < this.numTypes; i++) {
      d3.selectAll('.' + this.prefix + 'sortable-rect-' + this.types[i])
        .transition()
        .attr('d', (d: any) => {
          if (d.type === 'cnv' || this.heatMap) {
            return this.getRectangularPath(d)
          }
          return this.getCircularPath(d)
        })
        .attr('fill', (d: any) => {
          return this.getColor(d)
        })
        .attr('opacity', (d: any) => {
          return this.getOpacity(d)
        })
    }


    return this.heatMap
  }

  public setGridLines(active: boolean) {
    if (this.drawGridLines === active) return this.drawGridLines
    this.drawGridLines = active

    this.geneTrack.setGridLines(this.drawGridLines)
    this.donorTrack.setGridLines(this.drawGridLines)

    this.computeCoordinates()

    return this.drawGridLines
  }

  public setCrosshair(active: boolean) {
    this.crosshair = active

    return this.crosshair
  }

  /**
   * Helper for getting donor index position
   */
  private getDonorIndex(donors: any[], donorId: any) {
    for (let i = 0; i < donors.length; i++) {
      const donor = donors[i]
      if (donor.id === donorId) {
        return i
      }
    }

    return -1
  }

  /**
   * Removes all elements corresponding to the given gene and then removes it from the gene list.
   * @param i index of the gene to remove.
   */
  public removeGene(i: number) {
    const gene = this.genes[i]
    if (gene) {
      d3.selectAll('.' + this.prefix + gene.id + '-cell').remove()
      d3.selectAll('.' + this.prefix + gene.id + '-bar').remove()
      this.genes.splice(i, 1)
    }

    this.updateCallback(true)
  }


  private rangeToDomain(scale: any, value: any) {
    return scale.domain()[d3.bisect(scale.range(), value) - 1]
  }


  private nullableObsLookup(donor: any, gene: any) {
    if (!donor || typeof donor !== 'object') return null
    if (!gene || typeof gene !== 'object') return null

    if (this.lookupTable?.[donor.id]?.[gene.id]) {
      return this.lookupTable[donor.id][gene.id].join(', ') // Table stores arrays and we want to return a string;
    } else {
      return null
    }
  }

  /**
   * Removes all svg elements for this grid.
   */
  public destroy() {
    this.wrapper.select('.' + this.prefix + 'maingrid-svg').remove()
  }
}

export default MainGrid
