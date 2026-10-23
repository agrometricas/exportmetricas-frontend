export type CuttingType = {
  id: number | '';
  createdAt: Date | '';
  updatedAt: Date | '';
  quality: string;
  shipmentType: string;
  leavesAtHarvest: number | '';
  maxAgeAtCut: number | '';
  minCaliber: number | '';
  maxCaliber: number | '';
  fingerLength: string;
  saneos: string;
  cunas: string;
  clusterDetail: string;
  labelDetail: string;
  firstLine: string;
  secondLine: string;
  thirdLine: string;
  fourthLine: string;
  packagingPattern: string;
  palletDetail: string;
  cornerProtectorsDetail: string;
  reinforcementsDetail: string;
  plasticStrapsDetail: string;
  staplesDetail: string;
  blockingSheetsDetail: string;
  transportDetail: string;
  generalObservations?: string | null;
};

export interface CuttingTypeOptions {
  qualities: string[];
  saneos: string[];
}
