import { Accordion, Box, Heading } from '@chakra-ui/react';
import React from 'react';
import {
  DetailField,
  DetailFields,
  DetailSubtitle,
} from '@/components/ui/DetailFields';
import { ProducerPaymentListItem } from '../../../types/producerPayment';
import { harborPlace } from '../../../utils/harborPlace';

const DetailProducerPayments = ({
  producerPayment,
}: {
  producerPayment: ProducerPaymentListItem;
}): React.JSX.Element => {
  const { merchant, harborDeparture, harborDestination, boxBrand } =
    producerPayment;

  return (
    <Accordion.Root defaultValue={['item-0']} multiple>
      <Accordion.Item value='item-0'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Detalles del productor
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            <DetailFields>
              <DetailField label='Nombre del productor'>
                {merchant.businessName}
              </DetailField>
              <DetailField label='RUC'>{merchant.businessId}</DetailField>
              <DetailField label='Email'>{merchant.email}</DetailField>
              <DetailField label='Tipo de contrato'>
                {merchant.contractType}
              </DetailField>
            </DetailFields>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
      <Accordion.Item value='item-1'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Información logística
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            <DetailFields>
              <DetailField label='Puerto de salida'>
                {harborPlace(harborDeparture)}
              </DetailField>
              <DetailField label='Puerto de destino'>
                {harborPlace(harborDestination)}
              </DetailField>
            </DetailFields>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
      <Accordion.Item value='item-2'>
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
                {producerPayment.boxQuantity}
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
                ${producerPayment.price}
              </DetailField>
              <DetailField label='Subtotal inicial'>
                ${producerPayment.subtotal1}
              </DetailField>
              <DetailField label='Costo transporte'>
                ${producerPayment.transport}
              </DetailField>
              <DetailField label='Costo materiales'>
                ${producerPayment.materials}
              </DetailField>
              <DetailField label='Otros costos'>
                ${producerPayment.others}
              </DetailField>
              <DetailField label='Subtotal final'>
                ${producerPayment.subtotal2}
              </DetailField>
              <DetailField label='Total a pagar'>
                ${producerPayment.total}
              </DetailField>
              <DetailField label='Descripción'>
                {producerPayment.description || 'Sin observaciones'}
              </DetailField>
            </DetailFields>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
      <Accordion.Item value='item-3'>
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
            {producerPayment.sourceBankAccount && (
              <>
                <DetailSubtitle>Cuenta origen</DetailSubtitle>
                <DetailFields>
                  <DetailField label='Propietario'>
                    {producerPayment.sourceBankAccount.owner}
                  </DetailField>
                  <DetailField label='Identificación'>
                    {producerPayment.sourceBankAccount.ownerID}
                  </DetailField>
                  <DetailField label='Cuenta'>
                    {producerPayment.sourceBankAccount.accountNumber}
                  </DetailField>
                  <DetailField label='Tipo'>
                    {producerPayment.sourceBankAccount.type}
                  </DetailField>
                  <DetailField label='Email'>
                    {producerPayment.sourceBankAccount.email}
                  </DetailField>
                </DetailFields>
              </>
            )}
            {producerPayment.destinationBankAccount && (
              <>
                <DetailSubtitle>Cuenta destino</DetailSubtitle>
                <DetailFields>
                  <DetailField label='Propietario'>
                    {producerPayment.destinationBankAccount.owner}
                  </DetailField>
                  <DetailField label='Identificación'>
                    {' '}
                    {producerPayment.destinationBankAccount.ownerID}
                  </DetailField>
                  <DetailField label='Cuenta'>
                    {producerPayment.destinationBankAccount.accountNumber}
                  </DetailField>
                  <DetailField label='Tipo'>
                    {producerPayment.destinationBankAccount.type}
                  </DetailField>
                  <DetailField label='Email'>
                    {producerPayment.destinationBankAccount.email}
                  </DetailField>
                </DetailFields>
              </>
            )}
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
      <Accordion.Item value='item-4'>
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
            <DetailFields>
              <DetailField label='Monto transferido'>
                ${producerPayment.amount}
              </DetailField>
            </DetailFields>
            <DetailSubtitle>Evidencia</DetailSubtitle>
            <a
              href={producerPayment.transferUrl}
              target='_blank'
              rel='noopener noreferrer'
            >
              Ver comprobante
            </a>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default DetailProducerPayments;
