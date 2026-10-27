'use client';
import {
  Alert,
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Input,
  SimpleGrid,
  Text,
  Field,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import Link_Next from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';
import { FormActions } from '@/components/ui/form/FormSection';
import { toaster } from '@/components/ui/toaster';
import { useCuttingTypes } from '../../../hooks/export/cutting-type/getCuttingTypes';
import { useCorrectCuttingSheet } from '../../../hooks/export/cuttingSheet/correctCuttingSheet';
import { usePagination } from '../../../hooks/usePagination';
import { CuttingSheetResponse } from '../../../types/cuttingSheet.response';
import { CuttingType } from '../../../types/cuttingType';
import {
  belowDeckFor,
  CONTAINER_POSITIONS,
  palletsHeightOptions,
  sheetVersionLabel,
} from '../../../utils/cuttingSheetOptions';
import { serverErrorMessage } from '../../../utils/serverErrorMessage';
import InputFieldSelector from '../../ui/form/InputFieldSelector';
import InputFieldTextArea from '../../ui/form/InputFieldTextArea';
import SelectCuttingType from '../cutting-type/SelectCuttingType';

interface CorrectionValues {
  cuttingTypeId: number | '';
  palletsHeight: string;
  containerPositioning: string;
  reason: string;
}

const correctionSchema = Yup.object({
  cuttingTypeId: Yup.number()
    .typeError('Elige el tipo de corte')
    .required('Elige el tipo de corte'),
  palletsHeight: Yup.string().required('Elige la altura de pallets'),
  containerPositioning: Yup.string().required(
    'Elige la posición del contenedor'
  ),
  reason: Yup.string()
    .trim()
    .required('Escribe el motivo de la corrección')
    .max(300, 'El motivo no puede pasar de 300 caracteres'),
});

const CorrectCuttingSheetForm = ({
  sheet,
}: {
  sheet: CuttingSheetResponse;
}): React.JSX.Element => {
  const { mutate: correct, isLoading } = useCorrectCuttingSheet();
  const { paginationParams } = usePagination();
  const { data: cuttingTypes = [] } = useCuttingTypes(paginationParams);
  const currentCuttingType = (cuttingTypes as CuttingType[]).find(
    (cuttingType) => cuttingType.id === sheet.cuttingTypeId
  );
  const queryClient = useQueryClient();
  const router = useRouter();
  const shipment = sheet.exportSent.export;
  const hasPallets =
    !!shipment.boxBrand?.palletsTypeId &&
    shipment.boxBrand.palletsTypeQuantity !== 0;

  const initialValues: CorrectionValues = {
    cuttingTypeId: sheet.cuttingTypeId,
    palletsHeight: sheet.palletsHeight,
    containerPositioning: sheet.containerPositioning,
    reason: '',
  };

  const handleSubmit = (values: CorrectionValues): void => {
    correct(
      {
        id: sheet.id,
        body: {
          cuttingTypeId: Number(values.cuttingTypeId),
          palletsHeight: values.palletsHeight,
          containerPositioning: values.containerPositioning,
          belowDeck: belowDeckFor(values.containerPositioning),
          reason: values.reason.trim(),
        },
      },
      {
        onSuccess: ({ data }) => {
          toaster.create({
            title: `Hoja Nº ${data.id} corregida (versión ${data.version})`,
            description: `Se reenvió a ${data.emailRecipients.length} destinatario(s).`,
            type: 'success',
            duration: 6000,
            closable: true,
          });
          queryClient.invalidateQueries('cuttingSheets');
          router.push('/dashboard/export/cutting-sheets');
        },
        onError: (error) => {
          toaster.create({
            title: 'No se corrigió la hoja',
            description: serverErrorMessage(error),
            type: 'error',
            duration: 6000,
            closable: true,
          });
        },
      }
    );
  };

  return (
    <Flex direction='column' gap={6}>
      <Box>
        <HStack gap={3} mb={1}>
          <Text fontWeight='semibold'>Hoja de Corte Nº {sheet.id}</Text>
          <Badge colorPalette={sheet.version > 1 ? 'orange' : 'gray'}>
            Vigente: {sheetVersionLabel(sheet.version)}
          </Badge>
        </HStack>
        <Text fontSize='sm' color='fg.muted'>
          Exportación {sheet.exportSent.exportId} ·{' '}
          {shipment.merchant?.businessName} · {shipment.business?.name}
        </Text>
        {sheet.correctionReason && (
          <Text fontSize='sm' color='fg.muted'>
            Último motivo: {sheet.correctionReason}
          </Text>
        )}
      </Box>

      <Alert.Root status='info' borderRadius='md'>
        <Alert.Indicator />
        <Alert.Description fontSize='sm'>
          La hoja se vuelve a dibujar con el mismo número como versión{' '}
          {sheet.version + 1}, marcada CORREGIDA, con los datos de hoy de la
          exportación y del booking. Se reenvía a la exportadora, al cliente, al
          productor y a los contactos de la finca, y el enlace de los correos
          anteriores abrirá esta versión.
        </Alert.Description>
      </Alert.Root>

      <Formik
        initialValues={initialValues}
        validationSchema={correctionSchema}
        onSubmit={handleSubmit}
      >
        {({ values }) => (
          <Form>
            <Flex direction='column' gap={4}>
              <SelectCuttingType
                name='cuttingTypeId'
                cuttingTypeSelect={currentCuttingType}
              />
              <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                <InputFieldSelector
                  name='palletsHeight'
                  label='Altura de Pallets'
                  options={palletsHeightOptions(
                    hasPallets,
                    sheet.palletsHeight
                  )}
                />
                <InputFieldSelector
                  name='containerPositioning'
                  label='Posición del Contenedor'
                  options={CONTAINER_POSITIONS}
                />
                <Field.Root>
                  <Field.Label fontSize='sm' mb='8px'>
                    Bajo Cubierta
                  </Field.Label>
                  <Input
                    readOnly
                    value={belowDeckFor(values.containerPositioning)}
                  />
                </Field.Root>
              </SimpleGrid>
              <InputFieldTextArea
                name='reason'
                label='Motivo de la corrección'
                placeholder='Qué cambió y por qué. Lo leen el productor y la finca.'
              />
              <FormActions>
                <Button variant='ghost' asChild>
                  <Link_Next href='/dashboard/export/cutting-sheets'>
                    Cancelar
                  </Link_Next>
                </Button>

                <Button type='submit' colorPalette='green' loading={isLoading}>
                  Corregir y reenviar
                </Button>
              </FormActions>
            </Flex>
          </Form>
        )}
      </Formik>
    </Flex>
  );
};

export default CorrectCuttingSheetForm;
