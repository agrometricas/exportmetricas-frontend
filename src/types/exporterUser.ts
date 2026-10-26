export type UserRole =
  | 'MASTER'
  | 'LOGISTICS'
  | 'EXPORT'
  | 'QUALITY'
  | 'ADMINISTRATIVE';

export interface ExporterUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  exporterId: number;
}

export interface InvitedExporterUser extends ExporterUser {
  invitationSent: boolean;
}

export interface InviteUserBody {
  name: string;
  email: string;
  role: UserRole;
}
