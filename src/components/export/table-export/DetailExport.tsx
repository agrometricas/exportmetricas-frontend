/* eslint-disable @typescript-eslint/no-explicit-any */
import { Accordion, Alert, Badge, Box, Heading, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import React from 'react';
import {
  DetailField,
  DetailFields,
  DetailItem,
  DetailSubtitle,
} from '@/components/ui/DetailFields';
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
      <DetailItem key={i}>
        <DetailFields>
          <DetailField label='Nombre'>{c.name}</DetailField>
          <DetailField label='Correo'>{c.email}</DetailField>
          <DetailField label='Teléfono'>{c.phone}</DetailField>
        </DetailFields>
      </DetailItem>
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
              <strong>Detalles generales</strong>
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent>
          <Accordion.ItemBody>
            <DetailFields>
              <DetailField label='AUCP'>
                {data.aucpNumber
                  ? `${data.aucpNumber} — ${formatDayMonthYear(data.aucpDate)}`
                  : 'Sin registrar'}
              </DetailField>
              <DetailField label='DAE'>
                {data.daeNumber
                  ? `${data.daeNumber} — ${formatDayMonthYear(data.daeDate)}, aforo ${customsChannelLabel(data.daeChannel).toLowerCase()}${data.daeValue ? `, USD ${Number(data.daeValue).toFixed(2)}` : ''}`
                  : 'Sin registrar'}
              </DetailField>
              <DetailField label='Booking'>{data.bookingNumber}</DetailField>
            </DetailFields>
            {!!data.booking?.documents?.length && (
              <Box>
                <DetailSubtitle>Documentos del booking</DetailSubtitle>
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
            <DetailFields>
              {!!data.containers?.length && (
                <DetailField label='Contenedores'>
                  {data.containers.map(containerLabel).join(', ')}
                </DetailField>
              )}
              <DetailField label='Nombre del barco'>
                {data.shipName}
              </DetailField>
              <DetailField label='Tiempo estimado'>
                {data.estimatedTravelTime}
              </DetailField>
              <DetailField label='Fecha máxima de ingreso'>
                {formatDayMonthYearTime(data.shippingDateTime)}
              </DetailField>
            </DetailFields>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-1'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left'>
              <strong>Productor y finca</strong>
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent>
          <Accordion.ItemBody>
            <DetailFields>
              <DetailField label='Razón social'>
                {data.merchant?.businessName}
              </DetailField>
              <DetailField label='RUC'>{data.merchant?.businessId}</DetailField>
              <DetailField label='Finca'>{data.business?.name}</DetailField>
              <DetailField label='Ciudad'>
                {data.business?.city?.name}
              </DetailField>
              <DetailField label='Dirección'>
                {data.business?.address}
              </DetailField>
              <DetailField label='Área'>{data.business?.area} ha</DetailField>
            </DetailFields>
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
            <DetailFields>
              <DetailField label='Nombre'>
                {data.client?.businessName}
              </DetailField>
              <DetailField label='RUC'>{data.client?.businessId}</DetailField>
              <DetailField label='Email'>{data.client?.email}</DetailField>
              <DetailField label='Teléfono'>{data.client?.phone}</DetailField>
            </DetailFields>
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
            <DetailFields>
              <DetailField label='Salida'>
                {data.harborDeparture?.name} ({data.harborDeparture?.city?.name}
                )
              </DetailField>
              <DetailField label='Destino'>
                {data.harborDestination?.name} (
                {data.harborDestination?.city?.name})
              </DetailField>
            </DetailFields>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-4'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left'>
              <strong>Materiales y marca de caja</strong>
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent>
          <Accordion.ItemBody>
            <DetailFields>
              <DetailField label='Marca'>{data.boxBrand?.name}</DetailField>
              <DetailField label='Código'>
                {data.boxBrand?.brandCode}
              </DetailField>
              <DetailField label='Cantidad de cajas'>
                {data.boxQuantity}
              </DetailField>
            </DetailFields>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-5'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left'>
              <strong>Transporte y logística</strong>
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent>
          <Accordion.ItemBody>
            <DetailFields>
              <DetailField label='Transportista'>
                {data.transport?.name}
              </DetailField>
              <DetailField label='RUC'>{data.transport?.ruc}</DetailField>
              <DetailField label='Dirección'>
                {data.transport?.address}
              </DetailField>
            </DetailFields>
            <Box mt={3}>
              <DetailSubtitle>Contactos</DetailSubtitle>
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
            <DetailFields>
              <DetailField label='Nombre'>{data.deposit?.name}</DetailField>
              <DetailField label='Dirección'>
                {data.deposit?.address}
              </DetailField>
              <DetailField label='Ciudad'>
                {data.deposit?.city?.name}
              </DetailField>
            </DetailFields>
            <Box mt={3}>
              <DetailSubtitle>Contactos</DetailSubtitle>
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
            <DetailFields>
              <DetailField label='Nombre'>{data.verifier?.name}</DetailField>
              <DetailField label='RUC'>{data.verifier?.ruc}</DetailField>
              <DetailField label='Dirección'>
                {data.verifier?.address}
              </DetailField>
            </DetailFields>
            <Box mt={3}>
              <DetailSubtitle>Contactos</DetailSubtitle>
              {renderContacts(data.verifier?.contacts || [])}
            </Box>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default DetailExport;
