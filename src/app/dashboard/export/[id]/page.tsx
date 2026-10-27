'use client';
import { Box, Card, Grid, SimpleGrid, Text } from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import React from 'react';
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
                <DetailExport data={exportItem} />
              </Card.Body>
            </Card.Root>
          </Grid>
        </Box>
      )}
    </PageLayout>
  );
}

export default IsOnboarding(ExportFilePage);
