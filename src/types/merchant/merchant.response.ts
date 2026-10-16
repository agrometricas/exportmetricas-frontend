import { BankAccountType } from "../bankAccount";

export interface MerchantResponse {
    id: number | '';
    businessName: string;
    businessId: string;
    email: string;
    address: string;
    contractType: string;
    country: { id: number; name: string };
    province: { id: number; name: string };
    city: { id: number; name: string };
    businesses: BusinessResponse[];
    bankAccounts: BankAccountType[];
    logoKey: string | null;
    logoUrl: string | null;
}

export interface BusinessResponse {
    id: number;
    name: string;
    area: number;
    approvedHectares: string | null;
    approvedBoxesPerHectare: number | null;
    approvedBoxes: number | null;
    latitude: number;
    longitude: number;
    codeMAGAP: string;
    codeAGROCALIDAD: string;
    fruitType: string;
    address: string;
    country: { id: number; name: string };
    province: { id: number; name: string };
    city: { id: number; name: string };
}
