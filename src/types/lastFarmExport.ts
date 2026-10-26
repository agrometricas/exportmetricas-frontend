export interface LastFarmExport {
  exportId: number;
  cuttingDate: string | null;
  client: string;
}

export interface LastFarmExportResponse {
  last: LastFarmExport | null;
}
