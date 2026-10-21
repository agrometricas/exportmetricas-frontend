export type CustomsChannel =
  | 'AUTOMATIC'
  | 'ELECTRONIC'
  | 'DOCUMENTARY'
  | 'PHYSICAL';

export type CustomsStep = 'PENDING' | 'AUCP' | 'DAE';

export interface ExportCustomsBody {
  aucpNumber: string | null;
  aucpDate: string | null;
  daeNumber: string | null;
  daeDate: string | null;
  daeChannel: CustomsChannel | null;
}
