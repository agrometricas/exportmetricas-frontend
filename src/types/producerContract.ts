export type ProducerContractType = 'FAS' | 'FOB';

export interface ProducerContractResponse {
  id: number;
  approvedHectares: string;
  approvedWeeklyBoxesPerHectare: number;
  approvedWeeklyBoxes: number;
  weeklyContainers: number | null;
  price: string;
  contractType: ProducerContractType | null;
  startDate: string;
  endDate: string | null;
  active: boolean;
  business: {
    id: number;
    name: string;
    codeMAGAP: string;
    merchant: { id: number; businessName: string } | null;
  };
}

export interface ProducerContractBody {
  businessId?: number;
  approvedHectares: number;
  approvedWeeklyBoxesPerHectare: number;
  weeklyContainers: number;
  price: number;
  contractType: ProducerContractType | null;
  startDate: string;
  endDate: string | null;
}
