import { Box, Button, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import { Form, Formik, useFormikContext } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';
import { FormSectionTitle, FormActions } from '@/components/ui/form/FormSection';
import { toaster } from '@/components/ui/toaster';
import SelectBankAccount from './bank-account/SelectBankAccount';
import { PROGRESS_QUERIES } from '../../../hooks/export/exportProgress';
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
import { returnTo } from '../../../utils/exportSteps';
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
  // Asked without a price, a transport or materials, the backend answers with
  // the ones it proposes: the producer's price, the carrier's rate for the
  // farm and the validated cost of the supplies sent.
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
      <FormSectionTitle>
        Productor
      </FormSectionTitle>

      <SelectProducer
        name={'merchantId'}
        setProducerSelect={setProducerSelect}
        producerSelect={producerSelect as Partial<MerchantResponse>}
      />

      <FormSectionTitle>
        Puerto de Salida
      </FormSectionTitle>

      <SelectHarbor
        name={'departureHarborId'}
        harborSelect={departureHarbor as Partial<HarborType>}
        setHarborSelect={setDepartureHarbor}
        type={'Nacional'}
      />

      <FormSectionTitle>
        Puerto de Destino
      </FormSectionTitle>

      <SelectHarbor
        name={'destinationHarborId'}
        harborSelect={destinationHarbor as Partial<HarborType>}
        setHarborSelect={setDestinationHarbor}
        type={'Internacional'}
      />

      <FormSectionTitle>
        Compra
      </FormSectionTitle>

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
            <Text fontSize='sm' color='fg.muted' mt={1}>
              {priceProposalText(proposal.priceProposal)}
            </Text>
          )}
        </Box>
        <Box></Box>
        <ReadOnlyAmount label={'Subtotal1'} value={quote?.subtotal1} />
      </SelectBoxBrand>

      <FormSectionTitle>
        Gastos
      </FormSectionTitle>

      <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
        <Box>
          <InputFieldNumber
            name={'transport'}
            label={'Transporte'}
            value={proposal?.transportProposal ? proposal.transport : ''}
            isDecimal
            isDolar
          />
          {proposal?.transportProposal && (
            <Text fontSize='sm' color='fg.muted' mt={1}>
              Tarifa de {proposal.transportProposal.transport} para{' '}
              {proposal.transportProposal.province}:{' '}
              {proposal.transportProposal.containers} contenedor(es) × $
              {proposal.transportProposal.costPerContainer}
            </Text>
          )}
        </Box>
        <Box>
          <InputFieldNumber
            name={'materials'}
            label={'Materiales'}
            value={proposal?.materialsProposal ? proposal.materials : ''}
            isDecimal
            isDolar
          />
          {proposal?.materialsProposal && (
            <Text fontSize='sm' color='fg.muted' mt={1}>
              Costo validado de los {proposal.materialsProposal.lines}{' '}
              materiales del envío
            </Text>
          )}
        </Box>
        <InputFieldNumber name={'others'} label={'Varios'} isDecimal isDolar />
        <ReadOnlyAmount label={'Subtotal2'} value={quote?.subtotal2} />
        <Box></Box>
        <ReadOnlyAmount label={'Total'} value={quote?.total} />
      </SimpleGrid>

      <InputFieldTextArea
        name={'description'}
        label={'Descripción de los gastos'}
      />

      <FormSectionTitle>
        Cuenta Bancaria Origen
      </FormSectionTitle>

      <SelectBankAccount name={'sourceBankAccountId'} />

      <FormSectionTitle>
        Cuenta Bancaria Destino
      </FormSectionTitle>

      <SelectBankAccount name={'destinationBankAccountId'} />

      <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
        <Box></Box>
        <ReadOnlyAmount label={'Monto'} value={quote?.amount} />
      </SimpleGrid>
      <FormSectionTitle>
        Subir Transferencia
      </FormSectionTitle>
      <UploadLogoFile name={'transferFile'} />
      <FormActions start={<CheckboxForm
          name='dataReviewed'
          label='He revisado los datos agregados'
        />}><Button
          type='submit'
          colorPalette='green'
          loading={isSubmitting}
          disabled={!isSettled}
        >
          Registrar pago
        </Button></FormActions>
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

      toaster.create({
        title: 'Liquidación y archivo subidos con éxito',
        type: 'success',
        duration: 5000,
        closable: true,
      });

      queryClient.invalidateQueries('producerPayments');
      queryClient.invalidateQueries('exportsSentPending');
      actions.resetForm();
      PROGRESS_QUERIES.forEach((key) => queryClient.invalidateQueries(key));
      router.push(returnTo('/dashboard/liquidation/producer-payments', window.location.search));
    } catch (error: unknown) {
      toaster.create({
        title: 'Error',
        description: serverErrorMessage(error),
        type: 'error',
        duration: 5000,
        closable: true,
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
