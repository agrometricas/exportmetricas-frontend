import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Flex,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { MdContentCopy } from 'react-icons/md';
import { useLastFarmExport } from '../../hooks/export/getLastFarmExport';
import { formatDayMonthYear } from '../../utils/dayMonthYear';

interface LastFarmExportAlertProps {
  businessId?: number;
}

const LastFarmExportAlert: React.FC<LastFarmExportAlertProps> = ({
  businessId,
}) => {
  const { data } = useLastFarmExport({ businessId });
  const last = data?.last;
  if (!last) return null;

  return (
    <Alert status='info' borderRadius='md'>
      <AlertIcon />
      <Flex
        flex='1'
        gap={3}
        align={{ base: 'flex-start', md: 'center' }}
        direction={{ base: 'column', md: 'row' }}
        justify='space-between'
      >
        <AlertDescription>
          La última exportación de esta finca es la N.º {last.exportId}
          {last.cuttingDate
            ? `, cortada el ${formatDayMonthYear(last.cuttingDate)}`
            : ''}
          , para {last.client}. Puedes copiarla y cambiar solo lo que sea
          distinto.
        </AlertDescription>
        <Button
          as={NextLink}
          href={`/dashboard/export/${last.exportId}/duplicate`}
          size='sm'
          colorScheme='blue'
          leftIcon={<MdContentCopy />}
          flexShrink={0}
        >
          Copiar esa exportación
        </Button>
      </Flex>
    </Alert>
  );
};

export default LastFarmExportAlert;
