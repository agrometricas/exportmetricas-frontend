'use client';

import {
  Box,
  Button,
  Flex,
  IconButton,
  NativeSelect,
  SimpleGrid,
  Text,
  CloseButton,
} from '@chakra-ui/react';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useMemo } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { ExportResponse } from '@/types/export.response';
import ExportCardWithPopover from './ExportCardWithPopover';

interface WeeklyExportsCalendarProps {
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  isCurrentWeek: boolean;
  allData: ExportResponse[];
  selectedProducer: string;
  setSelectedProducer: (val: string) => void;
  selectedBoxBrand: string;
  setSelectedBoxBrand: (val: string) => void;
  selectedClient: string;
  setSelectedClient: (val: string) => void;
  weekStart: Date;
  weekEnd: Date;
  getExportColor: (exportId?: number) => string;
  weekDaysOfWeek: string[];
  boxesMatrix: Record<
    number,
    { exportId: number; boxQuantity: number; exportData: ExportResponse }[]
  >;
}

export default function WeeklyExportsCalendar({
  setCurrentDate,
  isCurrentWeek,
  allData,
  selectedProducer,
  setSelectedProducer,
  selectedBoxBrand,
  setSelectedBoxBrand,
  selectedClient,
  setSelectedClient,
  weekStart,
  weekEnd,
  getExportColor,
  weekDaysOfWeek,
  boxesMatrix,
}: WeeklyExportsCalendarProps): React.JSX.Element {
  const handlePrevWeek = (): void => {
    setCurrentDate((prev) => addDays(prev, -7));
  };
  const handleNextWeek = (): void => {
    setCurrentDate((prev) => addDays(prev, 7));
  };
  const handleToday = (): void => {
    setCurrentDate(new Date());
  };

  const weekRangeLabel = `${format(weekStart, 'd MMM yyyy', { locale: es })} - ${format(
    weekEnd,
    'd MMM yyyy',
    { locale: es }
  )}`;

  const producerOptions = useMemo(() => {
    const setProducers = new Set<string>();
    allData.forEach((exp) => {
      if (exp.merchant?.businessName)
        setProducers.add(exp.merchant.businessName);
    });
    return Array.from(setProducers);
  }, [allData]);
  const brandOptions = useMemo(() => {
    const setBrands = new Set<string>();
    allData.forEach((exp) => {
      if (exp.boxBrand?.name) setBrands.add(exp.boxBrand.name);
    });
    return Array.from(setBrands);
  }, [allData]);
  const clientOptions = useMemo(() => {
    const setClients = new Set<string>();
    allData.forEach((exp) => {
      if (exp.client?.businessName) setClients.add(exp.client.businessName);
    });
    return Array.from(setClients);
  }, [allData]);

  return (
    <Box>
      <Flex justify='space-between' align='center' mb={4}>
        <Text fontSize='xl' fontWeight='bold'>
          {weekRangeLabel}
        </Text>
        <Flex gap={2}>
          <Button
            onClick={handleToday}
            variant='outline'
            disabled={isCurrentWeek}
          >
            Hoy
          </Button>
          <IconButton aria-label='Semana anterior' onClick={handlePrevWeek}>
            <IoIosArrowBack />
          </IconButton>
          <IconButton aria-label='Semana siguiente' onClick={handleNextWeek}>
            <IoIosArrowForward />
          </IconButton>
        </Flex>
      </Flex>

      <Flex gap={2} mb={4} wrap='wrap' width='100%'>
        <Flex flex='1' align='center'>
          <NativeSelect.Root>
            <NativeSelect.Field
              placeholder='Filtrar por Productor'
              width='100%'
              onChange={(e) => setSelectedProducer(e.target.value)}
              value={selectedProducer}
            >
              {producerOptions.map((producer) => (
                <option key={producer} value={producer}>
                  {producer}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          {selectedProducer ? (
            <CloseButton
              onClick={() => setSelectedProducer('')}
              ml={2}
              size='sm'
            />
          ) : (
            <Box ml={2} width='24px' />
          )}
        </Flex>
        <Flex flex='1' align='center'>
          <NativeSelect.Root>
            <NativeSelect.Field
              placeholder='Filtrar por Marca de Caja'
              width='100%'
              onChange={(e) => setSelectedBoxBrand(e.target.value)}
              value={selectedBoxBrand}
            >
              {brandOptions.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          {selectedBoxBrand ? (
            <CloseButton
              onClick={() => setSelectedBoxBrand('')}
              ml={2}
              size='sm'
            />
          ) : (
            <Box ml={2} width='24px' />
          )}
        </Flex>
        <Flex flex='1' align='center'>
          <NativeSelect.Root>
            <NativeSelect.Field
              placeholder='Filtrar por Cliente'
              width='100%'
              onChange={(e) => setSelectedClient(e.target.value)}
              value={selectedClient}
            >
              {clientOptions.map((client) => (
                <option key={client} value={client}>
                  {client}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          {selectedClient ? (
            <CloseButton
              onClick={() => setSelectedClient('')}
              ml={2}
              size='sm'
            />
          ) : (
            <Box ml={2} width='24px' />
          )}
        </Flex>
      </Flex>

      <SimpleGrid columns={7} gap={4} h='100%' gridAutoRows='1fr'>
        {weekDaysOfWeek.map((dayLabel, dayIndex) => {
          const exportsForDay = boxesMatrix[dayIndex] || [];
          const dayTotal = exportsForDay.reduce(
            (acc, box) => acc + box.boxQuantity,
            0
          );

          return (
            <Box
              key={dayIndex}
              p={2}
              borderRadius='md'
              borderColor='border'
              borderWidth='1px'
              boxShadow='sm'
              minH='200px'
              h='100%'
              display='flex'
              flexDirection='column'
              minW={0}
            >
              <Text fontSize='md' fontWeight='semibold' mb={2} lineClamp={1}>
                {dayLabel}
              </Text>

              <Box flex='1' minH={0} overflowY='auto'>
                {exportsForDay.map((box, idx) => (
                  <ExportCardWithPopover
                    key={`${box.exportId}-${idx}`}
                    exportData={box.exportData}
                    color={getExportColor(box.exportId)}
                    dailyQuantity={box.boxQuantity}
                  />
                ))}
              </Box>

              <Text
                mt='auto'
                pt={2}
                textAlign='center'
                fontWeight='bold'
                borderTopWidth='1px'
                borderColor='border'
              >
                {dayTotal} Cajas
              </Text>
            </Box>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}
