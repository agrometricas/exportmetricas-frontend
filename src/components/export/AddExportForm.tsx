'use client';
import { Alert, Button, Flex, SimpleGrid, Box, Text } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React, { useMemo } from 'react';
import {
  FormSectionTitle,
  FormActions,
} from '@/components/ui/form/FormSection';
import DateGrid from './cutting-sheet/DateGrid';
import ExportBookingSelect from './ExportBookingSelect';
import { exportFormValues, exportFromLineValues } from './exportFormValues';
import { useSubmitExport } from './hooks/useSubmitExport';
import LastFarmExportAlert from './LastFarmExportAlert';
import { initialValues as emptyValues } from './schemas/export.schema';
import { useShippingCompanies } from '../../hooks/export/shippingCompany/getShippingCompanies';
import { BoxBrandType } from '../../types/box-brand/boxBrand';
import { ClientResponse } from '../../types/client.response';
import { ExportResponse } from '../../types/export.response';
import { BusinessType } from '../../types/merchant/business';
import { MerchantResponse } from '../../types/merchant/merchant.response';
import { PurchaseOrderLine } from '../../types/purchaseOrder';
import { ShippingCompanyType } from '../../types/shippingCompany';
import { getWeekInfo } from '../../utils/getWeekInfo';
import SelectBoxBrand from '../box-brands/SelectBoxBrand';
import SelectBusiness from '../business/SelectBusiness';
import SelectClient from '../client/SelectClient';
import ExportQuotaCheck from '../contract-usage/ExportQuotaCheck';
import { exportQuotaParams } from '../contract-usage/exportQuotaParams';
import InputFieldDepositSelect from '../deposit/InputFieldDepositSelect';
import SelectProducer from '../producer/SelectProducer';
import InputFieldHarborShippingCompany from '../shipping-company/InputFieldHarborShippingCompany';
import InputFieldShipName from '../shipping-company/InputFieldShipName';
import InputFieldShippingCompanySelect from '../shipping-company/InputFieldShippingCompanySelect';
import InputFieldTransportSelect from '../transport/InputFiledTransportSelect';
import InputFieldDayDate, {
  INVALID_DAY_DATE,
} from '../ui/form/InputFieldDayDate';
import InputFieldDayDateTime from '../ui/form/InputFieldDayDateTime';
import InputFieldNumber from '../ui/form/InputFieldNumber';
import InputFieldSelector from '../ui/form/InputFieldSelector';
import InputFieldText from '../ui/form/InputFieldText';
import UnsavedChangesGuard from '../ui/form/UnsavedChangesGuard';
import InputFieldVerifierSelect from '../verifier/InputFieldVerifierSelect';

// While the day is being typed the field holds a marker, not a date: the week
// and its grid wait for a complete one.
const cuttingDay = (value: Date | string | ''): Date | null =>
  value && value !== INVALID_DAY_DATE ? new Date(value) : null;

export interface ExportFromLine {
  orderId: number;
  week: string;
  line: PurchaseOrderLine;
  merchant: Partial<MerchantResponse>;
  business?: Partial<BusinessType>;
  boxBrand?: Partial<BoxBrandType>;
}

interface AddExportFormProps {
  source?: ExportResponse;
  editing?: boolean;
  fromLine?: ExportFromLine;
}

const AddExportForm: React.FC<AddExportFormProps> = ({
  source,
  editing,
  fromLine,
}) => {
  const { onSubmit, validationSchema, isLoading } = useSubmitExport({
    exportId: editing ? source?.id : undefined,
    purchaseOrderId: fromLine?.orderId,
  });
  const initialValues = useMemo(() => {
    if (source) return exportFormValues(source, { withContainers: !!editing });
    if (fromLine) {
      return exportFromLineValues(Number(fromLine.merchant.id), fromLine.line);
    }
    return emptyValues;
  }, [source, editing, fromLine]);
  const { data: shippingCompanies = [] } = useShippingCompanies();
  const shippingCompanyById = (
    id: number
  ): Partial<ShippingCompanyType> | null =>
    (shippingCompanies as Partial<ShippingCompanyType>[]).find(
      (company) => company.id === id
    ) ?? null;
  const ContractOpt = [
    { name: 'FOB (FREE ON BOARD)', id: 'FOB' },
    { name: 'FAS (FREE ALONGSIDE SHIP)', id: 'FAS' },
    { name: 'SPOT (ES VENTA AL CORTO PLAZO)', id: 'SPOT' },
  ];

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ values, errors, setFieldValue, dirty, isSubmitting }) => (
        <Form>
          <UnsavedChangesGuard isDirty={dirty && !isSubmitting} />
          <Flex flexDirection='column' gap={3}>
            {fromLine && (
              <Alert.Root status='info' borderRadius='md'>
                <Alert.Indicator />
                <Alert.Description>
                  Nace de la orden de compra de la {fromLine.week}:{' '}
                  {fromLine.line.business.name}, {fromLine.line.boxBrand.name},{' '}
                  {fromLine.line.boxQuantity} cajas de{' '}
                  {fromLine.line.type === 'CONTRACT' ? 'contrato' : 'spot'}. La
                  finca y la alícuota son las de la línea; las cajas se pueden
                  ajustar.
                </Alert.Description>
              </Alert.Root>
            )}
            <FormSectionTitle>Productor</FormSectionTitle>
            <SelectProducer
              name='merchantId'
              producerSelect={
                (source?.merchant as Partial<MerchantResponse> | undefined) ??
                fromLine?.merchant
              }
            />
            <FormSectionTitle>Finca</FormSectionTitle>
            <SelectBusiness
              name='businessId'
              merchant={values.merchantId || undefined}
              businessSelect={
                (source?.business as Partial<BusinessType> | undefined) ??
                fromLine?.business
              }
            />
            {!source && !fromLine && (
              <LastFarmExportAlert businessId={values.businessId} />
            )}
            <FormSectionTitle>Marca de caja</FormSectionTitle>
            <SelectBoxBrand
              name='boxBrandId'
              boxBrandSelect={
                (source?.boxBrand as Partial<BoxBrandType> | undefined) ??
                fromLine?.boxBrand
              }
            />
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
              <InputFieldNumber
                name='boxQuantity'
                label='Cantidad de cajas'
                unit='cajas'
              />
              <InputFieldSelector
                name={'contractType'}
                label={'Tipo de contrato'}
                options={ContractOpt}
              />
              <Box />
            </SimpleGrid>
            <FormSectionTitle>Fecha de corte</FormSectionTitle>
            <SimpleGrid columns={{ base: 1, sm: 3 }} gap={5}>
              <InputFieldDayDate
                name={'cuttingDate'}
                label={'Fecha de corte'}
              />
              {cuttingDay(values.cuttingDate) && (
                <Box w={{ base: '98%' }}>
                  <InputFieldText
                    name={'weekCutting.description'}
                    isReadOnly
                    defaultValue={
                      getWeekInfo({
                        date: cuttingDay(values.cuttingDate) as Date,
                      }).week
                    }
                  />
                </Box>
              )}
              <InputFieldDayDateTime
                name='shippingDateTime'
                label='Fecha máxima de ingreso'
              />
            </SimpleGrid>
            {cuttingDay(values.cuttingDate) && values.weekCutting && (
              <DateGrid
                nameWeek={'weekCutting.daysOfWeek'}
                nameBoxes={'weekCutting.boxesOfDay'}
                boxQuantity={Number(values.boxQuantity)}
                dateSelected={cuttingDay(values.cuttingDate) as Date}
                startDate={
                  getWeekInfo({ date: cuttingDay(values.cuttingDate) as Date })
                    .startDate
                }
              />
            )}
            {cuttingDay(values.cuttingDate) &&
              errors.weekCutting &&
              typeof errors.weekCutting === 'string' && (
                <Text color={'#E53E3E'} fontSize={'14px'}>
                  {errors.weekCutting ? (errors.weekCutting as string) : ''}
                </Text>
              )}
            <ExportQuotaCheck
              params={exportQuotaParams(
                values,
                editing ? source?.id : undefined
              )}
            />
            <FormSectionTitle>Cliente</FormSectionTitle>
            <SelectClient
              name={'clientId'}
              clientSelect={
                source?.client as Partial<ClientResponse> | undefined
              }
            />
            <FormSectionTitle>Naviera</FormSectionTitle>
            <ExportBookingSelect
              editingExportId={editing ? source?.id : undefined}
            />
            {!values.bookingId && (
              <>
                <InputFieldShippingCompanySelect
                  name='shippingCompanyId'
                  label='Naviera'
                  placeholder='Selecciona una naviera'
                  onSelect={() => {
                    setFieldValue('departureHarborId', '');
                    setFieldValue('destinationHarborId', '');
                  }}
                />
                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
                  <InputFieldHarborShippingCompany
                    key={`departure-${values.shippingCompanyId || 'none'}`}
                    name='departureHarborId'
                    label='Puerto de salida'
                    type='departure'
                    placeholder='Selecciona un puerto de salida'
                    shippingCompany={shippingCompanyById(
                      values.shippingCompanyId
                    )}
                  />
                  <InputFieldHarborShippingCompany
                    key={`destination-${values.shippingCompanyId || 'none'}`}
                    name='destinationHarborId'
                    label='Puerto de destino'
                    type='destination'
                    placeholder='Selecciona un puerto de destino'
                    shippingCompany={shippingCompanyById(
                      values.shippingCompanyId
                    )}
                  />
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, sm: 3 }} gap={5}>
                  <InputFieldShipName
                    name='shipName'
                    label='Nombre de la nave'
                    shippingCompanyId={values.shippingCompanyId}
                  />
                  <InputFieldText
                    name='estimatedTravelTime'
                    label='Tiempo estimado de viaje'
                  />
                  <InputFieldText
                    name='bookingNumber'
                    label='Número de booking'
                  />
                </SimpleGrid>
              </>
            )}

            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
              <InputFieldDepositSelect
                name='depositId'
                label='Depósito'
                placeholder='Selecciona un deposito'
              />
              <InputFieldTransportSelect
                name='transportId'
                label='Transporte'
                placeholder='Selecciona un transporte'
              />
              <InputFieldVerifierSelect
                name='verifierId'
                label='Verificadora'
                placeholder='Selecciona una verificadora'
              />
              <InputFieldNumber
                name='numberOfVerifiers'
                label='Número de verificadores'
              />
            </SimpleGrid>
            <FormActions>
              <Button type='submit' colorPalette='green' loading={isLoading}>
                {editing ? 'Guardar cambios' : 'Crear exportación'}
              </Button>
            </FormActions>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};

export default AddExportForm;
