import { Button, Flex } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';
import { FormSectionTitle } from '@/components/ui/form/FormSection';
import { toaster } from '@/components/ui/toaster';
import { useCreateCertificate } from '@/hooks/utils/createCertificate';
import { ServerErrorResponse } from '@/types/errorResponse';
import { useExporter } from '../../hooks/useUserProfile';
import { serverErrorMessage } from '../../utils/serverErrorMessage';
import UploadLogoFile from '../producer/UploadLogoFile';
import { FormLabel } from '../ui/form/FormLabel';
import InputFieldDayDate from '../ui/form/InputFieldDayDate';
import InputFieldText from '../ui/form/InputFieldText';
import InputFieldTextArea from '../ui/form/InputFieldTextArea';

interface AddCertificateFormProps {
  onClose?: () => void;
}

interface ValuesProps {
  name: string;
  certificateCode: string;
  description: string;
  issueDate: string;
  expirationDate: string;
  logo: File | null;
}

const initialValues: ValuesProps = {
  name: '',
  certificateCode: '',
  description: '',
  issueDate: '',
  expirationDate: '',
  logo: null,
};

const SUPPORTED_FORMATS = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/webp',
  'image/jpg',
];

const validationSchema = Yup.object({
  name: Yup.string().required('Requerido'),
  certificateCode: Yup.string()
    .trim()
    .required('Requerido')
    .min(7, 'Debe tener de 7 a 20 caracteres')
    .max(20, 'Debe tener de 7 a 20 caracteres'),
  description: Yup.string().max(300, 'Hasta 300 caracteres'),
  issueDate: Yup.date()
    .typeError('Fecha inválida, use DD/MM/AAAA')
    .required('Requerido'),
  expirationDate: Yup.date()
    .typeError('Fecha inválida, use DD/MM/AAAA')
    .required('Requerido')
    .min(Yup.ref('issueDate'), 'Debe ser posterior a la fecha de emisión'),
  logo: Yup.mixed()
    .required('Se requiere un archivo de logo')
    .test('fileFormat', 'Formato no soportado', (value) => {
      return value && SUPPORTED_FORMATS.includes((value as File).type);
    }),
});

const AddCertificateForm = ({
  onClose,
}: AddCertificateFormProps): React.JSX.Element => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useExporter();

  const onboardingStatus = user?.userDetails?.onboardingStatus ?? 'done';

  const { mutateAsync: createCertificate, isLoading } = useCreateCertificate({
    onboardingStatus,
  });

  const handleSubmit = async (
    values: ValuesProps,
    actions: { resetForm: () => void }
  ): Promise<void> => {
    try {
      await createCertificate(values);
      queryClient.invalidateQueries(['certificates']);

      toaster.create({
        title: 'Certificado creado con éxito',
        type: 'success',
        duration: 5000,
        closable: true,
      });

      if (onboardingStatus === 'done') {
        queryClient.invalidateQueries(['certificates']);
      }

      actions.resetForm();
      onClose?.();
    } catch (error) {
      const axiosError = error as AxiosError<ServerErrorResponse>;
      const data = axiosError?.response?.data;

      toaster.create({
        title: 'No se pudo guardar',
        description: serverErrorMessage(error),
        type: 'error',
        duration: 5000,
        closable: true,
      });

      if (data?.statusCode === 401) {
        router.push('/api/auth/signout');
      }
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {() => (
        <Form>
          <Flex flexDirection='column' gap={3}>
            <FormSectionTitle>Agregar certificado</FormSectionTitle>
            <InputFieldText name='name' label='Nombre' />
            <InputFieldText
              name='certificateCode'
              label='Código del certificado (7 a 20 caracteres)'
            />
            <InputFieldTextArea
              name='description'
              label='Enfoque del certificado (opcional)'
              placeholder='Por ejemplo: buenas prácticas agrícolas, inocuidad y trazabilidad'
            />
            <InputFieldDayDate name='issueDate' label='Fecha de emisión' />
            <InputFieldDayDate
              name='expirationDate'
              label='Fecha de expiración'
            />
            <FormLabel fontSize='sm' mb={0}>
              Logo
            </FormLabel>
            <UploadLogoFile name='logo' />
            <Button
              mt='32px'
              py='8px'
              px='16px'
              type='submit'
              colorPalette='green'
              loading={isLoading}
            >
              Agregar
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};

export default AddCertificateForm;
