'use client';
import {
  Button,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Box,
  Text,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React, { useMemo } from 'react';
import DateGrid from './cutting-sheet/DateGrid';
import { exportFormValues } from './exportFormValues';
import { useSubmitExport } from './hooks/useSubmitExport';
import { initialValues as emptyValues } from './schemas/export.schema';
import { useShippingCompanies } from '../../hooks/export/shippingCompany/getShippingCompanies';
import { usePagination } from '../../hooks/usePagination';
import { BoxBrandType } from '../../types/box-brand/boxBrand';
import { ClientType } from '../../types/client';
import { ExportResponse } from '../../types/export.response';
import { BusinessType } from '../../types/merchant/business';
import { MerchantResponse } from '../../types/merchant/merchant.response';
import { ShippingCompanyType } from '../../types/shippingCompany';
import { getWeekInfo } from '../../utils/getWeekInfo';
import SelectBoxBrand from '../box-brands/SelectBoxBrand';
import SelectBusiness from '../business/SelectBusiness';
import SelectClient from '../client/SelectClient';
import InputFieldDepositSelect from '../deposit/InputFieldDepositSelect';
import SelectProducer from '../producer/SelectProducer';
import InputFieldHarborShippingCompany from '../shipping-company/InputFieldHarborShippingCompany';
import InputFieldShippingCompanySelect from '../shipping-company/InputFieldShippingCompanySelect';
import InputFieldTransportSelect from '../transport/InputFiledTransportSelect';
import CheckboxForm from '../ui/form/CheckboxForm';
import InputFieldDate from '../ui/form/InputFieldDate';
import InputFieldDateTime from '../ui/form/InputFieldDateTime';
import InputFieldNumber from '../ui/form/InputFieldNumber';
import InputFieldSelector from '../ui/form/InputFieldSelector';
import InputFieldText from '../ui/form/InputFieldText';
import InputFieldVerifierSelect from '../verifier/InputFieldVerifierSelect';

interface AddExportFormProps {
  source?: ExportResponse;
  editing?: boolean;
}

const AddExportForm: React.FC<AddExportFormProps> = ({ source, editing }) => {
  const { onSubmit, validationSchema, isLoading } = useSubmitExport({
    exportId: editing ? source?.id : undefined,
  });
  const initialValues = useMemo(
    () => (source ? exportFormValues(source) : emptyValues),
    [source]
  );
  const { paginationParams } = usePagination();
  const { data: shippingCompanies = [] } =
    useShippingCompanies(paginationParams);
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
      {({ values, errors, setFieldValue }) => (
        <Form>
          <Flex flexDirection='column' gap={3}>
            <Heading fontSize='2xl' p='12px'>
              Productor
            </Heading>
            <Divider mb='16px' />
            <SelectProducer
              name='merchantId'
              producerSelect={
                source?.merchant as Partial<MerchantResponse> | undefined
              }
            />
            <Heading fontSize='2xl' p='12px'>
              Finca
            </Heading>
            <Divider mb='16px' />
            <SelectBusiness
              name='businessId'
              merchant={values.merchantId || undefined}
              businessSelect={
                source?.business as Partial<BusinessType> | undefined
              }
            />
            <Heading fontSize='2xl' p='12px'>
              Marca de Caja
            </Heading>
            <Divider mb='16px' />
            <SelectBoxBrand
              name='boxBrandId'
              boxBrandSelect={
                source?.boxBrand as Partial<BoxBrandType> | undefined
              }
            />
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
              <InputFieldNumber
                name='boxQuantity'
                label='Cantidad de Cajas'
                unit='cajas'
                value={source ? initialValues.boxQuantity : ''}
              />
              <InputFieldSelector
                name={'contractType'}
                label={'Tipo de Contrato'}
                options={ContractOpt}
              />
              <Box />
            </SimpleGrid>
            <Heading fontSize={'2xl'} p={'12px'}>
              Fecha de Corte
            </Heading>
            <Divider mb={'16px'} />
            <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={5}>
              <InputFieldDate
                name={'cuttingDate'}
                label={'Fecha de Corte'}
                flexDirection='row'
              />
              {values.cuttingDate && (
                <Box w={{ base: '98%' }}>
                  <InputFieldText
                    name={'weekCutting.description'}
                    isReadOnly
                    defaultValue={
                      getWeekInfo({ date: values.cuttingDate }).week
                    }
                  />
                </Box>
              )}
              <InputFieldDateTime
                name='shippingDateTime'
                label='Fecha Máxima de Ingreso'
                placeholder='Fecha y Hora Máxima de Ingreso'
                flexDirection='row'
              />
            </SimpleGrid>
            {values.cuttingDate && values.weekCutting && (
              <DateGrid
                nameWeek={'weekCutting.daysOfWeek'}
                nameBoxes={'weekCutting.boxesOfDay'}
                boxQuantity={Number(values.boxQuantity)}
                dateSelected={values.cuttingDate}
                startDate={getWeekInfo({ date: values.cuttingDate }).startDate}
              />
            )}
            {values.cuttingDate &&
              errors.weekCutting &&
              typeof errors.weekCutting === 'string' && (
                <Text color={'#E53E3E'} fontSize={'14px'}>
                  {errors.weekCutting ? (errors.weekCutting as string) : ''}
                </Text>
              )}
            <Heading fontSize='2xl' p='12px'>
              Cliente
            </Heading>
            <Divider mb='16px' />
            <SelectClient
              name={'clientId'}
              clientSelect={source?.client as Partial<ClientType> | undefined}
            />
            <Heading fontSize={'2xl'} p={'12px'}>
              Naviera
            </Heading>
            <Divider mb={'16px'} />
            <InputFieldShippingCompanySelect
              name='shippingCompanyId'
              label='Naviera'
              placeholder='Seleccione una Naviera'
              onSelect={() => {
                setFieldValue('departureHarborId', '');
                setFieldValue('destinationHarborId', '');
              }}
            />
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
              <InputFieldHarborShippingCompany
                key={`departure-${values.shippingCompanyId || 'none'}`}
                name='departureHarborId'
                label='Puerto de Salida'
                type='departure'
                placeholder='Selecciona un puerto de Salida'
                shippingCompany={shippingCompanyById(values.shippingCompanyId)}
              />
              <InputFieldHarborShippingCompany
                key={`destination-${values.shippingCompanyId || 'none'}`}
                name='destinationHarborId'
                label='Puerto de Destino'
                type='destination'
                placeholder='Selecciona un puerto de Destino'
                shippingCompany={shippingCompanyById(values.shippingCompanyId)}
              />
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={5}>
              <InputFieldText
                name='shipName'
                label='Nombre de la Nave'
                defaultValue={source ? initialValues.shipName : undefined}
              />
              <InputFieldText
                name='estimatedTravelTime'
                label='Tiempo estimado de viaje'
                defaultValue={
                  source ? initialValues.estimatedTravelTime : undefined
                }
              />
              <InputFieldText
                name='bookingNumber'
                label='Número de Booking'
                defaultValue={source ? initialValues.bookingNumber : undefined}
              />
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
              <InputFieldDepositSelect
                name='depositId'
                label='Depósito'
                placeholder='Selecciona un Deposito'
              />
              <InputFieldTransportSelect
                name='transportId'
                label='Transporte'
                placeholder='Selecciona un Transporte'
              />
              <InputFieldVerifierSelect
                name='verifierId'
                label='Verificadora'
                placeholder='Selecciona una Verificadora'
              />
              <InputFieldNumber
                name='numberOfVerifiers'
                label='Número de Verificadores'
                value={source ? initialValues.numberOfVerifiers : ''}
              />
            </SimpleGrid>

            <Divider my='16px' />
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
              isLoading={isLoading}
            >
              {editing ? 'Guardar cambios' : 'Enviar'}
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};

export default AddExportForm;
