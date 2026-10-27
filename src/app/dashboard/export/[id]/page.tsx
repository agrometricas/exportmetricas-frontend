'use client';
import { Box, Card, Grid, SimpleGrid, Text } from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import React, { useCallback, useRef, useState } from 'react';
import { MdOutlineLocalShipping } from 'react-icons/md';
import { PageLayout } from '@/components/ui/page/PageLayout';
import LoadingState from '@/components/ui/states/LoadingState';
import ExportSteps from '../../../../components/export/progress/ExportSteps';
import DetailExport from '../../../../components/export/table-export/DetailExport';
import IsOnboarding from '../../../../components/ui/IsOnboarding';
import { useExportProgress } from '../../../../hooks/export/exportProgress';
import { useExport } from '../../../../hooks/export/getExport';
import { ExportProgress } from '../../../../types/exportProgress';
import { formatDayMonthYear } from '../../../../utils/dayMonthYear';

// A callback ref: the measured box only exists once the export has loaded,
// after the first render.
function useWidth(): [(node: HTMLDivElement | null) => void, number] {
  const [width, setWidth] = useState(0);
  const observer = useRef<ResizeObserver | null>(null);
  const ref = useCallback((node: HTMLDivElement | null) => {
    observer.current?.disconnect();
    if (!node) return;
    observer.current = new ResizeObserver(([entry]) =>
      setWidth(Math.floor(entry.contentRect.width))
    );
    observer.current.observe(node);
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
    <PageLayout
      icon={MdOutlineLocalShipping}
      title={`Exportación ${id}`}
      description='Sus pasos, lo que sigue y el detalle'
    >
      {isLoading || !exportItem ? (
        <Card.Root boxShadow='sm'>
          <Card.Body>
            <LoadingState />
          </Card.Body>
        </Card.Root>
      ) : (
        // Two columns once the content area, not the window, has room: the
        // sidebar can be open or collapsed.
        <Box css={{ containerType: 'inline-size' }}>
          <Grid
            templateColumns='minmax(0, 1fr)'
            gap={6}
            alignItems='start'
            css={{
              '@container (min-width: 1040px)': {
                gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 2fr)',
              },
            }}
          >
            <Card.Root boxShadow='sm'>
              <Card.Body>
                <SimpleGrid columns={{ base: 2, md: 4 }} gap={4} mb={5}>
                  <Fact
                    label='Finca'
                    value={exportItem.business?.name ?? '—'}
                  />
                  <Fact
                    label='Cliente'
                    value={exportItem.client?.businessName ?? '—'}
                  />
                  <Fact
                    label='Cajas'
                    value={String(exportItem.boxQuantity ?? '—')}
                  />
                  <Fact
                    label='Corte'
                    value={formatDayMonthYear(exportItem.cuttingDate) || '—'}
                  />
                </SimpleGrid>
                {progress && (
                  <ExportSteps progress={progress} exportItem={exportItem} />
                )}
              </Card.Body>
            </Card.Root>
            <Card.Root boxShadow='sm'>
              <Card.Body>
                <Text as='h2' textStyle='h3' color='fg.heading' mb={3}>
                  Detalle
                </Text>
                <Box ref={detailRef}>
                  {detailWidth > 0 && (
                    <DetailExport
                      data={exportItem}
                      width={{ sm: detailWidth, md: detailWidth }}
                    />
                  )}
                </Box>
              </Card.Body>
            </Card.Root>
          </Grid>
        </Box>
      )}
    </PageLayout>
  );
}

export default IsOnboarding(ExportFilePage);
