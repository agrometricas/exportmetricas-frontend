import { SectionTab, sectionTabPaths } from './menuActive';
import { SidenavMenuItem } from './sidenav-items';

export const PRODUCER_MENU: SidenavMenuItem[] = [
  { label: 'Productores', to: '/dashboard/producer/producers' },
  { label: 'Agregar Productor', to: '/dashboard/producer/add-producer' },
  { label: 'Fincas', to: '/dashboard/producer/fincas' },
  { label: 'Agregar Finca', to: '/dashboard/producer/add-fincas' },
  { label: 'Contratos', to: '/dashboard/producer/contracts' },
  { label: 'Agregar Contrato', to: '/dashboard/producer/add-contract' },
  { label: 'Cupos de la Semana', to: '/dashboard/producer/contract-usage' },
  {
    label: 'Agregar Cuenta Bancaria',
    to: '/dashboard/producer/add-bank-account',
  },
];

// Catalogs set up once: one menu entry, and tabs on each list page.
export const LOGISTICS_TABS: SectionTab[] = [
  {
    label: 'Puertos',
    to: '/dashboard/client/harbors',
    add: '/dashboard/client/add-harbor',
  },
  {
    label: 'Navieras',
    to: '/dashboard/client/shipping-companies',
    add: '/dashboard/client/add-shipping-company',
  },
  {
    label: 'Contratos Navieros',
    to: '/dashboard/client/shipping-contracts',
    add: '/dashboard/client/add-shipping-contract',
  },
  {
    label: 'Depósitos',
    to: '/dashboard/client/deposits',
    add: '/dashboard/client/add-deposit',
  },
  {
    label: 'Transportes',
    to: '/dashboard/client/transports',
    add: '/dashboard/client/add-transport',
  },
  { label: 'Tarifas de Transporte', to: '/dashboard/client/transport-rates' },
];

export const QUALITY_CATALOG_TABS: SectionTab[] = [
  {
    label: 'Verificadoras',
    to: '/dashboard/box-brands/verifiers',
    add: '/dashboard/box-brands/add-verifier',
  },
  {
    label: 'Tipos de Corte',
    to: '/dashboard/box-brands/cutting-types',
    add: '/dashboard/box-brands/add-cutting-type',
  },
];

export const CLIENT_MENU: SidenavMenuItem[] = [
  { label: 'Clientes', to: '/dashboard/client/clients' },
  { label: 'Agregar Clientes', to: '/dashboard/client/add-client' },
  {
    label: 'Logística',
    to: LOGISTICS_TABS[0].to,
    match: sectionTabPaths(LOGISTICS_TABS),
  },
  {
    label: 'Totales por Contraparte',
    to: '/dashboard/client/counterpart-totals',
  },
];

export const BOX_BRANDS_MENU: SidenavMenuItem[] = [
  { label: 'Alícuotas', to: '/dashboard/box-brands/search' },
  { label: 'Agregar Alícuotas', to: '/dashboard/box-brands/add-box-brand' },
  { label: 'Logos', to: '/dashboard/logos' },
];

export const WINERY_MENU: SidenavMenuItem[] = [
  { label: 'Stock', to: '/dashboard/winery/stock' },
  { label: 'Agregar Stock', to: '/dashboard/winery/add-material' },

  { label: 'Trazabilidad de Stock', to: '/dashboard/winery/stock-movements' },
  { label: 'Ajuste Semanal', to: '/dashboard/winery/adjust-weekly' },
];

export function getExportMenu(counts: {
  addSupplyShipment: number;
}): SidenavMenuItem[] {
  return [
    { label: 'Órdenes de Compra', to: '/dashboard/export/purchase-orders' },
    {
      label: 'Agregar Órdenes de Compra',
      to: '/dashboard/export/add-purchase-order',
    },

    { label: 'Exportaciones', to: '/dashboard/export/search' },
    { label: 'Agregar Exportaciones', to: '/dashboard/export/add-export' },

    { label: 'Bookings', to: '/dashboard/export/bookings' },
    { label: 'Agregar Bookings', to: '/dashboard/export/add-booking' },

    { label: 'Documentos', to: '/dashboard/export/documents' },

    { label: 'Envíos de Insumos', to: '/dashboard/liquidation/exports-sent' },
    {
      label: 'Agregar Envíos de Insumos',
      to: '/dashboard/liquidation/add-supply-shipment',
      count: counts.addSupplyShipment,
    },
  ];
}

export function getQualityMenu(counts: {
  addCuttingSheet: number;
}): SidenavMenuItem[] {
  return [
    { label: 'Hojas de Corte', to: '/dashboard/export/cutting-sheets' },
    {
      label: 'Agregar Hojas de Corte',
      to: '/dashboard/export/add-cutting-sheet',
      count: counts.addCuttingSheet,
    },
    {
      label: 'Verificadoras y Tipos de Corte',
      to: QUALITY_CATALOG_TABS[0].to,
      match: sectionTabPaths(QUALITY_CATALOG_TABS),
    },
  ];
}

export function getLiquidationMenu(counts: {
  producerPendingPayments: number;
  clientPendingPayments: number;
  exportSentCostsPending: number;
}): SidenavMenuItem[] {
  return [
    { label: 'Hoja de Precios', to: '/dashboard/liquidation/price-sheet' },

    { label: 'Costos Validados', to: '/dashboard/liquidation/export-costs' },
    {
      label: 'Agregar Costos Validados',
      to: '/dashboard/liquidation/add-export-cost',
      count: counts.exportSentCostsPending,
    },

    {
      label: 'Pago Productores',
      to: '/dashboard/liquidation/producer-payments',
    },
    {
      label: 'Agregar Pago Productores',
      to: '/dashboard/liquidation/producer-pending-payments',
      count: counts.producerPendingPayments,
    },

    {
      label: 'Cobro Clientes',
      to: '/dashboard/liquidation/client-payments',
    },
    {
      label: 'Agregar Cobro Clientes',
      to: '/dashboard/liquidation/client-pending-payments',
      count: counts.clientPendingPayments,
    },

    { label: 'Cuentas Bancarias', to: '/dashboard/client/bank-accounts' },
    {
      label: 'Agregar Cuentas Bancarias',
      to: '/dashboard/client/add-bank-account',
    },
  ];
}

export function getSettingsMenu(
  exporterId?: string,
  role?: string
): SidenavMenuItem[] {
  return [
    ...(role === 'MASTER'
      ? [{ label: 'Usuarios', to: '/dashboard/settings/users' }]
      : []),
    { label: 'Logos', to: '/dashboard/logos' },
    {
      label: 'Unidades de Materiales',
      to: '/dashboard/settings/material-units',
    },
    { label: 'Precio Mínimo', to: '/dashboard/settings/minimum-box-price' },
    { label: 'Tipos de Caja', to: '/dashboard/settings/box-types' },
    {
      label: 'Modificar Ubicación',
      to: `/dashboard/user/update-user/${exporterId}`,
    },
  ];
}
