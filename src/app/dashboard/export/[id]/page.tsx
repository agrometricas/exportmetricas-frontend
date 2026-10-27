'use client';
import { Box, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { MdOutlineLocalShipping } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import LoadingState from '@/components/ui/states/LoadingState';
import ExportSteps from '../../../../components/export/progress/ExportSteps';
import DetailExport from '../../../../components/export/table-export/DetailExport';
import IsOnboarding from '../../../../components/ui/IsOnboarding';
import { useExportProgress } from '../../../../hooks/export/exportProgress';
import { useExport } from '../../../../hooks/export/getExport';
import { ExportProgress } from '../../../../types/exportProgress';
import { formatDayMonthYear } from '../../../../utils/dayMonthYear';

function useWidth(): [React.RefObject<HTMLDivElement>, number] {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.floor(entry.contentRect.width))
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, width];
}

function Fact({
  label,
  value,
}: {
  label: string;
  value: string;
}): React.JSX.Element {
  return (
    <Box>
      <Text fontSize='xs' color='fg.muted'>
        {label}
      </Text>
      <Text fontSize='sm' fontWeight='semibold'>
        {value}
      </Text>
    </Box>
  );
}

function ExportFilePage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { data: exportItem, isLoading } = useExport({ exportId: id });
  const { data: progressData } = useExportProgress(id);
  const progress = progressData as ExportProgress | undefined;
  const [detailRef, detailWidth] = useWidth();

  return (
    <CardPage
      icon={MdOutlineLocalShipping}
      title={`Exportación ${id}`}
      description='Sus pasos, lo que sigue y el detalle'
    >
      {isLoading || !exportItem ? (
        <LoadingState />
      ) : (
        <>
          <SimpleGrid columns={{ base: 2, md: 4 }} gap={4} mb={5}>
            <Fact label='Finca' value={exportItem.business?.name ?? '—'} />
            <Fact
              label='Cliente'
              value={exportItem.client?.businessName ?? '—'}
            />
            <Fact label='Cajas' value={String(exportItem.boxQuantity ?? '—')} />
            <Fact
              label='Corte'
              value={formatDayMonthYear(exportItem.cuttingDate) || '—'}
            />
          </SimpleGrid>
          {progress && (
            <ExportSteps progress={progress} exportItem={exportItem} />
          )}
          <Heading size='md' mt={6} mb={3}>
            Detalle
          </Heading>
          <Box ref={detailRef}>
            {detailWidth > 0 && (
              <DetailExport
                data={exportItem}
                width={{ sm: detailWidth, md: detailWidth }}
              />
            )}
          </Box>
        </>
      )}
    </CardPage>
  );
}

export default IsOnboarding(ExportFilePage);
