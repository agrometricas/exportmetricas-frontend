'use client';

import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  SimpleGrid,
  Text,
  } from '@chakra-ui/react';
import { Formik, Form, FieldArray } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';
import { toaster } from '@/components/ui/toaster';
import {
  COST_CONFIRMATION_QUERIES,
  confirmExportSentCostReview,
} from '../../hooks/export/export-sent/confirmExportSentCostReview';
import { useExportSentMaterials } from '../../hooks/export/export-sent/getExportSentMaterials';
import { patchExportSentMaterialCost } from '../../hooks/export/export-sent/patchExportSentMaterialCost';
import { returnTo } from '../../utils/exportSteps';
import { serverErrorMessage } from '../../utils/serverErrorMessage';
import CheckboxForm from '../ui/form/CheckboxForm';
import InputFieldNumber from '../ui/form/InputFieldNumber';

interface ExportSentCostFormProps {
  pathname: string;
}

const validationSchema = Yup.object().shape({
  dataReviewed: Yup.boolean()
    .oneOf([true], 'Debes revisar los datos antes de enviar')
    .required('Requerido'),
  materials: Yup.array()
    .of(
      Yup.object().shape({
        unitCost: Yup.number()
          .typeError('Debe ser un número')
          .required('Requerido')
          .moreThan(0, 'Debe ser mayor a 0'),
      })
    )
    .min(1),
});

export default function ExportSentCostForm({ }: ExportSentCostFormProps): JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useParams<{ id: string }>();
  const exportSentId = params.id;

  const { data: materials = [], isLoading } = useExportSentMaterials({
    exportSentId,
  });

  const initialValues = useMemo(() => {
    return {
      dataReviewed: false,
      materials: materials.map((item) => ({
        id: item.id,
        unitCost: item.unitCost,
        originalCost: item.unitCost,
        name: item.businessMaterialStock.exporterMaterialStock.materialDetail
          .name,
        quantity: item.quantity,
      })),
    };
  }, [materials]);

  const handleSubmit = async (values: typeof initialValues): Promise<void> => {
    try {
      const updates = values.materials.filter(
        (item) => item.unitCost !== item.originalCost
      );

      for (const item of updates) {
        await patchExportSentMaterialCost(item.id, {
          unitCost: item.unitCost,
        });
      }

      await confirmExportSentCostReview(Number(exportSentId));

      toaster.create({
        title: 'Costos actualizados correctamente.',
        type: 'success',
        duration: 3000,
        closable: true,
      });
      COST_CONFIRMATION_QUERIES.forEach((key) =>
        queryClient.invalidateQueries(key)
      );
      router.push(returnTo('/dashboard/liquidation/export-costs', window.location.search));
    } catch (error) {
      toaster.create({
        title: 'Error al actualizar los costos.',
        description: serverErrorMessage(error),
        type: 'error',
        duration: 4000,
        closable: true,
      });
    }
  };

  return (
    <Box>
      <Heading size='lg' mb={4}>
        Materiales enviados
      </Heading>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting }) => (
          <Form>
            <FieldArray
              name='materials'
              render={() => (
                <Flex direction='column' gap={2} w='full'>
                  {values.materials.map((material, index) => (
                    <Box key={material.id} p={1} w='full'>
                      <Grid
                        templateColumns='1fr 1fr 1fr'
                        alignItems='center'
                        gap={4}
                      >
                        <Text fontWeight='bold'>{material.name}</Text>
                        <Text>Cantidad: {material.quantity}</Text>
                        <InputFieldNumber
                          name={`materials[${index}].unitCost`}
                          label='Costo Unitario'
                          placeholder='0.00'
                          value={material.unitCost}
                          flexDirection='row'
                          isDecimal
                          unit='$'
                        />
                      </Grid>
                    </Box>
                  ))}
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
                      colorPalette='green'
                      loading={isSubmitting || isLoading}
                      disabled={values.materials.length === 0}
                    >
                      Confirmar Validación de Costos
                    </Button>
                  </SimpleGrid>
                </Flex>
              )}
            />
          </Form>
        )}
      </Formik>
    </Box>
  );
}
