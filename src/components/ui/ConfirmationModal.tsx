'use client';
import { Button, HStack, Box, Text, Badge, Dialog, Portal } from '@chakra-ui/react';
import React, { useRef } from 'react';
import { FiInfo, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import { useColorModeValue } from "./color-mode";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'info' | 'success' | 'danger';
  isConfirmLoading?: boolean;
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'info',
  isConfirmLoading = false,
}: ConfirmationModalProps): React.JSX.Element => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('gray.50', 'gray.750');
  const titleColor = useColorModeValue('gray.900', 'gray.100');
  const descColor = useColorModeValue('gray.700', 'gray.300');

  const greenStrong = useColorModeValue('green.600', 'green.300');
  const greenSoft = useColorModeValue('green.100', 'green.900');
  const redStrong = useColorModeValue('red.600', 'red.300');
  const redSoft = useColorModeValue('red.100', 'red.900');

  let scheme: 'green' | 'red' = 'green';
  let TopIcon = FiInfo as React.ComponentType<{ size?: number }>;
  let topColor = greenStrong;
  let topBg = greenSoft;
  let topBorder = 'green.500';

  if (variant === 'danger') {
    scheme = 'red';
    TopIcon = FiAlertTriangle;
    topColor = redStrong;
    topBg = redSoft;
    topBorder = 'red.500';
  } else if (variant === 'success') {
    scheme = 'green';
    TopIcon = FiCheckCircle;
  }

  return (
    <Dialog.Root
      open={isOpen}
      placement='center'
      initialFocusEl={() => cancelRef.current}
      motionPreset="scale"
      onOpenChange={e => {
        if (!e.open) {
          onClose();
        }
      }}
    >
      <Portal>

        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            border="1px solid"
            borderColor={borderColor}
            borderRadius="xl"
            boxShadow="2xl"
            overflow="hidden"
            borderTopWidth="4px"
            borderTopColor={topBorder}>
            <Dialog.Header bg={headerBg} pb={3}>
              <HStack gap={3} align="center">
                <Box p={2} bg={topBg} color={topColor} borderRadius="lg" display="flex">
                  <TopIcon size={18} />
                </Box>
                <HStack justify="space-between" w="full">
                  <Text as="span" fontWeight="bold" color={titleColor}>
                    {title}
                  </Text>
                  <Badge colorPalette={scheme} variant="subtle" borderRadius="full" px={2} py={1}>
                    Confirmación
                  </Badge>
                </HStack>
              </HStack>
            </Dialog.Header>

            <Dialog.CloseTrigger />

            <Dialog.Body>
              <Text fontSize="sm" color={descColor}>
                {description}
              </Text>
            </Dialog.Body>

            <Dialog.Footer gap={2}>
              <Button ref={cancelRef} variant="outline" onClick={onClose} borderRadius="lg">
                {cancelText}
              </Button>
              <Button
                colorPalette={scheme}
                onClick={onConfirm}
                loading={isConfirmLoading}
                borderRadius="lg"
                _hover={{ transform: 'translateY(-1px)', boxShadow: 'md' }}
                transition="all 0.15s ease"
              >
                {confirmText}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>

      </Portal>
    </Dialog.Root>
  );
};

export default ConfirmationModal;
