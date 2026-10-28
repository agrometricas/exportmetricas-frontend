import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { qk } from '@/lib/queryKeys';
import { env } from '../lib/env';

export interface UserProfile {
  userDetails: {
    name: string;
    email: string;
    onboardingStatus: string;
  };
  exporterDetails: {
    id?: number;
    businessName: string;
    businessId: string;
    email: string;
    address?: string;
    country?: {
      id: number;
      name: string;
    };
    province?: {
      id: number;
      name: string;
    };
    city?: {
      id: number;
      name: string;
    };
    accountStatus: string;
    updatedAt: string;
    logoUrl?: string;
  };
}

async function fetchExporter(refreshToken: string): Promise<UserProfile> {
  const response = await fetch(
    env.NEXT_PUBLIC_API_URL + '/auth/exporter/profile',
    {
      method: 'GET',
      headers: {
        authorization: `Bearer ${refreshToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Error al obtener el perfil');
  }
  return response.json();
}

export function useExporter(): {
  user: UserProfile | undefined;
  isLoading: boolean;
  error: unknown;
  reloadExporter: () => Promise<void>;
} {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: qk('exporter', session?.refreshToken),
    queryFn: () => {
      if (!session) throw new Error('No hay sesión activa');
      return fetchExporter(session.refreshToken);
    },
    enabled: !!session,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    placeholderData: () =>
      queryClient.getQueryData(['exporter', session?.refreshToken]),
  });

  return {
    user,
    isLoading,
    error,
    reloadExporter: () =>
      queryClient.invalidateQueries({
        queryKey: qk('exporter'),
      }),
  };
}
export type UseExporterReturn = ReturnType<typeof useExporter>;
