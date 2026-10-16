/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { ExportResponse } from '../../../types/export.response';
interface DetailExportsProps {
  data: ExportResponse;
  width: { sm: number; md: number };
}
const DetailExport: React.FC<DetailExportsProps> = ({ data, width }) => {
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
    <Accordion defaultIndex={[0]} allowMultiple>
      <AccordionItem>
        <Heading>
          <AccordionButton width={{ sm: `${width.sm}px`, md: `${width.md}px` }}>
            <Box flex='1' textAlign='left'>
              <strong>Detalles Generales</strong>
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel>
          <Text>
            <strong>Booking:</strong> {data.bookingNumber}
          </Text>
          <Text>
            <strong>Nombre del Barco:</strong> {data.shipName}
          </Text>
          <Text>
            <strong>Tiempo Estimado:</strong> {data.estimatedTravelTime}
          </Text>
          <Text>
            <strong>Fecha Máxima de Ingreso:</strong> {data.shippingDateTime}
          </Text>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <Heading>
          <AccordionButton width={{ sm: `${width.sm}px`, md: `${width.md}px` }}>
            <Box flex='1' textAlign='left'>
              <strong>Productor y Finca</strong>
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel>
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
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <Heading>
          <AccordionButton width={{ sm: `${width.sm}px`, md: `${width.md}px` }}>
            <Box flex='1' textAlign='left'>
              <strong>Cliente</strong>
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel>
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
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <Heading>
          <AccordionButton width={{ sm: `${width.sm}px`, md: `${width.md}px` }}>
            <Box flex='1' textAlign='left'>
              <strong>Puerto</strong>
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel>
          <Text>
            <strong>Salida:</strong> {data.harborDeparture?.name} (
            {data.harborDeparture?.city?.name})
          </Text>
          <Text>
            <strong>Destino:</strong> {data.harborDestination?.name} (
            {data.harborDestination?.city?.name})
          </Text>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <Heading>
          <AccordionButton width={{ sm: `${width.sm}px`, md: `${width.md}px` }}>
            <Box flex='1' textAlign='left'>
              <strong>Materiales y Marca de Caja</strong>
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel>
          <Text>
            <strong>Marca:</strong> {data.boxBrand?.name}
          </Text>
          <Text>
            <strong>Código:</strong> {data.boxBrand?.brandCode}
          </Text>
          <Text>
            <strong>Cantidad de Cajas:</strong> {data.boxQuantity}
          </Text>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <Heading>
          <AccordionButton width={{ sm: `${width.sm}px`, md: `${width.md}px` }}>
            <Box flex='1' textAlign='left'>
              <strong>Transporte y Logística</strong>
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel>
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
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <Heading>
          <AccordionButton width={{ sm: `${width.sm}px`, md: `${width.md}px` }}>
            <Box flex='1' textAlign='left'>
              <strong>Depósito</strong>
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel>
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
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <Heading>
          <AccordionButton width={{ sm: `${width.sm}px`, md: `${width.md}px` }}>
            <Box flex='1' textAlign='left'>
              <strong>Verificadora</strong>
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel>
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
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default DetailExport;
