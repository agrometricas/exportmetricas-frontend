import { BusinessCodeType } from './businessCode';
import { ContactType } from './contact';

export type BusinessType = {
  id: number | '';
  name: string;
  area: number;
  approvedHectares?: number;
  approvedBoxesPerHectare?: number;
  countryId: number | '';
  provinceId: number | '';
  city: { id: number, name: string };
  cityId: number | '';
  address: string;
  fruitType: string;
  latitude: number | '';
  longitude: number | '';
  codeMAGAP: string;
  codeAGROCALIDAD: string;
  certificates: number[];
  businessCodes: Partial<BusinessCodeType>[];
  contacts: Partial<ContactType>[];
  merchant: number | '';
};
