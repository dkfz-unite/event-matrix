import {IDescriptionField} from '../interfaces/main-grid.interface'

class DescriptionField implements IDescriptionField {
  name: string
  fieldName: string
  collapsed: boolean
  group: string
  type: string | null

  constructor({name, fieldName, collapsed, group, type}: IDescriptionField) {
    this.name = name
    this.fieldName = fieldName
    this.collapsed = collapsed ?? false
    this.group = group ?? 'Tracks'
    this.type = type ?? null
  }
}

export default DescriptionField
