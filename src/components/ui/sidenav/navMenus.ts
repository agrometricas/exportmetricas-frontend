import { SidenavMenuItem } from './sidenav-items';

export const PRODUCER_MENU: SidenavMenuItem[] = [
  { label: 'Productores', to: '/dashboard/producer/producers' },
  { label: 'Agregar Productor', to: '/dashboard/producer/add-producer' },
  { label: 'Fincas', to: '/dashboard/producer/fincas' },
  { label: 'Agregar Finca', to: '/dashboard/producer/add-fincas' },
  { label: 'Contratos', to: '/dashboard/producer/contracts' },
  { label: 'Agregar Contrato', to: '/dashboard/producer/add-contract' },
  {
    label: 'Agregar Cuenta Bancaria',
    to: '/dashboard/producer/add-bank-account',
  },
];

export const CLIENT_MENU: SidenavMenuItem[] = [
  { label: 'Clientes', to: '/dashboard/client/clients' },
  { label: 'Agregar Clientes', to: '/dashboard/client/add-client' },

  { label: 'Puertos', to: '/dashboard/client/harbors' },
  { label: 'Agregar Puertos', to: '/dashboard/client/add-harbor' },

  { label: 'Navieras', to: '/dashboard/client/shipping-companies' },
  { label: 'Agregar Navieras', to: '/dashboard/client/add-shipping-company' },

  { label: 'Depósitos', to: '/dashboard/client/deposits' },
  { label: 'Agregar Depósitos', to: '/dashboard/client/add-deposit' },

  { label: 'Transportes', to: '/dashboard/client/transports' },
  { label: 'Agregar Transportes', to: '/dashboard/client/add-transport' },
];

export const BOX_BRANDS_MENU: SidenavMenuItem[] = [
  { label: 'Alícuotas', to: '/dashboard/box-brands/search' },
  { label: 'Agregar Alícuotas', to: '/dashboard/box-brands/add-box-brand' },
  { label: 'Agregar Logo', to: '/dashboard/box-brands/upload-logo' },
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
    { label: 'Exportaciones', to: '/dashboard/export/search' },
    { label: 'Agregar Exportaciones', to: '/dashboard/export/add-export' },

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
    { label: 'Verificadoras', to: '/dashboard/box-brands/verifiers' },
    {
      label: 'Agregar Verificadoras',
      to: '/dashboard/box-brands/add-verifier',
    },
    { label: 'Tipos de Corte', to: '/dashboard/box-brands/cutting-types' },
    {
      label: 'Agregar Tipos de Corte',
      to: '/dashboard/box-brands/add-cutting-type',
    },
    { label: 'Hojas de Corte', to: '/dashboard/export/cutting-sheets' },
    {
      label: 'Agregar Hojas de Corte',
      to: '/dashboard/export/add-cutting-sheet',
      count: counts.addCuttingSheet,
    },
  ];
}

export function getLiquidationMenu(counts: {
  producerPendingPayments: number;
  clientPendingPayments: number;
  exportSentCostsPending: number;
}): SidenavMenuItem[] {
  return [
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

export function getSettingsMenu(exporterId?: string): SidenavMenuItem[] {
  return [
    { label: 'Logo Exportadora', to: '/dashboard/settings/upload-logo' },
    {
      label: 'Unidades de Materiales',
      to: '/dashboard/settings/material-units',
    },
    {
      label: 'Modificar Ubicación',
      to: `/dashboard/user/update-user/${exporterId}`,
    },
    { label: 'Logo Productores', to: '/dashboard/producer/upload-logo' },
  ];
}
