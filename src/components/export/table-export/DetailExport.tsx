/* eslint-disable @typescript-eslint/no-explicit-any */
import { Accordion, Alert, Badge, Box, Heading, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import React from 'react';
import { ExportResponse } from '../../../types/export.response';
import { containerLabel } from '../../../utils/containerSeals';
import { customsChannelLabel } from '../../../utils/customs';
import {
  formatDayMonthYear,
  formatDayMonthYearTime,
} from '../../../utils/dayMonthYear';
import {
  DOCUMENT_STATUS_COLOR,
  documentStatusText,
} from '../../../utils/documentStatus';
interface DetailExportsProps {
  data: ExportResponse;
}
const DetailExport: React.FC<DetailExportsProps> = ({ data }) => {
  const renderContacts = (contacts: any[]): React.JSX.Element[] =>
    contacts.map((c, i) => (
      <Box key={i} mb={2}>
        <Text>
          <strong>Nombre:</strong> {c.name}
        </Text>
        <Text>
          <strong>Correo:</strong> {c.email}
        </Text>
        <Text>
          <strong>Teléfono:</strong> {c.phone}
        </Text>
      </Box>
    ));

  return (
    <Accordion.Root defaultValue={['item-0']} multiple>
      {data.cancelledAt && (
        <Alert.Root
          status='error'
          variant='subtle'
          borderStartWidth='3px'
          borderStartColor='colorPalette.solid'
        >
          <Alert.Indicator />
          <Alert.Description>
            <strong>
              Cancelada el {format(new Date(data.cancelledAt), 'dd/MM/yyyy')}.
            </strong>{' '}
            {data.cancellationReason ?? 'Sin motivo registrado.'}
          </Alert.Description>
        </Alert.Root>
      )}
      <Accordion.Item value='item-0'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left'>
              <strong>Detalles Generales</strong>
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent>
          <Accordion.ItemBody>
            <Text>
              <strong>AUCP:</strong>{' '}
              {data.aucpNumber
                ? `${data.aucpNumber} — ${formatDayMonthYear(data.aucpDate)}`
                : 'Sin registrar'}
            </Text>
            <Text>
              <strong>DAE:</strong>{' '}
              {data.daeNumber
                ? `${data.daeNumber} — ${formatDayMonthYear(data.daeDate)}, aforo ${customsChannelLabel(data.daeChannel).toLowerCase()}${data.daeValue ? `, USD ${Number(data.daeValue).toFixed(2)}` : ''}`
                : 'Sin registrar'}
            </Text>
            <Text>
              <strong>Booking:</strong> {data.bookingNumber}
            </Text>
            {!!data.booking?.documents?.length && (
              <Box>
                <strong>Documentos del booking:</strong>
                {data.booking.documents.map((document) => (
                  <Text key={`${document.type}-${document.number}`} ml={2}>
                    {document.typeLabel} {document.number}{' '}
                    <Badge
                      colorPalette={DOCUMENT_STATUS_COLOR[document.status]}
                    >
                      {documentStatusText(document.status, document.daysLeft)}
                    </Badge>
                  </Text>
                ))}
              </Box>
            )}
            {!!data.containers?.length && (
              <Text>
                <strong>Contenedores:</strong>{' '}
                {data.containers.map(containerLabel).join(', ')}
              </Text>
            )}
            <Text>
              <strong>Nombre del Barco:</strong> {data.shipName}
            </Text>
            <Text>
              <strong>Tiempo Estimado:</strong> {data.estimatedTravelTime}
            </Text>
            <Text>
              <strong>Fecha Máxima de Ingreso:</strong>{' '}
              {formatDayMonthYearTime(data.shippingDateTime)}
            </Text>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-1'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left'>
              <strong>Productor y Finca</strong>
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent>
          <Accordion.ItemBody>
            <Text>
              <strong>Razón Social:</strong> {data.merchant?.businessName}
            </Text>
            <Text>
              <strong>RUC:</strong> {data.merchant?.businessId}
            </Text>
            <Text>
              <strong>Finca:</strong> {data.business?.name}
            </Text>
            <Text>
              <strong>Ciudad:</strong> {data.business?.city?.name}
            </Text>
            <Text>
              <strong>Dirección:</strong> {data.business?.address}
            </Text>
            <Text>
              <strong>Área:</strong> {data.business?.area} ha
            </Text>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-2'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left'>
              <strong>Cliente</strong>
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent>
          <Accordion.ItemBody>
            <Text>
              <strong>Nombre:</strong> {data.client?.businessName}
            </Text>
            <Text>
              <strong>RUC:</strong> {data.client?.businessId}
            </Text>
            <Text>
              <strong>Email:</strong> {data.client?.email}
            </Text>
            <Text>
              <strong>Teléfono:</strong> {data.client?.phone}
            </Text>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-3'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left'>
              <strong>Puerto</strong>
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent>
          <Accordion.ItemBody>
            <Text>
              <strong>Salida:</strong> {data.harborDeparture?.name} (
              {data.harborDeparture?.city?.name})
            </Text>
            <Text>
              <strong>Destino:</strong> {data.harborDestination?.name} (
              {data.harborDestination?.city?.name})
            </Text>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-4'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left'>
              <strong>Materiales y Marca de Caja</strong>
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent>
          <Accordion.ItemBody>
            <Text>
              <strong>Marca:</strong> {data.boxBrand?.name}
            </Text>
            <Text>
              <strong>Código:</strong> {data.boxBrand?.brandCode}
            </Text>
            <Text>
              <strong>Cantidad de Cajas:</strong> {data.boxQuantity}
            </Text>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-5'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left'>
              <strong>Transporte y Logística</strong>
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent>
          <Accordion.ItemBody>
            <Text>
              <strong>Transportista:</strong> {data.transport?.name}
            </Text>
            <Text>
              <strong>RUC:</strong> {data.transport?.ruc}
            </Text>
            <Text>
              <strong>Dirección:</strong> {data.transport?.address}
            </Text>
            <Box mt={3}>
              <strong>Contactos:</strong>
              {renderContacts(data.transport?.contacts || [])}
            </Box>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-6'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left'>
              <strong>Depósito</strong>
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent>
          <Accordion.ItemBody>
            <Text>
              <strong>Nombre:</strong> {data.deposit?.name}
            </Text>
            <Text>
              <strong>Dirección:</strong> {data.deposit?.address}
            </Text>
            <Text>
              <strong>Ciudad:</strong> {data.deposit?.city?.name}
            </Text>
            <Box mt={3}>
              <strong>Contactos:</strong>
              {renderContacts(data.deposit?.contacts || [])}
            </Box>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-7'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left'>
              <strong>Verificadora</strong>
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent>
          <Accordion.ItemBody>
            <Text>
              <strong>Nombre:</strong> {data.verifier?.name}
            </Text>
            <Text>
              <strong>RUC:</strong> {data.verifier?.ruc}
            </Text>
            <Text>
              <strong>Dirección:</strong> {data.verifier?.address}
            </Text>
            <Box mt={3}>
              <strong>Contactos:</strong>
              {renderContacts(data.verifier?.contacts || [])}
            </Box>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default DetailExport;
