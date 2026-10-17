/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface BoxBrandResponse {
  id: number;
  name: string;
  brandCode: string;
  boxQuantity: number;
  netWeightBox: number;
  grossWeightBox: number;
  brand: { id: number; name: string };
  bottomType: { id: number; name: string; code: string; exporterId: number };
  bottomTypeQuantity: number;
  lidType: { id: number; name: string; code: string; exporterId: number };
  lidTypeQuantity: number;
  coverType: { id: number; name: string; code: string; exporterId: number };
  coverTypeQuantity: number;
  cardboardType: { id: number; name: string; code: string; exporterId: number };
  cardboardTypeQuantity: number;
  parasealType: { id: number; name: string; code: string; exporterId: number };
  parasealTypeQuantity: number;
  padType: { id: number; name: string; code: string; exporterId: number };
  padTypeQuantity: number;
  spongeType: { id: number; name: string; code: string; exporterId: number };
  spongeTypeQuantity: number;
  label: { id: number; name: string };
  labelQuantity: number;
  band: { id: number; name: string };
  bandQuantity: number;
  sachet: { id: number; name: string };
  sachetQuantity: number;
  rubber: { id: number; name: string };
  rubberQuantity: number;
  protector: { id: number; name: string };
  protectorQuantity: number;
  clusterBag: { id: number; name: string };
  clusterBagQuantity: number;
  pesticideCocktail: any[];
  palletsType: { id: number; name: string; code: string; exporterId: number };
  palletsTypeQuantity: number;
  miniPalletsType: {
    id: number;
    name: string;
    code: string;
    exporterId: number;
  };
  miniPalletsTypeQuantity: number;
  cornerType: { id: number; name: string; code: string; exporterId: number };
  cornerTypeQuantity: number;
  reinforcementType: {
    id: number;
    name: string;
    code: string;
    exporterId: number;
  };
  reinforcementTypeQuantity: number;
  staple: { id: number; name: string };
  stapleQuantity: number;
  stripping: { id: number; name: string };
  strippingQuantity: number;
  thermograph: { id: number; name: string };
  thermographQuantity: number;
  seal: { id: number; name: string };
  sealQuantity: number;
  mettoLabel: { id: number; name: string };
  mettoLabelQuantity: number;
  packingTapeType: {
    id: number;
    name: string;
    code: string;
    exporterId: number;
  };
  packingTapeTypeQuantity: number;
  latexRemover: { id: number; name: string };
  latexRemoverQuantity: number;
  insecticideCocktail: any[];
  stickerCocktail: any[];
  sheetCocktail: any[];
  blockingSheet: { id: number; name: string };
  blockingSheetQuantity: number;
  containerSealPlastic: { id: number; name: string };
  containerSealPlasticQuantity: number;
  securityKit: { id: number; name: string };
  securityKitQuantity: number;
  boardingCard: { id: number; name: string };
  boardingCardQuantity: number;
}

export interface ExportResponse {
  id: number;
  boxQuantity: number;
  pendingExportSent: boolean | null;
  shipName: string;
  estimatedTravelTime: string;
  bookingNumber: string;
  shippingDateTime: string;
  cuttingDate: string;
  weekDescription: string;
  weekDaysOfWeek: string[];
  weekBoxesOfDay: number[];
  weekTotal: number;
  numberOfVerifiers: number;
  contractType: string;
  cancelledAt: string | null;
  cancellationReason: string | null;
  merchant: {
    id: number;
    businessName: string;
    businessId: string;
    city: { id: number; name: string; code: string; provinceId: number };
    address: string;
  };
  business: {
    id: number;
    name: string;
    address: string;
    area: number;
    city: { id: number; name: string; code: string; provinceId: number };
    latitude: number | null;
    longitude: number | null;
    contacts: Contact[];
  };
  boxBrand: BoxBrandResponse;
  harborDeparture: {
    id: number;
    name: string;
    city: { id: number; name: string; code: string; provinceId: number };
    country: { id: number; name: string; code: string };
    latitude: number | null;
    longitude: number | null;
  };
  harborDestination: {
    id: number;
    name: string;
    code: string;
    city: { id: number; name: string; code: string; provinceId: number };
    country: { id: number; name: string; code: string; region: string };
    latitude: number | null;
    longitude: number | null;
  };
  client: {
    id: number;
    businessName: string;
    businessId: string;
    commercialType: string;
    certificates: {
      certificate: {
        id: number;
        name: string;
        certificateCode: string;
      };
    };
    email: string;
    phone: string;
  };
  shippingCompany: {
    id: number;
    name: string;
    code: string;
    contacts: Contact[];
  };
  deposit: {
    id: number;
    name: string;
    code: string;
    address: string;
    city: { id: number; name: string };
    contacts: Contact[];
  };
  transport: {
    id: number;
    name: string;
    ruc: string;
    address: string;
    satelliteTracking: boolean;
    contacts: Contact[];
  };
  verifier: {
    id: number;
    name: string;
    ruc: string;
    address: string;
    contacts: Contact[];
  };
  exportSent: {
    id: number;
  };
}
