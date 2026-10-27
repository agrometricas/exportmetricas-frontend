'use client';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CloseButton,
  Collapsible,
  Flex,
  Heading,
  Link,
  List,
  NativeSelect,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
  Field,
  Dialog,
  Portal,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { MdContentCut, MdExpandLess, MdExpandMore } from 'react-icons/md';
import { toaster } from '@/components/ui/toaster';
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
  const { open, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending: isLoading } = useCreateCuttingSheetBatch();
  const [edits, setEdits] = useState<Record<number, Partial<Editable>>>({});
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [created, setCreated] = useState<{ label: string; pdfUrl: string }[]>(
    []
  );
  const [failures, setFailures] = useState<
    { exportSentId: number; label: string; message: string }[]
  >([]);

  const panelBg = 'green.subtle';
  const rowBorder = 'border';
  const hintColor = 'fg.muted';
  const rowBg = 'bg.panel';

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
      AFFECTED_QUERIES.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: [key] })
      );
      const summary = sheetBatchSummary(result);
      toaster.create({
        title: summary.title,
        description: result.created.length
          ? 'Cada hoja se envía por correo a sus destinatarios.'
          : undefined,
        type: summary.status,
        duration: 6000,
        closable: true,
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
      toaster.create({
        title: 'No se pudieron generar las hojas',
        description: serverErrorMessage(error),
        type: 'error',
        duration: 6000,
        closable: true,
      });
    }
  };

  return (
    <Stack gap={3}>
      {created.length > 0 && (
        <Alert.Root status='success' borderRadius='md' alignItems='flex-start'>
          <Alert.Indicator />
          <Box flex='1'>
            <Alert.Title>Hojas generadas</Alert.Title>
            <Alert.Description>
              <List.Root gap={1} mt={1}>
                {created.map((sheet) => (
                  <List.Item key={sheet.pdfUrl}>
                    {sheet.label}:{' '}
                    <Link
                      href={sheet.pdfUrl}
                      fontWeight='semibold'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      abrir el PDF
                    </Link>
                  </List.Item>
                ))}
              </List.Root>
            </Alert.Description>
          </Box>
          <CloseButton
            aria-label='Cerrar el aviso'
            onClick={() => setCreated([])}
          />
        </Alert.Root>
      )}

      {failures.length > 0 && (
        <Alert.Root status='warning' borderRadius='md' alignItems='flex-start'>
          <Alert.Indicator />
          <Box flex='1'>
            <Alert.Title>Quedaron sin generar</Alert.Title>
            <Alert.Description>
              <List.Root gap={1} mt={1}>
                {failures.map((failure) => (
                  <List.Item key={failure.exportSentId}>
                    <strong>{failure.label}:</strong> {failure.message}
                  </List.Item>
                ))}
              </List.Root>
            </Alert.Description>
          </Box>
          <CloseButton
            aria-label='Cerrar el aviso'
            onClick={() => setFailures([])}
          />
        </Alert.Root>
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
              colorPalette='green'
              flexShrink={0}
              onClick={() => setExpanded((open) => !open)}
            >
              {expanded ? 'Cerrar' : 'Abrir'}
              {expanded ? <MdExpandLess /> : <MdExpandMore />}
            </Button>
          </Flex>

          <Collapsible.Root open={expanded}>
            <Collapsible.Content>
              <Flex
                direction={{ base: 'column', md: 'row' }}
                gap={3}
                mt={3}
                align={{ base: 'stretch', md: 'flex-end' }}
              >
                <Checkbox.Root
                  onCheckedChange={() =>
                    setSelectedIds(
                      allSelected ? [] : items.map((sheet) => sheet.id)
                    )
                  }
                  colorPalette='green'
                  flexShrink={0}
                  checked={
                    selected.length > 0 && !allSelected
                      ? 'indeterminate'
                      : allSelected
                  }
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                  <Checkbox.Label>Elegir todas</Checkbox.Label>
                </Checkbox.Root>
                <Field.Root disabled={selected.length === 0}>
                  <Field.Label fontSize='sm' mb={1}>
                    Posición para las elegidas
                  </Field.Label>
                  <NativeSelect.Root size='sm'>
                    <NativeSelect.Field
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
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Field.Root>
                <Field.Root disabled={selected.length === 0}>
                  <Field.Label fontSize='sm' mb={1}>
                    Altura para las que llevan pallets
                  </Field.Label>
                  <NativeSelect.Root size='sm'>
                    <NativeSelect.Field
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
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Field.Root>
              </Flex>

              <Stack gap={3} mt={4}>
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
                      <Checkbox.Root
                        onCheckedChange={() =>
                          setSelectedIds((ids) => toggleId(ids, sheet.id))
                        }
                        colorPalette='green'
                        checked={isSelected}
                      >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                        <Checkbox.Label>
                          <Text fontSize='sm' fontWeight='semibold'>
                            {sheetLabel(sheet)}
                          </Text>
                        </Checkbox.Label>
                      </Checkbox.Root>
                      <SimpleGrid columns={{ base: 1, md: 3 }} gap={3} mt={3}>
                        <Field.Root invalid={isSelected && !row.cuttingTypeId}>
                          <Field.Label fontSize='sm' mb={1}>
                            Tipo de corte
                          </Field.Label>
                          <NativeSelect.Root size='sm'>
                            <NativeSelect.Field
                              placeholder='Elige'
                              value={row.cuttingTypeId}
                              onChange={(event) =>
                                edit(sheet, {
                                  cuttingTypeId: event.target.value,
                                })
                              }
                            >
                              {options.map((option) => (
                                <option
                                  key={option.id}
                                  value={String(option.id)}
                                >
                                  {option.shipmentType}
                                  {option.quality ? ` · ${option.quality}` : ''}
                                </option>
                              ))}
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                          </NativeSelect.Root>
                        </Field.Root>
                        <Field.Root invalid={isSelected && !row.palletsHeight}>
                          <Field.Label fontSize='sm' mb={1}>
                            Altura de pallets
                          </Field.Label>
                          <NativeSelect.Root size='sm'>
                            <NativeSelect.Field
                              placeholder='Elige'
                              value={row.palletsHeight}
                              onChange={(event) =>
                                edit(sheet, {
                                  palletsHeight: event.target.value,
                                })
                              }
                            >
                              {palletsHeightOptions(
                                boxBrandHasPallets(sheet.export?.boxBrand)
                              ).map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.name}
                                </option>
                              ))}
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                          </NativeSelect.Root>
                        </Field.Root>
                        <Field.Root
                          invalid={isSelected && !row.containerPositioning}
                        >
                          <Field.Label fontSize='sm' mb={1}>
                            Posición del contenedor
                          </Field.Label>
                          <NativeSelect.Root size='sm'>
                            <NativeSelect.Field
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
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                          </NativeSelect.Root>
                          {row.containerPositioning && (
                            <Field.HelperText>
                              Bajo cubierta:{' '}
                              {belowDeckFor(row.containerPositioning)}
                            </Field.HelperText>
                          )}
                        </Field.Root>
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
                  <Text fontSize='sm' color='orange.fg'>
                    Completa las elegidas marcadas en rojo.
                  </Text>
                )}
                <Button
                  colorPalette='green'
                  disabled={selected.length === 0 || !allReady}
                  onClick={onOpen}
                >
                  <MdContentCut />
                  Generar las hojas ({selected.length})
                </Button>
              </Flex>
            </Collapsible.Content>
          </Collapsible.Root>
        </Box>
      )}

      <Dialog.Root
        open={open}
        placement='center'
        size='lg'
        onOpenChange={(e) => {
          if (!e.open) {
            onClose();
          }
        }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content mx={4}>
              <Dialog.Header>Generar las hojas de corte</Dialog.Header>
              <Dialog.CloseTrigger />
              <Dialog.Body>
                <Text mb={3}>
                  Se{' '}
                  {selected.length === 1
                    ? 'genera 1 hoja'
                    : `generan ${selected.length} hojas`}{' '}
                  y cada una sale por correo a la exportadora, al cliente, al
                  productor y a los contactos de su finca.
                </Text>
                <List.Root gap={1} maxH='40vh' overflowY='auto'>
                  {selected.map((sheet) => (
                    <List.Item key={sheet.id} fontSize='sm'>
                      {sheetLabel(sheet)}
                    </List.Item>
                  ))}
                </List.Root>
              </Dialog.Body>
              <Dialog.Footer gap={3}>
                <Button variant='ghost' onClick={onClose} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button colorPalette='green' onClick={send} loading={isLoading}>
                  Generar{' '}
                  {selected.length === 1
                    ? '1 hoja'
                    : `${selected.length} hojas`}
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Stack>
  );
};

export default CuttingSheetBatchPanel;
