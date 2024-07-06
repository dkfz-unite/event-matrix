export interface IMatrixTracksGroup {
  id: string,
  label: string,
  fields: IMatrixTracksField[],
}

export interface IMatrixTracksField {
  id: string,
  field: string,
  type: string | null,
  label: string,
  cells: IMatrixTracksCell[],
}

export interface IMatrixTracksCell {
  value: string | number | null,
  displayValue: string,
  id: string,
}
