export interface TransportRateResponse {
  id: number;
  costPerContainer: string;
  transport: { id: number; name: string };
  province: { id: number; name: string };
}

export interface TransportRateBody {
  transportId?: number;
  provinceId?: number;
  costPerContainer: number;
}
