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
import React from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import {
  Party,
  WeekDay,
  WeekSummary,
  WeekSummaryExport,
} from '@/types/weekSummary';
import ExportCardWithPopover from './ExportCardWithPopover';

interface WeeklyExportsCalendarProps {
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  isCurrentWeek: boolean;
  weekStart: Date;
  weekEnd: Date;
  filters: WeekSummary['filters'];
  producer: Party | null;
  setProducer: (value: Party | null) => void;
  boxBrand: Party | null;
  setBoxBrand: (value: Party | null) => void;
  client: Party | null;
  setClient: (value: Party | null) => void;
  days: WeekDay[];
  exportsById: Map<number, WeekSummaryExport>;
  getExportColor: (exportId?: number) => string;
}

// The options are the week's; a choice kept from another week stays listed so
// it can be seen and cleared.
function FilterSelect({
  placeholder,
  options,
  selected,
  onChange,
}: {
  placeholder: string;
  options: Party[];
  selected: Party | null;
  onChange: (value: Party | null) => void;
}): React.JSX.Element {
  const listed =
    selected && !options.some((option) => option.id === selected.id)
      ? [selected, ...options]
      : options;
  return (
    <Flex flex='1' align='center'>
      <NativeSelect.Root size='sm'>
        <NativeSelect.Field
          placeholder={placeholder}
          width='100%'
          onChange={(e) =>
            onChange(
              listed.find((option) => String(option.id) === e.target.value) ??
                null
            )
          }
          value={selected ? String(selected.id) : ''}
        >
          {listed.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
      {selected ? (
        <CloseButton onClick={() => onChange(null)} ml={2} size='sm' />
      ) : (
        <Box ml={2} width='24px' />
      )}
    </Flex>
  );
}

export default function WeeklyExportsCalendar({
  setCurrentDate,
  isCurrentWeek,
  weekStart,
  weekEnd,
  filters,
  producer,
  setProducer,
  boxBrand,
  setBoxBrand,
  client,
  setClient,
  days,
  exportsById,
  getExportColor,
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

  const weekRangeLabel = `${format(weekStart, 'd MMM yyyy', { locale: es })} – ${format(
    weekEnd,
    'd MMM yyyy',
    { locale: es }
  )}`;

  return (
    <Box>
      <Flex justify='space-between' align='center' gap={3} wrap='wrap' mb={4}>
        <Text as='h3' textStyle='h3' color='fg.heading'>
          {weekRangeLabel}
        </Text>
        <Flex gap={2}>
          <Button
            size='sm'
            onClick={handleToday}
            variant='outline'
            disabled={isCurrentWeek}
          >
            Hoy
          </Button>
          <IconButton
            size='sm'
            variant='outline'
            aria-label='Semana anterior'
            onClick={handlePrevWeek}
          >
            <IoIosArrowBack />
          </IconButton>
          <IconButton
            size='sm'
            variant='outline'
            aria-label='Semana siguiente'
            onClick={handleNextWeek}
          >
            <IoIosArrowForward />
          </IconButton>
        </Flex>
      </Flex>

      <Flex gap={2} mb={4} wrap='wrap' width='100%'>
        <FilterSelect
          placeholder='Productor'
          options={filters.merchants}
          selected={producer}
          onChange={setProducer}
        />
        <FilterSelect
          placeholder='Marca'
          options={filters.boxBrands}
          selected={boxBrand}
          onChange={setBoxBrand}
        />
        <FilterSelect
          placeholder='Cliente'
          options={filters.clients}
          selected={client}
          onChange={setClient}
        />
      </Flex>

      <SimpleGrid columns={7} gap={2} h='100%' gridAutoRows='1fr'>
        {days.map((day) => {
          return (
            <Box
              key={day.date}
              p={2}
              borderRadius='l2'
              borderWidth='1px'
              bg='bg.subtle'
              minH='200px'
              h='100%'
              display='flex'
              flexDirection='column'
              minW={0}
            >
              <Text
                fontSize='xs'
                fontWeight='semibold'
                color='fg.muted'
                textTransform='capitalize'
                mb={2}
                truncate
              >
                {format(new Date(day.date), 'EEE d', { locale: es })}
              </Text>

              <Box flex='1' minH={0} overflowY='auto'>
                {day.exports.map((entry) => {
                  const exportData = exportsById.get(entry.exportId);
                  return exportData ? (
                    <ExportCardWithPopover
                      key={entry.exportId}
                      exportData={exportData}
                      color={getExportColor(entry.exportId)}
                      dailyQuantity={entry.boxes}
                    />
                  ) : null;
                })}
              </Box>

              <Box mt='auto' pt={2} textAlign='center' borderTopWidth='1px'>
                <Text
                  fontSize='sm'
                  fontWeight='semibold'
                  fontVariantNumeric='tabular-nums'
                >
                  {day.boxes}
                </Text>
                <Text fontSize='xs' color='fg.muted'>
                  cajas
                </Text>
              </Box>
            </Box>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}
