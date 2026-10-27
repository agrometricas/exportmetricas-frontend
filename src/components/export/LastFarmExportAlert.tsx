import { Alert, Button, Flex } from '@chakra-ui/react';
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
    <Alert.Root status='info' borderRadius='md'>
      <Alert.Indicator />
      <Flex
        flex='1'
        gap={3}
        align={{ base: 'flex-start', md: 'center' }}
        direction={{ base: 'column', md: 'row' }}
        justify='space-between'
      >
        <Alert.Description>
          La última exportación de esta finca es la N.º {last.exportId}
          {last.cuttingDate
            ? `, cortada el ${formatDayMonthYear(last.cuttingDate)}`
            : ''}
          , para {last.client}. Puedes copiarla y cambiar solo lo que sea
          distinto.
        </Alert.Description>
        <Button size='sm' colorPalette='blue' flexShrink={0} asChild>
          <NextLink href={`/dashboard/export/${last.exportId}/duplicate`}>
            <MdContentCopy />
            Copiar esa exportación
          </NextLink>
        </Button>
      </Flex>
    </Alert.Root>
  );
};

export default LastFarmExportAlert;
