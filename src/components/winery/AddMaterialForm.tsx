'use client';

import {
  Box,
  Heading,
  Text,
  Center,
  Button,
  Table,
  SimpleGrid,
  useDisclosure,
  Separator,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import React, { useMemo, useState } from 'react';
import { MdArrowDownward, MdArrowUpward } from 'react-icons/md';
import LoadingState from '@/components/ui/states/LoadingState';
import { useExporterMaterialStock } from '@/hooks/winery/useExporterMaterialStock';
import { MATERIAL_TYPE_LABELS } from '@/utils/materialTypeLabels';
import { AssignStockToBusinessModal } from './AssignStockToBusinessModal';
import { UpdateStockModal } from './UpdateStockModal';

interface AddMaterialFormProps {
  exporterId: number;
  materialType: string;
  materialId: number;
  materialName: string;
}

export function AddMaterialForm({
  exporterId,
  materialType,
  materialId,
  materialName,
}: AddMaterialFormProps): React.JSX.Element {
  const { open, onOpen, onClose } = useDisclosure();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const {
    open: isAssignOpen,
    onOpen: onAssignOpen,
    onClose: onAssignClose,
  } = useDisclosure();
  const {
    data: stock,
    isLoading,
    error,
  } = useExporterMaterialStock({ exporterId, materialType, materialId });

  const paginatedMovements = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return stock?.stockMovements.slice(start, start + itemsPerPage);
  }, [stock?.stockMovements, currentPage]);

  if (isLoading) {
    return <LoadingState minH='60vh' />;
  }

  if (error || !stock) {
    return (
      <Center py={10}>
        <Text color='red.fg'>No se pudo cargar el stock del material</Text>
      </Center>
    );
  }

  const MOVEMENT_TYPE_LABELS: Record<string, string> = {
    TRANSFER: 'TRANSFERIDO',
    CONSUMPTION: 'CONSUMIDO',
    ADJUSTMENT: 'ASIGNADO',
    RETURN: 'DEVUELTO',
  };

  const getMovementIcon = (type: string): React.JSX.Element | null => {
    switch (type) {
      case 'TRANSFER':
        return <MdArrowUpward color='orange' size={18} />;
      case 'CONSUMPTION':
        return <MdArrowUpward color='red' size={18} />;
      case 'ADJUSTMENT':
        return <MdArrowDownward color='green' size={18} />;
      case 'RETURN':
        return <MdArrowDownward color='green.fg' size={18} />;
      default:
        return null;
    }
  };

  return (
    <Box mx='auto' mt={4}>
      <Heading mb={4} size='md'>
        Stock de {materialName}
      </Heading>

      <SimpleGrid columns={{ base: 1, sm: 4 }} gap={4} mb={4}>
        <Box>
          <Text fontWeight='bold'>Código:</Text>
          <Text mb={2}>{stock.materialDetail.code}</Text>
        </Box>

        <Box>
          <Text fontWeight='bold'>Tipo:</Text>
          <Text mb={2}>
            {MATERIAL_TYPE_LABELS[materialType] ?? materialType}
          </Text>
        </Box>

        <Box>
          <Text fontWeight='bold'>Stock asignado:</Text>
          <Text mb={2}>{stock.assignedStock}</Text>
        </Box>

        <Box>
          <Text fontWeight='bold'>Stock actual:</Text>
          <Text mb={2}>{stock.currentStock}</Text>
        </Box>

        <Box>
          <Text fontWeight='bold'>Costo asignado:</Text>
          <Text mb={2}>${stock.assignedCost.toFixed(2)}</Text>
        </Box>

        <Box>
          <Text fontWeight='bold'>Costo actual:</Text>
          <Text mb={2}>${stock.currentCost.toFixed(2)}</Text>
        </Box>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, sm: 4 }} gap={4} mb={4}>
        <Button colorPalette='green' onClick={onOpen}>
          Agregar stock a exportadora
        </Button>
        <UpdateStockModal
          isOpen={open}
          onClose={onClose}
          stockId={stock.id}
          initialStock={stock.currentStock}
          initialCost={stock.currentCost}
        />
        <Button colorPalette='green' onClick={onAssignOpen}>
          Asignar stock a fincas
        </Button>
        <AssignStockToBusinessModal
          isOpen={isAssignOpen}
          onClose={onAssignClose}
          businessMaterialStocks={stock.businessMaterialStocks}
          availableStock={stock.currentStock}
          exporterId={exporterId}
          materialId={materialId}
          materialType={materialType}
        />
      </SimpleGrid>

      <Separator my={6} />

      <Heading mb={4} size='md'>
        Movimientos de stock
      </Heading>

      <Box overflowX='auto'>
        {stock.stockMovements && stock.stockMovements.length > 0 ? (
          <Box>
            <Table.Root variant='line' size='sm'>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Fecha</Table.ColumnHeader>
                  <Table.ColumnHeader>Tipo</Table.ColumnHeader>
                  <Table.ColumnHeader></Table.ColumnHeader>
                  <Table.ColumnHeader textAlign='end'>
                    Cantidad
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign='end'>
                    Costo unitario
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {paginatedMovements?.map((movement) => (
                  <Table.Row key={movement.id}>
                    <Table.Cell>
                      {format(new Date(movement.createdAt), 'dd/MM/yyyy')}
                    </Table.Cell>
                    <Table.Cell>
                      {MOVEMENT_TYPE_LABELS[movement.type] ?? movement.type}
                    </Table.Cell>
                    <Table.Cell>{getMovementIcon(movement.type)}</Table.Cell>
                    <Table.Cell textAlign='end'>{movement.quantity}</Table.Cell>
                    <Table.Cell textAlign='end'>
                      ${movement.unitCost.toFixed(2)}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
            <Box mt={4} display='flex' justifyContent='end' gap={4}>
              <Button
                size='sm'
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <Text fontSize='sm' alignSelf='center'>
                Página {currentPage} de{' '}
                {Math.ceil(stock.stockMovements.length / itemsPerPage)}
              </Text>
              <Button
                size='sm'
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev < Math.ceil(stock.stockMovements.length / itemsPerPage)
                      ? prev + 1
                      : prev
                  )
                }
                disabled={
                  currentPage ===
                  Math.ceil(stock.stockMovements.length / itemsPerPage)
                }
              >
                Siguiente
              </Button>
            </Box>
          </Box>
        ) : (
          <Text textAlign='center' py={4} color='fg.muted'>
            Aún no se han registrado movimientos para este material.
          </Text>
        )}
      </Box>
    </Box>
  );
}
