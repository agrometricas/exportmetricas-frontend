import {
  Button,
  SimpleGrid,
  Text,
  VStack,
  Dialog,
  Portal,
} from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';
import { toaster } from '@/components/ui/toaster';
import { useUpdateExportCustoms } from '../../hooks/export/updateExportCustoms';
import { ExportResponse } from '../../types/export.response';
import {
  CUSTOMS_CHANNEL_OPTIONS,
  customsBody,
  CustomsValues,
} from '../../utils/customs';
import { isMoney } from '../../utils/money';
import { serverErrorMessage } from '../../utils/serverErrorMessage';
import InputFieldDayDate, {
  INVALID_DAY_DATE,
} from '../ui/form/InputFieldDayDate';
import InputFieldPlain from '../ui/form/InputFieldPlain';
import InputFieldSelector from '../ui/form/InputFieldSelector';

const validDay = Yup.string().test(
  'fecha',
  'Fecha inválida, use DD/MM/AAAA',
  (value) => value !== INVALID_DAY_DATE
);

const validationSchema = Yup.object({
  aucpNumber: Yup.string()
    .max(40, 'Hasta 40 caracteres')
    .test(
      'aucp',
      'Requerido con la fecha de la AUCP o con la DAE',
      (value, ctx) => !!value || (!ctx.parent.aucpDate && !ctx.parent.daeNumber)
    ),
  aucpDate: validDay.test(
    'aucp',
    'Requerida con el número de AUCP',
    (value, ctx) => !!value || !ctx.parent.aucpNumber
  ),
  daeNumber: Yup.string()
    .max(40, 'Hasta 40 caracteres')
    .test(
      'dae',
      'Requerido con la fecha o el canal de la DAE',
      (value, ctx) => !!value || (!ctx.parent.daeDate && !ctx.parent.daeChannel)
    ),
  daeDate: validDay.test(
    'dae',
    'Requerida con el número de DAE',
    (value, ctx) => !!value || !ctx.parent.daeNumber
  ),
  daeChannel: Yup.string().test(
    'dae',
    'Requerido con el número de DAE',
    (value, ctx) => !!value || !ctx.parent.daeNumber
  ),
  daeValue: Yup.string()
    .test(
      'monto',
      'Un monto mayor que 0, con hasta dos decimales',
      (value) => !value?.trim() || isMoney(value)
    )
    .test(
      'dae',
      'Va con el número de DAE',
      (value, ctx) => !value?.trim() || !!ctx.parent.daeNumber
    ),
});

const AFFECTED_QUERIES = [
  'exports',
  'export',
  'bookingDocumentStatus',
  'documentBoard',
  'exportProgress',
  'workQueue',
];

interface ExportCustomsModalProps {
  exportItem: ExportResponse | null;
  onClose: () => void;
}

const ExportCustomsModal: React.FC<ExportCustomsModalProps> = ({
  exportItem,
  onClose,
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: save, isLoading } = useUpdateExportCustoms();

  const onSubmit = (values: CustomsValues): void => {
    if (!exportItem) return;
    save(
      { exportId: exportItem.id, body: customsBody(values) },
      {
        onError: (error) => {
          if (isAxiosError(error) && error.response?.status === 401) {
            router.push('/api/auth/signout');
            return;
          }
          toaster.create({
            title: 'No se pudo guardar la AUCP y la DAE',
            description: serverErrorMessage(error),
            type: 'error',
            duration: 6000,
            closable: true,
          });
        },
        onSuccess: () => {
          toaster.create({
            title: 'AUCP y DAE guardadas',
            type: 'success',
            duration: 4000,
            closable: true,
          });
          AFFECTED_QUERIES.forEach((key) => queryClient.invalidateQueries(key));
          onClose();
        },
      }
    );
  };

  return (
    <Dialog.Root
      open={!!exportItem}
      placement='center'
      size='xl'
      onOpenChange={(e) => {
        if (!e.open) {
          onClose();
        }
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            {exportItem && (
              <Formik<CustomsValues>
                initialValues={{
                  aucpNumber: exportItem.aucpNumber ?? '',
                  aucpDate: exportItem.aucpDate ?? '',
                  daeNumber: exportItem.daeNumber ?? '',
                  daeDate: exportItem.daeDate ?? '',
                  daeChannel: exportItem.daeChannel ?? '',
                  daeValue: exportItem.daeValue ?? '',
                }}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                <Form>
                  <Dialog.Header>
                    AUCP y DAE — {exportItem.business?.name},{' '}
                    {exportItem.boxQuantity} cajas
                  </Dialog.Header>
                  <Dialog.CloseTrigger />
                  <Dialog.Body>
                    <VStack align='stretch' gap={5}>
                      <Text fontSize='sm' color='gray.600'>
                        Al exportar se emite la AUCP y el evaluador la convierte
                        en DAE. Deja un campo vacío para borrarlo.
                      </Text>
                      <Text fontWeight='semibold'>AUCP</Text>
                      <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
                        <InputFieldPlain name='aucpNumber' label='Número' />
                        <InputFieldDayDate name='aucpDate' label='Fecha' />
                      </SimpleGrid>
                      <Text fontWeight='semibold'>DAE</Text>
                      <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
                        <InputFieldPlain name='daeNumber' label='Número' />
                        <InputFieldDayDate name='daeDate' label='Fecha' />
                        <InputFieldSelector
                          name='daeChannel'
                          label='Canal de Aforo'
                          placeholder='Seleccione el canal'
                          options={CUSTOMS_CHANNEL_OPTIONS}
                        />
                        <InputFieldPlain
                          name='daeValue'
                          label='Valor (USD)'
                          inputMode='decimal'
                          placeholder='Se compara con la factura'
                        />
                      </SimpleGrid>
                    </VStack>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Button variant='ghost' mr={3} onClick={onClose}>
                      Cancelar
                    </Button>
                    <Button
                      type='submit'
                      colorPalette='green'
                      loading={isLoading}
                    >
                      Guardar
                    </Button>
                  </Dialog.Footer>
                </Form>
              </Formik>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ExportCustomsModal;
