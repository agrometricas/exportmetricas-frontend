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
              Detalles del Productor
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            <DetailFields>
              <DetailField label='Nombre del Productor'>
                {merchant.businessName}
              </DetailField>
              <DetailField label='RUC'>{merchant.businessId}</DetailField>
              <DetailField label='Email'>{merchant.email}</DetailField>
              <DetailField label='Tipo de Contrato'>
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
              Información Logística
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            <DetailFields>
              <DetailField label='Puerto de Salida'>
                {harborPlace(harborDeparture)}
              </DetailField>
              <DetailField label='Puerto de Destino'>
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
              Detalles Financieros
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            <DetailFields>
              <DetailField label='Cantidad de Cajas'>
                {producerPayment.boxQuantity}
              </DetailField>
              <DetailField label='Marca'>{boxBrand.name}</DetailField>
              <DetailField label='Código'>{boxBrand.brandCode}</DetailField>
              <DetailField label='Peso Neto por Caja'>
                {boxBrand.netWeightBox} LBS
              </DetailField>
              <DetailField label='Peso Bruto por Caja'>
                {boxBrand.grossWeightBox} LBS
              </DetailField>
              <DetailField label='Precio Unitario'>
                ${producerPayment.price}
              </DetailField>
              <DetailField label='Subtotal Inicial'>
                ${producerPayment.subtotal1}
              </DetailField>
              <DetailField label='Costo Transporte'>
                ${producerPayment.transport}
              </DetailField>
              <DetailField label='Costo Materiales'>
                ${producerPayment.materials}
              </DetailField>
              <DetailField label='Otros Costos'>
                ${producerPayment.others}
              </DetailField>
              <DetailField label='Subtotal Final'>
                ${producerPayment.subtotal2}
              </DetailField>
              <DetailField label='Total a Pagar'>
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
              Cuentas Bancarias
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            {producerPayment.sourceBankAccount && (
              <>
                <DetailSubtitle>Cuenta Origen</DetailSubtitle>
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
                <DetailSubtitle>Cuenta Destino</DetailSubtitle>
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
              Transferencia Realizada
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            <DetailFields>
              <DetailField label='Monto Transferido'>
                ${producerPayment.amount}
              </DetailField>
            </DetailFields>
            <DetailSubtitle>Evidencia</DetailSubtitle>
            <a
              href={producerPayment.transferUrl}
              target='_blank'
              rel='noopener noreferrer'
            >
              Ver Comprobante
            </a>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default DetailProducerPayments;
