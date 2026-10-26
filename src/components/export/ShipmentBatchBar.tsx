'use client';

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Checkbox,
  CloseButton,
  Flex,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { MdLocalShipping } from 'react-icons/md';
import { useQueryClient } from 'react-query';
import { useCreateExportSentBatch } from '../../hooks/export/export-sent/createExportSentBatch';
import { ExportType } from '../../types/export';
import { formatDayMonthYear } from '../../utils/dayMonthYear';
import { serverErrorMessage } from '../../utils/serverErrorMessage';
import { shipmentBatchSummary } from '../../utils/shipmentBatch';

const AFFECTED_QUERIES = [
  'exports',
  'export',
  'exportsPending',
  'exportsSent',
  'exportsSentPending',
  'cuttingSheets',
  'cuttingSheetsPending',
  'exportSentCostsPending',
  'clientPaymentsPending',
  'exporterMaterialStock',
  'businessStock',
  'stockMovements',
  'exportProgress',
  'workQueue',
];

const shipmentLabel = (item?: Partial<ExportType>): string =>
  item
    ? [
        item.business?.name,
        item.boxBrand?.name,
        item.boxQuantity ? `${item.boxQuantity} cajas` : '',
        formatDayMonthYear(item.cuttingDate),
      ]
        .filter(Boolean)
        .join(' · ')
    : 'Exportación';

interface ShipmentBatchBarProps {
  items: Partial<ExportType>[];
  selectedIds: number[];
  onSelectedChange: (ids: number[]) => void;
}

const ShipmentBatchBar: React.FC<ShipmentBatchBarProps> = ({
  items,
  selectedIds,
  onSelectedChange,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useCreateExportSentBatch();
  const [failures, setFailures] = useState<
    { exportId: number; label: string; message: string }[]
  >([]);

  const barBg = useColorModeValue('green.50', 'gray.700');
  const hintColor = useColorModeValue('gray.600', 'gray.300');

  const selected = items.filter((item) =>
    selectedIds.includes(Number(item.id))
  );
  const allSelected = items.length > 0 && selected.length === items.length;

  const send = async (): Promise<void> => {
    const labels = new Map(
      selected.map((item) => [Number(item.id), shipmentLabel(item)])
    );
    try {
      const result = await mutateAsync([...labels.keys()]);
      AFFECTED_QUERIES.forEach((key) => queryClient.invalidateQueries(key));
      const summary = shipmentBatchSummary(result);
      toast({
        title: summary.title,
        status: summary.status,
        duration: 6000,
        isClosable: true,
      });
      setFailures(
        result.failed.map((failure) => ({
          ...failure,
          label: labels.get(failure.exportId) ?? shipmentLabel(),
        }))
      );
      onSelectedChange(result.failed.map((failure) => failure.exportId));
      onClose();
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        router.push('/api/auth/signout');
        return;
      }
      toast({
        title: 'No se pudo registrar el lote',
        description: serverErrorMessage(error),
        status: 'error',
        duration: 6000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      {items.length > 1 && (
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align={{ base: 'stretch', md: 'center' }}
          justify='space-between'
          gap={3}
          p={3}
          bg={barBg}
          borderRadius='lg'
        >
          <Box>
            <Checkbox
              isChecked={allSelected}
              isIndeterminate={selected.length > 0 && !allSelected}
              onChange={() =>
                onSelectedChange(
                  allSelected ? [] : items.map((item) => Number(item.id))
                )
              }
              colorScheme='green'
            >
              Elegir todas
            </Checkbox>
            <Text fontSize='sm' color={hintColor} mt={1}>
              Registra juntas las elegidas con lo que propone cada alícuota.
              Para cambiar una cantidad, abre esa exportación.
            </Text>
          </Box>
          <Button
            colorScheme='green'
            leftIcon={<MdLocalShipping />}
            isDisabled={selected.length === 0}
            onClick={onOpen}
            flexShrink={0}
          >
            Enviar lo propuesto ({selected.length})
          </Button>
        </Flex>
      )}

      {failures.length > 0 && (
        <Alert status='warning' borderRadius='md' alignItems='flex-start'>
          <AlertIcon />
          <Box flex='1'>
            <AlertTitle>Quedaron sin enviar</AlertTitle>
            <AlertDescription>
              <List spacing={1} mt={1}>
                {failures.map((failure) => (
                  <ListItem key={failure.exportId}>
                    <strong>{failure.label}:</strong> {failure.message}
                  </ListItem>
                ))}
              </List>
            </AlertDescription>
          </Box>
          <CloseButton
            aria-label='Cerrar el aviso'
            onClick={() => setFailures([])}
          />
        </Alert>
      )}

      <Modal isOpen={isOpen} onClose={onClose} isCentered size='lg'>
        <ModalOverlay />
        <ModalContent mx={4}>
          <ModalHeader>Enviar los insumos propuestos</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={3}>
              Se registra el envío de{' '}
              {selected.length === 1
                ? '1 exportación'
                : `${selected.length} exportaciones`}{' '}
              con las cantidades que propone cada alícuota, y se descuenta del
              stock de cada finca.
            </Text>
            <List spacing={1} maxH='40vh' overflowY='auto'>
              {selected.map((item) => (
                <ListItem key={item.id} fontSize='sm'>
                  {shipmentLabel(item)}
                </ListItem>
              ))}
            </List>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant='ghost' onClick={onClose} isDisabled={isLoading}>
              Cancelar
            </Button>
            <Button colorScheme='green' onClick={send} isLoading={isLoading}>
              Registrar{' '}
              {selected.length === 1 ? '1 envío' : `${selected.length} envíos`}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ShipmentBatchBar;
