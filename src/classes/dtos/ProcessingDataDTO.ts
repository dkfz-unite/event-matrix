import {IProcessingParams, IRawProcessingParams} from '../../interfaces/main-grid.interface'

export class ProcessingDataDTO {
  private data: IRawProcessingParams

  constructor(rawData: IRawProcessingParams) {
    this.data = rawData
  }

  public getProcessingData(): IProcessingParams {
    return {
      columns: this.data.columns ?? this.data.donors ?? this.data.x ?? [],
      rows: this.data.rows ?? this.data.genes ?? this.data.y ?? [],
      entries: this.data.entries ?? this.data.observations ?? [],
      columnsFields: [],
      rowsFields: []
    }
  }
}
