/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ContactResponse {
    id: number;
    name: string;
    web: string;
    email: string;
    phone: string;
}

export interface HarborResponse {
    id: number;
    type: string;
    name: string;
    code: string;
    address: string;
    location: string;
    latitude: number | null;
    longitude: number | null;
    openTime: string;
    closeTime: string;
    daysOfOperation: string[];
    country: { id: number; name: string } | null;
    province: { id: number; name: string } | null;
    city: { id: number; name: string } | null;
    countryId: number | null;
    provinceId: number | null;
    cityId: number | null;
    contacts: ContactResponse[];
    createdAt: string;
    updatedAt: string;
    exporterId: number;
    clients: any[];
}