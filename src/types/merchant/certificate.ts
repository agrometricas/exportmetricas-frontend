export type CertificateType = {
  id: number;
  name: string;
  certificateCode: string;
  description?: string | null;
  issueDate: Date | '';
  expirationDate: Date | '';
};
