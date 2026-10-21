export interface BoxTypeResponse {
  id: number;
  name: string;
  boxBrands: number;
}

export interface BoxTypeBody {
  name: string;
}

export type CargoType = 'CONTAINER' | 'BULK';

export interface BoxBrandCargoBody {
  cargoType: CargoType;
  boxTypeId?: number;
}
