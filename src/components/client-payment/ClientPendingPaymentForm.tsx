import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  useToast,
} from '@chakra-ui/react';
import { Form, Formik, useFormikContext } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';
import { useCreateClientPayment } from '../../hooks/client-payment/createClientPayment';
import { useUploadTransferImage } from '../../hooks/client-payment/uploadTransferImage';
import { useClientPaymentQuote } from '../../hooks/client-payment/useClientPaymentQuote';
import { PROGRESS_QUERIES } from '../../hooks/export/exportProgress';
import { BoxBrandType } from '../../types/box-brand/boxBrand';
import { ClientType } from '../../types/client';
import { ExportSentType } from '../../types/exportSent';
import { returnTo } from '../../utils/exportSteps';
import { serverErrorMessage } from '../../utils/serverErrorMessage';
import SelectBoxBrand from '../box-brands/SelectBoxBrand';
import SelectClient from '../client/SelectClient';
import SelectBankAccount from '../export/export-payments/bank-account/SelectBankAccount';
import UploadLogoFile from '../producer/UploadLogoFile';
import CheckboxForm from '../ui/form/CheckboxForm';
import InputFieldNumber from '../ui/form/InputFieldNumber';
import InputFieldTextArea from '../ui/form/InputFieldTextArea';
import ReadOnlyAmount from '../ui/form/ReadOnlyAmount';

const SUPPORTED_FORMATS = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/webp',
  'image/jpg',
];

interface ValuesProps {
  exportSentId: number | '';
  clientId: number | '';
  boxQuantity: number | '';
  boxBrandId: number | '';
  price: number | '';
  description: string;
  sourceBankAccountId: number | '';
  destinationBankAccountId: number | '';
  dataReviewed: boolean;
  transferFile: File | null;
}

const initialValues: ValuesProps = {
  exportSentId: '',
  clientId: '',
  boxQuantity: '',
  boxBrandId: '',
  price: '',
  description: '',
  sourceBankAccountId: '',
  destinationBankAccountId: '',
  dataReviewed: false,
  transferFile: null,
};

const validationSchema = Yup.object({
  exportSentId: Yup.number()
    .integer('Debe ser un número entero')
    .min(0, 'Debe ser mayor que 0')
    .required('Requerido'),
  clientId: Yup.number()
    .integer('Debe ser un número entero')
    .min(0, 'Debe ser mayor que 0')
    .required('Requerido'),
  boxQuantity: Yup.number()
    .integer('Debe ser un número entero')
    .min(0, 'Debe ser mayor que 0')
    .required('Requerido'),
  boxBrandId: Yup.number()
    .integer('Debe ser un número entero')
    .min(0, 'Debe ser mayor que 0')
    .required('Requerido'),
  price: Yup.number()
    .min(0, 'No puede ser negativo')
    .test(
      'is-decimal',
      'Debe tener como máximo 2 decimales',
      (value) => (value + '').match(/^\d+(\.\d{1,2})?$/) !== null
    )
    .required('Requerido'),
  description: Yup.string().max(500, 'Debe tener 500 caracteres o menos'),
  sourceBankAccountId: Yup.number()
    .integer('Debe ser un número entero')
    .min(0, 'Debe ser mayor que 0')
    .required('Requerido'),
  destinationBankAccountId: Yup.number()
    .integer('Debe ser un número entero')
    .min(0, 'Debe ser mayor que 0')
    .required('Requerido'),
  dataReviewed: Yup.boolean()
    .oneOf([true], 'Debes revisar los datos antes de enviar')
    .required('Requerido'),
  transferFile: Yup.mixed()
    .required('Se requiere una imagen')
    .test('fileFormat', 'Formato no soportado', (value) => {
      return value && SUPPORTED_FORMATS.includes((value as File).type);
    }),
});

const ClientPendingPaymentFields = ({
  paymentSelected,
  isSubmitting,
}: {
  paymentSelected: Partial<ExportSentType>;
  isSubmitting: boolean;
}): React.JSX.Element => {
  const { values } = useFormikContext<ValuesProps>();
  const [clientSelect, setClientSelect] = useState<Partial<ClientType> | null>(
    paymentSelected?.export!.client || null
  );
  const [boxBrand, setBoxBrand] = useState<Partial<BoxBrandType> | null>(
    paymentSelected?.export!.boxBrand || null
  );

  const sale =
    values.boxQuantity === '' ? null : { boxQuantity: values.boxQuantity };
  // Asked without a price, the backend answers with the one it proposes.
  const { quote: proposal } = useClientPaymentQuote(sale);
  const { quote, isSettled } = useClientPaymentQuote(
    sale && {
      ...sale,
      price: values.price === '' ? undefined : values.price,
    }
  );

  return (
    <Flex flexDirection='column' gap={3}>
      <Heading fontSize={'2xl'} p={'12px'}>
        Cliente
      </Heading>
      <Divider mb={'16px'} />

      <SelectClient
        name={'clientId'}
        setClientSelect={setClientSelect}
        clientSelect={clientSelect as Partial<ClientType>}
      />

      <Heading fontSize={'2xl'} p={'12px'}>
        Cobro
      </Heading>
      <Divider mb={'16px'} />

      <SelectBoxBrand
        name={'boxBrandId'}
        name2={'boxQuantity'}
        boxQuantity={Number(values.boxQuantity)}
        boxBrandSelect={boxBrand as Partial<BoxBrandType>}
        setBoxBrandSelect={setBoxBrand}
      >
        <InputFieldNumber
          name={'price'}
          label={'Precio'}
          value={proposal?.price ?? ''}
          isDecimal
          isDolar
        />
        <Box></Box>
        <ReadOnlyAmount label={'Total'} value={quote?.total} />
      </SelectBoxBrand>

      <InputFieldTextArea name={'description'} label={'Detalles del cobro'} />

      <Heading fontSize={'2xl'} p={'12px'}>
        Cuenta Bancaria Origen
      </Heading>
      <Divider mb={'16px'} />

      <SelectBankAccount name={'sourceBankAccountId'} label='Razón Social' />

      <Heading fontSize={'2xl'} p={'12px'}>
        Cuenta Bancaria Destino
      </Heading>
      <Divider mb={'16px'} />

      <SelectBankAccount
        name={'destinationBankAccountId'}
        label='Razón Social'
      />

      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
        <Box></Box>
        <ReadOnlyAmount label={'Monto'} value={quote?.total} />
      </SimpleGrid>

      <Heading fontSize={'2xl'} p={'12px'}>
        Subir Transferencia
      </Heading>
      <Divider mb={'16px'} />

      <UploadLogoFile name={'transferFile'} />

      <SimpleGrid columns={{ base: 1, sm: 1 }}>
        <CheckboxForm
          name='dataReviewed'
          label='He revisado los datos agregados'
        />
        <Button
          mt='12px'
          py='8px'
          px='16px'
          type='submit'
          colorScheme='teal'
          isLoading={isSubmitting}
          isDisabled={!isSettled}
        >
          Enviar
        </Button>
      </SimpleGrid>
    </Flex>
  );
};

const ClientPendingPaymentForm = ({
  paymentSelected,
}: {
  paymentSelected: Partial<ExportSentType>;
  pathname?: string;
}): React.JSX.Element => {
  const [initialValuesPayment, setInitialValuesPayment] =
    useState<ValuesProps>(initialValues);
  const { mutateAsync: createClientPayment, isLoading: createLoading } =
    useCreateClientPayment();
  const { uploadTransferImage, isLoading } = useUploadTransferImage();
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (paymentSelected) {
      setInitialValuesPayment((prevValues) => ({
        ...prevValues,
        exportSentId: Number(paymentSelected.id),
        clientId: Number(paymentSelected.export?.client?.id),
        boxQuantity: Number(paymentSelected.export?.boxQuantity),
        boxBrandId: Number(paymentSelected.export?.boxBrand?.id),
      }));
    }
  }, [paymentSelected]);

  const sentPayment = async (
    values: ValuesProps,
    actions: { resetForm: () => void }
  ): Promise<void> => {
    try {
      const { transferFile, boxQuantity, price, dataReviewed, ...paymentData } =
        values;
      void dataReviewed;
      const { clientPaymentId } = await createClientPayment({
        ...paymentData,
        boxQuantity: Number(boxQuantity),
        price: Number(price),
      });

      if (transferFile) {
        await uploadTransferImage({
          file: transferFile,
          clientPaymentId,
          clientId: Number(values.clientId),
        });
      }

      toast({
        title: 'Cobro y Archivo Subidos con Éxito',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      queryClient.invalidateQueries('clientPayments');
      queryClient.invalidateQueries('exportsSentPending');
      queryClient.invalidateQueries('clientPaymentsPending');
      actions.resetForm();
      PROGRESS_QUERIES.forEach((key) => queryClient.invalidateQueries(key));
      router.push(returnTo('/dashboard/liquidation/client-payments', window.location.search));
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: serverErrorMessage(error),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Formik
      initialValues={initialValuesPayment}
      enableReinitialize={true}
      onSubmit={sentPayment}
      validationSchema={validationSchema}
    >
      <Form>
        <ClientPendingPaymentFields
          paymentSelected={paymentSelected}
          isSubmitting={createLoading || isLoading}
        />
      </Form>
    </Formik>
  );
};

export default ClientPendingPaymentForm;
