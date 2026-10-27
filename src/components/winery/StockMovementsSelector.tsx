'use client';

import { NativeSelect, Spinner, VStack, Text, Center } from '@chakra-ui/react';
import React, { useState } from 'react';
import MaterialStockMovementCard from './MaterialStockMovementCard';
import { useBusinessesByExporter } from '../../hooks/business/getAllBusinessesByExporter';
import { useExporter } from '../../hooks/useUserProfile';
import { useStockMovementsByBusiness } from '../../hooks/winery/useStockMovementsByBusiness';

const StockMovementsSelector = (): React.JSX.Element => {
  const { user, isLoading: isLoadingExporter } = useExporter();
  const exporterId = user?.exporterDetails?.id;
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(
    null
  );
  const { data: farms, isLoading: loadingFarms } = useBusinessesByExporter(
    exporterId ?? 0
  );
  const { data: stockMovements, isLoading: loadingStock } =
    useStockMovementsByBusiness(selectedBusinessId);

  if (isLoadingExporter || !exporterId) {
    return (
      <Center py={10}>
        <Spinner />{' '}
      </Center>
    );
  }

  return (
    <VStack align='stretch' gap={4}>
      {loadingFarms ? (
        <Center py={10}>
          <Spinner />{' '}
        </Center>
      ) : (
        <NativeSelect.Root>
          <NativeSelect.Field
            placeholder='Selecciona una finca'
            onChange={(e) => setSelectedBusinessId(Number(e.target.value))}
          >
            {farms?.map((farm) => (
              <option key={farm.id} value={farm.id}>
                {farm.name}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      )}

      {!loadingStock && selectedBusinessId && stockMovements?.length === 0 && (
        <Text>No hay movimientos registrados para esta finca.</Text>
      )}

      {stockMovements && stockMovements.length > 0 && (
        <MaterialStockMovementCard materials={stockMovements} />
      )}
    </VStack>
  );
};

export default StockMovementsSelector;
