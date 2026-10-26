'use client';

import {
  Box,
  Heading,
  Text,
  Center,
  Button,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  SimpleGrid,
  useDisclosure,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { useMemo, useState } from 'react';
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
}: AddMaterialFormProps): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const {
    isOpen: isAssignOpen,
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
        <Text color='red.500'>No se pudo cargar el stock del material</Text>
      </Center>
    );
  }

  const MOVEMENT_TYPE_LABELS: Record<string, string> = {
    TRANSFER: 'TRANSFERIDO',
    CONSUMPTION: 'CONSUMIDO',
    ADJUSTMENT: 'ASIGNADO',
    RETURN: 'DEVUELTO',
  };

  const getMovementIcon = (type: string): JSX.Element | null => {
    switch (type) {
      case 'TRANSFER':
        return <MdArrowUpward color='orange' size={18} />;
      case 'CONSUMPTION':
        return <MdArrowUpward color='red' size={18} />;
      case 'ADJUSTMENT':
        return <MdArrowDownward color='green' size={18} />;
      case 'RETURN':
        return <MdArrowDownward color='teal' size={18} />;
      default:
        return null;
    }
  };

  return (
    <Box mx='auto' mt={4}>
      <Heading mb={4} size='md'>
        Stock de {materialName}
      </Heading>

      <SimpleGrid columns={{ base: 1, sm: 4 }} spacing={4} mb={4}>
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
          <Text fontWeight='bold'>Stock Asignado:</Text>
          <Text mb={2}>{stock.assignedStock}</Text>
        </Box>

        <Box>
          <Text fontWeight='bold'>Stock Actual:</Text>
          <Text mb={2}>{stock.currentStock}</Text>
        </Box>

        <Box>
          <Text fontWeight='bold'>Costo Asignado:</Text>
          <Text mb={2}>${stock.assignedCost.toFixed(2)}</Text>
        </Box>

        <Box>
          <Text fontWeight='bold'>Costo Actual:</Text>
          <Text mb={2}>${stock.currentCost.toFixed(2)}</Text>
        </Box>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, sm: 4 }} spacing={4} mb={4}>
        <Button colorScheme='teal' onClick={onOpen}>
          Agregar Stock a Exportadora
        </Button>
        <UpdateStockModal
          isOpen={isOpen}
          onClose={onClose}
          stockId={stock.id}
          initialStock={stock.currentStock}
          initialCost={stock.currentCost}
        />
        <Button colorScheme='teal' onClick={onAssignOpen}>
          Asignar Stock a Fincas
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

      <Divider my={6} />

      <Heading mb={4} size='md'>
        Movimientos de Stock
      </Heading>

      <Box overflowX='auto'>
        {stock.stockMovements && stock.stockMovements.length > 0 ? (
          <Box>
            <Table variant='simple' size='sm'>
              <Thead>
                <Tr>
                  <Th>Fecha</Th>
                  <Th>Tipo</Th>
                  <Th></Th>
                  <Th isNumeric>Cantidad</Th>
                  <Th isNumeric>Costo Unitario</Th>
                </Tr>
              </Thead>
              <Tbody>
                {paginatedMovements?.map((movement) => (
                  <Tr key={movement.id}>
                    <Td>
                      {format(new Date(movement.createdAt), 'dd/MM/yyyy')}
                    </Td>
                    <Td>
                      {MOVEMENT_TYPE_LABELS[movement.type] ?? movement.type}
                    </Td>
                    <Td>{getMovementIcon(movement.type)}</Td>
                    <Td isNumeric>{movement.quantity}</Td>
                    <Td isNumeric>${movement.unitCost.toFixed(2)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Box mt={4} display='flex' justifyContent='end' gap={4}>
              <Button
                size='sm'
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                isDisabled={currentPage === 1}
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
                isDisabled={
                  currentPage ===
                  Math.ceil(stock.stockMovements.length / itemsPerPage)
                }
              >
                Siguiente
              </Button>
            </Box>
          </Box>
        ) : (
          <Text textAlign='center' py={4} color='gray.500'>
            Aún no se han registrado movimientos para este material.
          </Text>
        )}
      </Box>
    </Box>
  );
}
