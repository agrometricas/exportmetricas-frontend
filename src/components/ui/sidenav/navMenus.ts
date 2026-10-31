import { SectionTab, sectionTabPaths } from './menuActive';
import { SidenavMenuItem } from './sidenav-items';

export const PRODUCER_MENU: SidenavMenuItem[] = [
  { label: 'Productores', to: '/dashboard/producer/producers' },
  { label: 'Agregar productor', to: '/dashboard/producer/add-producer' },
  { label: 'Fincas', to: '/dashboard/producer/fincas' },
  { label: 'Agregar finca', to: '/dashboard/producer/add-fincas' },
  { label: 'Contratos', to: '/dashboard/producer/contracts' },
  { label: 'Agregar contrato', to: '/dashboard/producer/add-contract' },
  { label: 'Cupos de la semana', to: '/dashboard/producer/contract-usage' },
  {
    label: 'Agregar cuenta bancaria',
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
    label: 'Contratos navieros',
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
  { label: 'Tarifas de transporte', to: '/dashboard/client/transport-rates' },
];

export const QUALITY_CATALOG_TABS: SectionTab[] = [
  {
    label: 'Verificadoras',
    to: '/dashboard/box-brands/verifiers',
    add: '/dashboard/box-brands/add-verifier',
  },
  {
    label: 'Tipos de corte',
    to: '/dashboard/box-brands/cutting-types',
    add: '/dashboard/box-brands/add-cutting-type',
  },
];

export const CLIENT_MENU: SidenavMenuItem[] = [
  { label: 'Clientes', to: '/dashboard/client/clients' },
  { label: 'Agregar clientes', to: '/dashboard/client/add-client' },
  {
    label: 'Logística',
    to: LOGISTICS_TABS[0].to,
    match: sectionTabPaths(LOGISTICS_TABS),
  },
  {
    label: 'Totales por contraparte',
    to: '/dashboard/client/counterpart-totals',
  },
];

export const BOX_BRANDS_MENU: SidenavMenuItem[] = [
  { label: 'Alícuotas', to: '/dashboard/box-brands/search' },
  { label: 'Agregar alícuotas', to: '/dashboard/box-brands/add-box-brand' },
  { label: 'Logos', to: '/dashboard/logos' },
];

export const WINERY_MENU: SidenavMenuItem[] = [
  { label: 'Stock', to: '/dashboard/winery/stock' },
  { label: 'Agregar stock', to: '/dashboard/winery/add-material' },

  { label: 'Trazabilidad de stock', to: '/dashboard/winery/stock-movements' },
  { label: 'Ajuste semanal', to: '/dashboard/winery/adjust-weekly' },
];

export function getExportMenu(counts: {
  addSupplyShipment: number;
}): SidenavMenuItem[] {
  return [
    { label: 'Órdenes de compra', to: '/dashboard/export/purchase-orders' },
    {
      label: 'Agregar órdenes de compra',
      to: '/dashboard/export/add-purchase-order',
    },
    {
      label: 'Pedidos de la semana',
      to: '/dashboard/export/weekly-plan',
    },

    { label: 'Exportaciones', to: '/dashboard/export/search' },
    { label: 'Agregar exportaciones', to: '/dashboard/export/add-export' },

    { label: 'Bookings', to: '/dashboard/export/bookings' },
    { label: 'Agregar bookings', to: '/dashboard/export/add-booking' },

    { label: 'Documentos', to: '/dashboard/export/documents' },

    { label: 'Envíos de insumos', to: '/dashboard/liquidation/exports-sent' },
    {
      label: 'Agregar envíos de insumos',
      to: '/dashboard/liquidation/add-supply-shipment',
      count: counts.addSupplyShipment,
    },
  ];
}

export function getQualityMenu(counts: {
  addCuttingSheet: number;
}): SidenavMenuItem[] {
  return [
    { label: 'Hojas de corte', to: '/dashboard/export/cutting-sheets' },
    {
      label: 'Agregar hojas de corte',
      to: '/dashboard/export/add-cutting-sheet',
      count: counts.addCuttingSheet,
    },
    {
      label: 'Verificadoras y tipos de corte',
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
    { label: 'Hoja de precios', to: '/dashboard/liquidation/price-sheet' },

    { label: 'Costos validados', to: '/dashboard/liquidation/export-costs' },
    {
      label: 'Agregar costos validados',
      to: '/dashboard/liquidation/add-export-cost',
      count: counts.exportSentCostsPending,
    },

    {
      label: 'Pago productores',
      to: '/dashboard/liquidation/producer-payments',
    },
    {
      label: 'Agregar pago productores',
      to: '/dashboard/liquidation/producer-pending-payments',
      count: counts.producerPendingPayments,
    },

    {
      label: 'Cobro clientes',
      to: '/dashboard/liquidation/client-payments',
    },
    {
      label: 'Agregar cobro clientes',
      to: '/dashboard/liquidation/client-pending-payments',
      count: counts.clientPendingPayments,
    },

    { label: 'Cuentas bancarias', to: '/dashboard/client/bank-accounts' },
    {
      label: 'Agregar cuentas bancarias',
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
      label: 'Unidades de materiales',
      to: '/dashboard/settings/material-units',
    },
    { label: 'Precio mínimo', to: '/dashboard/settings/minimum-box-price' },
    { label: 'Tipos de caja', to: '/dashboard/settings/box-types' },
    {
      label: 'Modificar ubicación',
      to: `/dashboard/user/update-user/${exporterId}`,
    },
  ];
}
