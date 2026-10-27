import { ContactType } from './merchant/contact';
import { TimeUnit } from '../utils/clientTerms';

export type ClientType = {
  id: number;
  businessName: string;
  businessId: string;
  address: string;
  type: string | 'Supermercado' | 'Intermediario';
  commercialType: string;
  postalCode: string;
  email: string;
  phone: string;
  website: string;
  purchaseVolumeBoxes?: number | null;
  purchaseVolumePeriod?: TimeUnit | null;
  paymentTermValue?: number | null;
  paymentTermUnit?: TimeUnit | null;
  shippingMethod: string;
  countryId: number | '';
  provinceId: number | '';
  cityId: number | '';
  harbors: number[] | null;
  incoterms: number[] | null;
  certificates: number[];
  contacts: Partial<ContactType>[];
};
