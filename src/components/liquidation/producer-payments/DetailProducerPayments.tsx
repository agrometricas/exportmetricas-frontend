import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
} from '@chakra-ui/react';
import React from 'react';
import { harborPlace } from '../../../utils/harborPlace';

const DetailProducerPayments = ({
  producerPayment,
  width,
}: {
  producerPayment: {
    id: number;
    merchant: {
      businessName: string;
      businessId: string;
      contractType: string;
      email: string;
    };
    harborDeparture: {
      name: string;
      country: { name: string };
      city: { name: string };
    };
    harborDestination: {
      name: string;
      country: { name: string };
      city: { name: string };
    };
    boxBrand: {
      name: string;
      brandCode: string;
      netWeightBox: number;
      grossWeightBox: number;
      requiredCertificates?: { id: number; name: string }[];
    };
    boxQuantity: number;
    price: string;
    subtotal1: string;
    transport: string;
    materials: string;
    others: string;
    subtotal2: string;
    total: string;
    amount: string;
    transferUrl: string;
    description?: string;
    sourceBankAccount?: {
      owner: string;
      ownerID: string;
      accountNumber: string;
      type: string;
      email: string;
    };
    destinationBankAccount?: {
      owner: string;
      ownerID: string;
      accountNumber: string;
      type: string;
      email: string;
    };
  };
  width: { sm: number; md: number };
}): React.JSX.Element => {
  const { merchant, harborDeparture, harborDestination, boxBrand } = producerPayment;

  return (
    <Accordion defaultIndex={[0]} allowMultiple>
      <AccordionItem>
        <Heading>
          <AccordionButton pl="60px" width={{ sm: width.sm, md: width.md }}>
            <Box flex="1" textAlign="left" fontSize="md" fontWeight="bold">
              Detalles del Productor
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel pb={4} pl="60px">
          <p><strong>Nombre del Productor:</strong> {merchant.businessName}</p>
          <p><strong>RUC:</strong> {merchant.businessId}</p>
          <p><strong>Email:</strong> {merchant.email}</p>
          <p><strong>Tipo de Contrato:</strong> {merchant.contractType}</p>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <Heading>
          <AccordionButton pl="60px" width={{ sm: width.sm, md: width.md }}>
            <Box flex="1" textAlign="left" fontSize="md" fontWeight="bold">
              Información Logística
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel pb={4} pl="60px">
          <p>
            <strong>Puerto de Salida:</strong> {harborPlace(harborDeparture)}
          </p>
          <p>
            <strong>Puerto de Destino:</strong> {harborPlace(harborDestination)}
          </p>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <Heading>
          <AccordionButton pl="60px" width={{ sm: width.sm, md: width.md }}>
            <Box flex="1" textAlign="left" fontSize="md" fontWeight="bold">
              Detalles Financieros
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel pb={4} pl="60px">
          <p><strong>Cantidad de Cajas:</strong> {producerPayment.boxQuantity}</p>
          <p><strong>Marca:</strong> {boxBrand.name}</p>
          <p><strong>Código:</strong> {boxBrand.brandCode}</p>
          <p><strong>Peso Neto por Caja:</strong> {boxBrand.netWeightBox} LBS</p>
          <p><strong>Peso Bruto por Caja:</strong> {boxBrand.grossWeightBox} LBS</p>
          <p><strong>Precio Unitario:</strong> ${producerPayment.price}</p>
          <p><strong>Subtotal Inicial:</strong> ${producerPayment.subtotal1}</p>
          <p><strong>Costo Transporte:</strong> ${producerPayment.transport}</p>
          <p><strong>Costo Materiales:</strong> ${producerPayment.materials}</p>
          <p><strong>Otros Costos:</strong> ${producerPayment.others}</p>
          <p><strong>Subtotal Final:</strong> ${producerPayment.subtotal2}</p>
          <p><strong>Total a Pagar:</strong> ${producerPayment.total}</p>
          <p><strong>Descripción:</strong> {producerPayment.description || 'Sin observaciones'}</p>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <Heading>
          <AccordionButton pl="60px" width={{ sm: width.sm, md: width.md }}>
            <Box flex="1" textAlign="left" fontSize="md" fontWeight="bold">
              Cuentas Bancarias
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel pb={4} pl="60px">
          {producerPayment.sourceBankAccount && (
            <>
              <p><strong>Cuenta Origen:</strong></p>
              <p>Propietario: {producerPayment.sourceBankAccount.owner}</p>
              <p>Identificación: {producerPayment.sourceBankAccount.ownerID}</p>
              <p>Cuenta: {producerPayment.sourceBankAccount.accountNumber}</p>
              <p>Tipo: {producerPayment.sourceBankAccount.type}</p>
              <p>Email: {producerPayment.sourceBankAccount.email}</p>
            </>
          )}
          {producerPayment.destinationBankAccount && (
            <>
              <p><strong>Cuenta Destino:</strong></p>
              <p>Propietario: {producerPayment.destinationBankAccount.owner}</p>
              <p>Identificación: {producerPayment.destinationBankAccount.ownerID}</p>
              <p>Cuenta: {producerPayment.destinationBankAccount.accountNumber}</p>
              <p>Tipo: {producerPayment.destinationBankAccount.type}</p>
              <p>Email: {producerPayment.destinationBankAccount.email}</p>
            </>
          )}
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <Heading>
          <AccordionButton pl="60px" width={{ sm: width.sm, md: width.md }}>
            <Box flex="1" textAlign="left" fontSize="md" fontWeight="bold">
              Transferencia Realizada
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel pb={4} pl="60px">
          <p><strong>Monto Transferido:</strong> ${producerPayment.amount}</p>
          <p><strong>Evidencia:</strong></p>
          <a href={producerPayment.transferUrl} target="_blank" rel="noopener noreferrer">
            Ver Comprobante
          </a>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default DetailProducerPayments;
