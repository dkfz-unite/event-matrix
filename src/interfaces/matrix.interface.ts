export interface IMatrixDescriptionGroup {
  id: string | number,
  label: string,
  fields: IMatrixDescriptionField[],
}

export interface IMatrixDescriptionField {
  id: string,
  field: string,
  type: string | null,
  label: string,
  cells: IMatrixDescriptionCell[],
}

export interface IMatrixDescriptionCell {
  value: string | number | null,
  displayValue: string,
  id: string,
}
