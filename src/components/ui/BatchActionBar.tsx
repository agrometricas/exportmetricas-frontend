'use client';
import {
  Alert,
  Box,
  Button,
  CloseButton,
  Flex,
  List,
  Text,
  useDisclosure,
  Dialog,
  Portal,
} from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import { toaster } from '@/components/ui/toaster';
import { useColorModeValue } from './color-mode';
import { serverErrorMessage } from '../../utils/serverErrorMessage';

export interface BatchOutcome {
  failed: { id: number; message: string }[];
  summary: { status: 'success' | 'warning' | 'error'; title: string };
}

interface BatchActionBarProps<T> {
  selected: T[];
  keyOf: (item: T) => number;
  labelOf: (item: T) => string;
  hint: string;
  icon: React.ReactElement;
  actionLabel: string;
  confirmTitle: string;
  confirmText: (count: number) => string;
  confirmLabel: (count: number) => string;
  failuresTitle: string;
  errorTitle: string;
  affectedQueries: string[];
  isRunning: boolean;
  run: (ids: number[]) => Promise<BatchOutcome>;
  onFinished: (failedIds: number[]) => void;
}

function BatchActionBar<T>({
  selected,
  keyOf,
  labelOf,
  hint,
  icon,
  actionLabel,
  confirmTitle,
  confirmText,
  confirmLabel,
  failuresTitle,
  errorTitle,
  affectedQueries,
  isRunning,
  run,
  onFinished,
}: BatchActionBarProps<T>): React.JSX.Element {
  const { open, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [failures, setFailures] = useState<
    { id: number; label: string; message: string }[]
  >([]);

  const barBg = useColorModeValue('green.50', 'gray.700');
  const hintColor = useColorModeValue('gray.600', 'gray.300');

  const confirm = async (): Promise<void> => {
    const labels = new Map(
      selected.map((item) => [keyOf(item), labelOf(item)])
    );
    try {
      const outcome = await run([...labels.keys()]);
      affectedQueries.forEach((key) => queryClient.invalidateQueries(key));
      toaster.create({
        title: outcome.summary.title,
        type: outcome.summary.status,
        duration: 6000,
        closable: true,
      });
      setFailures(
        outcome.failed.map((failure) => ({
          ...failure,
          label: labels.get(failure.id) ?? String(failure.id),
        }))
      );
      onFinished(outcome.failed.map((failure) => failure.id));
      onClose();
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        router.push('/api/auth/signout');
        return;
      }
      toaster.create({
        title: errorTitle,
        description: serverErrorMessage(error),
        type: 'error',
        duration: 6000,
        closable: true,
      });
    }
  };

  return (
    <>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        align={{ base: 'stretch', md: 'center' }}
        justify='space-between'
        gap={3}
        p={3}
        bg={barBg}
        borderRadius='lg'
      >
        <Text fontSize='sm' color={hintColor}>
          {hint}
        </Text>
        <Button
          colorPalette='green'
          disabled={selected.length === 0}
          onClick={onOpen}
          flexShrink={0}
        >
          {icon}
          {actionLabel} ({selected.length})
        </Button>
      </Flex>

      {failures.length > 0 && (
        <Alert.Root status='warning' borderRadius='md' alignItems='flex-start'>
          <Alert.Indicator />
          <Box flex='1'>
            <Alert.Title>{failuresTitle}</Alert.Title>
            <Alert.Description>
              <List.Root gap={1} mt={1}>
                {failures.map((failure) => (
                  <List.Item key={failure.id}>
                    <strong>{failure.label}:</strong> {failure.message}
                  </List.Item>
                ))}
              </List.Root>
            </Alert.Description>
          </Box>
          <CloseButton
            aria-label='Cerrar el aviso'
            onClick={() => setFailures([])}
          />
        </Alert.Root>
      )}

      <Dialog.Root
        open={open}
        placement='center'
        size='lg'
        onOpenChange={(e) => {
          if (!e.open) {
            onClose();
          }
        }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content mx={4}>
              <Dialog.Header>{confirmTitle}</Dialog.Header>
              <Dialog.CloseTrigger />
              <Dialog.Body>
                <Text mb={3}>{confirmText(selected.length)}</Text>
                <List.Root gap={1} maxH='40vh' overflowY='auto'>
                  {selected.map((item) => (
                    <List.Item key={keyOf(item)} fontSize='sm'>
                      {labelOf(item)}
                    </List.Item>
                  ))}
                </List.Root>
              </Dialog.Body>
              <Dialog.Footer gap={3}>
                <Button variant='ghost' onClick={onClose} disabled={isRunning}>
                  Cancelar
                </Button>
                <Button
                  colorPalette='green'
                  onClick={confirm}
                  loading={isRunning}
                >
                  {confirmLabel(selected.length)}
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}

export default BatchActionBar;
