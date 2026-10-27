import { Alert, Button, Center, Spinner } from '@chakra-ui/react';
import Link_Next from 'next/link';
import React from 'react';
import { useBoxBrands } from '../../hooks/box-brand/getBoxBrands';
import { useBusinessesByMerchantId } from '../../hooks/business/getBusinesses';
import { useMerchants } from '../../hooks/merchants/getMerchants';
import { usePagination } from '../../hooks/usePagination';
import { BoxBrandType } from '../../types/box-brand/boxBrand';
import { BusinessType } from '../../types/merchant/business';
import { MerchantResponse } from '../../types/merchant/merchant.response';
import { PurchaseOrderResponse } from '../../types/purchaseOrder';
import { getWeekInfo } from '../../utils/getWeekInfo';
import AddExportForm from '../export/AddExportForm';

// The producer, farm and box selects show the full record next to the choice;
// the order only carries names, so the records come from the same lists the
// selects load.
export default function ExportFromLine({
  order,
  lineId,
}: {
  order: PurchaseOrderResponse;
  lineId: number;
}): React.JSX.Element {
  const { paginationParams } = usePagination();
  const { data: merchants = [], isLoading: loadingMerchants } =
    useMerchants(paginationParams);
  const { data: businesses = [], isLoading: loadingBusinesses } =
    useBusinessesByMerchantId(paginationParams, { id: order.merchant.id });
  const { data: boxBrands = [], isLoading: loadingBoxBrands } =
    useBoxBrands(paginationParams);
  const line = order.lines.find((l) => l.id === lineId);
  const orderHref = `/dashboard/export/purchase-orders/${order.id}`;

  if (!line || line.export) {
    return (
      <Alert.Root status='warning' borderRadius='md'>
        <Alert.Indicator />
        <Alert.Description flex='1'>
          {line?.export
            ? `Esta línea ya tiene la exportación ${line.export.id}.`
            : 'Esta línea no está en la orden de compra.'}
        </Alert.Description>
        <Button size='sm' variant='outline' colorPalette='green' asChild>
          <Link_Next href={orderHref}>Volver a la orden</Link_Next>
        </Button>
      </Alert.Root>
    );
  }

  if (loadingMerchants || loadingBusinesses || loadingBoxBrands) {
    return (
      <Center py={10}>
        <Spinner color='green.fg' />
      </Center>
    );
  }

  return (
    <AddExportForm
      fromLine={{
        orderId: order.id,
        week: getWeekInfo({ date: new Date(order.weekStart) }).week.split(
          ' //'
        )[0],
        line,
        merchant: (merchants as Partial<MerchantResponse>[]).find(
          (m) => m.id === order.merchant.id
        ) ?? {
          id: order.merchant.id,
          businessName: order.merchant.businessName,
        },
        business: (businesses as Partial<BusinessType>[]).find(
          (b) => b.id === line.business.id
        ),
        boxBrand: (boxBrands as Partial<BoxBrandType>[]).find(
          (b) => b.id === line.boxBrand.id
        ),
      }}
    />
  );
}
