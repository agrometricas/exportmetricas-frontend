import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';

interface CreateCertificateResponse {
  certificateId: string;
}

type CreateCertificateDTO = {
  name: string;
  certificateCode: string;
  description: string;
  issueDate: string | Date;
  expirationDate: string | Date;
  logo: File | null;
};

const createCertificate = async (
  data: CreateCertificateDTO
): Promise<CreateCertificateResponse> => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('certificateCode', data.certificateCode);
  if (data.description.trim()) {
    formData.append('description', data.description.trim());
  }

  const issueDate =
    typeof data.issueDate === 'string'
      ? new Date(data.issueDate)
      : data.issueDate;
  const expirationDate =
    typeof data.expirationDate === 'string'
      ? new Date(data.expirationDate)
      : data.expirationDate;

  formData.append('issueDate', issueDate.toISOString());
  formData.append('expirationDate', expirationDate.toISOString());

  if (data.logo instanceof File) {
    formData.append('logo', data.logo);
  }

  return axios
    .post<CreateCertificateResponse>('/certificate', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data);
};

type UseCreateCertificateOptions = {
  config?: MutationConfig<typeof createCertificate>;
};

export const useCreateCertificate = ({
  config,
}: UseCreateCertificateOptions = {}): UseMutationResult<
  CreateCertificateResponse,
  AxiosError,
  CreateCertificateDTO
> => {
  return useMutation({
    ...config,
    mutationFn: createCertificate,
  });
};
