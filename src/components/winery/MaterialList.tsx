'use client';

import {
  Box,
  Button,
  Center,
  CloseButton,
  Flex,
  Input,
  NativeSelect,
  Spinner,
  Table,
  Text,
  SimpleGrid,
  Heading,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { useExporterMaterials } from '@/hooks/winery/getExporterMaterials';
import { ExporterMaterial } from '@/types/winery/exporterMateriales';
import { useExporter } from '../../hooks/useUserProfile';
import {
  MATERIAL_TYPE_LABELS,
  MATERIAL_TYPE_ORDER,
} from '../../utils/materialTypeLabels';

export function MaterialList(): JSX.Element {
  const { user, isLoading: isLoadingExporter } = useExporter();
  const exporterId = user?.exporterDetails?.id?.toString();
  const router = useRouter();

  const { data, isLoading, error } = useExporterMaterials({
    exporterId: exporterId ?? '',
  });

  const materials = useMemo(() => (data ?? []) as ExporterMaterial[], [data]);

  const [filterType, setFilterType] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');

  const materialTypes = useMemo(() => {
    const unique = new Set(materials.map((m) => m.materialType));
    return Array.from(unique).sort();
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => {
      const matchesType =
        filterType === 'ALL' || material.materialType === filterType;
      const matchesSearch = material.name
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [materials, filterType, search]);

  if (isLoadingExporter || isLoading) {
    return (
      <Center py={10}>
        Cargando Materiales <Spinner size='md' ml={4} />
      </Center>
    );
  }

  if (error) {
    return (
      <Center py={10}>
        <Text color='red.fg'>Error al cargar los materiales</Text>
      </Center>
    );
  }

  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap='4' mb={4}>
        <Flex flex='1' align='center'>
          <NativeSelect.Root>
            <NativeSelect.Field
              placeholder='Filtrar por Tipo de Material'
              value={filterType === 'ALL' ? '' : filterType}
              onChange={(e) => setFilterType(e.target.value)}
              width='100%'
            >
              {MATERIAL_TYPE_ORDER.map((type) =>
                materialTypes.includes(type) ? (
                  <option key={type} value={type}>
                    {MATERIAL_TYPE_LABELS[type] ?? type}
                  </option>
                ) : null
              )}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          {filterType !== 'ALL' ? (
            <CloseButton
              onClick={() => setFilterType('ALL')}
              ml={2}
              size='sm'
              aria-label='Limpiar filtro de tipo'
            />
          ) : (
            <Box ml={2} width='20px' />
          )}
        </Flex>

        <Flex flex='1' align='center'>
          <Input
            placeholder='Buscar por nombre'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            width='100%'
          />
          {search ? (
            <CloseButton
              onClick={() => setSearch('')}
              ml={2}
              size='sm'
              aria-label='Limpiar búsqueda'
            />
          ) : (
            <Box ml={2} width='20px' />
          )}
        </Flex>
      </SimpleGrid>

      <Table.ScrollArea w='100%' overflowX='auto'>
        <Table.Root variant='line' size='sm'>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>
                <Heading size='sm' mb={2}>
                  Nombre
                </Heading>
              </Table.ColumnHeader>
              <Table.ColumnHeader pr={24}>
                <Heading size='sm' mb={2}>
                  ID
                </Heading>
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <Heading size='sm' mb={2}>
                  Tipo
                </Heading>
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <Heading size='sm' mb={2}>
                  Código
                </Heading>
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign={'center'}>
                <Heading size='sm' mb={2}>
                  Stock
                </Heading>
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredMaterials.map((material) => (
              <Table.Row key={`${material.materialType}-${material.id}`}>
                <Table.Cell>{material.name}</Table.Cell>
                <Table.Cell>{material.id}</Table.Cell>
                <Table.Cell>
                  {MATERIAL_TYPE_LABELS[material.materialType] ??
                    material.materialType}
                </Table.Cell>
                <Table.Cell>{material.code}</Table.Cell>
                <Table.Cell>
                  <Flex justifyContent='center'>
                    <Button
                      size='sm'
                      colorPalette='green'
                      onClick={() =>
                        router.push(
                          `/dashboard/winery/add-material/${material.materialType}-${material.id}`
                        )
                      }
                    >
                      Agregar stock
                    </Button>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      {filteredMaterials.length === 0 && (
        <Text mt={6} textAlign='center'>
          No se encontraron materiales con los filtros aplicados.
        </Text>
      )}
    </Box>
  );
}
