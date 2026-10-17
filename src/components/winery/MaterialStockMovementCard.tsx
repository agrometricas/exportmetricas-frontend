import {
  Box,
  Text,
  Heading,
  Divider,
  Badge,
  VStack,
  SimpleGrid,
  Select,
  Input,
  Flex,
  CloseButton,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { format, getISOWeek, getMonth, parseISO } from 'date-fns';
import { useMemo, useState } from 'react';
import {
  MATERIAL_TYPE_LABELS,
  MATERIAL_TYPE_ORDER,
} from '@/utils/materialTypeLabels';
import { ExporterBusinessMaterialStock } from '../../types/winery/exporterBusinessMaterialStock';
import { STOCK_MOVEMENT_LABELS } from '../../utils/stockMovementLabels';
import WeekSelect from '../ui/form/WeekSelect';

const months = [
  { value: 0, label: 'Enero' },
  { value: 1, label: 'Febrero' },
  { value: 2, label: 'Marzo' },
  { value: 3, label: 'Abril' },
  { value: 4, label: 'Mayo' },
  { value: 5, label: 'Junio' },
  { value: 6, label: 'Julio' },
  { value: 7, label: 'Agosto' },
  { value: 8, label: 'Septiembre' },
  { value: 9, label: 'Octubre' },
  { value: 10, label: 'Noviembre' },
  { value: 11, label: 'Diciembre' },
];

interface Props {
  materials: ExporterBusinessMaterialStock[];
}

const MaterialStockMovementGrid = ({ materials }: Props): JSX.Element => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

  const materialTypes = useMemo(() => {
    const unique = new Set(
      materials.map((m) => m.exporterMaterialStock.materialType)
    );
    return Array.from(unique).sort();
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      const typeMatch =
        filterType === 'ALL' ||
        m.exporterMaterialStock.materialType === filterType;
      const searchMatch = m.materialDetail.name
        .toLowerCase()
        .includes(search.toLowerCase());
      return typeMatch && searchMatch;
    });
  }, [materials, filterType, search]);

  const filterByDate = (dateStr: string): boolean => {
    const date = parseISO(dateStr);
    const week = getISOWeek(date);
    const month = getMonth(date);
    if (selectedWeek) {
      return week === selectedWeek && month === selectedMonth;
    }
    return month === selectedMonth;
  };

  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing='4' mb={4}>
        <Flex flex='1' align='center'>
          <Select
            placeholder='Filtrar por Tipo'
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
          </Select>
          {filterType !== 'ALL' ? (
            <CloseButton
              onClick={() => setFilterType('ALL')}
              ml={2}
              size='sm'
            />
          ) : null}
        </Flex>

        <Flex flex='1' align='center'>
          <Input
            placeholder='Buscar por nombre'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search ? (
            <CloseButton onClick={() => setSearch('')} ml={2} size='sm' />
          ) : null}
        </Flex>

        <Select
          placeholder='Filtrar por mes'
          value={selectedMonth}
          onChange={(e) => {
            setSelectedMonth(Number(e.target.value));
            setSelectedWeek(null);
          }}
          width='100%'
        >
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </Select>
        <WeekSelect
          month={selectedMonth}
          value={selectedWeek}
          onChange={setSelectedWeek}
          placeholder='Filtrar por semana'
        />
      </SimpleGrid>

      <VStack spacing={4} align='stretch'>
        {filteredMaterials.map((material) => {
          const filteredTransfers = material.stockMovementsFromExporter.filter(
            (m) => filterByDate(m.createdAt)
          );
          const filteredConsumptions =
            material.stockMovementsConsumption.filter((m) =>
              filterByDate(m.createdAt)
            );

          return (
            <Box key={material.id} p={4} borderWidth='1px' borderRadius='md'>
              <Grid
                templateColumns={{ base: '1fr', md: '1fr 1fr 1fr 1fr' }}
                gap={4}
                alignItems='center'
                mb={3}
              >
                <Box>
                  <Heading size='sm'>{material.materialDetail.name}</Heading>
                </Box>
                <Text color='black'>
                  <strong>Código:</strong> {material.materialDetail.code}
                </Text>
                <Text color='black'>
                  <strong>Stock asignado:</strong> {material.assignedStock}
                </Text>
                <Text color='black'>
                  <strong>Stock actual:</strong> {material.currentStock}
                </Text>
              </Grid>

              <Divider my={2} />

              <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                <GridItem>
                  <Heading size='sm' mb={2}>
                    Transferencias
                  </Heading>
                  {filteredTransfers.length === 0 ? (
                    <Text color='gray.500'>
                      No hay transferencias esta semana.
                    </Text>
                  ) : (
                    <VStack align='start' spacing={1}>
                      {filteredTransfers.map((movement) => (
                        <Box key={movement.id}>
                          <Badge colorScheme='green'>
                            {STOCK_MOVEMENT_LABELS[movement.type] ??
                              movement.type}
                          </Badge>{' '}
                          {movement.quantity} unidades{' '}
                          {movement.type === 'RETURN' &&
                            movement.exportSentId && (
                              <>- (Envío #{movement.exportSentId}) </>
                            )}
                          - (
                          {format(new Date(movement.createdAt), 'dd/MM/yyyy')})
                        </Box>
                      ))}
                    </VStack>
                  )}
                </GridItem>

                <GridItem>
                  <Heading size='sm' mb={2}>
                    Consumos
                  </Heading>
                  {filteredConsumptions.length === 0 ? (
                    <Text color='gray.500'>No hay consumos esta semana.</Text>
                  ) : (
                    <VStack align='start' spacing={1}>
                      {filteredConsumptions.map((movement) => (
                        <Box key={movement.id}>
                          <Badge colorScheme='red'>
                            {!movement.exportSentId
                              ? 'DESCONTADO'
                              : (STOCK_MOVEMENT_LABELS[movement.type] ??
                                movement.type)}
                          </Badge>{' '}
                          {movement.quantity} unidades{' '}
                          {!movement.exportSentId ? null : (
                            <>- (Envío #{movement.exportSentId})</>
                          )}{' '}
                          - {format(new Date(movement.createdAt), 'dd/MM/yyyy')}
                        </Box>
                      ))}
                    </VStack>
                  )}
                </GridItem>
              </Grid>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
};

export default MaterialStockMovementGrid;
