export interface TransportCertification {
  certification: {
    id: number;
    name: string;
  };
}

export interface TransportContact {
  id: number;
  name: string;
  role: string | null;
  email: string;
  phone: string;
}

export interface TransportResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  ruc: string;
  address: string;
  satelliteTracking: boolean;
  exporterId: number;
  transportCertifications: TransportCertification[];
  contacts: TransportContact[];
}
