import {
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  Separator,
} from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import { Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';
import { toaster } from '@/components/ui/toaster';
import { useBoxBrand } from '../../../hooks/box-brand/getBoxBrand';
import { useCreateCuttingType } from '../../../hooks/export/cutting-type/createCuttingType';
import { useCuttingTypeOptions } from '../../../hooks/export/cutting-type/getCuttingTypeOptions';
import { useUpdateCuttingType } from '../../../hooks/export/cutting-type/updateCuttingType';
import { CuttingType, CuttingTypeOptions } from '../../../types/cuttingType';
import {
  cuttingTypeBody,
  CuttingTypeFormValues,
  cuttingTypeFormValues,
  EMPTY_CUTTING_TYPE,
  optionsWithSaved,
} from '../../../utils/cuttingTypeForm';
import { serverErrorMessage } from '../../../utils/serverErrorMessage';
import SelectBoxBrand from '../../box-brands/SelectBoxBrand';
import InputFieldPlain from '../../ui/form/InputFieldPlain';
import InputFieldSelector from '../../ui/form/InputFieldSelector';
import InputFieldTextArea from '../../ui/form/InputFieldTextArea';

const validationSchema = Yup.object({
  boxBrandId: Yup.number()
    .integer('Debe ser un número entero')
    .moreThan(0, 'Debe ser mayor que 0')
    .required('Requerido'),
  quality: Yup.string().required('Elige la calidad'),
  shipmentType: Yup.string()
    .required('Requerido')
    .max(50, 'Debe tener 50 caracteres o menos'),
  leavesAtHarvest: Yup.number()
    .required('Requerido')
    .min(1, 'Debe ser al menos 1'),
  maxAgeAtCut: Yup.number().required('Requerido').min(1, 'Debe ser al menos 1'),
  minCaliber: Yup.number().required('Requerido').min(1, 'Debe ser al menos 1'),
  maxCaliber: Yup.number().required('Requerido').min(1, 'Debe ser al menos 1'),
  fingerLength: Yup.string().required('Requerido'),
  saneos: Yup.string()
    .trim()
    .required('Elige los saneos o escribe otro valor')
    .max(30, 'Debe tener 30 caracteres o menos'),
  cunas: Yup.string().required('Requerido'),
  clusterDetail: Yup.string().required('Requerido'),
  labelDetail: Yup.string().required('Requerido'),
  firstLine: Yup.string(),
  secondLine: Yup.string(),
  thirdLine: Yup.string(),
  fourthLine: Yup.string(),
  packagingPattern: Yup.string().required('Requerido'),
  palletDetail: Yup.string().required('Requerido'),
  cornerProtectorsDetail: Yup.string().required('Requerido'),
  reinforcementsDetail: Yup.string().required('Requerido'),
  plasticStrapsDetail: Yup.string().required('Requerido'),
  staplesDetail: Yup.string().required('Requerido'),
  blockingSheetsDetail: Yup.string().required('Requerido'),
  transportDetail: Yup.string().required('Requerido'),
  generalObservations: Yup.string(),
});

const lineOptions = [
  { id: 'PEQUEÑOS PLANOS', name: 'PEQUEÑOS PLANOS' },
  { id: 'PEQUEÑOS CURVOS', name: 'PEQUEÑOS CURVOS' },
  { id: 'PEQUEÑOS SEMICURVOS', name: 'PEQUEÑOS SEMICURVOS' },
  { id: 'MEDIANOS PLANOS', name: 'MEDIANOS PLANOS' },
  { id: 'MEDIANOS CURVOS', name: 'MEDIANOS CURVOS' },
  { id: 'MEDIANOS SEMICURVOS', name: 'MEDIANOS SEMICURVOS' },
  { id: 'GRANDES PLANOS', name: 'GRANDES PLANOS' },
  { id: 'GRANDES CURVOS', name: 'GRANDES CURVOS' },
  { id: 'GRANDES SEMICURVOS', name: 'GRANDES SEMICURVOS' },
  { id: 'N/A', name: 'N/A' },
];

const packagingPatternOptions = [
  { id: 'TRES LINEAS', name: 'TRES LINEAS' },
  { id: 'CUATRO LINEAS', name: 'CUATRO LINEAS' },
  { id: 'JUMBO', name: 'JUMBO' },
  { id: 'TRES LINEAS Y CUATRO LINEAS', name: 'TRES LINEAS Y CUATRO LINEAS' },
  { id: 'TRES LINEAS Y JUMBO', name: 'TRES LINEAS Y JUMBO' },
  { id: 'CUATRO LINEAS Y JUMBO', name: 'CUATRO LINEAS Y JUMBO' },
  {
    id: 'CUATRO LINEAS, JUMBO Y TRES LINEAS',
    name: 'CUATRO LINEAS, JUMBO Y TRES LINEAS',
  },
];

const AddCuttingTypeForm = ({
  cuttingType,
}: {
  cuttingType?: CuttingType;
}): React.JSX.Element => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = Boolean(cuttingType?.id);
  const { createCuttingType, isLoading: createLoading } =
    useCreateCuttingType();
  const { mutate: updateCuttingType, isLoading: updateLoading } =
    useUpdateCuttingType();
  const { data: optionsData } = useCuttingTypeOptions();
  const options = optionsData as CuttingTypeOptions | undefined;
  const [selectedBoxBrandId, setSelectedBoxBrandId] = React.useState<
    string | null
  >(cuttingType?.boxBrandId ? String(cuttingType.boxBrandId) : null);
  const { data: boxBrandDetails } = useBoxBrand({
    boxBrandId: selectedBoxBrandId || '',
  });

  const onError = (error: unknown): void => {
    if (isAxiosError(error) && error.response?.status === 401) {
      router.push('/api/auth/signout');
      return;
    }
    toaster.create({
      title: isEdit
        ? 'No se guardó el tipo de corte'
        : 'No se creó el tipo de corte',
      description: serverErrorMessage(error),
      type: 'error',
      duration: 5000,
      closable: true,
    });
  };

  const onSaved = (title: string): void => {
    toaster.create({ title, type: 'success', duration: 5000, closable: true });
    queryClient.invalidateQueries('cuttingTypes');
    queryClient.invalidateQueries('cuttingType');
    router.push('/dashboard/box-brands/cutting-types');
  };

  const onSubmit = (
    values: CuttingTypeFormValues,
    formikHelpers: FormikHelpers<CuttingTypeFormValues>
  ): void => {
    const body = cuttingTypeBody(values);
    if (isEdit && cuttingType) {
      updateCuttingType(
        { id: Number(cuttingType.id), body },
        {
          onError,
          onSuccess: () => onSaved('Tipo de corte actualizado'),
        }
      );
      return;
    }
    createCuttingType(body, {
      onError,
      onSuccess: () => {
        formikHelpers.resetForm();
        onSaved('Tipo de Corte Creado con Éxito');
      },
    });
  };

  return (
    <>
      <Formik
        initialValues={
          cuttingType ? cuttingTypeFormValues(cuttingType) : EMPTY_CUTTING_TYPE
        }
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ isSubmitting }) => (
          <Form>
            <Flex flexDirection='column' gap={2}>
              <Heading fontSize={'2xl'} p={'12px'}>
                Marca de Caja
              </Heading>
              <Separator mb={'16px'} />

              <SelectBoxBrand
                name={'boxBrandId'}
                boxBrandSelect={isEdit ? boxBrandDetails : undefined}
                setBoxBrandSelect={(selectedBoxBrand) => {
                  // The select reports null when it mounts; keep the saved
                  // box brand of an edit instead of dropping it.
                  if (selectedBoxBrand?.id) {
                    setSelectedBoxBrandId(String(selectedBoxBrand.id));
                  }
                }}
              />

              <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
                <InputFieldPlain
                  name='shipmentType'
                  label='Nombre del Tipo de Corte'
                />
                <InputFieldSelector
                  name='quality'
                  label='Calidad'
                  placeholder='Seleccione la calidad'
                  options={(options?.qualities ?? []).map((quality) => ({
                    id: quality,
                    name: quality,
                  }))}
                />
              </SimpleGrid>
              <Heading fontSize={'2xl'} p={'12px'}>
                Detalles del Corte
              </Heading>
              <Separator mb={'16px'} />
              {boxBrandDetails && selectedBoxBrandId ? (
                <Box
                  p='4'
                  border='1px'
                  borderRadius='md'
                  borderColor='gray.200'
                >
                  <Text fontSize='sm'>
                    <strong>Cluster Bag:</strong>{' '}
                    {boxBrandDetails?.clusterBag?.name || 'N/A'}.
                  </Text>
                  <Text fontSize='sm'>
                    <strong>Etiqueta:</strong>{' '}
                    {boxBrandDetails?.label?.name || 'N/A'} {'/ '}
                    {boxBrandDetails?.label?.description || 'N/A'}.
                  </Text>
                  <Text fontSize='sm'>
                    <strong>Calibre:</strong> Basado en las dimensiones de{' '}
                    {boxBrandDetails?.clusterBag?.name || 'N/A'}{' '}
                    {boxBrandDetails?.clusterBag?.dimensions || 'N/A'}.
                  </Text>
                  <Text fontSize='sm'>
                    <strong>Peso Neto de Caja:</strong>{' '}
                    {boxBrandDetails.netWeightBox} LBS
                  </Text>
                  <Text fontSize='sm'>
                    <strong>Peso Bruto de Caja:</strong>{' '}
                    {boxBrandDetails.grossWeightBox} LBS
                  </Text>
                </Box>
              ) : (
                <Text>No se ha seleccionado una marca de caja.</Text>
              )}
              <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
                <InputFieldPlain
                  name='leavesAtHarvest'
                  label='Hojas en Cosecha'
                  placeholder='Numero Mínimo de Hojas Funcionales'
                />
                <InputFieldPlain
                  name='maxAgeAtCut'
                  label='Edad Máxima al Corte'
                  placeholder='Numero de Semanas al Corte'
                />
                <InputFieldPlain
                  name='minCaliber'
                  label='Calibre Mínimo'
                  placeholder='Numero de Calibre Mínimo'
                />
                <InputFieldPlain
                  name='maxCaliber'
                  label='Calibre Máximo'
                  placeholder='Numero de Calibre Maximo'
                />
                <InputFieldPlain
                  name='fingerLength'
                  label='Largo del Dedo'
                  placeholder='Longitud Mínima del Dedo en Pulgadas'
                />
                <InputFieldPlain
                  name='saneos'
                  label='Saneos'
                  placeholder={`${(options?.saneos ?? []).join(', ')} u otro valor`}
                  suggestions={options?.saneos ?? []}
                />
                <InputFieldPlain
                  name='cunas'
                  label='Cuñas'
                  placeholder='Cuñas por Caja'
                />
                <InputFieldPlain
                  name='clusterDetail'
                  label='Detalle de Cluster'
                  placeholder='Cantidad Mínima y Maxima de # de Dedos por Cluster'
                />
                <InputFieldPlain
                  name='labelDetail'
                  label='Detalle de Etiqueta'
                  placeholder='Detalle de Distribucion de Etiquetas'
                />
              </SimpleGrid>
              <Heading fontSize={'2xl'} p={'12px'}>
                Detalles de Empaque
              </Heading>
              <Separator mb={'16px'} />

              <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
                <InputFieldSelector
                  name={'firstLine'}
                  label={'Primera Línea '}
                  placeholder='Seleccione el Diseño de la Primera Línea'
                  flexDirection='column'
                  alignItems='flex-end'
                  options={optionsWithSaved(
                    lineOptions,
                    cuttingType?.firstLine
                  )}
                />
                <InputFieldSelector
                  name={'secondLine'}
                  label={'Segunda Línea '}
                  placeholder='Seleccione el Diseño de la Segunda Línea'
                  flexDirection='column'
                  alignItems='flex-end'
                  options={optionsWithSaved(
                    lineOptions,
                    cuttingType?.secondLine
                  )}
                />
                <InputFieldSelector
                  name={'thirdLine'}
                  label={'Tercera Línea '}
                  placeholder='Seleccione el Diseño de la Tercera Línea'
                  flexDirection='column'
                  alignItems='flex-end'
                  options={optionsWithSaved(
                    lineOptions,
                    cuttingType?.thirdLine
                  )}
                />
                <InputFieldSelector
                  name={'fourthLine'}
                  label={'Cuarta Línea '}
                  placeholder='Seleccione el Diseño de la Cuarta Línea'
                  flexDirection='column'
                  alignItems='flex-end'
                  options={optionsWithSaved(
                    lineOptions,
                    cuttingType?.fourthLine
                  )}
                />
                <InputFieldSelector
                  name={'packagingPattern'}
                  label={'Patrón de Empaque'}
                  placeholder='Seleccione el Patrón de Empaque'
                  flexDirection='column'
                  alignItems='flex-end'
                  options={optionsWithSaved(
                    packagingPatternOptions,
                    cuttingType?.packagingPattern
                  )}
                />
              </SimpleGrid>
              <Heading fontSize={'2xl'} p={'12px'}>
                Detalles de Transporte
              </Heading>
              <Separator mb={'16px'} />
              {boxBrandDetails && selectedBoxBrandId ? (
                <Box
                  p='4'
                  border='1px'
                  borderRadius='md'
                  borderColor='gray.200'
                  overflow='hidden'
                >
                  <SimpleGrid columns={2} gap={4}>
                    <Box>
                      <Text fontSize='sm'>
                        <strong>Pallets:</strong>{' '}
                        {boxBrandDetails?.palletsType?.name || 'N/A'} (
                        {boxBrandDetails?.palletsTypeQuantity || 'N/A'}{' '}
                        unidades).
                      </Text>
                      <Text fontSize='sm'>
                        <strong>Esquineros:</strong>{' '}
                        {boxBrandDetails?.cornerType?.name || 'N/A'} (
                        {boxBrandDetails?.cornerTypeQuantity || 'N/A'}{' '}
                        unidades).
                      </Text>
                      <Text fontSize='sm'>
                        <strong>Refuerzos:</strong>{' '}
                        {boxBrandDetails?.reinforcementType?.name || 'N/A'} (
                        {boxBrandDetails?.reinforcementTypeQuantity || 'N/A'}{' '}
                        unidades).
                      </Text>
                      <Text fontSize='sm'>
                        <strong>Zunchos:</strong>{' '}
                        {boxBrandDetails?.stripping?.name || 'N/A'} (
                        {boxBrandDetails?.strippingQuantity || 'N/A'} unidades,
                        color: {boxBrandDetails?.stripping?.color || 'N/A'}).
                      </Text>
                      <Text fontSize='sm'>
                        <strong>Grapas:</strong>{' '}
                        {boxBrandDetails?.staple?.name || 'N/A'} (
                        {boxBrandDetails?.stapleQuantity || 'N/A'} unidades por
                        paquete).
                      </Text>
                      <Text fontSize='sm'>
                        <strong>Hojas de Bloqueo:</strong>{' '}
                        {boxBrandDetails?.blockingSheet?.name || 'N/A'} (
                        {boxBrandDetails?.blockingSheetQuantity || 'N/A'}{' '}
                        unidades, dimensiones:{' '}
                        {boxBrandDetails?.blockingSheet?.dimensions || 'N/A'}).
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize='sm'>
                        <strong>Mini Pallets:</strong>{' '}
                        {boxBrandDetails?.miniPalletsType?.name || 'N/A'} (
                        {boxBrandDetails?.miniPalletsTypeQuantity || 'N/A'}{' '}
                        unidades).
                      </Text>
                      <Text fontSize='sm'>
                        <strong>Termografo:</strong>{' '}
                        {boxBrandDetails?.thermograph?.name || 'N/A'} (
                        {boxBrandDetails?.thermographQuantity || 'N/A'}{' '}
                        unidades, tipo:{' '}
                        {boxBrandDetails?.thermograph?.type || 'N/A'}).
                      </Text>
                      <Text fontSize='sm'>
                        <strong>Sello:</strong>{' '}
                        {boxBrandDetails?.seal?.name || 'N/A'} (
                        {boxBrandDetails?.sealQuantity || 'N/A'} unidades, tipo:{' '}
                        {boxBrandDetails?.seal?.type || 'N/A'}).
                      </Text>
                      <Text fontSize='sm'>
                        <strong>Banda:</strong>{' '}
                        {boxBrandDetails?.band?.name || 'N/A'} (
                        {boxBrandDetails?.bandQuantity || 'N/A'} unidades,
                        color: {boxBrandDetails?.band?.color || 'N/A'}).
                      </Text>
                      <Text fontSize='sm'>
                        <strong>Sachet:</strong>{' '}
                        {boxBrandDetails?.sachet?.name || 'N/A'} (
                        {boxBrandDetails?.sachetQuantity || 'N/A'} unidades,
                        tipo: {boxBrandDetails?.sachet?.type || 'N/A'}).
                      </Text>
                      <Text fontSize='sm'>
                        <strong>Liga:</strong>{' '}
                        {boxBrandDetails?.rubber?.name || 'N/A'} (
                        {boxBrandDetails?.rubberQuantity || 'N/A'} unidades,
                        color: {boxBrandDetails?.rubber?.color || 'N/A'}).
                      </Text>
                    </Box>
                  </SimpleGrid>
                </Box>
              ) : (
                <Text>No se ha seleccionado una marca de caja.</Text>
              )}

              <InputFieldPlain
                name='palletDetail'
                label='Detalle de los Pallets'
                placeholder='Indique el Uso o Disposición de los Pallets'
              />
              <InputFieldPlain
                name='cornerProtectorsDetail'
                label='Detalle de los Esquineros'
                placeholder='Indique el Uso o Disposición de los Esquineros'
              />
              <InputFieldPlain
                name='reinforcementsDetail'
                label='Detalle de los Refuerzos'
                placeholder='Indique el Uso o Disposición de los Refuerzos'
              />
              <InputFieldPlain
                name='plasticStrapsDetail'
                label='Detalle de los Zunchos Plasticos'
                placeholder='Indique el Uso o Disposición de los Zunchos Plasticos'
              />
              <InputFieldPlain
                name='staplesDetail'
                label='Detalle de las Grapas'
                placeholder='Indique el Uso o Disposición de las Grapas'
              />
              <InputFieldPlain
                name='blockingSheetsDetail'
                label='Detalle de las Laminas de Bloqueo'
                placeholder='Indique el Uso o Disposición de las Laminas de Bloqueo'
              />
              <InputFieldPlain
                name='transportDetail'
                label='Detalle del Termografo'
                placeholder='Indique el Uso o Ubicación del Termografo'
              />
              <InputFieldTextArea
                name='generalObservations'
                label='Observaciones Generales'
                placeholder='Ingrese Cualquier Observación Adicional de Corte'
              />
              <SimpleGrid columns={{ base: 1, sm: 1 }}>
                <Button
                  mt='12px'
                  py='8px'
                  px='16px'
                  type='submit'
                  colorPalette='green'
                  loading={createLoading || updateLoading}
                  disabled={isSubmitting}
                >
                  {isEdit ? 'Guardar Cambios' : 'Enviar'}
                </Button>
              </SimpleGrid>
            </Flex>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AddCuttingTypeForm;
