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
  '/dashboard/producer/contract-usage': 'Cupos de la semana',
  '/dashboard/client/counterpart-totals': 'Totales por contraparte',
  '/dashboard/producer/contracts': 'Contratos',

  '/dashboard/client/clients': 'Clientes',
  '/dashboard/client/harbors': 'Puertos',
  '/dashboard/client/shipping-companies': 'Navieras',
  '/dashboard/client/shipping-contracts': 'Contratos navieros',
  '/dashboard/client/transport-rates': 'Tarifas de transporte',
  '/dashboard/client/deposits': 'Depósitos',
  '/dashboard/client/transports': 'Transportes',

  '/dashboard/box-brands/search': 'Alícuotas',
  '/dashboard/box-brands/verifiers': 'Verificadoras',
  '/dashboard/box-brands/cutting-types': 'Tipos de corte',

  '/dashboard/winery/stock': 'Stock',
  '/dashboard/winery/stock-movements': 'Trazabilidad de stock',
  '/dashboard/winery/adjust-weekly': 'Ajuste semanal',

  '/dashboard/export/search': 'Exportaciones',
  '/dashboard/export/bookings': 'Bookings',
  '/dashboard/export/documents': 'Documentos',
  '/dashboard/export/purchase-orders': 'Órdenes de compra',
  '/dashboard/liquidation/exports-sent': 'Envíos de insumos',

  '/dashboard/export/cutting-sheets': 'Hojas de corte',

  '/dashboard/liquidation/export-costs': 'Costos validados',
  '/dashboard/liquidation/producer-payments': 'Pago productores',
  '/dashboard/liquidation/client-payments': 'Cobro clientes',
  '/dashboard/client/bank-accounts': 'Cuentas bancarias',

  '/dashboard/logos': 'Logos',
  '/dashboard/settings/material-units': 'Unidades de materiales',
  '/dashboard/settings/minimum-box-price': 'Precio mínimo',
  '/dashboard/settings/box-types': 'Tipos de caja',
  '/dashboard/settings/users': 'Usuarios',
  '/dashboard/liquidation/price-sheet': 'Hoja de precios',
};

const ADD_ROUTES: AddMap = {
  '/dashboard/producer/add-producer': {
    parent: 'Productores',
    addLabel: 'Agregar productor',
    parentHref: '/dashboard/producer/producers',
  },
  '/dashboard/producer/add-fincas': {
    parent: 'Fincas',
    addLabel: 'Agregar finca',
    parentHref: '/dashboard/producer/fincas',
  },
  '/dashboard/producer/add-contract': {
    parent: 'Contratos',
    addLabel: 'Agregar contrato',
    parentHref: '/dashboard/producer/contracts',
  },
  '/dashboard/producer/add-bank-account': {
    parent: 'Cuentas bancarias',
    addLabel: 'Agregar cuenta bancaria',
    parentHref: '/dashboard/client/bank-accounts',
  },

  '/dashboard/client/add-client': {
    parent: 'Clientes',
    addLabel: 'Agregar cliente',
    parentHref: '/dashboard/client/clients',
  },
  '/dashboard/client/add-harbor': {
    parent: 'Puertos',
    addLabel: 'Agregar puerto',
    parentHref: '/dashboard/client/harbors',
  },
  '/dashboard/client/add-shipping-company': {
    parent: 'Navieras',
    addLabel: 'Agregar naviera',
    parentHref: '/dashboard/client/shipping-companies',
  },
  '/dashboard/client/add-shipping-contract': {
    parent: 'Contratos navieros',
    addLabel: 'Agregar contrato naviero',
    parentHref: '/dashboard/client/shipping-contracts',
  },
  '/dashboard/client/add-deposit': {
    parent: 'Depósitos',
    addLabel: 'Agregar depósito',
    parentHref: '/dashboard/client/deposits',
  },
  '/dashboard/client/add-transport': {
    parent: 'Transportes',
    addLabel: 'Agregar transporte',
    parentHref: '/dashboard/client/transports',
  },
  '/dashboard/client/add-bank-account': {
    parent: 'Cuentas bancarias',
    addLabel: 'Agregar cuenta bancaria',
    parentHref: '/dashboard/client/bank-accounts',
  },

  '/dashboard/box-brands/add-box-brand': {
    parent: 'Alícuotas',
    addLabel: 'Agregar alícuotas',
    parentHref: '/dashboard/box-brands/search',
  },
  '/dashboard/box-brands/add-brand': {
    parent: 'Alícuotas',
    addLabel: 'Agregar marca',
    parentHref: '/dashboard/box-brands/search',
  },
  '/dashboard/box-brands/add-verifier': {
    parent: 'Verificadoras',
    addLabel: 'Agregar verificadora',
    parentHref: '/dashboard/box-brands/verifiers',
  },
  '/dashboard/box-brands/add-cutting-type': {
    parent: 'Tipos de corte',
    addLabel: 'Agregar tipo de corte',
    parentHref: '/dashboard/box-brands/cutting-types',
  },

  '/dashboard/export/add-export': {
    parent: 'Exportaciones',
    addLabel: 'Agregar exportación',
    parentHref: '/dashboard/export/search',
  },
  '/dashboard/liquidation/add-supply-shipment': {
    parent: 'Envíos de insumos',
    addLabel: 'Agregar envío de insumos',
    parentHref: '/dashboard/liquidation/exports-sent',
  },

  '/dashboard/export/add-booking': {
    parent: 'Bookings',
    addLabel: 'Agregar booking',
    parentHref: '/dashboard/export/bookings',
  },
  '/dashboard/export/add-purchase-order': {
    parent: 'Órdenes de compra',
    addLabel: 'Agregar orden de compra',
    parentHref: '/dashboard/export/purchase-orders',
  },

  '/dashboard/export/add-cutting-sheet': {
    parent: 'Hojas de corte',
    addLabel: 'Agregar hoja de corte',
    parentHref: '/dashboard/export/cutting-sheets',
  },

  '/dashboard/winery/add-material': {
    parent: 'Stock',
    addLabel: 'Agregar stock',
    parentHref: '/dashboard/winery/stock',
  },

  '/dashboard/liquidation/add-export-cost': {
    parent: 'Costos validados',
    addLabel: 'Agregar costos validados',
    parentHref: '/dashboard/liquidation/export-costs',
  },
  '/dashboard/liquidation/producer-pending-payments': {
    parent: 'Pago productores',
    addLabel: 'Agregar pago productores',
    parentHref: '/dashboard/liquidation/producer-payments',
  },
  '/dashboard/liquidation/client-pending-payments': {
    parent: 'Cobro clientes',
    addLabel: 'Agregar cobro clientes',
    parentHref: '/dashboard/liquidation/client-payments',
  },
};

const SEGMENT_ES: Record<string, string> = {
  dashboard: 'Inicio',
  'update-user': 'Modificar ubicación',
  onboarding: 'Registro inicial',
  producer: 'Productores',
  producers: 'Productores',
  fincas: 'Fincas',
  contracts: 'Contratos',
  client: 'Clientes',
  clients: 'Clientes',
  harbors: 'Puertos',
  'shipping-companies': 'Navieras',
  'shipping-contracts': 'Contratos navieros',
  bookings: 'Bookings',
  'purchase-orders': 'Órdenes de compra',
  deposits: 'Depósitos',
  transports: 'Transportes',
  'box-brands': 'Marcas de caja',
  brand: 'Marca',
  search: 'Buscar',
  verifiers: 'Verificadoras',
  'cutting-types': 'Tipos de corte',
  'cutting-sheets': 'Hojas de corte',
  'upload-logo': 'Agregar logo',
  winery: 'Bodega',
  stock: 'Stock',
  'stock-movements': 'Trazabilidad de stock',
  'adjust-weekly': 'Ajuste semanal',
  export: 'Exportaciones',
  'exports-sent': 'Envíos de insumos',
  liquidation: 'Liquidación',
  'export-costs': 'Costos validados',
  'producer-payments': 'Pago productores',
  'client-payments': 'Cobro clientes',
  'bank-accounts': 'Cuentas bancarias',
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
      name: 'Inicio',
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

  const exportFile = cleanPath.match(/^\/dashboard\/export\/(\d+)$/);
  if (exportFile) {
    push('Exportaciones', '/dashboard/export/search', false);
    push(`Exportación ${exportFile[1]}`, cleanPath, true);
    return crumbs;
  }

  const exportAction = cleanPath.match(
    /^\/dashboard\/export\/\d+\/(edit|duplicate)$/
  );
  if (exportAction) {
    push('Exportaciones', '/dashboard/export/search', false);
    push(
      exportAction[1] === 'edit'
        ? 'Editar exportación'
        : 'Duplicar exportación',
      cleanPath,
      true
    );
    return crumbs;
  }

  if (/^\/dashboard\/producer\/fincas\/\d+$/.test(cleanPath)) {
    push('Fincas', '/dashboard/producer/fincas', false);
    push('Editar finca', cleanPath, true);
    return crumbs;
  }

  const orderWeek = cleanPath.match(
    /^\/dashboard\/export\/weekly-plan(\/assign)?$/
  );
  if (orderWeek) {
    push('Órdenes de compra', '/dashboard/export/purchase-orders', false);
    push(
      'Pedidos de la semana',
      '/dashboard/export/weekly-plan',
      !orderWeek[1]
    );
    if (orderWeek[1]) push('Asignar fincas', cleanPath, true);
    return crumbs;
  }

  if (/^\/dashboard\/export\/purchase-orders\/\d+$/.test(cleanPath)) {
    push('Órdenes de compra', '/dashboard/export/purchase-orders', false);
    push('Orden de compra', cleanPath, true);
    return crumbs;
  }

  if (/^\/dashboard\/box-brands\/cutting-types\/\d+$/.test(cleanPath)) {
    push('Tipos de corte', '/dashboard/box-brands/cutting-types', false);
    push('Editar tipo de corte', cleanPath, true);
    return crumbs;
  }

  if (/^\/dashboard\/export\/cutting-sheets\/\d+$/.test(cleanPath)) {
    push('Hojas de corte', '/dashboard/export/cutting-sheets', false);
    push('Corregir hoja de corte', cleanPath, true);
    return crumbs;
  }

  if (/^\/dashboard\/client\/shipping-contracts\/\d+$/.test(cleanPath)) {
    push('Contratos navieros', '/dashboard/client/shipping-contracts', false);
    push('Editar contrato naviero', cleanPath, true);
    return crumbs;
  }

  if (/^\/dashboard\/producer\/contracts\/\d+$/.test(cleanPath)) {
    push('Contratos', '/dashboard/producer/contracts', false);
    push('Editar contrato de productor', cleanPath, true);
    return crumbs;
  }

  const updateUser = cleanPath.match(
    /^\/dashboard\/user\/update-user\/([^/]+)$/
  );
  if (updateUser) {
    push('Perfil', `/dashboard/user/${updateUser[1]}`, false);
    push('Modificar ubicación', cleanPath, true);
    return crumbs;
  }

  if (/^\/dashboard\/export\/bookings\/\d+$/.test(cleanPath)) {
    push('Bookings', '/dashboard/export/bookings', false);
    push('Editar booking', cleanPath, true);
    return crumbs;
  }

  if (/^\/dashboard\/user\/[^/]+$/.test(cleanPath)) {
    push('Perfil', cleanPath, true);
    return crumbs;
  }

  const segments = cleanPath.split('/').filter(Boolean);
  let acc = '/dashboard';
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
