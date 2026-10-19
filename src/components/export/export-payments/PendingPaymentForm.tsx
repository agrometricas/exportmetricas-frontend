import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Form, Formik, useFormikContext } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';
import SelectBankAccount from './bank-account/SelectBankAccount';
import { useCreateProducerPayment } from '../../../hooks/export/producerPayment/createProducerPayment';
import { useUploadTransferImage } from '../../../hooks/export/producerPayment/uploadTransferImage';
import {
  PriceProposal,
  useProducerPaymentQuote,
} from '../../../hooks/export/producerPayment/useProducerPaymentQuote';
import { BoxBrandType } from '../../../types/box-brand/boxBrand';
import { ExportSentType } from '../../../types/exportSent';
import { HarborType } from '../../../types/harbor';
import { MerchantResponse } from '../../../types/merchant/merchant.response';
import { getWeekInfo } from '../../../utils/getWeekInfo';
import { serverErrorMessage } from '../../../utils/serverErrorMessage';
import SelectBoxBrand from '../../box-brands/SelectBoxBrand';
import SelectHarbor from '../../harbor/SelectHarbor';
import SelectProducer from '../../producer/SelectProducer';
import UploadLogoFile from '../../producer/UploadLogoFile';
import CheckboxForm from '../../ui/form/CheckboxForm';
import InputFieldNumber from '../../ui/form/InputFieldNumber';
import InputFieldTextArea from '../../ui/form/InputFieldTextArea';
import ReadOnlyAmount from '../../ui/form/ReadOnlyAmount';

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
  // selling
  merchantId: number | '';
  departureHarborId: number | '';
  destinationHarborId: number | '';
  boxQuantity: number | '';
  boxBrandId: number | '';
  price: number | '';
  // expenses
  transport: number | '';
  materials: number | '';
  others: number | '';
  description: string;

  sourceBankAccountId: number | '';
  destinationBankAccountId: number | '';
  dataReviewed: boolean;
  transferFile: File | null;
}

const initialValues: ValuesProps = {
  exportSentId: '',
  // selling
  merchantId: '',
  departureHarborId: '',
  destinationHarborId: '',
  boxQuantity: '',
  boxBrandId: '',
  price: '',
  // expenses
  transport: '',
  materials: '',
  others: '',
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
  merchantId: Yup.number()
    .integer('Debe ser un número entero')
    .min(0, 'Debe ser mayor que 0')
    .required('Requerido'),
  departureHarborId: Yup.number()
    .integer('Debe ser un número entero')
    .min(0, 'Debe ser mayor que 0')
    .required('Requerido'),
  destinationHarborId: Yup.number()
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
    .moreThan(0, 'Debe ser mayor que 0')
    .test(
      'is-decimal',
      'Debe tener como máximo 2 decimales',
      (value) => (value + '').match(/^\d+(\.\d{1,2})?$/) !== null
    )
    .required('Requerido'),

  transport: Yup.number()
    .moreThan(0, 'Debe ser mayor que 0')
    .test(
      'is-decimal',
      'Debe tener como máximo 2 decimales',
      (value) => (value + '').match(/^\d+(\.\d{1,2})?$/) !== null
    )
    .required('Requerido'),
  materials: Yup.number()
    .moreThan(0, 'Debe ser mayor que 0')
    .test(
      'is-decimal',
      'Debe tener como máximo 2 decimales',
      (value) => (value + '').match(/^\d+(\.\d{1,2})?$/) !== null
    )
    .required('Requerido'),
  others: Yup.number()
    .moreThan(0, 'Debe ser mayor que 0')
    .test(
      'is-decimal',
      'Debe tener como máximo 2 decimales',
      (value) => (value + '').match(/^\d+(\.\d{1,2})?$/) !== null
    )
    .required('Requerido'),
  description: Yup.string().required('Required'),

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

const priceProposalText = (proposal: PriceProposal): string =>
  proposal.source === 'PRICE_SHEET' && proposal.weekStart
    ? `Propuesto: $${proposal.price.toFixed(2)} de la hoja de precios de la ${
        getWeekInfo({ date: new Date(proposal.weekStart) }).week.split(' //')[0]
      }`
    : `Propuesto: $${proposal.price.toFixed(2)}, el precio mínimo de la exportadora`;

const typed = (value: number | ''): number | undefined =>
  value === '' ? undefined : value;

const PendingPaymentFields = ({
  paymentSelected,
  isSubmitting,
}: {
  paymentSelected: Partial<ExportSentType>;
  isSubmitting: boolean;
}): React.JSX.Element => {
  const { values } = useFormikContext<ValuesProps>();
  const [producerSelect, setProducerSelect] =
    useState<Partial<MerchantResponse> | null>(
      paymentSelected?.export!.merchant || null
    );
  const [departureHarbor, setDepartureHarbor] =
    useState<Partial<HarborType> | null>(
      paymentSelected?.export!.harborDeparture || null
    );
  const [destinationHarbor, setDestinationHarbor] =
    useState<Partial<HarborType> | null>(
      paymentSelected?.export!.harborDestination || null
    );
  const [boxBrand, setBoxBrand] = useState<Partial<BoxBrandType> | null>(
    paymentSelected?.export!.boxBrand || null
  );

  const sale =
    values.merchantId === '' || values.boxQuantity === ''
      ? null
      : {
          merchantId: values.merchantId,
          boxQuantity: values.boxQuantity,
          exportSentId: typed(values.exportSentId),
        };
  // Asked without a price or a transport, the backend answers with the ones
  // it proposes: the producer's price and the carrier's rate for the farm.
  const { quote: proposal } = useProducerPaymentQuote(sale);
  const { quote, isSettled } = useProducerPaymentQuote(
    sale && {
      ...sale,
      price: typed(values.price),
      transport: typed(values.transport),
      materials: typed(values.materials),
      others: typed(values.others),
    }
  );

  return (
    <Flex flexDirection='column' gap={3}>
      <Heading fontSize={'2xl'} p={'12px'}>
        Productor
      </Heading>
      <Divider mb={'16px'} />

      <SelectProducer
        name={'merchantId'}
        setProducerSelect={setProducerSelect}
        producerSelect={producerSelect as Partial<MerchantResponse>}
      />

      <Heading fontSize={'2xl'} p={'12px'}>
        Puerto de Salida
      </Heading>
      <Divider mb={'16px'} />

      <SelectHarbor
        name={'departureHarborId'}
        harborSelect={departureHarbor as Partial<HarborType>}
        setHarborSelect={setDepartureHarbor}
        type={'Nacional'}
      />

      <Heading fontSize={'2xl'} p={'12px'}>
        Puerto de Destino
      </Heading>
      <Divider mb={'16px'} />

      <SelectHarbor
        name={'destinationHarborId'}
        harborSelect={destinationHarbor as Partial<HarborType>}
        setHarborSelect={setDestinationHarbor}
        type={'Internacional'}
      />

      <Heading fontSize={'2xl'} p={'12px'}>
        Compra
      </Heading>
      <Divider mb={'16px'} />

      <SelectBoxBrand
        name={'boxBrandId'}
        name2={'boxQuantity'}
        boxQuantity={Number(values.boxQuantity)}
        boxBrandSelect={boxBrand as Partial<BoxBrandType>}
        setBoxBrandSelect={setBoxBrand}
      >
        <Box>
          <InputFieldNumber
            name={'price'}
            label={'Precio'}
            value={proposal?.price ?? ''}
            isDecimal
            isDolar
          />
          {proposal?.priceProposal && (
            <Text fontSize='sm' color='gray.600' mt={1}>
              {priceProposalText(proposal.priceProposal)}
            </Text>
          )}
        </Box>
        <Box></Box>
        <ReadOnlyAmount label={'Subtotal1'} value={quote?.subtotal1} />
      </SelectBoxBrand>

      <Heading fontSize={'2xl'} p={'12px'}>
        Gastos
      </Heading>
      <Divider mb={'16px'} />

      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
        <Box>
          <InputFieldNumber
            name={'transport'}
            label={'Transporte'}
            value={proposal?.transportProposal ? proposal.transport : ''}
            isDecimal
            isDolar
          />
          {proposal?.transportProposal && (
            <Text fontSize='sm' color='gray.600' mt={1}>
              Tarifa de {proposal.transportProposal.transport} para{' '}
              {proposal.transportProposal.province}:{' '}
              {proposal.transportProposal.containers} contenedor(es) × $
              {proposal.transportProposal.costPerContainer}
            </Text>
          )}
        </Box>
        <InputFieldNumber
          name={'materials'}
          label={'Materiales'}
          isDecimal
          isDolar
        />
        <InputFieldNumber name={'others'} label={'Varios'} isDecimal isDolar />
        <ReadOnlyAmount label={'Subtotal2'} value={quote?.subtotal2} />
        <Box></Box>
        <ReadOnlyAmount label={'Total'} value={quote?.total} />
      </SimpleGrid>

      <InputFieldTextArea
        name={'description'}
        label={'Descripción de los gastos'}
      />

      <Heading fontSize={'2xl'} p={'12px'}>
        Cuenta Bancaria Origen
      </Heading>
      <Divider mb={'16px'} />

      <SelectBankAccount name={'sourceBankAccountId'} />

      <Heading fontSize={'2xl'} p={'12px'}>
        Cuenta Bancaria Destino
      </Heading>
      <Divider mb={'16px'} />

      <SelectBankAccount name={'destinationBankAccountId'} />

      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
        <Box></Box>
        <ReadOnlyAmount label={'Monto'} value={quote?.amount} />
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

const PendingPaymentForm = ({
  paymentSelected,
}: {
  paymentSelected: Partial<ExportSentType>;
  pathname?: string;
}): React.JSX.Element => {
  const [initialValuesPayment, setInitialValuesPayment] =
    useState<ValuesProps>(initialValues);
  const { createProducerPayment, isLoading: createLoading } =
    useCreateProducerPayment();
  const { uploadTransferImage, isLoading } = useUploadTransferImage();
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (paymentSelected) {
      setInitialValuesPayment((prevValues) => ({
        ...prevValues,
        exportSentId: Number(paymentSelected.id),
        merchantId: Number(paymentSelected.export?.merchant?.id),
        departureHarborId: Number(paymentSelected.export?.harborDeparture?.id),
        destinationHarborId: Number(
          paymentSelected.export?.harborDestination?.id
        ),
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
      const {
        transferFile,
        boxQuantity,
        materials,
        others,
        price,
        transport,
        dataReviewed,
        ...paymentData
      } = values;
      void dataReviewed;
      const { producerPaymentId } = await createProducerPayment({
        ...paymentData,
        boxQuantity: Number(boxQuantity),
        materials: Number(materials),
        others: Number(others),
        price: Number(price),
        transport: Number(transport),
      });

      if (transferFile) {
        await uploadTransferImage({
          file: transferFile,
          producerPaymentId,
          merchantId: Number(values.merchantId),
        });
      }

      toast({
        title: 'Liquidación y Archivo Subidos con Éxito',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      queryClient.invalidateQueries('producerPayments');
      queryClient.invalidateQueries('exportsSentPending');
      actions.resetForm();
      router.push('/dashboard/liquidation/producer-payments');
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
        <PendingPaymentFields
          paymentSelected={paymentSelected}
          isSubmitting={createLoading || isLoading}
        />
      </Form>
    </Formik>
  );
};

export default PendingPaymentForm;
