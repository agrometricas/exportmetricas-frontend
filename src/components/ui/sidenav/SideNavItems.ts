'use client';

import { FaBoxOpen, FaCashRegister, FaCogs, FaUserTie } from 'react-icons/fa';
import {
  MdOutlineAgriculture,
  MdContentCut,
  MdFlightTakeoff,
} from 'react-icons/md';
import { PiPackageBold } from 'react-icons/pi';

import {
  PRODUCER_MENU,
  CLIENT_MENU,
  BOX_BRANDS_MENU,
  WINERY_MENU,
  getExportMenu,
  getQualityMenu,
  getLiquidationMenu,
  getSettingsMenu,
} from './navMenus';

import { SidenavItem } from './sidenav-items';

export interface NavCounts {
  addCuttingSheet: number;
  addSupplyShipment: number;
  producerPendingPayments: number;
  clientPendingPayments: number;
  exportSentCostsPending: number;
}

export type Role =
  | 'MASTER'
  | 'EXPORT'
  | 'LOGISTICS'
  | 'ADMINISTRATIVE'
  | 'QUALITY'
  | 'USER';

export interface SessionUser {
  role?: Role | string;
  exporterId?: string;
}

/** Helper: refleja el count en badge (sin romper compatibilidad con props.count) */
function withBadgeFromCount<T extends Pick<SidenavItem, 'count'>>(
  item: T
): T & SidenavItem {
  const count = (item.count ?? 0) as number;
  return {
    ...item,
    // mantenemos count para tu lógica previa
    count,
    // y sumamos badge para la UI nueva (solo si count > 0)
    badge: count > 0 ? { count, color: 'red', variant: 'solid' } : undefined,
  } as T & SidenavItem;
}

/**
 * Construcción de ítems de navegación para el contexto de Exportaciones.
 * - Respeta tus menús (navMenus.ts) y paths.
 * - Mantiene allowedRoles y el filtro por rol.
 * - Expone counts en ítems padre y submenús (sin cambiar tu contrato).
 */
export function getNavItems(
  counts: NavCounts,
  session: SessionUser | null
): SidenavItem[] {
  const role = (session?.role as Role) || 'USER';

  const baseItems: SidenavItem[] = [
    {
      icon: MdOutlineAgriculture,
      label: 'Productor',
      isMenu: true,
      to: '/dashboard/producer',
      menu: PRODUCER_MENU,
      allowedRoles: ['LOGISTICS', 'EXPORT'],
    },
    {
      icon: FaUserTie,
      label: 'Comercialización',
      isMenu: true,
      to: '/dashboard/client',
      menu: CLIENT_MENU,
      allowedRoles: ['LOGISTICS', 'EXPORT'],
    },
    {
      icon: FaBoxOpen,
      label: 'Materiales',
      isMenu: true,
      to: '/dashboard/box-brands',
      menu: BOX_BRANDS_MENU,
      allowedRoles: ['LOGISTICS', 'EXPORT'],
    },
    withBadgeFromCount({
      icon: MdFlightTakeoff,
      label: 'Exportaciones',
      isMenu: true,
      to: '/dashboard/export',
      menu: getExportMenu({ addSupplyShipment: counts.addSupplyShipment }),
      count: counts.addSupplyShipment,
      allowedRoles: ['EXPORT'],
    }),
    withBadgeFromCount({
      icon: FaCashRegister,
      label: 'Liquidación',
      isMenu: true,
      // (se mantiene tu ruta original para el padre)
      to: '/dashboard/box-brands',
      menu: getLiquidationMenu({
        producerPendingPayments: counts.producerPendingPayments,
        clientPendingPayments: counts.clientPendingPayments,
        exportSentCostsPending: counts.exportSentCostsPending,
      }),
      count:
        counts.producerPendingPayments +
        counts.clientPendingPayments +
        counts.exportSentCostsPending,
      allowedRoles: ['ADMINISTRATIVE'],
    }),
    withBadgeFromCount({
      icon: MdContentCut,
      label: 'Calidad',
      isMenu: true,
      // (se mantiene tu ruta original para el padre)
      to: '/dashboard/export',
      menu: getQualityMenu({ addCuttingSheet: counts.addCuttingSheet }),
      count: counts.addCuttingSheet,
      allowedRoles: ['QUALITY'],
    }),
    {
      icon: PiPackageBold,
      label: 'Bodega',
      isMenu: true,
      to: '/dashboard/winery',
      menu: WINERY_MENU,
      allowedRoles: ['ADMINISTRATIVE'],
    },
    {
      icon: FaCogs,
      label: 'Configuraciones',
      isMenu: true,
      to: '/dashboard/settings',
      menu: getSettingsMenu(session?.exporterId, role),
      allowedRoles: ['ADMINISTRATIVE'],
    },
  ];

  // Visibilidad por rol (igual a tu comportamiento actual)
  return role === 'MASTER'
    ? baseItems
    : baseItems.filter(
        (item) => !item.allowedRoles || item.allowedRoles.includes(role as Role)
      );
}

export default getNavItems;
