'use client';
import {
  Box,
  Card,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Text,
  Separator,
} from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { MdOutlineLocalShipping } from 'react-icons/md';
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
  const bgColor = 'bg.canvas';
  const cardBg = 'bg.panel';
  const borderColor = 'border';
  const headBg = 'bg.subtle';

  return (
    <Box minH='100vh' bg={bgColor} p={{ base: 4, md: 6, lg: 8 }}>
      <Box maxW='6xl' mx='auto'>
        <Card.Root
          bg={cardBg}
          borderColor={borderColor}
          borderRadius='xl'
          boxShadow='sm'
          borderWidth='1px'
          borderTopWidth='4px'
          borderTopColor='green.500'
        >
          <Card.Header bg={headBg}>
            <HStack gap={3}>
              <Box p={2} bg='green.subtle' borderRadius='lg' color='green.fg'>
                <Icon boxSize={5} asChild>
                  <MdOutlineLocalShipping />
                </Icon>
              </Box>
              <Box>
                <Heading size='lg' fontWeight='bold'>
                  Exportación {id}
                </Heading>
                <Text fontSize='sm' color='fg.muted'>
                  Sus pasos, lo que sigue y el detalle
                </Text>
              </Box>
            </HStack>
          </Card.Header>
          <Separator />
          <Card.Body>
            {isLoading || !exportItem ? (
              <LoadingState />
            ) : (
              <>
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
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
}

export default IsOnboarding(ExportFilePage);
