import Frame from '../../../classes/data/Frame'

describe('Frame', () => {
  let frame: Frame

  beforeEach(() => {
    frame = new Frame(10, 20, 30)
  })

  test('should initialize with given limits and set end values to limits', () => {
    const sizes = frame.getSizes()
    expect(sizes).toEqual({
      x: [0, 10],
      y: [0, 20],
      z: [0, 30],
    })
  })

  test('should set sizes correctly', () => {
    frame.setSizes([1, 5], [2, 10], [3, 8])
    const sizes = frame.getSizes()
    expect(sizes).toEqual({
      x: [1, 5],
      y: [2, 10],
      z: [3, 8],
    })
  })

  test('should increment frame size correctly', () => {
    frame.incrementFrameSize(2)
    const sizes = frame.getSizes()
    expect(sizes).toEqual({
      x: [0, 10],
      y: [0, 20],
      z: [0, 30],
    })

    frame.setSizes([1, 4], [1, 4])
    frame.incrementFrameSize(1)
    const newSizes = frame.getSizes()
    expect(newSizes).toEqual({
      x: [0, 5],
      y: [0, 5],
      z: [0, 30],
    })
  })

  test('should decrement frame size correctly', () => {
    frame.setSizes([1, 5], [2, 10])
    frame.decrementFrameSize(1)
    const sizes = frame.getSizes()
    expect(sizes).toEqual({
      x: [2, 4],
      y: [3, 9],
      z: [0, 30],
    })
  })

  test('should shift frame x correctly', () => {
    frame.setSizes([1, 5], [2, 10])
    frame.shiftFrameX(2)
    const sizes = frame.getSizes()
    expect(sizes).toEqual({
      x: [3, 7],
      y: [2, 10],
      z: [0, 30],
    })
  })

  test('should shift frame y correctly', () => {
    frame.setSizes([1, 5], [2, 10])
    frame.shiftFrameY(2)
    const sizes = frame.getSizes()
    expect(sizes).toEqual({
      x: [1, 5],
      y: [4, 12],
      z: [0, 30],
    })
  })

  test('should update limits and recalculate frame size correctly', () => {
    frame.setSizes([1, 5], [2, 10])
    frame.updateLimits(8, 15, 25)
    const sizes = frame.getSizes()
    expect(sizes).toEqual({
      x: [1, 5],
      y: [2, 10],
      z: [0, 30],
    })
  })
})

