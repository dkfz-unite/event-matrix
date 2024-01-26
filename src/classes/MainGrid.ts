import * as d3 from 'd3'
import {D3DragEvent, ScaleBand, Selection} from 'd3'
import {BaseType, BlockType, ColorMap, CssMarginProps} from '../interfaces/base.interface'
import {IDonor, IGene, IObservation} from '../interfaces/bioinformatics.interface'
import {
  HistogramParams,
  IDescriptionBlockParams,
  IDomainEntity,
  IEnhancedEvent,
  MainGridParams
} from '../interfaces/main-grid.interface'
import {eventBus, innerEvents, publicEvents, renderEvents} from '../utils/event-bus'
import {storage} from '../utils/storage'
import {parseTransform} from '../utils/utils'
import DescriptionBlock from './DescriptionBlock'

import Histogram from './Histogram'

class MainGrid {
  private params: MainGridParams
  private x: ScaleBand<string>
  private y: ScaleBand<string>
  private donorDescriptionBlock: DescriptionBlock
  private geneHistogram: Histogram
  private donorHistogram: Histogram
  private geneDescriptionBlock: DescriptionBlock
  private scaleToFit = true
  private leftTextWidth = 80
  private types: BaseType[] = [BaseType.Mutation]
  private wrapper!: Selection<HTMLElement, any, HTMLElement, any>
  private svg!: Selection<SVGSVGElement, any, HTMLElement, any>
  private container!: Selection<SVGGElement, any, HTMLElement, any>
  private background!: Selection<SVGRectElement, any, HTMLElement, any>
  private gridContainer!: Selection<SVGGElement, any, HTMLElement, any>
  private colorMap: ColorMap = {
    'missense_variant': '#ff9b6c',
    'frameshift_variant': '#57dba4',
    'stop_gained': '#af57db',
    'start_lost': '#ff2323',
    'stop_lost': '#d3ec00',
    'initiator_codon_variant': '#5abaff',
  }
  private width = 500
  private height = 500
  private inputWidth = 500
  private inputHeight = 500
  private cellWidth!: number
  private cellHeight!: number
  private margin: CssMarginProps = {top: 30, right: 100, bottom: 15, left: 80}
  public heatMap = false
  public drawGridLines = false
  public crosshair = false
  private heatMapColor = '#D33682'
  private verticalCross: any
  private horizontalCross: any
  private selectionRegion: any
  private column: any
  private row: any
  private geneMap: any
  public fullscreen = false

  constructor(params: MainGridParams, x: ScaleBand<string>, y: ScaleBand<string>) {
    this.params = params
    this.x = x
    this.y = y

    this.loadParams(params)
    this.createGeneMap()
    this.init()

    const descriptionBlockParams = this.getDescriptionBlockParams()
    const histogramParams = this.getHistogramParams()
    this.donorHistogram = new Histogram(histogramParams, this.container, false)
    this.donorDescriptionBlock = new DescriptionBlock(
      descriptionBlockParams,
      BlockType.Donor,
      this.container,
      false,
      params.donorTracks ?? [],
      this.height
    )
    this.donorDescriptionBlock.init()

    this.geneHistogram = new Histogram(histogramParams, this.container, true)
    this.geneDescriptionBlock =
      new DescriptionBlock(
        descriptionBlockParams,
        BlockType.Gene,
        this.container,
        true,
        params.geneTracks ?? [],
        this.width + (this.donorHistogram.getHistogramHeight() * this.types.length)
      )
    this.geneDescriptionBlock.init()
  }

  private getDescriptionBlockParams(): IDescriptionBlockParams {
    return {
      padding: this.params.trackPadding,
      offset: this.params.offset,
      label: this.params.trackLegendLabel,
      margin: this.params.margin,
      genes: this.params.genes,
      donors: this.params.donors,
      width: this.params.width,
      parentHeight: this.params.height,
      height: this.params.trackHeight,
      nullSentinel: this.params.nullSentinel,
      grid: this.params.grid,
      wrapper: this.params.wrapper,
      expandableGroups: this.params.expandableGroups,
    }
  }

  private getHistogramParams(): HistogramParams {
    return {
      histogramBorderPadding: this.params.histogramBorderPadding,
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
  private loadParams({
    scaleToFit,
    leftTextWidth,
    wrapper,
    colorMap,
    width,
    height,
    margin,
    heatMap,
    heatMapColor,
    grid,
  }: MainGridParams) {
    if (scaleToFit !== undefined) {
      this.scaleToFit = scaleToFit
    }
    if (leftTextWidth !== undefined) {
      this.leftTextWidth = leftTextWidth
    }
    this.wrapper = d3.select(wrapper || 'body')
    if (colorMap !== undefined) {
      this.colorMap = colorMap
    }

    if (width !== undefined) {
      this.width = width
      this.inputWidth = width
    }
    if (height !== undefined) {
      this.height = height
      this.inputHeight = height
    }

    this.cellWidth = this.width / storage.donors.length
    this.cellHeight = this.height / storage.genes.length

    if (this.cellHeight < storage.minCellHeight) {
      this.cellHeight = storage.minCellHeight
      this.height = storage.genes.length * storage.minCellHeight
    }

    if (margin !== undefined) {
      this.margin = margin
    }
    if (heatMap !== undefined) {
      this.heatMap = heatMap
    }
    if (grid !== undefined) {
      this.drawGridLines = grid
    }
    if (heatMapColor !== undefined) {
      this.heatMapColor = heatMapColor
    }
  }

  /**
   * Creates main svg element, background, and tooltip.
   */
  private init() {
    this.svg = this.wrapper.append('svg')
      .attr('class', `${storage.prefix}maingrid-svg`)
      .attr('id', `${storage.prefix}maingrid-svg`)
      .attr('width', '100%')
    // .style('position', 'absolute')
    // .style('top', 0)
    // .style('left', 0)

    // n=t.margin.left+t.leftTextWidth+t.width+t.histogramHeight+t.geneTrack.height+t.margin.right

    this.container = this.svg.append('g')

    this.background = this.container.append('rect')
      .attr('class', `${storage.prefix}background`)
      .attr('width', this.width)
      .attr('height', this.height)

    this.gridContainer = this.container.append('g')
  }

  /**
   * Only to be called the first time the OncoGrid is rendered. It creates the rects representing the
   * mutation occurrences.
   */
  public render() {
    eventBus.emit(renderEvents.RENDER_GRID_START)
    this.computeCoordinates()

    this.svg.on('mouseover', (event: IEnhancedEvent) => {
      const target = event.target
      const coord = d3.pointer(event, target)

      const xIndex = this.getIndexFromScaleBand(this.x, coord[0])
      const yIndex = this.getIndexFromScaleBand(this.y, coord[1])

      if (!target.dataset.obsIndex || this.crosshair) {
        return
      }
      const obsIds = target.dataset.obsIndex.split(' ')
      const obs = storage.observations.filter((observation: IObservation) => {
        return observation.donorId === obsIds[0] && observation.geneId === obsIds[1]
      })
      const targetObservation = obs.find((observation: IObservation) => {
        return observation.id == obsIds[2]
      })

      eventBus.emit(publicEvents.GRID_CELL_HOVER, {
        target: target,
        observations: obs,
        observation: targetObservation,
        donor: storage.donors[xIndex],
        gene: storage.genes[yIndex],
      })
    })

    this.svg.on('mouseout', () => {
      eventBus.emit(publicEvents.GRID_OUT)
    })

    this.svg.on('click', (event: IEnhancedEvent) => {
      const obsIds = event.target.dataset.obsIndex?.split(' ')
      if (!obsIds) {
        return
      }

      const obs = storage.observations.filter((observation: IObservation) => {
        return observation.donorId === obsIds[0] && observation.geneId === obsIds[1]
      })
      const targetObservation = obs.find((observation: IObservation) => {
        return observation.id == obsIds[2]
      })

      eventBus.emit(publicEvents.GRID_CELL_CLICK, {
        target: event.target,
        donorId: obsIds[0],
        geneId: obsIds[1],
        observation: targetObservation,
      })
    })

    this.container
      .selectAll(`.${storage.prefix}maingrid-svg`)
      .data(storage.observations)
      .enter()
      .append('path')
      .attr('data-obs-index', (obs: IObservation, i: number) => {
        return `${obs.donorId} ${obs.geneId} ${obs.id}`
      })
      .attr('class', (obs: IObservation) => {
        return `${storage.prefix}sortable-rect ${storage.prefix}${obs.donorId}-cell ${storage.prefix}${obs.geneId}-cell`
      })
      .attr('cons', (obs: IObservation) => {
        return this.getValueByType(obs)
      })
      .attr('d', (obs: IObservation) => {
        return this.getRectangularPath(obs)
      })
      .attr('fill', (obs: IObservation) => {
        return this.getColor(obs)
      })
      .attr('opacity', (obs: IObservation) => {
        return this.getOpacity(obs)
      })

    eventBus.emit(renderEvents.RENDER_GRID_END)

    if (storage.observations.length) {
      eventBus.emit(renderEvents.RENDER_X_HISTOGRAM_START)
      this.donorHistogram.render()
      eventBus.emit(renderEvents.RENDER_X_HISTOGRAM_END)

      eventBus.emit(renderEvents.RENDER_Y_HISTOGRAM_START)
      this.geneHistogram.render()
      eventBus.emit(renderEvents.RENDER_Y_HISTOGRAM_END)
    }

    eventBus.emit(renderEvents.RENDER_X_DESCRIPTION_BLOCK_START)
    this.donorDescriptionBlock.render()
    eventBus.emit(renderEvents.RENDER_X_DESCRIPTION_BLOCK_END)

    eventBus.emit(renderEvents.RENDER_Y_DESCRIPTION_BLOCK_START)
    this.geneDescriptionBlock.render()
    eventBus.emit(renderEvents.RENDER_Y_DESCRIPTION_BLOCK_END)

    this.defineCrosshairBehaviour()

    this.resizeSvg()
  }

  /**
   * Render function ensures presentation matches the data. Called after modifying data.
   */
  public update(x: ScaleBand<string>, y: ScaleBand<string>) {
    this.computeCoordinates()
    this.createGeneMap()

    this.x = x
    this.y = y

    this.row.selectAll('text').attr('style', () => {
      if (this.cellHeight < storage.minCellHeight) {
        return 'display: none;'
      } else {
        return ''
      }
    })

    this.row
      .transition()
      .attr('transform', (d: any) => {
        return 'translate( 0, ' + d.y + ')'
      })

    for (let i = 0; i < this.types.length; i++) {
      this.container
        .selectAll(`.${storage.prefix}sortable-rect`)
        .transition()
        .attr('d', (obs: IObservation) => {
          return this.getRectangularPath(obs)
        })
    }

    this.donorDescriptionBlock.update(storage.donors as IDomainEntity[])
    this.geneDescriptionBlock.update(storage.genes as IDomainEntity[])
    this.donorHistogram.update(storage.donors as IDomainEntity[])
    this.geneHistogram.update(storage.genes as IDomainEntity[])
  }


  /**
   * Updates coordinate system and renders the lines of the grid.
   */
  private computeCoordinates() {
    this.cellWidth = this.width / storage.donors.length

    if (this.column !== undefined) {
      this.column.remove()
    }

    if (this.drawGridLines) {
      this.column = this.gridContainer.selectAll(`.${storage.prefix}donor-column`)
        .data(storage.donors)
        .enter()
        .append('line')
        .attr('x1', (donor: IDonor) => donor.x)
        .attr('x2', (donor: IDonor) => donor.x)
        .attr('y1', 0)
        .attr('y2', this.height)
        .attr('class', `${storage.prefix}donor-column`)
        .style('pointer-events', 'none')
    }

    this.cellHeight = this.height / storage.genes.length

    if (this.row !== undefined) {
      this.row.remove()
    }

    this.row = this.gridContainer.selectAll(`.${storage.prefix}gene-row`)
      .data(storage.genes)
      .enter()
      .append('g')
      .attr('class', `${storage.prefix}gene-row`)
      .attr('transform', (d: IGene) => {
        return 'translate(0,' + d.y + ')'
      })

    if (this.drawGridLines) {
      this.row.append('line')
        .attr('x2', this.width)
        .style('pointer-events', 'none')
    }

    this.row.append('text')
      .attr('class', (g: any) => {
        return `${storage.prefix}${g.id}-label ${storage.prefix}gene-label ${storage.prefix}label-text-font`
      })
      .attr('x', -8)
      .attr('y', this.cellHeight / 2)
      .attr('dy', '.32em')
      .attr('text-anchor', 'end')
      .attr('style', () => {
        if (this.cellHeight < storage.minCellHeight) {
          return 'display: none;'
        } else {
          return ''
        }
      })
      .text((d: any, i: number) => {
        return storage.genes[i].symbol
      })

    this.defineRowDragBehaviour()
  }

  public resize(width: number, height: number, x: ScaleBand<string>, y: ScaleBand<string>) {
    this.createGeneMap()

    this.x = x
    this.y = y
    this.width = width
    this.height = height

    this.cellWidth = this.width / storage.donors.length
    this.cellHeight = this.height / storage.genes.length

    if (this.cellHeight < storage.minCellHeight) {
      this.cellHeight = storage.minCellHeight
      this.height = storage.genes.length * storage.minCellHeight
    }

    this.background
      .attr('width', this.width)
      .attr('height', this.height)

    this.computeCoordinates()

    if (storage.observations.length) {
      this.donorHistogram.resize(width, this.height)
      this.geneHistogram.resize(width, this.height)
    }
    const histogramHeight = this.donorHistogram.getHistogramHeight()
    this.donorDescriptionBlock.resize(width, this.height, this.height)
    this.geneDescriptionBlock.resize(width, this.height, this.width + histogramHeight + 120)

    this.resizeSvg()
    this.update(this.x, this.y)

    this.verticalCross.attr('y2', this.height + this.donorDescriptionBlock.height)
    this.horizontalCross.attr('x2', this.width + (histogramHeight * this.types.length) + this.geneDescriptionBlock.height)
  }

  private resizeSvg() {
    const histogramHeight = this.donorHistogram.getHistogramHeight()
    const width = this.margin.left + this.leftTextWidth + this.width + (histogramHeight * this.types.length) + this.geneDescriptionBlock.height + this.margin.right
    const height = this.margin.top + (histogramHeight * this.types.length) + this.height + this.donorDescriptionBlock.height + this.margin.bottom

    this.svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)

    this.container
      .attr('transform', 'translate(' +
        (this.margin.left + this.leftTextWidth) + ',' +
        (this.margin.top + (histogramHeight * this.types.length)) +
        ')')
  }

  private defineCrosshairBehaviour() {
    const moveCrossHair = (eventType: string, event: IEnhancedEvent) => {
      if (this.crosshair) {
        const coord = d3.pointer(event, event.target)

        this.verticalCross.attr('x1', coord[0]).attr('opacity', 1)
        this.verticalCross.attr('x2', coord[0]).attr('opacity', 1)
        this.horizontalCross.attr('y1', coord[1]).attr('opacity', 1)
        this.horizontalCross.attr('y2', coord[1]).attr('opacity', 1)

        if (eventType === 'mousemove' && this.selectionRegion !== undefined) {
          this.changeSelection(coord)
        }

        const xIndex = this.width < coord[0] ? -1 : this.getIndexFromScaleBand(this.x, coord[0])
        const yIndex = this.height < coord[1] ? -1 : this.getIndexFromScaleBand(this.y, coord[1])

        const donor = storage.donors[xIndex]
        const gene = storage.genes[yIndex]

        if (!donor || !gene) {
          return
        }

        eventBus.emit(publicEvents.GRID_CROSSHAIR_HOVER, {
          donor: donor,
          gene: gene,
        })
      }
    }

    const histogramHeight = this.donorHistogram.getHistogramHeight()

    this.verticalCross = this.container.append('line')
      .attr('class', `${storage.prefix}vertical-cross`)
      .attr('y1', -histogramHeight)
      .attr('y2', this.height + this.donorDescriptionBlock.height)
      .attr('opacity', 0)
      .attr('style', 'pointer-events: none')

    this.horizontalCross = this.container.append('line')
      .attr('class', `${storage.prefix}horizontal-cross`)
      .attr('x1', 0)
      .attr('x2', this.width + histogramHeight + this.geneDescriptionBlock.height)
      .attr('opacity', 0)
      .attr('style', 'pointer-events: none')

    this.container
      .on('mousedown', (event: IEnhancedEvent) => {
        this.startSelection(event)
      })
      .on('mouseover', (event: IEnhancedEvent) => {
        moveCrossHair('mouseover', event)
      })
      .on('mousemove', (event: IEnhancedEvent) => {
        moveCrossHair('mousemove', event)
      })
      .on('mouseout', () => {
        if (this.crosshair) {
          this.verticalCross.attr('opacity', 0)
          this.horizontalCross.attr('opacity', 0)

          eventBus.emit(publicEvents.GRID_CROSSHAIR_OUT)
        }
      })
      .on('mouseup', (event: IEnhancedEvent) => {
        this.verticalCross.attr('opacity', 0)
        this.horizontalCross.attr('opacity', 0)
        this.finishSelection(event)
      })
  }

  /**
   * Event behavior when pressing down on the mouse to make a selection
   */
  private startSelection(event: IEnhancedEvent) {
    if (this.crosshair && this.selectionRegion === undefined) {
      eventBus.emit(publicEvents.GRID_SELECTION_STARTED)
      event.stopPropagation()
      const coord = d3.pointer(event, event.target)

      this.selectionRegion = this.container.append('rect')
        .attr('x', coord[0])
        .attr('y', coord[1])
        .attr('width', 1)
        .attr('height', 1)
        .attr('class', `${storage.prefix}selection-region`)
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

    this.selectionRegion.attr('x', rect.x)
    this.selectionRegion.attr('y', rect.y)
    this.selectionRegion.attr('width', rect.width)
    this.selectionRegion.attr('height', rect.height)
  }

  private getIndexFromScaleBand(scaleBand: ScaleBand<string>, coord: number) {
    const step = scaleBand.step()
    const index = Math.floor(coord / step)
    return scaleBand.domain()[index]
  }

  /**
   * Event behavior when releasing mouse when finishing with a selection
   */
  private finishSelection(event: IEnhancedEvent) {
    if (this.crosshair && this.selectionRegion !== undefined) {
      event.stopPropagation()

      const x1 = Number(this.selectionRegion.attr('x'))
      const x2 = x1 + Number(this.selectionRegion.attr('width'))

      const y1 = Number(this.selectionRegion.attr('y'))
      const y2 = y1 + Number(this.selectionRegion.attr('height'))

      const xStart = this.getIndexFromScaleBand(this.x, x1)
      const xStop = this.getIndexFromScaleBand(this.x, x2)

      const yStart = this.getIndexFromScaleBand(this.y, y1)
      const yStop = this.getIndexFromScaleBand(this.y, y2)

      this.sliceDonors(parseInt(xStart), parseInt(xStop))
      this.sliceGenes(parseInt(yStart), parseInt(yStop))

      this.selectionRegion.remove()
      delete this.selectionRegion

      eventBus.emit(publicEvents.GRID_SELECTION_FINISHED)
      eventBus.emit(innerEvents.INNER_UPDATE, true)
    }
  }

  /**
   * Used when resizing grid
   * @param start - start index of the selection
   * @param stop - end index of the selection
   */
  private sliceGenes(start: number, stop: number) {
    for (let i = 0; i < storage.genes.length; i++) {
      const gene = storage.genes[i]
      if (i < start || i > stop) {
        d3.selectAll(`.${storage.prefix}${gene.id}-cell`).remove()
        d3.selectAll(`.${storage.prefix}${gene.id}-bar`).remove()
        storage.genes.splice(i, 1)
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
    for (let i = 0; i < storage.donors.length; i++) {
      const donor = storage.donors[i]
      if (i < start || i > stop) {
        d3.selectAll(`.${storage.prefix}${donor.id}-cell`).remove()
        d3.selectAll(`.${storage.prefix}${donor.id}-bar`).remove()
        storage.donors.splice(i, 1)
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
    const drag = d3.drag()
      .on('start', (event: D3DragEvent<any, any, any>) => {
        event.sourceEvent.stopPropagation()
      })
      .on('drag', (event: D3DragEvent<any, any, any>) => {
        const trans = event.dy
        const selection = d3.select(event.sourceEvent.target)

        selection.attr('transform', (element) => {
          const transform = selection.attr('transform')
          let translate = [0, 0]
          if (transform !== null) {
            const parsedTransform = parseTransform(transform)
            translate = parsedTransform.translate
          }

          return `translate( 0, ${translate[1] + trans})`
        })
      })
      .on('end', (event: D3DragEvent<any, any, any>) => {
        console.log('end', event)
        const coord = d3.pointer(event, this.container.node())
        const dragged = storage.genes.indexOf(event.subject)
        const yIndex = this.getIndexFromScaleBand(this.y, coord[1])

        storage.genes.splice(dragged, 1)
        storage.genes.splice(parseInt(yIndex), 0, event.subject)

        eventBus.emit(innerEvents.INNER_UPDATE, true)
      })

    const dragSelection = this.row.call(drag)
    dragSelection.on('click', (event: IEnhancedEvent) => {
      if (event.defaultPrevented) {
        //
      }
    })

    this.row.on('mouseover', (event: IEnhancedEvent) => {
      const curElement = event.target
      if (curElement.timeout !== undefined) {
        clearTimeout(curElement.timeout)
      }

      d3.select(event.target)
        .select(`.${storage.prefix}remove-gene`)
        .attr('style', 'display: block')
    })

    this.row.on('mouseout', (event: IEnhancedEvent) => {
      const curElement = event.target
      curElement.timeout = setTimeout(() => {
        d3.select(curElement).select(`.${storage.prefix}remove-gene`)
          .attr('style', 'display: none')
      }, 500)
    })
  }

  private createGeneMap() {
    const geneMap = {}
    for (const gene of storage.genes) {
      geneMap[gene.id] = gene
    }
    this.geneMap = geneMap
  }

  /**
   * Function that determines the y position of a mutation within a cell
   */
  private getY({id, geneId, donorId}: IObservation): number {
    const y = this.geneMap[geneId].y ?? 0
    if (this.heatMap) {
      return y
    }
    const obs = storage.lookupTable[donorId][geneId]
    if (obs.length === 0) {
      return y
    }
    return y + this.cellHeight / obs.length * obs.indexOf(id)
  }

  /**
   * Function that determines the x position of a mutation
   */
  private getCellX(observation: IObservation): number {
    const x = storage.lookupTable[observation.donorId].x ?? 0
    return x
  }

  /**
   * Returns the color for the given observation.
   * @param observation.
   */
  private getColor(observation: IObservation) {
    const colorKey = observation.consequence
    if (this.heatMap) {
      return this.heatMapColor
    } else {
      return this.colorMap[colorKey]
    }
  }

  /**
   * Returns the desired opacity of observation rects. This changes between heatmap and regular mode.
   * @returns {number}
   */
  private getOpacity(observation: IObservation) {
    if (this.heatMap) {
      return 0.25
    } else {
      return 1
    }
  }

  /**
   * Returns the height of an observation cell.
   * @returns {number}
   */
  private getHeight({donorId, geneId}: IObservation): number {
    const height = this.cellHeight ?? 0
    if (this.heatMap) {
      return height
    }
    const count = storage.lookupTable[donorId][geneId].length
    if (count === 0) {
      return height
    }

    return height / count
  }

  private getCellWidth(observation: IObservation) {
    return this.cellWidth ?? 0
  }

  /**
   * Returns the correct observation value based on the data type.
   */
  private getValueByType(observation: IObservation) {
    return observation.consequence ?? ''
  }

  /**
   * Returns circular path based on cell dimensions
   */
  private getCircularPath(observation: IObservation) {
    const x1 = this.getCellX(observation)
    const y1 = this.getY(observation)
    return 'M ' + (x1 + this.cellWidth / 4) + ', ' + y1 + ' m ' + (-1 * this.getCellWidth(observation)) + ', 0 ' + 'a ' + this.getCellWidth(observation) + ', ' + this.getCellWidth(observation) + ' 0 1,0 ' + (2 * this.getCellWidth(observation)) + ',0 a ' + this.getCellWidth(observation) + ',' + this.getCellWidth(observation) + ' 0 1,0 ' + (-1 * (2 * this.getCellWidth(observation))) + ',0'
  }

  /**
   * Returns rectangular path based on cell dimensions
   */
  private getRectangularPath(observation: IObservation) {
    const x1 = this.getCellX(observation)
    const y1 = this.getY(observation)
    return 'M ' + x1 + ' ' + y1 + ' H ' + (x1 + this.cellWidth) + ' V ' + (y1 + this.getHeight(observation)) + ' H ' + x1 + 'Z'
  }

  /**
   * set the observation rects between heatmap and regular mode.
   */
  public setHeatmap(active: boolean) {
    if (active === this.heatMap) return this.heatMap
    this.heatMap = active

    for (const type of this.types) {
      d3.selectAll(`.${storage.prefix}sortable-rect`)
        .transition()
        .attr('d', (obs: IObservation) => {
          return this.getRectangularPath(obs)
        })
        .attr('fill', (obs: IObservation) => {
          return this.getColor(obs)
        })
        .attr('opacity', (obs: IObservation) => {
          return this.getOpacity(obs)
        })
    }


    return this.heatMap
  }

  public setGridLines(active: boolean) {
    if (this.drawGridLines === active) return this.drawGridLines
    this.drawGridLines = active

    this.geneDescriptionBlock.setGridLines(this.drawGridLines)
    this.donorDescriptionBlock.setGridLines(this.drawGridLines)

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
    const gene = storage.genes[i]
    if (gene) {
      d3.selectAll(`.${storage.prefix}${gene.id}-cell`).remove()
      d3.selectAll(`.${storage.prefix}${gene.id}-bar`).remove()
      storage.genes.splice(i, 1)
    }

    eventBus.emit(innerEvents.INNER_UPDATE, true)
  }

  private nullableObsLookup(donor: any, gene: any) {
    if (!donor || typeof donor !== 'object') return null
    if (!gene || typeof gene !== 'object') return null

    if (storage.lookupTable?.[donor.id]?.[gene.id]) {
      return storage.lookupTable[donor.id][gene.id].join(', ') // Table stores arrays and we want to return a string;
    } else {
      return null
    }
  }

  /**
   * Removes all svg elements for this grid.
   */
  public destroy() {
    this.wrapper.select(`.${storage.prefix}maingrid-svg`).remove()
  }
}

export default MainGrid
