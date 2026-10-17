'use client';

import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Divider,
  Heading,
  HStack,
  Icon,
  Spinner,
  Text,
  useColorModeValue,
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
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('gray.50', 'gray.750');
  const headingColor = useColorModeValue('gray.900', 'gray.100');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const { icon, title, subtitle } = COPY[mode];

  const blocked =
    mode === 'edit' && data
      ? editBlockedReason(data.cancelledAt, data.pendingExportSent)
      : null;

  return (
    <Box minH='100vh' w='100%' bg={bgColor} p={{ base: 4, md: 6, lg: 8 }}>
      <Box maxW='8xl' mx='auto'>
        <Card
          bg={cardBg}
          borderColor={borderColor}
          borderRadius='xl'
          boxShadow='lg'
          overflow='hidden'
          border='1px solid'
          borderTopWidth='4px'
          borderTopColor='green.500'
        >
          <CardHeader bg={headerBg} pb={4}>
            <HStack spacing={3} align='center'>
              <Box p={2} bg='green.100' borderRadius='lg' color='green.600'>
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
          </CardHeader>

          <Divider />

          <CardBody>
            {isLoading && (
              <Center py={10}>
                <Spinner color='green.500' />
              </Center>
            )}
            {!!error && (
              <Alert status='error' borderRadius='md'>
                <AlertIcon />
                <AlertDescription>
                  {serverErrorMessage(
                    error,
                    'No se pudo cargar la exportación'
                  )}
                </AlertDescription>
              </Alert>
            )}
            {data && blocked && (
              <Alert status='warning' borderRadius='md'>
                <AlertIcon />
                <AlertDescription flex='1'>{blocked}</AlertDescription>
                <Button
                  as={Link_Next}
                  href={`/dashboard/export/${exportId}/duplicate`}
                  size='sm'
                  colorScheme='green'
                  leftIcon={<MdContentCopy />}
                >
                  Duplicar
                </Button>
              </Alert>
            )}
            {data && !blocked && (
              <>
                {mode === 'duplicate' && (
                  <Alert status='info' borderRadius='md' mb={4}>
                    <AlertIcon />
                    <AlertDescription>
                      Copia de la exportación #{data.id}. Cambia lo necesario y
                      guarda: la original no se modifica.
                    </AlertDescription>
                  </Alert>
                )}
                <AddExportForm source={data} editing={mode === 'edit'} />
              </>
            )}
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
};

export default ExportFormPage;
