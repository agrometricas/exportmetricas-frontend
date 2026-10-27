/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { env } from '@/lib/env';
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
  data: CreateCertificateDTO,
  onboardingStatus: 'pending' | 'done' | string,
  token?: string
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

  if (onboardingStatus === 'pending') {
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/certificate`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(
        responseData.message || 'Error al crear certificado'
      );
      (error as any).response = {
        status: response.status,
        data: responseData,
      };
      throw error;
    }

    return responseData;
  }

  return axios
    .post(`${env.NEXT_PUBLIC_API_URL}/certificate`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token ? `Bearer ${token}` : '',
      },
    })
    .then((res) => res.data);
};

type UseCreateCertificateOptions = {
  config?: MutationConfig<typeof createCertificate>;
  onboardingStatus: 'pending' | 'done' | string;
};

export const useCreateCertificate = ({
  config,
  onboardingStatus,
}: UseCreateCertificateOptions): UseMutationResult<
  CreateCertificateResponse,
  AxiosError<any>,
  CreateCertificateDTO
> => {
  const { data: session } = useSession();
  const token = session?.refreshToken;

  return useMutation({
    ...config,
    mutationFn: (data) => createCertificate(data, onboardingStatus, token),
  });
};
