import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Progress,
  Text,
  VStack,
} from '@chakra-ui/react';
import Link_Next from 'next/link';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { ExportResponse } from '../../../types/export.response';
import { ExportProgress } from '../../../types/exportProgress';
import {
  exportPage,
  STEP_STATUS,
  stepAction,
} from '../../../utils/exportSteps';
import { seesQueue } from '../../../utils/workQueueAccess';
import { useColorModeValue } from '../../ui/color-mode';
import ExportCustomsModal from '../ExportCustomsModal';

const STATE_COLOR: Record<ExportProgress['state'], string> = {
  CANCELLED: 'red',
  CLOSED: 'green',
  IN_PROGRESS: 'orange',
};

export default function ExportSteps({
  progress,
  exportItem,
}: {
  progress: ExportProgress;
  exportItem: ExportResponse;
}): React.JSX.Element {
  const [customsOpen, setCustomsOpen] = useState(false);
  const { data: session } = useSession();
  const role = session?.user?.role;
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const nextBg = useColorModeValue('orange.50', 'whiteAlpha.100');
  const canEdit =
    !exportItem.cancelledAt && exportItem.pendingExportSent !== false;
  const back = exportPage(progress.exportId);

  return (
    <Box border='1px solid' borderColor={borderColor} borderRadius='md' p={4}>
      <Flex justify='space-between' align='center' gap={4} wrap='wrap'>
        <Badge colorPalette={STATE_COLOR[progress.state]} fontSize='sm' px={2}>
          {progress.stateLabel}
        </Badge>
        <HStack flex='1' minW='180px' maxW='360px' gap={2}>
          <Progress.Root
            flex='1'
            value={progress.progress}
            colorPalette={STATE_COLOR[progress.state]}
            size='sm'
            borderRadius='md'
          >
            <Progress.Track>
              <Progress.Range />
            </Progress.Track>
          </Progress.Root>
          <Text fontSize='sm'>{progress.progress} %</Text>
        </HStack>
      </Flex>

      <VStack align='stretch' gap={2} mt={4}>
        {progress.steps.map((step, index) => {
          const action =
            progress.state === 'CANCELLED' || !seesQueue(role, step.key)
              ? null
              : stepAction(step, progress, back, canEdit);
          const isNext = step.key === progress.next;
          return (
            <Flex
              key={step.key}
              align='center'
              gap={3}
              p={2}
              borderRadius='md'
              bg={isNext ? nextBg : undefined}
              wrap='wrap'
            >
              <Text w='20px' color='gray.500' fontSize='sm'>
                {index + 1}
              </Text>
              <Badge
                colorPalette={STEP_STATUS[step.status].colorScheme}
                minW='84px'
                textAlign='center'
              >
                {STEP_STATUS[step.status].label}
              </Badge>
              <Box flex='1' minW='180px'>
                <Text fontSize='sm' fontWeight='semibold'>
                  {step.label}
                  {isNext && (
                    <Text as='span' fontWeight='normal' color='orange.600'>
                      {' '}
                      · sigue
                    </Text>
                  )}
                </Text>
                {step.detail && (
                  <Text fontSize='sm' color='gray.600'>
                    {step.detail}
                  </Text>
                )}
              </Box>
              {action &&
                ('modal' in action ? (
                  <Button
                    size='sm'
                    colorPalette='green'
                    variant={isNext ? 'solid' : 'outline'}
                    onClick={() => setCustomsOpen(true)}
                  >
                    {action.label}
                  </Button>
                ) : (
                  <Button
                    size='sm'
                    colorPalette='green'
                    variant={isNext ? 'solid' : 'outline'}
                    asChild
                  >
                    <Link_Next href={action.href}>{action.label}</Link_Next>
                  </Button>
                ))}
            </Flex>
          );
        })}
      </VStack>

      <ExportCustomsModal
        exportItem={customsOpen ? exportItem : null}
        onClose={() => setCustomsOpen(false)}
      />
    </Box>
  );
}
