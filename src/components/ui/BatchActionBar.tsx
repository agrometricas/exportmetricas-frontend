'use client';

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  CloseButton,
  Flex,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
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
      toast({
        title: outcome.summary.title,
        status: outcome.summary.status,
        duration: 6000,
        isClosable: true,
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
      toast({
        title: errorTitle,
        description: serverErrorMessage(error),
        status: 'error',
        duration: 6000,
        isClosable: true,
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
          colorScheme='green'
          leftIcon={icon}
          isDisabled={selected.length === 0}
          onClick={onOpen}
          flexShrink={0}
        >
          {actionLabel} ({selected.length})
        </Button>
      </Flex>

      {failures.length > 0 && (
        <Alert status='warning' borderRadius='md' alignItems='flex-start'>
          <AlertIcon />
          <Box flex='1'>
            <AlertTitle>{failuresTitle}</AlertTitle>
            <AlertDescription>
              <List spacing={1} mt={1}>
                {failures.map((failure) => (
                  <ListItem key={failure.id}>
                    <strong>{failure.label}:</strong> {failure.message}
                  </ListItem>
                ))}
              </List>
            </AlertDescription>
          </Box>
          <CloseButton
            aria-label='Cerrar el aviso'
            onClick={() => setFailures([])}
          />
        </Alert>
      )}

      <Modal isOpen={isOpen} onClose={onClose} isCentered size='lg'>
        <ModalOverlay />
        <ModalContent mx={4}>
          <ModalHeader>{confirmTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={3}>{confirmText(selected.length)}</Text>
            <List spacing={1} maxH='40vh' overflowY='auto'>
              {selected.map((item) => (
                <ListItem key={keyOf(item)} fontSize='sm'>
                  {labelOf(item)}
                </ListItem>
              ))}
            </List>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant='ghost' onClick={onClose} isDisabled={isRunning}>
              Cancelar
            </Button>
            <Button colorScheme='green' onClick={confirm} isLoading={isRunning}>
              {confirmLabel(selected.length)}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default BatchActionBar;
