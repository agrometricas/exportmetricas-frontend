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
  Collapse,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Link,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { MdContentCut, MdExpandLess, MdExpandMore } from 'react-icons/md';
import { useQueryClient } from 'react-query';
import { useCuttingTypes } from '../../../hooks/export/cutting-type/getCuttingTypes';
import { useCreateCuttingSheetBatch } from '../../../hooks/export/cuttingSheet/createCuttingSheetBatch';
import { usePagination } from '../../../hooks/usePagination';
import { PendingSheet, SheetBatchRow } from '../../../types/cuttingSheetBatch';
import { CuttingType } from '../../../types/cuttingType';
import {
  cuttingTypesFor,
  initialSheetRow,
  isSheetRowReady,
  sheetBatchBody,
  sheetBatchSummary,
} from '../../../utils/cuttingSheetBatch';
import {
  belowDeckFor,
  boxBrandHasPallets,
  CONTAINER_POSITIONS,
  palletsHeightOptions,
} from '../../../utils/cuttingSheetOptions';
import { formatDayMonthYear } from '../../../utils/dayMonthYear';
import { toggleId } from '../../../utils/selection';
import { serverErrorMessage } from '../../../utils/serverErrorMessage';

const AFFECTED_QUERIES = [
  'cuttingSheets',
  'cuttingSheetsPending',
  'exportProgress',
  'workQueue',
];

type Editable = Omit<SheetBatchRow, 'exportSentId'>;

const sheetLabel = (sheet?: PendingSheet): string =>
  sheet
    ? [
        sheet.export?.business?.name,
        sheet.export?.boxBrand?.name,
        sheet.export?.boxQuantity ? `${sheet.export.boxQuantity} cajas` : '',
        formatDayMonthYear(sheet.export?.cuttingDate),
      ]
        .filter(Boolean)
        .join(' · ')
    : 'Hoja de corte';

interface CuttingSheetBatchPanelProps {
  items: PendingSheet[];
}

const CuttingSheetBatchPanel: React.FC<CuttingSheetBatchPanelProps> = ({
  items,
}) => {
  const { paginationParams } = usePagination();
  const { data: cuttingTypesData = [] } = useCuttingTypes(paginationParams);
  const cuttingTypes = cuttingTypesData as CuttingType[];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useCreateCuttingSheetBatch();
  const [edits, setEdits] = useState<Record<number, Partial<Editable>>>({});
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [created, setCreated] = useState<{ label: string; pdfUrl: string }[]>(
    []
  );
  const [failures, setFailures] = useState<
    { exportSentId: number; label: string; message: string }[]
  >([]);

  const panelBg = useColorModeValue('green.50', 'gray.700');
  const rowBorder = useColorModeValue('gray.200', 'gray.600');
  const hintColor = useColorModeValue('gray.600', 'gray.300');
  const rowBg = useColorModeValue('white', 'gray.800');

  const rowOf = (sheet: PendingSheet): SheetBatchRow => ({
    ...initialSheetRow(sheet, cuttingTypes),
    ...edits[sheet.id],
  });
  const selected = items.filter((sheet) => selectedIds.includes(sheet.id));
  const selectedRows = selected.map(rowOf);
  const allReady = selectedRows.every(isSheetRowReady);
  const allSelected = items.length > 0 && selected.length === items.length;

  const edit = (sheet: PendingSheet, change: Partial<Editable>): void => {
    setEdits((current) => ({
      ...current,
      [sheet.id]: { ...current[sheet.id], ...change },
    }));
    setSelectedIds((ids) =>
      ids.includes(sheet.id) ? ids : [...ids, sheet.id]
    );
  };

  const applyToSelected = (change: Partial<Editable>): void =>
    selected.forEach((sheet) => {
      if (change.palletsHeight && !boxBrandHasPallets(sheet.export?.boxBrand)) {
        return;
      }
      edit(sheet, change);
    });

  const send = async (): Promise<void> => {
    const labels = new Map(
      selected.map((sheet) => [sheet.id, sheetLabel(sheet)])
    );
    try {
      const result = await mutateAsync(sheetBatchBody(selectedRows));
      AFFECTED_QUERIES.forEach((key) => queryClient.invalidateQueries(key));
      const summary = sheetBatchSummary(result);
      toast({
        title: summary.title,
        description: result.created.length
          ? 'Cada hoja se envía por correo a sus destinatarios.'
          : undefined,
        status: summary.status,
        duration: 6000,
        isClosable: true,
      });
      setCreated(
        result.created.map((sheet) => ({
          label: labels.get(sheet.exportSentId) ?? sheetLabel(),
          pdfUrl: sheet.pdfUrl,
        }))
      );
      setFailures(
        result.failed.map((failure) => ({
          ...failure,
          label: labels.get(failure.exportSentId) ?? sheetLabel(),
        }))
      );
      setSelectedIds(result.failed.map((failure) => failure.exportSentId));
      onClose();
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        router.push('/api/auth/signout');
        return;
      }
      toast({
        title: 'No se pudieron generar las hojas',
        description: serverErrorMessage(error),
        status: 'error',
        duration: 6000,
        isClosable: true,
      });
    }
  };

  return (
    <Stack spacing={3}>
      {created.length > 0 && (
        <Alert status='success' borderRadius='md' alignItems='flex-start'>
          <AlertIcon />
          <Box flex='1'>
            <AlertTitle>Hojas generadas</AlertTitle>
            <AlertDescription>
              <List spacing={1} mt={1}>
                {created.map((sheet) => (
                  <ListItem key={sheet.pdfUrl}>
                    {sheet.label}:{' '}
                    <Link href={sheet.pdfUrl} isExternal fontWeight='semibold'>
                      abrir el PDF
                    </Link>
                  </ListItem>
                ))}
              </List>
            </AlertDescription>
          </Box>
          <CloseButton
            aria-label='Cerrar el aviso'
            onClick={() => setCreated([])}
          />
        </Alert>
      )}

      {failures.length > 0 && (
        <Alert status='warning' borderRadius='md' alignItems='flex-start'>
          <AlertIcon />
          <Box flex='1'>
            <AlertTitle>Quedaron sin generar</AlertTitle>
            <AlertDescription>
              <List spacing={1} mt={1}>
                {failures.map((failure) => (
                  <ListItem key={failure.exportSentId}>
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

      {items.length > 1 && (
        <Box bg={panelBg} borderRadius='lg' p={4}>
          <Flex
            align={{ base: 'stretch', md: 'center' }}
            direction={{ base: 'column', md: 'row' }}
            justify='space-between'
            gap={3}
          >
            <Box>
              <Heading size='sm'>Generar varias a la vez</Heading>
              <Text fontSize='sm' color={hintColor} mt={1}>
                Completa el tipo de corte, la altura de pallets y la posición de
                las que elijas, y se generan juntas.
              </Text>
            </Box>
            <Button
              size='sm'
              variant='outline'
              colorScheme='green'
              flexShrink={0}
              rightIcon={expanded ? <MdExpandLess /> : <MdExpandMore />}
              onClick={() => setExpanded((open) => !open)}
            >
              {expanded ? 'Cerrar' : 'Abrir'}
            </Button>
          </Flex>

          <Collapse in={expanded} animateOpacity>
            <Flex
              direction={{ base: 'column', md: 'row' }}
              gap={3}
              mt={3}
              align={{ base: 'stretch', md: 'flex-end' }}
            >
              <Checkbox
                isChecked={allSelected}
                isIndeterminate={selected.length > 0 && !allSelected}
                onChange={() =>
                  setSelectedIds(
                    allSelected ? [] : items.map((sheet) => sheet.id)
                  )
                }
                colorScheme='green'
                flexShrink={0}
              >
                Elegir todas
              </Checkbox>
              <FormControl isDisabled={selected.length === 0}>
                <FormLabel fontSize='sm' mb={1}>
                  Posición para las elegidas
                </FormLabel>
                <Select
                  size='sm'
                  bg={rowBg}
                  placeholder='Elige una posición'
                  value=''
                  onChange={(event) =>
                    event.target.value &&
                    applyToSelected({
                      containerPositioning: event.target.value,
                    })
                  }
                >
                  {CONTAINER_POSITIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isDisabled={selected.length === 0}>
                <FormLabel fontSize='sm' mb={1}>
                  Altura para las que llevan pallets
                </FormLabel>
                <Select
                  size='sm'
                  bg={rowBg}
                  placeholder='Elige una altura'
                  value=''
                  onChange={(event) =>
                    event.target.value &&
                    applyToSelected({ palletsHeight: event.target.value })
                  }
                >
                  {palletsHeightOptions(true).map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Flex>

            <Stack spacing={3} mt={4}>
              {items.map((sheet) => {
                const row = rowOf(sheet);
                const isSelected = selectedIds.includes(sheet.id);
                const options = cuttingTypesFor(
                  sheet.export?.boxBrand?.id,
                  cuttingTypes
                );
                return (
                  <Box
                    key={sheet.id}
                    borderWidth='1px'
                    borderColor={isSelected ? 'green.400' : rowBorder}
                    borderRadius='lg'
                    bg={rowBg}
                    p={3}
                  >
                    <Checkbox
                      isChecked={isSelected}
                      onChange={() =>
                        setSelectedIds((ids) => toggleId(ids, sheet.id))
                      }
                      colorScheme='green'
                    >
                      <Text fontSize='sm' fontWeight='semibold'>
                        {sheetLabel(sheet)}
                      </Text>
                    </Checkbox>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3} mt={3}>
                      <FormControl isInvalid={isSelected && !row.cuttingTypeId}>
                        <FormLabel fontSize='sm' mb={1}>
                          Tipo de corte
                        </FormLabel>
                        <Select
                          size='sm'
                          placeholder='Elige'
                          value={row.cuttingTypeId}
                          onChange={(event) =>
                            edit(sheet, { cuttingTypeId: event.target.value })
                          }
                        >
                          {options.map((option) => (
                            <option key={option.id} value={String(option.id)}>
                              {option.shipmentType}
                              {option.quality ? ` · ${option.quality}` : ''}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl isInvalid={isSelected && !row.palletsHeight}>
                        <FormLabel fontSize='sm' mb={1}>
                          Altura de pallets
                        </FormLabel>
                        <Select
                          size='sm'
                          placeholder='Elige'
                          value={row.palletsHeight}
                          onChange={(event) =>
                            edit(sheet, { palletsHeight: event.target.value })
                          }
                        >
                          {palletsHeightOptions(
                            boxBrandHasPallets(sheet.export?.boxBrand)
                          ).map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.name}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl
                        isInvalid={isSelected && !row.containerPositioning}
                      >
                        <FormLabel fontSize='sm' mb={1}>
                          Posición del contenedor
                        </FormLabel>
                        <Select
                          size='sm'
                          placeholder='Elige'
                          value={row.containerPositioning}
                          onChange={(event) =>
                            edit(sheet, {
                              containerPositioning: event.target.value,
                            })
                          }
                        >
                          {CONTAINER_POSITIONS.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.name}
                            </option>
                          ))}
                        </Select>
                        {row.containerPositioning && (
                          <FormHelperText>
                            Bajo cubierta:{' '}
                            {belowDeckFor(row.containerPositioning)}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </SimpleGrid>
                  </Box>
                );
              })}
            </Stack>

            <Flex
              mt={4}
              gap={3}
              direction={{ base: 'column', md: 'row' }}
              align={{ base: 'stretch', md: 'center' }}
              justify='flex-end'
            >
              {selected.length > 0 && !allReady && (
                <Text fontSize='sm' color='orange.600'>
                  Completa las elegidas marcadas en rojo.
                </Text>
              )}
              <Button
                colorScheme='green'
                leftIcon={<MdContentCut />}
                isDisabled={selected.length === 0 || !allReady}
                onClick={onOpen}
              >
                Generar las hojas ({selected.length})
              </Button>
            </Flex>
          </Collapse>
        </Box>
      )}

      <Modal isOpen={isOpen} onClose={onClose} isCentered size='lg'>
        <ModalOverlay />
        <ModalContent mx={4}>
          <ModalHeader>Generar las hojas de corte</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={3}>
              Se{' '}
              {selected.length === 1
                ? 'genera 1 hoja'
                : `generan ${selected.length} hojas`}{' '}
              y cada una sale por correo a la exportadora, al cliente, al
              productor y a los contactos de su finca.
            </Text>
            <List spacing={1} maxH='40vh' overflowY='auto'>
              {selected.map((sheet) => (
                <ListItem key={sheet.id} fontSize='sm'>
                  {sheetLabel(sheet)}
                </ListItem>
              ))}
            </List>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant='ghost' onClick={onClose} isDisabled={isLoading}>
              Cancelar
            </Button>
            <Button colorScheme='green' onClick={send} isLoading={isLoading}>
              Generar{' '}
              {selected.length === 1 ? '1 hoja' : `${selected.length} hojas`}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
};

export default CuttingSheetBatchPanel;
