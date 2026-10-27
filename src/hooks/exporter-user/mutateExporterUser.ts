import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import axios from '../../lib/axios';
import { ServerErrorResponse } from '../../types/errorResponse';
import {
  ExporterUser,
  InvitedExporterUser,
  InviteUserBody,
  UserRole,
} from '../../types/exporterUser';

type MutationError = AxiosError<ServerErrorResponse>;
type UserRef = { exporterId: string; userId: number };

function inviteUser({
  exporterId,
  body,
}: {
  exporterId: string;
  body: InviteUserBody;
}): Promise<AxiosResponse<InvitedExporterUser>> {
  return axios.post(`/exporters/${exporterId}/users`, body);
}

export function useInviteUser(): UseMutationResult<
  AxiosResponse<InvitedExporterUser>,
  MutationError,
  { exporterId: string; body: InviteUserBody }
> {
  return useMutation({ mutationFn: inviteUser });
}

function changeRole({
  exporterId,
  userId,
  role,
}: UserRef & { role: UserRole }): Promise<AxiosResponse<ExporterUser>> {
  return axios.patch(`/exporters/${exporterId}/users/${userId}`, { role });
}

export function useChangeRole(): UseMutationResult<
  AxiosResponse<ExporterUser>,
  MutationError,
  UserRef & { role: UserRole }
> {
  return useMutation({ mutationFn: changeRole });
}

function resendInvitation({
  exporterId,
  userId,
}: UserRef): Promise<AxiosResponse<{ invitationSent: boolean }>> {
  return axios.post(`/exporters/${exporterId}/users/${userId}/invitation`);
}

export function useResendInvitation(): UseMutationResult<
  AxiosResponse<{ invitationSent: boolean }>,
  MutationError,
  UserRef
> {
  return useMutation({ mutationFn: resendInvitation });
}

function removeUser({ exporterId, userId }: UserRef): Promise<AxiosResponse> {
  return axios.delete(`/exporters/${exporterId}/users/${userId}`);
}

export function useRemoveUser(): UseMutationResult<
  AxiosResponse,
  MutationError,
  UserRef
> {
  return useMutation({ mutationFn: removeUser });
}
