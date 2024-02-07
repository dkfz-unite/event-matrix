class Frame {
  private xStart = 0
  private xEnd = 0
  private xLimit = 0

  private yStart = 0
  private yEnd = 0
  private yLimit = 0

  private zStart = 0
  private zEnd = 0
  private zLimit = 0

  constructor(xLimit: number, yLimit: number, zLimit: number) {
    this.xLimit = xLimit
    this.yLimit = yLimit
    this.zLimit = zLimit
    this.xEnd = xLimit
    this.yEnd = yLimit
    this.zEnd = zLimit
  }

  public getSizes() {
    return {
      x: [this.xStart, this.xEnd],
      y: [this.yStart, this.yEnd],
      z: [this.zStart, this.zEnd],
    }
  }

  public setSizes(x: [number, number], y: [number, number], z?: [number, number]) {
    this.xStart = x[0]
    this.xEnd = x[1]
    this.yStart = y[0]
    this.yEnd = y[1]
    if (z !== undefined) {
      this.zStart = z[0]
      this.zEnd = z[1]
    }
  }

  public incrementFrameSize(step = 1) {
    this.xStart = Math.max(this.xStart - step, 0)
    this.xEnd = Math.min(this.xEnd + step, this.xLimit)
    this.yStart = Math.max(this.yStart - step, 0)
    this.yEnd = Math.min(this.yEnd + step, this.yLimit)
  }

  public decrementFrameSize(step = 1) {
    if (this.xEnd > this.xStart) {
      this.xStart += step
      if (this.xEnd > this.xStart) {
        this.xEnd -= step
      }
    }
    if (this.yEnd > this.yStart) {
      this.yStart += step
      if (this.yEnd > this.yStart) {
        this.yEnd -= step
      }
    }
  }

  public shiftFrameX(step = 1) {
    this.xStart = Math.min(Math.max(this.xStart + step, 0), this.xLimit)
    this.xEnd = Math.min(Math.max(this.xEnd + step, 0), this.xLimit)
  }

  public shiftFrameY(step = 1) {
    this.yStart = Math.min(Math.max(this.yStart + step, 0), this.yLimit)
    this.yEnd = Math.min(Math.max(this.yEnd + step, 0), this.yLimit)
  }

  public updateLimits(xLimit: number, yLimit: number, zLimit: number) {
    this.xLimit = xLimit
    this.yLimit = yLimit
    this.zLimit = zLimit

    this.incrementFrameSize(0) // in case if limits reduced, recalculate frame size
  }
}

export default Frame
