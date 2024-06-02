import {Storage} from '../../utils/storage'

describe('Storage', () => {
  it('should create a singleton instance', () => {
    const instance1 = Storage.getInstance()
    const instance2 = Storage.getInstance()
    expect(instance1).toBe(instance2)
  })

  it('should set options correctly', () => {
    const storage = Storage.getInstance()
    const minCellHeight = 20
    const prefix = 'test-'

    storage.setOptions({
      minCellHeight,
      prefix,
    })

    expect(storage.minCellHeight).toBe(minCellHeight)
    expect(storage.prefix).toBe(prefix)
  })
})
