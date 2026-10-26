import {
  ExportProgress,
  ProgressStep,
  StepKey,
  StepStatus,
} from '../types/exportProgress';

export const STEP_STATUS: Record<
  StepStatus,
  { label: string; colorScheme: string }
> = {
  DONE: { label: 'Hecho', colorScheme: 'green' },
  TODO: { label: 'Pendiente', colorScheme: 'orange' },
  WAITING: { label: 'En espera', colorScheme: 'gray' },
  OPTIONAL: { label: 'Opcional', colorScheme: 'gray' },
};

export type StepAction =
  | { label: string; href: string }
  | { label: string; modal: 'customs' };

export const RETURN_PARAM = 'volver';

export function withReturn(href: string, back?: string): string {
  if (!back) return href;
  return `${href}?${RETURN_PARAM}=${encodeURIComponent(back)}`;
}

// Only a page of the app: the value comes from the URL, and an outside
// address there would turn a form into a redirect to anywhere.
export function returnTo(fallback: string, search: string): string {
  const back = new URLSearchParams(search).get(RETURN_PARAM);
  return back && back.startsWith('/dashboard/') && !back.startsWith('//')
    ? back
    : fallback;
}

type Ids = Pick<ExportProgress, 'exportId' | 'exportSentId' | 'bookingId'>;

const SENT_PAGES: Partial<Record<StepKey, [string, string]>> = {
  costs: ['Validar costos', '/dashboard/liquidation/add-export-cost'],
  producerPayment: [
    'Registrar pago',
    '/dashboard/liquidation/producer-pending-payments',
  ],
  clientPayment: [
    'Registrar cobro',
    '/dashboard/liquidation/client-pending-payments',
  ],
};

export function stepAction(
  step: Pick<ProgressStep, 'key' | 'status'>,
  ids: Ids,
  back?: string,
  canEdit = false
): StepAction | null {
  const link = (label: string, href: string): StepAction => ({
    label,
    href: withReturn(href, back),
  });
  if (step.key === 'booking') {
    if (ids.bookingId) {
      return link(
        'Ver documentos',
        `/dashboard/export/bookings/${ids.bookingId}`
      );
    }
    return canEdit
      ? {
          label: 'Asignar booking',
          href: `/dashboard/export/${ids.exportId}/edit`,
        }
      : null;
  }
  if (step.status !== 'TODO') return null;
  if (step.key === 'customs') {
    return { label: 'Registrar AUCP y DAE', modal: 'customs' };
  }
  if (step.key === 'supplies') {
    return link(
      'Registrar envío',
      `/dashboard/liquidation/add-supply-shipment/${ids.exportId}`
    );
  }
  if (step.key === 'cuttingSheet') {
    return link(
      'Generar hoja',
      `/dashboard/export/add-cutting-sheet/${ids.exportId}`
    );
  }
  const page = SENT_PAGES[step.key];
  if (!page || !ids.exportSentId) return null;
  return link(page[0], `${page[1]}/${ids.exportSentId}`);
}

export const exportPage = (exportId: number): string =>
  `/dashboard/export/${exportId}`;
