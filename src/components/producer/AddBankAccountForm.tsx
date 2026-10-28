import { Button, Flex, SimpleGrid } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Form, Formik, FormikHelpers } from 'formik';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import {
  FormSectionTitle,
  FormActions,
} from '@/components/ui/form/FormSection';
import { toaster } from '@/components/ui/toaster';
import SelectProducer from './SelectProducer';
import { useCreateBankAccount } from '../../hooks/bank-account/createBankAccount';
import { ClientType } from '../../types/client';
import { ServerErrorResponse } from '../../types/errorResponse';
import { MerchantResponse } from '../../types/merchant/merchant.response';
import { serverErrorMessage } from '../../utils/serverErrorMessage';
import SelectClient from '../client/SelectClient';
import InputFieldSelector from '../ui/form/InputFieldSelector';
import InputFieldText from '../ui/form/InputFieldText';

interface ValuesProps {
  merchantId: number | '';
  clientId: number | '';
  bank: string;
  owner: string;
  ownerID: string;
  accountNumber: string;
  type: 'Cta Ahorro' | 'Cta Corriente' | '';
  email: string;
  isProducer: boolean;
  isClient: boolean;
}

const initialValues: ValuesProps = {
  merchantId: '',
  clientId: '',
  bank: '',
  owner: '',
  ownerID: '',
  accountNumber: '',
  type: '',
  email: '',
  isProducer: false,
  isClient: false,
};

const validationSchema = Yup.object({
  isProducer: Yup.boolean().required(),
  merchantId: Yup.number()
    .integer('Debe ser un número entero')
    .typeError('Debe ser un número')
    .when('isProducer', (isProducer, schema) =>
      isProducer ? schema.required('Requerido') : schema
    ),
  isClient: Yup.boolean().required(),
  clientId: Yup.number()
    .integer('Debe ser un número entero')
    .typeError('Debe ser un número')
    .when('isClient', (isClient, schema) =>
      isClient ? schema.required('Requerido') : schema
    ),
  bank: Yup.string()
    .max(50, 'Debe tener 50 caracteres o menos')
    .transform((value) => value.trim())
    .required('Requerido')
    .matches(/^[a-zA-Z\s]+$/, 'Debe contener solo letras y espacios'),
  owner: Yup.string()
    .max(50, 'Debe tener 50 caracteres o menos')
    .min(2, 'Debe tener 2 caracteres o más')
    .transform((value) => value.trim())
    .required('Requerido'),
  ownerID: Yup.string()
    .matches(/^[0-9]+$/, 'Debe contener solo dígitos')
    .test(
      'len',
      'Debe tener 10 o 13 caracteres',
      (val) => val?.length === 10 || val?.length === 13
    )
    .required('Requerido'),
  accountNumber: Yup.string()
    .matches(/^[0-9]+$/, 'Debe contener solo dígitos')
    .transform((value) => value.trim())
    .length(10, 'Debe tener 10 caracteres')
    .required('Requerido'),
  type: Yup.string()
    .oneOf(['Cta Ahorro', 'Cta Corriente'], 'Tipo de cuenta inválido')
    .required('Requerido'),
  email: Yup.string()
    .email('Correo electrónico inválido')
    .max(50, 'Debe tener 50 caracteres o menos')
    .optional(),
});

const typesOpt = [
  {
    name: 'Cta Ahorro',
    id: 'Cta Ahorro',
  },
  {
    name: 'Cta Corriente',
    id: 'Cta Corriente',
  },
];

const AddBankAccountForm = (): React.JSX.Element => {
  const pathname = usePathname();
  const [producer, setProducer] = useState<Partial<MerchantResponse> | null>(
    null
  );
  const isProducerPath = pathname === '/dashboard/producer/add-bank-account';
  const [client, setClient] = useState<Partial<ClientType> | null>(null);
  const isClientPath = pathname === '/dashboard/client/add-bank-account';

  const [initialValuesBankAccount, setInitialValuesBankAccount] =
    useState<ValuesProps>(initialValues);

  const { mutate: createBankAccount, isPending: isLoading } =
    useCreateBankAccount();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!!producer && isProducerPath) {
      setInitialValuesBankAccount((prevValues) => ({
        ...prevValues,
        merchantId: Number(producer.id!),
        clientId: 0,
        owner: producer.businessName!,
        ownerID: producer.businessId!,
        email: producer.email!,
        isProducer: isProducerPath,
        isClient: isClientPath,
      }));
    }

    if (!!client && isClientPath) {
      setInitialValuesBankAccount((prevValues) => ({
        ...prevValues,
        merchantId: 0,
        clientId: Number(client.id!),
        owner: client.businessName!,
        ownerID: client.businessId!,
        email: client.email!,
        isProducer: isProducerPath,
        isClient: isClientPath,
      }));
    }

    if (!producer && !client) {
      setInitialValuesBankAccount((prevValues) => ({
        ...prevValues,
        merchantId: 0,
        clientId: 0,
        owner: '',
        ownerID: '',
        isProducer: false,
        isClient: false,
      }));
    }
  }, [producer, isProducerPath, client, isClientPath]);

  const addBankAccount = async (
    values: ValuesProps,
    formikHelpers: FormikHelpers<ValuesProps>
  ): Promise<void> => {
    const { isClient, isProducer, merchantId, clientId, ...accountValues } =
      values;
    createBankAccount(
      {
        ...accountValues,
        merchantId: !!isProducer ? merchantId : undefined,
        clientId: !!isClient ? clientId : undefined,
      },
      {
        onError: (error: AxiosError<ServerErrorResponse>) => {
          const { message, model, prop }: Partial<ServerErrorResponse> =
            error.response?.data ?? {};

          toaster.create({
            title: 'No se pudo guardar',
            description: serverErrorMessage(error),
            type: 'error',
            duration: 5000,
            closable: true,
          });

          if (!!model && !!prop) {
            if (model === 'BankAccount' && prop === 'accountNumber') {
              formikHelpers.setFieldTouched(`${prop}`, true, false);
              formikHelpers.setFieldError(`${prop}`, message);
            }
          }
        },
        onSuccess: () => {
          toaster.create({
            title: 'Cuenta bancaria agregada con éxito',
            type: 'success',
            duration: 5000,
            closable: true,
          });

          queryClient.invalidateQueries({
            queryKey: ['merchants'],
          });
          queryClient.invalidateQueries({
            queryKey: ['bankAccounts'],
          });
          formikHelpers.resetForm();
          setProducer(null);
          setClient(null);
          if (isProducer) {
            router.push('/dashboard/producer/producers');
          } else if (isClient) {
            router.push('/dashboard/client/bank-accounts');
          }
        },
      }
    );
  };

  return (
    <Formik
      initialValues={initialValuesBankAccount}
      enableReinitialize={true}
      onSubmit={addBankAccount}
      validationSchema={validationSchema}
    >
      {() => (
        <Form>
          <Flex flexDirection='column' gap={3}>
            {isProducerPath && (
              <>
                <FormSectionTitle>Productor</FormSectionTitle>
                <SelectProducer
                  name={'merchantId'}
                  setProducerSelect={setProducer}
                />
              </>
            )}

            {isClientPath && (
              <>
                <FormSectionTitle>Cliente</FormSectionTitle>
                <SelectClient name={'clientId'} setClientSelect={setClient} />
              </>
            )}

            <FormSectionTitle>Datos de cuenta bancaria</FormSectionTitle>

            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
              <InputFieldText
                name={'bank'}
                label={'Banco'}
                placeholder='Nombre del banco'
              />
              <InputFieldText
                name={'owner'}
                label={'Propietario'}
                placeholder='Propietario de la cuenta'
              />
              <InputFieldText name={'ownerID'} label={'Identificación'} />
              <InputFieldText name={'accountNumber'} label={'N° de cuenta'} />
              <InputFieldSelector
                name={'type'}
                label={'Tipo de cuenta'}
                options={typesOpt}
              />
              <InputFieldText name={'email'} label={'E-mail'} />
            </SimpleGrid>

            <FormActions>
              <Button type='submit' colorPalette='green' loading={isLoading}>
                Crear cuenta bancaria
              </Button>
            </FormActions>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};

export default AddBankAccountForm;
