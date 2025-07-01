import {IProcessingParams, IRawProcessingParams} from '../../interfaces/main-grid.interface'

export class ProcessingDataDTO {
  private data: IRawProcessingParams

  constructor(rawData: IRawProcessingParams) {
    this.data = rawData
  }

  public getProcessingData(): IProcessingParams {
    return {
      columns: 'columns' in this.data ? this.data.columns : 'x' in this.data ? this.data.x : [],
      rows: 'rows' in this.data ? this.data.rows : 'y' in this.data ? this.data.y : [],
      entries: this.data.entries ?? this.data.observations ?? [],
      columnsFields: this.data.tracks?.bottom?.fields ?? [],
      rowsFields: this.data.tracks?.side?.fields ?? [],
    }
  }
}
