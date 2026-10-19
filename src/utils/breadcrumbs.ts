export interface BreadcrumbItem {
  name: string;
  href: string;
  isCurrent: boolean;
}

type ViewMap = Record<string, string>;
type AddMap = Record<
  string,
  {
    parent: string;
    addLabel?: string;
    parentHref?: string;
  }
>;

const VIEW_ROUTES: ViewMap = {
  '/dashboard/producer/producers': 'Productores',
  '/dashboard/producer/fincas': 'Fincas',
  '/dashboard/producer/contracts': 'Contratos',

  '/dashboard/client/clients': 'Clientes',
  '/dashboard/client/harbors': 'Puertos',
  '/dashboard/client/shipping-companies': 'Navieras',
  '/dashboard/client/shipping-contracts': 'Contratos Navieros',
  '/dashboard/client/transport-rates': 'Tarifas de Transporte',
  '/dashboard/client/deposits': 'Depósitos',
  '/dashboard/client/transports': 'Transportes',

  '/dashboard/box-brands/search': 'Alícuotas',
  '/dashboard/box-brands/verifiers': 'Verificadoras',
  '/dashboard/box-brands/cutting-types': 'Tipos de Corte',
  '/dashboard/box-brands/upload-logo': 'Agregar Logo',

  '/dashboard/winery/stock': 'Stock',
  '/dashboard/winery/stock-movements': 'Trazabilidad de Stock',
  '/dashboard/winery/adjust-weekly': 'Ajuste Semanal',

  '/dashboard/export/search': 'Exportaciones',
  '/dashboard/export/bookings': 'Bookings',
  '/dashboard/export/purchase-orders': 'Órdenes de Compra',
  '/dashboard/liquidation/exports-sent': 'Envíos de Insumos',

  '/dashboard/export/cutting-sheets': 'Hojas de Corte',

  '/dashboard/liquidation/export-costs': 'Costos Validados',
  '/dashboard/liquidation/producer-payments': 'Pago Productores',
  '/dashboard/liquidation/client-payments': 'Cobro Clientes',
  '/dashboard/client/bank-accounts': 'Cuentas Bancarias',

  '/dashboard/settings/upload-logo': 'Logo Exportadora',
  '/dashboard/settings/material-units': 'Unidades de Materiales',
  '/dashboard/settings/minimum-box-price': 'Precio Mínimo',
  '/dashboard/liquidation/price-sheet': 'Hoja de Precios',
  '/dashboard/producer/upload-logo': 'Logo Productores',
};

const ADD_ROUTES: AddMap = {
  '/dashboard/producer/add-producer': {
    parent: 'Productores',
    addLabel: 'Agregar Productor',
    parentHref: '/dashboard/producer/producers',
  },
  '/dashboard/producer/add-fincas': {
    parent: 'Fincas',
    addLabel: 'Agregar Finca',
    parentHref: '/dashboard/producer/fincas',
  },
  '/dashboard/producer/add-contract': {
    parent: 'Contratos',
    addLabel: 'Agregar Contrato',
    parentHref: '/dashboard/producer/contracts',
  },
  '/dashboard/producer/add-bank-account': {
    parent: 'Cuentas Bancarias',
    addLabel: 'Agregar Cuenta Bancaria',
    parentHref: '/dashboard/client/bank-accounts',
  },

  '/dashboard/client/add-client': {
    parent: 'Clientes',
    addLabel: 'Agregar Cliente',
    parentHref: '/dashboard/client/clients',
  },
  '/dashboard/client/add-harbor': {
    parent: 'Puertos',
    addLabel: 'Agregar Puerto',
    parentHref: '/dashboard/client/harbors',
  },
  '/dashboard/client/add-shipping-company': {
    parent: 'Navieras',
    addLabel: 'Agregar Naviera',
    parentHref: '/dashboard/client/shipping-companies',
  },
  '/dashboard/client/add-shipping-contract': {
    parent: 'Contratos Navieros',
    addLabel: 'Agregar Contrato Naviero',
    parentHref: '/dashboard/client/shipping-contracts',
  },
  '/dashboard/client/add-deposit': {
    parent: 'Depósitos',
    addLabel: 'Agregar Depósito',
    parentHref: '/dashboard/client/deposits',
  },
  '/dashboard/client/add-transport': {
    parent: 'Transportes',
    addLabel: 'Agregar Transporte',
    parentHref: '/dashboard/client/transports',
  },
  '/dashboard/client/add-bank-account': {
    parent: 'Cuentas Bancarias',
    addLabel: 'Agregar Cuenta Bancaria',
    parentHref: '/dashboard/client/bank-accounts',
  },

  '/dashboard/box-brands/add-box-brand': {
    parent: 'Alícuotas',
    addLabel: 'Agregar Alícuotas',
    parentHref: '/dashboard/box-brands/search',
  },
  '/dashboard/box-brands/add-verifier': {
    parent: 'Verificadoras',
    addLabel: 'Agregar Verificadora',
    parentHref: '/dashboard/box-brands/verifiers',
  },
  '/dashboard/box-brands/add-cutting-type': {
    parent: 'Tipos de Corte',
    addLabel: 'Agregar Tipo de Corte',
    parentHref: '/dashboard/box-brands/cutting-types',
  },

  '/dashboard/export/add-export': {
    parent: 'Exportaciones',
    addLabel: 'Agregar Exportación',
    parentHref: '/dashboard/export/search',
  },
  '/dashboard/liquidation/add-supply-shipment': {
    parent: 'Envíos de Insumos',
    addLabel: 'Agregar Envío de Insumos',
    parentHref: '/dashboard/liquidation/exports-sent',
  },

  '/dashboard/export/add-booking': {
    parent: 'Bookings',
    addLabel: 'Agregar Booking',
    parentHref: '/dashboard/export/bookings',
  },
  '/dashboard/export/add-purchase-order': {
    parent: 'Órdenes de Compra',
    addLabel: 'Agregar Orden de Compra',
    parentHref: '/dashboard/export/purchase-orders',
  },

  '/dashboard/export/add-cutting-sheet': {
    parent: 'Hojas de Corte',
    addLabel: 'Agregar Hoja de Corte',
    parentHref: '/dashboard/export/cutting-sheets',
  },

  '/dashboard/winery/add-material': {
    parent: 'Stock',
    addLabel: 'Agregar Stock',
    parentHref: '/dashboard/winery/stock',
  },

  '/dashboard/liquidation/add-export-cost': {
    parent: 'Costos Validados',
    addLabel: 'Agregar Costos Validados',
    parentHref: '/dashboard/liquidation/export-costs',
  },
  '/dashboard/liquidation/producer-pending-payments': {
    parent: 'Pago Productores',
    addLabel: 'Agregar Pago Productores',
    parentHref: '/dashboard/liquidation/producer-payments',
  },
  '/dashboard/liquidation/client-pending-payments': {
    parent: 'Cobro Clientes',
    addLabel: 'Agregar Cobro Clientes',
    parentHref: '/dashboard/liquidation/client-payments',
  },
};

const SEGMENT_ES: Record<string, string> = {
  dashboard: 'Dashboard',
  producer: 'Productores',
  producers: 'Productores',
  fincas: 'Fincas',
  contracts: 'Contratos',
  client: 'Clientes',
  clients: 'Clientes',
  harbors: 'Puertos',
  'shipping-companies': 'Navieras',
  'shipping-contracts': 'Contratos Navieros',
  bookings: 'Bookings',
  'purchase-orders': 'Órdenes de Compra',
  deposits: 'Depósitos',
  transports: 'Transportes',
  'box-brands': 'Marcas de Caja',
  search: 'Buscar',
  verifiers: 'Verificadoras',
  'cutting-types': 'Tipos de Corte',
  'cutting-sheets': 'Hojas de Corte',
  'upload-logo': 'Agregar Logo',
  winery: 'Bodega',
  stock: 'Stock',
  'stock-movements': 'Trazabilidad de Stock',
  'adjust-weekly': 'Ajuste Semanal',
  export: 'Exportaciones',
  'exports-sent': 'Envíos de Insumos',
  liquidation: 'Liquidación',
  'export-costs': 'Costos Validados',
  'producer-payments': 'Pago Productores',
  'client-payments': 'Cobro Clientes',
  'bank-accounts': 'Cuentas Bancarias',
  settings: 'Configuraciones',
  user: 'Perfil',
};

const isNumericOrUUID = (s: string): boolean =>
  /^\d+$/.test(s) ||
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    s
  );

const titleCase = (s: string): string =>
  s.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());

function translateSegment(seg: string): string {
  if (SEGMENT_ES[seg]) return SEGMENT_ES[seg];

  if (seg.startsWith('add-')) {
    const raw = seg.slice(4);
    const base = SEGMENT_ES[raw] || titleCase(raw);
    return `Agregar ${base}`;
  }

  return titleCase(seg);
}

export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const cleanPath = pathname.split('?')[0].split('#')[0];

  const crumbs: BreadcrumbItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      isCurrent: cleanPath === '/dashboard',
    },
  ];

  const push = (name: string, href: string, isCurrent = false): void => {
    crumbs.push({ name, href, isCurrent });
  };

  if (VIEW_ROUTES[cleanPath]) {
    push(VIEW_ROUTES[cleanPath], cleanPath, true);
    return crumbs;
  }

  if (ADD_ROUTES[cleanPath]) {
    const { parent, addLabel, parentHref } = ADD_ROUTES[cleanPath];
    const parentHrefResolved =
      parentHref ||
      Object.entries(VIEW_ROUTES).find(([, label]) => label === parent)?.[0] ||
      '#';
    push(parent, parentHrefResolved, false);
    push(addLabel || 'Agregar', cleanPath, true);
    return crumbs;
  }

  const addBase = Object.keys(ADD_ROUTES).find((base) =>
    cleanPath.startsWith(base + '/')
  );
  if (addBase) {
    const { parent, addLabel, parentHref } = ADD_ROUTES[addBase];
    const parentHrefResolved =
      parentHref ||
      Object.entries(VIEW_ROUTES).find(([, label]) => label === parent)?.[0] ||
      '#';
    push(parent, parentHrefResolved, false);
    push(addLabel || 'Agregar', cleanPath, true);
    return crumbs;
  }

  const exportAction = cleanPath.match(
    /^\/dashboard\/export\/\d+\/(edit|duplicate)$/
  );
  if (exportAction) {
    push('Exportaciones', '/dashboard/export/search', false);
    push(
      exportAction[1] === 'edit'
        ? 'Editar Exportación'
        : 'Duplicar Exportación',
      cleanPath,
      true
    );
    return crumbs;
  }

  const orderLine = cleanPath.match(
    /^\/dashboard\/export\/purchase-orders\/(\d+)(\/export\/\d+)?$/
  );
  if (orderLine) {
    const orderHref = `/dashboard/export/purchase-orders/${orderLine[1]}`;
    push('Órdenes de Compra', '/dashboard/export/purchase-orders', false);
    push('Orden de Compra', orderHref, !orderLine[2]);
    if (orderLine[2]) push('Crear Exportación', cleanPath, true);
    return crumbs;
  }

  if (/^\/dashboard\/export\/bookings\/\d+$/.test(cleanPath)) {
    push('Bookings', '/dashboard/export/bookings', false);
    push('Editar Booking', cleanPath, true);
    return crumbs;
  }

  if (/^\/dashboard\/user\/[^/]+$/.test(cleanPath)) {
    push('Perfil', cleanPath, true);
    return crumbs;
  }

  const segments = cleanPath.split('/').filter(Boolean);
  let acc = '';
  const labelSegments = segments.filter((s) => s !== 'dashboard');

  labelSegments.forEach((seg, idx) => {
    acc += `/${seg}`;
    const isLast = idx === labelSegments.length - 1;

    if (isNumericOrUUID(seg)) {
      const lastLabel = crumbs.length
        ? crumbs[crumbs.length - 1].name
        : 'Detalle';
      if (crumbs.length) crumbs[crumbs.length - 1].isCurrent = false;
      push(lastLabel || 'Detalle', cleanPath, true);
    } else {
      const name = translateSegment(seg);
      push(name, acc, isLast);
    }
  });

  return crumbs;
}
