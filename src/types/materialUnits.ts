export interface MaterialUnitsResponse {
  units: string[];
  materials: { materialType: string; unit: string; isDefault: boolean }[];
}
