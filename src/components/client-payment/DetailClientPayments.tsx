import { Accordion, Box, Heading } from '@chakra-ui/react';
import React from 'react';
import { ClientPayment } from '../../types/client-payment/client-payment.response';

const DetailClientPayments = ({
  clientPayment,
  width,
}: {
  clientPayment: ClientPayment;
  width: { sm: number; md: number };
}): React.JSX.Element => {
  const { client, boxBrand } = clientPayment;

  return (
    <Accordion.Root defaultValue={['item-0']} multiple>
      <Accordion.Item value='item-0'>
        <Heading>
          <Accordion.ItemTrigger
            pl='60px'
            width={{ sm: width.sm, md: width.md }}
          >
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Detalles del Cliente
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4} pl='60px'>
          <Accordion.ItemBody>
            <p>
              <strong>Nombre del Cliente:</strong> {client.businessName}
            </p>
            <p>
              <strong>RUC:</strong> {client.businessId}
            </p>
            <p>
              <strong>Email:</strong> {client.email}
            </p>
            <p>
              <strong>Tipo:</strong> {client.type}
            </p>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-1'>
        <Heading>
          <Accordion.ItemTrigger
            pl='60px'
            width={{ sm: width.sm, md: width.md }}
          >
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Detalles Financieros
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4} pl='60px'>
          <Accordion.ItemBody>
            <p>
              <strong>Cantidad de Cajas:</strong> {clientPayment.boxQuantity}
            </p>
            <p>
              <strong>Marca:</strong> {boxBrand.name}
            </p>
            <p>
              <strong>Código:</strong> {boxBrand.brandCode}
            </p>
            <p>
              <strong>Peso Neto por Caja:</strong> {boxBrand.netWeightBox} LBS
            </p>
            <p>
              <strong>Peso Bruto por Caja:</strong> {boxBrand.grossWeightBox}{' '}
              LBS
            </p>
            <p>
              <strong>Precio Unitario:</strong> ${clientPayment.price}
            </p>
            <p>
              <strong>Total a Pagar:</strong> ${clientPayment.total}
            </p>
            <p>
              <strong>Descripción:</strong>{' '}
              {clientPayment.description || 'Sin observaciones'}
            </p>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-2'>
        <Heading>
          <Accordion.ItemTrigger
            pl='60px'
            width={{ sm: width.sm, md: width.md }}
          >
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Cuentas Bancarias
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4} pl='60px'>
          <Accordion.ItemBody>
            {clientPayment.sourceBankAccount && (
              <>
                <p>
                  <strong>Cuenta Origen:</strong>
                </p>
                <p>Propietario: {clientPayment.sourceBankAccount.owner}</p>
                <p>Identificación: {clientPayment.sourceBankAccount.ownerID}</p>
                <p>Cuenta: {clientPayment.sourceBankAccount.accountNumber}</p>
                <p>Tipo: {clientPayment.sourceBankAccount.type}</p>
                <p>Email: {clientPayment.sourceBankAccount.email}</p>
              </>
            )}
            {clientPayment.destinationBankAccount && (
              <>
                <p>
                  <strong>Cuenta Destino:</strong>
                </p>
                <p>Propietario: {clientPayment.destinationBankAccount.owner}</p>
                <p>
                  Identificación: {clientPayment.destinationBankAccount.ownerID}
                </p>
                <p>
                  Cuenta: {clientPayment.destinationBankAccount.accountNumber}
                </p>
                <p>Tipo: {clientPayment.destinationBankAccount.type}</p>
                <p>Email: {clientPayment.destinationBankAccount.email}</p>
              </>
            )}
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-3'>
        <Heading>
          <Accordion.ItemTrigger
            pl='60px'
            width={{ sm: width.sm, md: width.md }}
          >
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Transferencia Realizada
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4} pl='60px'>
          <Accordion.ItemBody>
            <p>
              <strong>Evidencia:</strong>
            </p>
            {clientPayment.transferUrl ? (
              <a
                href={clientPayment.transferUrl}
                target='_blank'
                rel='noopener noreferrer'
              >
                Ver Comprobante
              </a>
            ) : (
              <span>No disponible</span>
            )}
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default DetailClientPayments;
