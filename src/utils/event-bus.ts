import EventEmitter from 'eventemitter3'

export enum publicEvents {
  DESCRIPTION_LEGEND_HOVER = 'description:legend:hover',
  DESCRIPTION_LEGEND_OUT = 'description:legend:out',
  DESCRIPTION_BUTTONS_ADD_CLICK = 'description:buttons:add:click',
  DESCRIPTION_FIELD_CLICK = 'description:cell:click',
  DESCRIPTION_CELL_HOVER = 'description:cell:hover',
  DESCRIPTION_CELL_OUT = 'description:cell:out',
  HISTOGRAM_HOVER = 'histogram:hover',
  HISTOGRAM_OUT = 'histogram:out',
  HISTOGRAM_CLICK = 'histogram:click',
  GRID_CELL_HOVER = 'grid:cell:hover',
  GRID_CELL_CLICK = 'grid:cell:click',
  GRID_OUT = 'grid:out',
  GRID_LABEL_HOVER = 'grid:label:hover',
  GRID_LABEL_CLICK = 'grid:label:click',
  GRID_CROSSHAIR_HOVER = 'grid:crosshair:hover',
  GRID_CROSSHAIR_OUT = 'grid:crosshair:out',
  GRID_SELECTION_STARTED = 'grid:selection:started',
  GRID_SELECTION_FINISHED = 'grid:selection:finished',
}

export enum innerEvents {
  INNER_RESIZE = 'inner:resize',
  INNER_UPDATE = 'inner:update',
}

export enum renderEvents {
  RENDER_ALL_START = 'render:all:start',
  RENDER_ALL_END = 'render:all:end',
  RENDER_GRID_START = 'render:grid:start',
  RENDER_GRID_END = 'render:grid:end',
  RENDER_X_HISTOGRAM_START = 'render:x-histogram:start',
  RENDER_X_HISTOGRAM_END = 'render:x-histogram:end',
  RENDER_Y_HISTOGRAM_START = 'render:y-histogram:start',
  RENDER_Y_HISTOGRAM_END = 'render:y-histogram:end',
  RENDER_X_DESCRIPTION_BLOCK_START = 'render:x-description-block:start',
  RENDER_X_DESCRIPTION_BLOCK_END = 'render:x-description-block:end',
  RENDER_Y_DESCRIPTION_BLOCK_START = 'render:y-description-block:start',
  RENDER_Y_DESCRIPTION_BLOCK_END = 'render:y-description-block:end',
}

class EventBus extends EventEmitter {
  private static instance: EventBus | null = null

  private constructor() {
    super()
  }

  public static getInstance(): EventBus {
    if (this.instance === null) {
      this.instance = new this()
    }
    return this.instance
  }

  public exposeEvents() {
    return Object.values(publicEvents)
  }
}

export const eventBus = EventBus.getInstance()
