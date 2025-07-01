import EventEmitter from 'eventemitter3'

export enum publicEvents {
  GRID_CELL_HOVER = 'grid:cell:hover',
  GRID_CELL_CLICK = 'grid:cell:click',
  GRID_OUT = 'grid:out',
  GRID_LABEL_HOVER = 'grid:label:hover',
  GRID_LABEL_CLICK = 'grid:label:click',
  GRID_CROSSHAIR_HOVER = 'grid:crosshair:hover',
  GRID_CROSSHAIR_OUT = 'grid:crosshair:out',
  GRID_SELECTION_STARTED = 'grid:selection:started',
  GRID_SELECTION_FINISHED = 'grid:selection:finished',
  HISTOGRAM_HOVER = 'histogram:hover',
  HISTOGRAM_CLICK = 'histogram:click',
  HISTOGRAM_OUT = 'histogram:out',
  TRACKS_LEGEND_HOVER = 'tracks:legend:hover',
  TRACKS_LEGEND_OUT = 'tracks:legend:out',
  TRACKS_BUTTONS_ADD_CLICK = 'tracks:buttons:add:click',
  TRACKS_FIELD_CLICK = 'tracks:cell:click',
  TRACKS_CELL_HOVER = 'tracks:cell:hover',
  TRACKS_CELL_OUT = 'tracks:cell:out',
}

export enum innerEvents {
  INNER_RESIZE = 'inner:resize',
  INNER_UPDATE = 'inner:update',
  INNER_EVENTS_LOCK = 'inner:events:lock',
  INNER_EVENTS_UNLOCK = 'inner:events:unlock',
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
  RENDER_X_TRACKS_BLOCK_START = 'render:x-tracks-block:start',
  RENDER_X_TRACKS_BLOCK_END = 'render:x-tracks-block:end',
  RENDER_Y_TRACKS_BLOCK_START = 'render:y-tracks-block:start',
  RENDER_Y_TRACKS_BLOCK_END = 'render:y-tracks-block:end',
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
