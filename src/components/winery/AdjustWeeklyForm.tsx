'use client';

import {
  Box,
  Button,
  Grid,
  Heading,
  Text,
  VStack,
  Divider,
  Badge,
  GridItem,
  useToast,
  SimpleGrid,
  Select,
  Flex,
} from '@chakra-ui/react';
import { parseISO, getISOWeek } from 'date-fns';
import { FieldArray, Form, Formik } from 'formik';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';
import { useAdjustWeekly } from '../../hooks/winery/useAdjustWeekly';
import { useStockMovementsByBusiness } from '../../hooks/winery/useStockMovementsByBusiness';
import { formatDayMonthYear } from '../../utils/dayMonthYear';
import { STOCK_MOVEMENT_LABELS } from '../../utils/stockMovementLabels';
import CheckboxForm from '../ui/form/CheckboxForm';
import InputFieldNumber from '../ui/form/InputFieldNumber';

interface AdjustWeeklyFormProps {
  businessId: number;
  week: number;
}

const clamp = (x: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, x));

const clampUnits = (current: number, units: number): number => {
  const maxUnits = current < 0 ? Math.abs(current) : Math.max(0, current);
  const safeUnits = clamp(Number(units) || 0, 0, maxUnits);
  return safeUnits;
};

const computeProjectedStock = (current: number, units: number): number => {
  const u = clampUnits(current, units);
  if (current < 0) return Math.min(0, current + u);
  return Math.max(0, current - u);
};

const computeMaterialDiscount = (
  current: number,
  units: number,
  unitCost: number
): number => {
  const cost = Number.isFinite(unitCost) ? unitCost : 0;
  const u = clampUnits(current, units);
  return u * cost;
};

const getValidationSchema = (): Yup.ObjectSchema<{
  dataReviewed: boolean;
  stocks: { id: number; real: number; current: number }[];
  selectedCosts: Record<string, number>;
}> => {
  return Yup.object({
    dataReviewed: Yup.boolean()
      .oneOf([true], 'Debes revisar los datos antes de enviar')
      .required('Requerido'),
    stocks: Yup.array()
      .of(
        Yup.object({
          id: Yup.number().required(),
          current: Yup.number().required(),
          real: Yup.number()
            .required('Requerido')
            .min(0, 'No puede ser negativo')
            .test('max-by-current-sign', function (value) {
              const { current } = this.parent as { current: number };
              const max =
                current < 0 ? Math.abs(current) : Math.max(0, current);
              if ((value ?? 0) > max) {
                return this.createError({
                  message: `No puede exceder ${max} unidades a ajustar`,
                });
              }
              return true;
            })
            .typeError('Debe ser un número'),
        })
      )
      .required()
      .default([]),
    selectedCosts: Yup.object().default({}),
  });
};

const AdjustWeeklyForm = ({
  businessId,
  week,
}: AdjustWeeklyFormProps): JSX.Element => {
  const { data: materials = [], isLoading } =
    useStockMovementsByBusiness(businessId);
  const toast = useToast();
  const mutation = useAdjustWeekly(businessId);
  const queryClient = useQueryClient();

  const initialValues = {
    dataReviewed: false,
    stocks: materials.map((item) => ({
      id: item.exporterMaterialStockId,
      name: item.materialDetail.name,
      code: item.materialDetail.code,
      assigned: item.assignedStock,
      current: item.currentStock,
      real: 0,
      currentCost: item.currentCost,
      transfers: item.stockMovementsFromExporter.filter(
        (m) => getISOWeek(parseISO(m.createdAt)) === week
      ),
      consumptions: item.stockMovementsConsumption.filter(
        (m) => getISOWeek(parseISO(m.createdAt)) === week
      ),
    })),
    selectedCosts: {} as Record<string, number>,
  };

  const handleSubmit = async (values: typeof initialValues): Promise<void> => {
    const updates = values.stocks
      .map((item) => ({
        id: item.id,
        current: item.current,
        units: clampUnits(item.current, item.real),
        projected: computeProjectedStock(item.current, item.real),
      }))
      .filter((x) => x.units > 0);

    if (updates.length === 0) {
      toast({ title: 'No hay cambios para ajustar.', status: 'info' });
      return;
    }

    const realStocks = Object.fromEntries(
      updates.map((u) => [u.id, u.projected])
    );

    try {
      await mutation.mutateAsync({ realStocks });
      toast({
        title: 'Stock ajustado correctamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      queryClient.invalidateQueries('stockMovements');
    } catch {
      toast({
        title: 'Error al ajustar el stock.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Heading size='lg' mb={8}>
        Materiales - Semana {week}
      </Heading>
      <Formik
        initialValues={initialValues}
        validationSchema={getValidationSchema()}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, isSubmitting, setFieldValue }) => {
          const totalDiscount = values.stocks.reduce((acc, item) => {
            const cost =
              values.selectedCosts[String(item.id)] ?? item.currentCost ?? 0;
            return acc + computeMaterialDiscount(item.current, item.real, cost);
          }, 0);

          return (
            <Form>
              <FieldArray name='stocks'>
                {() => (
                  <VStack spacing={4} align='stretch'>
                    {values.stocks.length === 0 && (
                      <Text>No hay materiales disponibles.</Text>
                    )}

                    {values.stocks.map((item, index) => {
                      const uniqueCosts = new Set<number>();
                      uniqueCosts.add(item.currentCost ?? 0);
                      item.consumptions.forEach((c) => {
                        c.exportSent?.materialCosts?.forEach((mc) => {
                          if (mc.unitCost !== undefined)
                            uniqueCosts.add(mc.unitCost);
                        });
                      });
                      const costs = Array.from(uniqueCosts);

                      const selectedCost =
                        values.selectedCosts[String(item.id)] ??
                        item.currentCost ??
                        0;

                      const unitsClamped = clampUnits(item.current, item.real);
                      const projected = computeProjectedStock(
                        item.current,
                        item.real
                      );
                      const materialDiscount = computeMaterialDiscount(
                        item.current,
                        item.real,
                        selectedCost
                      );

                      return (
                        <Box
                          key={item.id}
                          p={2}
                          borderWidth='1px'
                          borderRadius='md'
                        >
                          <Grid templateColumns='1fr 1fr 1fr' gap={4} mb={2}>
                            <Text fontWeight='bold'>{item.name}</Text>
                            <Text>
                              <strong>Código:</strong> {item.code}
                            </Text>
                            <Text>
                              <strong>Asignado:</strong> {item.assigned}
                            </Text>
                          </Grid>

                          <Grid templateColumns='1fr 1fr' gap={4} mb={2}>
                            <Text>
                              <strong>Stock Actual:</strong> {item.current}
                            </Text>
                            <Flex direction='column' gap={1}>
                              <Text>
                                <strong>Unidades a Ajustar:</strong>
                              </Text>
                              <InputFieldNumber
                                name={`stocks[${index}].real`}
                                value={item.real}
                                placeholder='Unidades a Ajustar'
                                isDecimal={false}
                              />
                              <Text fontSize='sm' color='gray.600'>
                                Stock Proyectado: <strong>{projected}</strong>
                                {' - '}
                                Unidades Consideradas:{' '}
                                <strong>{unitsClamped}</strong>
                              </Text>
                            </Flex>
                          </Grid>

                          <SimpleGrid
                            columns={{ base: 1, md: 2 }}
                            spacing='4'
                            mb={4}
                          >
                            <Text>
                              <strong>
                                Seleccionar Costo para el Descuento:
                              </strong>
                            </Text>
                            <Select
                              value={
                                values.selectedCosts[String(item.id)] ??
                                item.currentCost
                              }
                              onChange={(e) =>
                                setFieldValue(
                                  `selectedCosts.${item.id}`,
                                  parseFloat(e.target.value)
                                )
                              }
                              mt={1}
                            >
                              {costs.map((cost) => (
                                <option key={cost} value={cost}>
                                  ${cost.toFixed(2)}
                                </option>
                              ))}
                            </Select>
                            <Box>
                              {item.current < 0 && (
                                <Badge colorScheme='red' mb={2}>
                                  Stock negativo actual: {projected}/
                                  {item.current}
                                </Badge>
                              )}
                            </Box>
                            <Text
                              mt={1}
                              color={
                                materialDiscount === 0 ? 'black' : 'red.600'
                              }
                            >
                              <strong>Descuento Estimado:</strong> $
                              {materialDiscount.toFixed(2)}
                            </Text>
                          </SimpleGrid>

                          <Divider my={2} />
                          <Grid templateColumns='1fr 1fr' gap={4}>
                            <GridItem>
                              <Heading size='sm' mb={2}>
                                Transferencias (Semana {week})
                              </Heading>
                              {item.transfers.length === 0 ? (
                                <Text color='gray.500'>
                                  No hay transferencias.
                                </Text>
                              ) : (
                                <VStack align='start' spacing={1}>
                                  {item.transfers.map((m) => (
                                    <Box key={m.id}>
                                      <Badge colorScheme='green'>
                                        {STOCK_MOVEMENT_LABELS[m.type] ??
                                          m.type}
                                      </Badge>{' '}
                                      {m.quantity} unidades - (
                                      {formatDayMonthYear(m.createdAt)}
                                      )
                                    </Box>
                                  ))}
                                </VStack>
                              )}
                            </GridItem>
                            <GridItem>
                              <Heading size='sm' mb={2}>
                                Consumos (Semana {week})
                              </Heading>
                              {item.consumptions.length === 0 ? (
                                <Text color='gray.500'>No hay consumos.</Text>
                              ) : (
                                <VStack align='start' spacing={1}>
                                  {item.consumptions.map((m) => (
                                    <Box key={m.id}>
                                      <Badge colorScheme='red'>
                                        {!m.exportSentId
                                          ? 'DESCONTADO'
                                          : (STOCK_MOVEMENT_LABELS[m.type] ??
                                            m.type)}
                                      </Badge>{' '}
                                      {m.quantity} unidades{' '}
                                      {!m.exportSentId
                                        ? null
                                        : `- (Envío #${m.exportSentId})`}{' '}
                                      -{' '}
                                      {formatDayMonthYear(m.createdAt)}
                                    </Box>
                                  ))}
                                </VStack>
                              )}
                            </GridItem>
                          </Grid>
                        </Box>
                      );
                    })}

                    {values.stocks.length > 0 && (
                      <>
                        <Text
                          fontWeight='bold'
                          color={totalDiscount === 0 ? 'black' : 'red.500'}
                        >
                          Total Descuento Estimado: ${totalDiscount.toFixed(2)}
                        </Text>

                        <SimpleGrid columns={1} spacing={2}>
                          <CheckboxForm
                            name='dataReviewed'
                            label='He revisado los datos antes de enviar'
                          />
                          <Button
                            type='submit'
                            colorScheme='teal'
                            isLoading={
                              mutation.isLoading || isLoading || isSubmitting
                            }
                          >
                            Enviar Ajuste
                          </Button>
                        </SimpleGrid>
                      </>
                    )}
                  </VStack>
                )}
              </FieldArray>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default AdjustWeeklyForm;
