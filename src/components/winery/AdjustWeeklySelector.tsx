'use client';

import {
  NativeSelect,
  Spinner,
  VStack,
  Center,
  SimpleGrid,
} from '@chakra-ui/react';
import {
  eachWeekOfInterval,
  startOfMonth,
  endOfMonth,
  getISOWeek,
} from 'date-fns';
import React, { useState } from 'react';
import AdjustWeeklyForm from './AdjustWeeklyForm';
import { useBusinessesByExporter } from '../../hooks/business/getAllBusinessesByExporter';
import { useExporter } from '../../hooks/useUserProfile';

const AdjustWeeklySelector = (): React.JSX.Element => {
  const { user, isLoading: isLoadingExporter } = useExporter();
  const exporterId = user?.exporterDetails?.id;
  const [businessId, setBusinessId] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [weeksInMonth, setWeeksInMonth] = useState<number[]>([]);
  const [week, setWeek] = useState<number | null>(null);

  const { data: farms, isLoading: loadingFarms } = useBusinessesByExporter(
    exporterId ?? 0
  );

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const selectedMonth = Number(e.target.value);
    setMonth(selectedMonth);
    setWeek(null);

    const year = new Date().getFullYear();
    const start = startOfMonth(new Date(year, selectedMonth));
    const end = endOfMonth(new Date(year, selectedMonth));
    const weeks = eachWeekOfInterval({ start, end }, { weekStartsOn: 1 }).map(
      (date) => getISOWeek(date)
    );
    setWeeksInMonth(weeks);
  };

  if (isLoadingExporter || !exporterId) {
    return (
      <Center py={10}>
        <Spinner />
      </Center>
    );
  }

  return (
    <VStack align='stretch' gap={4}>
      {loadingFarms ? (
        <Center py={10}>
          <Spinner />
        </Center>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 3 }} gap='4' mb={4}>
          <NativeSelect.Root>
            <NativeSelect.Field
              placeholder='Selecciona una finca'
              onChange={(e) => setBusinessId(Number(e.target.value))}
            >
              {farms?.map((farm) => (
                <option key={farm.id} value={farm.id}>
                  {farm.name}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>

          <NativeSelect.Root>
            <NativeSelect.Field
              placeholder='Selecciona un mes'
              onChange={handleMonthChange}
            >
              {Array.from({ length: 12 }, (_, i) => {
                const monthName = new Date(0, i)
                  .toLocaleString('es', { month: 'long' })
                  .replace(/^\w/, (c) => c.toUpperCase());
                return (
                  <option key={i} value={i}>
                    {monthName}
                  </option>
                );
              })}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>

          <NativeSelect.Root disabled={month === null}>
            <NativeSelect.Field
              placeholder='Selecciona una semana'
              onChange={(e) => setWeek(Number(e.target.value))}
            >
              {weeksInMonth.map((weekNumber) => (
                <option key={weekNumber} value={weekNumber}>
                  Semana {weekNumber}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </SimpleGrid>
      )}
      {businessId && month !== null && week !== null && (
        <AdjustWeeklyForm businessId={businessId} week={week} />
      )}
    </VStack>
  );
};

export default AdjustWeeklySelector;
