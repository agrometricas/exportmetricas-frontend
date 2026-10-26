'use client';

import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import LoadingState from '@/components/ui/states/LoadingState';
import InputFieldNumber from '../ui/form/InputFieldNumber';
import InputFieldText from '../ui/form/InputFieldText';
import { Logo } from '../ui/Logo';

interface Material {
  id: number;
  exporterMaterialStockId: number;
  materialType: string;
  materialId: number;
  materialName: string | null;
}

interface AdjustmentData {
  businessId: number;
  producerId: number;
  businessName: string;
  materials: Material[];
}

interface AdjustmentFormValues {
  responsibleName: string;
  materials: { exporterMaterialStockId: number; quantity: number }[];
}

export default function PublicAdjustmentPage(): JSX.Element {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<AdjustmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/public/weekly-adjustment?token=${token}`
        );

        if (!res.ok) throw new Error('Token inválido o expirado');
        const json = await res.json();
        setData(json);
      } catch (error) {
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return <LoadingState minH='100vh' />;
  if (!data) return <p>Token inválido o expirado.</p>;

  const initialValues: AdjustmentFormValues = {
    responsibleName: '',
    materials: data.materials.map((m) => ({
      exporterMaterialStockId: m.exporterMaterialStockId,
      quantity: 0,
    })),
  };

  const validationSchema = Yup.object({
    responsibleName: Yup.string().required('Requerido'),
    materials: Yup.array().of(
      Yup.object({
        quantity: Yup.number()
          .typeError('Debe ser un número entero')
          .integer('Debe ser un número entero')
          .min(0, 'Debe ser un número positivo')
          .required('Obligatorio'),
      })
    ),
  });

  const onSubmit = async (values: AdjustmentFormValues): Promise<void> => {
    const formattedMaterials: Record<number, number> = {};
    values.materials.forEach((m) => {
      formattedMaterials[m.exporterMaterialStockId] = m.quantity;
    });

    const payload = {
      responsible: values.responsibleName,
      materials: formattedMaterials,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/public/weekly-adjustment?token=${token}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error('Error al enviar');
      toast({
        title: '¡Ajuste enviado!',
        description: 'Los datos fueron registrados correctamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setTimeout(() => {
        router.replace('/ajuste-materiales/success');
      }, 1000);
    } catch (error: unknown) {
      const errMessage =
        error instanceof Error ? error.message : 'No se pudo enviar el ajuste.';

      toast({
        title: 'Error',
        description: errMessage,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Box height='100vh' display='flex' flexDirection='column'>
      <Box
        flexShrink={0}
        px={6}
        py={4}
        bg='white'
        boxShadow='sm'
        zIndex={1}
        position='sticky'
        top={0}
      >
        <Flex align='center' gap={4}>
          <Icon as={Logo} boxSize={8} />
          <Text fontSize='2xl' fontWeight='bold'>
            Ajuste de Materiales
          </Text>
          <Text fontSize='2xl' fontWeight='bold'>
            -
          </Text>
          <Text fontSize='2xl' fontWeight='bold' color='teal'>
            {data.businessName}
          </Text>
        </Flex>
      </Box>
      <Box flex={1} overflowY='auto' px={6} py={4}>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {() => (
            <Form>
              <InputFieldText
                name='responsibleName'
                label='Responsable'
                placeholder='Nombre del responsable'
              />
              <Text mt={4} fontSize='sm' color='gray.500'>
                Asegurate de ingresar las cantidades correctas de todos los
                materiales asignados a la Finca.
              </Text>
              <Divider my={4} />
              <VStack align='stretch' spacing={4}>
                {data.materials.map((material, index) => (
                  <InputFieldNumber
                    key={material.exporterMaterialStockId}
                    name={`materials[${index}].quantity`}
                    label={material.materialName ?? 'Material'}
                    placeholder='Cantidad'
                  />
                ))}
              </VStack>

              <Flex mt={6}>
                <Button colorScheme='teal' type='submit'>
                  Enviar Ajuste
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
}
