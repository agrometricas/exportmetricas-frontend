'use client';

import {
  Button,
  Text,
  Box,
  VStack,
  Spinner,
  Center,
  Dialog,
  Portal,
} from '@chakra-ui/react';
import { useState } from 'react';
import { AssignStockToBusinessForm } from './AssignStockToBusinessForm';
import { CreateBusinessStockAssignmentForm } from './CreateBusinessStockAssignmentForm';
import { useBusinessesByExporter } from '../../hooks/business/getAllBusinessesByExporter';
import { Business } from '../../types/cuttingSheet.response';
import { BusinessMaterialStock } from '../../types/winery/businessMaterialStock';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  businessMaterialStocks: BusinessMaterialStock[];
  availableStock: number;
  exporterId: number;
  materialId: number;
  materialType: string;
}

export function AssignStockToBusinessModal({
  isOpen,
  onClose,
  businessMaterialStocks,
  availableStock,
  exporterId,
  materialId,
  materialType,
}: Props): JSX.Element {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null
  );
  const { data: farms, isLoading } = useBusinessesByExporter(exporterId);

  const handleReset = (): void => setSelectedBusiness(null);

  const existingStock = (
    businessId: number
  ): BusinessMaterialStock | undefined =>
    businessMaterialStocks.find((bms) => bms.businessId === businessId);

  return (
    <Dialog.Root
      open={isOpen}
      size='lg'
      placement='center'
      onOpenChange={(e) => {
        if (!e.open) {
          handleReset();
          onClose();
        }
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              {selectedBusiness
                ? `Asignar Stock a ${selectedBusiness.name}`
                : 'Selecciona una Finca'}
            </Dialog.Header>
            <Dialog.CloseTrigger />
            <Dialog.Body>
              {isLoading ? (
                <Center py={6}>
                  <Spinner size='lg' />
                </Center>
              ) : selectedBusiness ? (
                ((): JSX.Element => {
                  const existing = existingStock(selectedBusiness.id);
                  return existing ? (
                    <AssignStockToBusinessForm
                      stockId={existing.id}
                      currentStock={availableStock}
                      currentCost={existing.currentCost}
                      businessName={existing.business.name}
                      businessCurrentStock={existing.currentStock}
                      businessAssignedStock={existing.assignedStock}
                      maxAssignableStock={availableStock}
                      onClose={onClose}
                      onBack={handleReset}
                    />
                  ) : (
                    <CreateBusinessStockAssignmentForm
                      exporterId={exporterId}
                      materialType={materialType}
                      materialId={materialId}
                      business={selectedBusiness}
                      availableStock={availableStock}
                      onBack={handleReset}
                      onClose={onClose}
                    />
                  );
                })()
              ) : (
                <VStack gap={3} align='stretch' mb={4}>
                  {(farms ?? []).map((farm) => (
                    <Box
                      key={farm.id}
                      p={3}
                      border='1px solid #E2E8F0'
                      borderRadius='md'
                      cursor='pointer'
                    >
                      <Text fontWeight='bold'>{farm.name}</Text>
                      <Text fontSize='sm' color='gray.500'>
                        MAGAP: {farm.codeMAGAP}
                      </Text>
                      <Button
                        mt={2}
                        size='sm'
                        colorPalette='green'
                        onClick={() => setSelectedBusiness(farm)}
                      >
                        Seleccionar
                      </Button>
                    </Box>
                  ))}
                </VStack>
              )}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
