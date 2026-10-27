import { Accordion, Box, Heading } from '@chakra-ui/react';
import React from 'react';
import {
  DetailField,
  DetailFields,
  DetailSubtitle,
} from '@/components/ui/DetailFields';
import { ClientPayment } from '../../types/client-payment/client-payment.response';

const DetailClientPayments = ({
  clientPayment,
}: {
  clientPayment: ClientPayment;
}): React.JSX.Element => {
  const { client, boxBrand } = clientPayment;

  return (
    <Accordion.Root defaultValue={['item-0']} multiple>
      <Accordion.Item value='item-0'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Detalles del cliente
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            <DetailFields>
              <DetailField label='Nombre del cliente'>
                {client.businessName}
              </DetailField>
              <DetailField label='RUC'>{client.businessId}</DetailField>
              <DetailField label='Email'>{client.email}</DetailField>
              <DetailField label='Tipo'>{client.type}</DetailField>
            </DetailFields>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-1'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Detalles financieros
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            <DetailFields>
              <DetailField label='Cantidad de cajas'>
                {clientPayment.boxQuantity}
              </DetailField>
              <DetailField label='Marca'>{boxBrand.name}</DetailField>
              <DetailField label='Código'>{boxBrand.brandCode}</DetailField>
              <DetailField label='Peso neto por caja'>
                {boxBrand.netWeightBox} LBS
              </DetailField>
              <DetailField label='Peso bruto por caja'>
                {boxBrand.grossWeightBox} LBS
              </DetailField>
              <DetailField label='Precio unitario'>
                ${clientPayment.price}
              </DetailField>
              <DetailField label='Total a pagar'>
                ${clientPayment.total}
              </DetailField>
              <DetailField label='Descripción'>
                {clientPayment.description || 'Sin observaciones'}
              </DetailField>
            </DetailFields>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-2'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Cuentas bancarias
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            {clientPayment.sourceBankAccount && (
              <>
                <DetailSubtitle>Cuenta origen</DetailSubtitle>
                <DetailFields>
                  <DetailField label='Propietario'>
                    {clientPayment.sourceBankAccount.owner}
                  </DetailField>
                  <DetailField label='Identificación'>
                    {clientPayment.sourceBankAccount.ownerID}
                  </DetailField>
                  <DetailField label='Cuenta'>
                    {clientPayment.sourceBankAccount.accountNumber}
                  </DetailField>
                  <DetailField label='Tipo'>
                    {clientPayment.sourceBankAccount.type}
                  </DetailField>
                  <DetailField label='Email'>
                    {clientPayment.sourceBankAccount.email}
                  </DetailField>
                </DetailFields>
              </>
            )}
            {clientPayment.destinationBankAccount && (
              <>
                <DetailSubtitle>Cuenta destino</DetailSubtitle>
                <DetailFields>
                  <DetailField label='Propietario'>
                    {clientPayment.destinationBankAccount.owner}
                  </DetailField>
                  <DetailField label='Identificación'>
                    {clientPayment.destinationBankAccount.ownerID}
                  </DetailField>
                  <DetailField label='Cuenta'>
                    {clientPayment.destinationBankAccount.accountNumber}
                  </DetailField>
                  <DetailField label='Tipo'>
                    {clientPayment.destinationBankAccount.type}
                  </DetailField>
                  <DetailField label='Email'>
                    {clientPayment.destinationBankAccount.email}
                  </DetailField>
                </DetailFields>
              </>
            )}
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-3'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Transferencia realizada
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            <DetailSubtitle>Evidencia</DetailSubtitle>
            {clientPayment.transferUrl ? (
              <a
                href={clientPayment.transferUrl}
                target='_blank'
                rel='noopener noreferrer'
              >
                Ver comprobante
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
