'use client';
import {
  Alert,
  Box,
  Button,
  Card,
  Center,
  Heading,
  HStack,
  Icon,
  Spinner,
  Text,
  Separator,
} from '@chakra-ui/react';
import Link_Next from 'next/link';
import React from 'react';
import { MdContentCopy, MdEdit } from 'react-icons/md';
import AddExportForm from './AddExportForm';
import { useExport } from '../../hooks/export/getExport';
import { serverErrorMessage } from '../../utils/serverErrorMessage';

interface ExportFormPageProps {
  exportId: string;
  mode: 'edit' | 'duplicate';
}

const COPY = {
  edit: {
    icon: MdEdit,
    title: 'Editar Exportación',
    subtitle: 'Cambia la finca, la alícuota o cualquier otro dato',
  },
  duplicate: {
    icon: MdContentCopy,
    title: 'Duplicar Exportación',
    subtitle: 'Se creará una exportación nueva con estos datos',
  },
};

function editBlockedReason(
  cancelledAt: string | null,
  pendingExportSent: boolean | null
): string | null {
  if (cancelledAt) return 'Esta exportación está cancelada: ya no se edita.';
  if (pendingExportSent === false) {
    return 'Esta exportación ya tiene envío de insumos: no se puede editar. Para cambiarla, cancélala y duplícala.';
  }
  return null;
}

const ExportFormPage: React.FC<ExportFormPageProps> = ({ exportId, mode }) => {
  const { data, isLoading, error } = useExport({ exportId });
  const bgColor = 'bg.canvas';
  const cardBg = 'bg.panel';
  const borderColor = 'border';
  const headerBg = 'bg.subtle';
  const headingColor = 'fg.heading';
  const textColor = 'fg';
  const { icon, title, subtitle } = COPY[mode];

  const blocked =
    mode === 'edit' && data
      ? editBlockedReason(data.cancelledAt, data.pendingExportSent)
      : null;

  return (
    <Box minH='100vh' w='100%' bg={bgColor} p={{ base: 4, md: 6, lg: 8 }}>
      <Box maxW='8xl' mx='auto'>
        <Card.Root
          bg={cardBg}
          borderColor={borderColor}
          borderRadius='xl'
          boxShadow='sm'
          overflow='hidden'
          borderWidth='1px'
          borderTopWidth='4px'
          borderTopColor='green.500'
        >
          <Card.Header bg={headerBg} pb={4}>
            <HStack gap={3} align='center'>
              <Box p={2} bg='green.subtle' borderRadius='lg' color='green.fg'>
                <Icon as={icon} boxSize={5} />
              </Box>
              <Box>
                <Heading size='lg' color={headingColor} fontWeight='bold'>
                  {title}
                </Heading>
                <Text fontSize='sm' color={textColor} mt={1}>
                  {subtitle}
                </Text>
              </Box>
            </HStack>
          </Card.Header>

          <Separator />

          <Card.Body>
            {isLoading && (
              <Center py={10}>
                <Spinner color='green.fg' />
              </Center>
            )}
            {!!error && (
              <Alert.Root status='error' borderRadius='md'>
                <Alert.Indicator />
                <Alert.Description>
                  {serverErrorMessage(
                    error,
                    'No se pudo cargar la exportación'
                  )}
                </Alert.Description>
              </Alert.Root>
            )}
            {data && blocked && (
              <Alert.Root status='warning' borderRadius='md'>
                <Alert.Indicator />
                <Alert.Description flex='1'>{blocked}</Alert.Description>
                <Button size='sm' colorPalette='green' asChild>
                  <Link_Next href={`/dashboard/export/${exportId}/duplicate`}>
                    <MdContentCopy />
                    Duplicar
                  </Link_Next>
                </Button>
              </Alert.Root>
            )}
            {data && !blocked && (
              <>
                {mode === 'edit' && data.purchaseOrderLine && (
                  <Alert.Root status='info' borderRadius='md' mb={4}>
                    <Alert.Indicator />
                    <Alert.Description flex='1'>
                      Nació de una orden de compra: la finca y la alícuota son
                      las de su línea y no cambian.
                    </Alert.Description>
                    <Button
                      size='sm'
                      variant='outline'
                      colorPalette='green'
                      asChild
                    >
                      <Link_Next
                        href={`/dashboard/export/purchase-orders/${data.purchaseOrderLine.purchaseOrderId}`}
                      >
                        Ver la orden
                      </Link_Next>
                    </Button>
                  </Alert.Root>
                )}
                {mode === 'duplicate' && (
                  <Alert.Root status='info' borderRadius='md' mb={4}>
                    <Alert.Indicator />
                    <Alert.Description>
                      Copia de la exportación #{data.id}. Cambia lo necesario y
                      guarda: la original no se modifica.
                    </Alert.Description>
                  </Alert.Root>
                )}
                <AddExportForm source={data} editing={mode === 'edit'} />
              </>
            )}
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
};

export default ExportFormPage;
