import { UserRole } from '../types/exporterUser';

export const ROLE_LABELS: Record<UserRole, string> = {
  MASTER: 'Principal',
  LOGISTICS: 'Logística',
  EXPORT: 'Exportación',
  QUALITY: 'Calidad',
  ADMINISTRATIVE: 'Administrativo',
};

export const ROLE_OPTIONS = (Object.keys(ROLE_LABELS) as UserRole[]).map(
  (role) => ({ id: role, name: ROLE_LABELS[role] })
);

export function roleLabel(role: string): string {
  return ROLE_LABELS[role as UserRole] ?? role;
}
