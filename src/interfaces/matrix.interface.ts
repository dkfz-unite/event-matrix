export interface IMatrixDescriptionGroup {
  id: string,
  label: string,
  fields: IMatrixDescriptionField[],
}

export interface IMatrixDescriptionField {
  id: string,
  field: string,
  type: string,
  label: string,
  cells: IMatrixDescriptionCell[],
}

export interface IMatrixDescriptionCell {
  value: string | number | null,
  displayValue: string,
  id: string,
}
