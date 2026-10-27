'use client';

import { Center, Text, Box, Heading, Card } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { useParams } from 'next/navigation';
import React from 'react';
import LoadingState from '@/components/ui/states/LoadingState';
import { useExporter } from '@/hooks/useUserProfile';
import { useExporterMaterials } from '@/hooks/winery/getExporterMaterials';
import { useExporterMaterialStock } from '@/hooks/winery/useExporterMaterialStock';
import { ExporterMaterial } from '@/types/winery/exporterMateriales';
import { AddMaterialForm } from '../../../../../components/winery/AddMaterialForm';
import { CreateInitialStockForm } from '../../../../../components/winery/CreateInitialStockForm';

export default function AddMaterialPage(): React.JSX.Element {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const [materialType, materialIdString] = slug?.split('-') ?? [];

  const { user, isLoading: isLoadingUser } = useExporter();
  const exporterId = user?.exporterDetails?.id;

  const { data: materials, isLoading: isLoadingMaterials } =
    useExporterMaterials({
      exporterId: exporterId?.toString() ?? '',
    });

  const selectedMaterial = (materials ?? []).find(
    (m: ExporterMaterial) =>
      m.materialType === materialType && String(m.id) === materialIdString
  );

  const stockQuery = useExporterMaterialStock({
    exporterId: exporterId ?? 0,
    materialType: materialType ?? '',
    materialId: Number(materialIdString),
  });

  const isLoadingStock = stockQuery.isLoading;
  const stockError = stockQuery.error;

  const stockNotFound =
    stockError instanceof AxiosError && stockError.response?.status === 400;

  if (isLoadingUser || isLoadingMaterials || isLoadingStock) {
    return <LoadingState minH='60vh' />;
  }

  if (!exporterId || !selectedMaterial) {
    return (
      <Center py={10}>
        <Text color='red.fg'>No se encontró el material solicitado</Text>
      </Center>
    );
  }

  if (stockNotFound) {
    return (
      <Box my={'20px'} mx='auto' w={'95%'}>
        <Center>
          <Card.Root
            w={{
              base: '95%',
              sm: '95%',
              md: '90%',
              lg: '100%',
              xl: '100%',
            }}
            mb={'20px'}
          >
            <Card.Header w={'100%'}>
              <Heading>Asignar stock inicial</Heading>
            </Card.Header>
            <Card.Body>
              <CreateInitialStockForm
                exporterId={exporterId}
                materialType={selectedMaterial.materialType}
                materialId={Number(selectedMaterial.id)}
                materialName={selectedMaterial.name}
              />
            </Card.Body>
          </Card.Root>
        </Center>
      </Box>
    );
  }

  return (
    <Box my={'20px'} mx='auto' w={'95%'}>
      <Center>
        <Card.Root
          w={{
            base: '95%',
            sm: '95%',
            md: '90%',
            lg: '100%',
            xl: '100%',
          }}
          mb={'20px'}
        >
          <Card.Header w={'100%'}>
            <Heading>Movimientos del material</Heading>
          </Card.Header>
          <Card.Body w={'100%'}>
            <AddMaterialForm
              exporterId={exporterId}
              materialType={selectedMaterial.materialType}
              materialId={Number(selectedMaterial.id)}
              materialName={selectedMaterial.name}
            />
          </Card.Body>
        </Card.Root>
      </Center>
    </Box>
  );
}
