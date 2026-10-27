import { Box, Card, Heading, Input, InputGroup, NumberInput, SimpleGrid, Textarea, Separator, Field } from '@chakra-ui/react';
import React from 'react';
import { ProducerPaymentType } from '../../../types/producerPayment';

interface props {
  payment: Partial<ProducerPaymentType>;
}

const DetailInvoice = ({ payment }: props): React.JSX.Element => {
  return (
    <Card.Root
      w={{
        base: '95%',
        sm: '95%',
        md: '90%',
        lg: '100%',
        xl: '100%',
        '2xl': '700px',
      }}
      mb={'10px'}
      pb={'30px'}
    >
      <Heading fontSize={'2xl'} p={'12px'} m={'16px'}>
        Liquidación a Productor
      </Heading>
      <Separator mb={'16px'} />

      <Heading fontSize={'2xl'} p={'12px'}>
        Productor
      </Heading>
      <Separator mb={'16px'} />

      <SimpleGrid
        columns={{ base: 1, sm: 2 }}
        columnGap={5}
        rowGap={3}
        px={'20px'}
      >
        <Box>
          <Field.Label>Productor/Razón Social:</Field.Label>
          <Input
            readOnly={true}
            value={payment.merchant?.businessName || ''}
          />
        </Box>
        <Box>
          <Field.Label>RUC:</Field.Label>
          <Input readOnly={true} value={payment.merchant?.businessId || ''} />
        </Box>
        <Box>
          <Field.Label>Ciudad:</Field.Label>
          <Input
            readOnly={true}
            value={payment.merchant?.city || ''}
            placeholder={
              payment.merchant?.city ? 'No se ha agregado información' : ''
            }
          />
        </Box>
        <Box>
          <Field.Label>Dirección:</Field.Label>
          <Input
            readOnly={true}
            value={payment.merchant?.address || ''}
            placeholder={
              payment.merchant?.address ? 'No se ha agregado información' : ''
            }
          />
        </Box>
      </SimpleGrid>

      <Heading fontSize={'2xl'} p={'12px'}>
        Puerto de Salida
      </Heading>
      <Separator mb={'16px'} />

      <SimpleGrid
        columns={{ base: 1, sm: 2 }}
        columnGap={5}
        rowGap={3}
        px={'20px'}
      >
        <Box>
          <Field.Label>Nombre</Field.Label>
          <Input
            readOnly={true}
            value={payment.harborDeparture?.name || ''}
          />
        </Box>
        <Box>
          <Field.Label>País</Field.Label>
          <Input
            readOnly={true}
            value={payment.harborDeparture?.country?.name || ''}
          />
        </Box>
        <Box>
          <Field.Label>Latitud</Field.Label>
          <Input
            readOnly={true}
            value={
              payment.harborDeparture?.latitude !== undefined &&
              payment.harborDeparture?.latitude !== null
                ? `${payment.harborDeparture?.latitude}`
                : ''
            }
            placeholder={
              payment.harborDeparture?.latitude !== undefined &&
              payment.harborDeparture?.latitude === null
                ? 'No se ha ingresado el valor'
                : ''
            }
          />
        </Box>
        <Box>
          <Field.Label>Ciudad</Field.Label>
          <Input
            readOnly={true}
            value={payment.harborDeparture?.city?.name || ''}
          />
        </Box>
        <Box>
          <Field.Label>Longitud</Field.Label>
          <Input
            readOnly={true}
            value={
              payment.harborDeparture?.longitude !== undefined &&
              payment.harborDeparture?.longitude !== null
                ? `${payment.harborDeparture?.longitude}`
                : ''
            }
            placeholder={
              payment.harborDeparture?.longitude !== undefined &&
              payment.harborDeparture?.longitude === null
                ? 'No se ha ingresado el valor'
                : ''
            }
          />
        </Box>
      </SimpleGrid>

      <Heading fontSize={'2xl'} p={'12px'}>
        Puerto de Destino
      </Heading>
      <Separator mb={'16px'} />

      <SimpleGrid
        columns={{ base: 1, sm: 2 }}
        columnGap={5}
        rowGap={3}
        px={'20px'}
      >
        <Box>
          <Field.Label>Nombre</Field.Label>
          <Input
            readOnly={true}
            value={payment.harborDestination?.name || ''}
          />
        </Box>
        <Box>
          <Field.Label>País</Field.Label>
          <Input
            readOnly={true}
            value={payment.harborDestination?.country?.name || ''}
          />
        </Box>
        <Box>
          <Field.Label>Latitud</Field.Label>
          <Input
            readOnly={true}
            value={
              payment.harborDestination?.latitude !== undefined &&
              payment.harborDestination?.latitude !== null
                ? `${payment.harborDestination?.latitude}`
                : ''
            }
            placeholder={
              payment.harborDestination?.latitude !== undefined &&
              payment.harborDestination?.latitude === null
                ? 'No se ha ingresado el valor'
                : ''
            }
          />
        </Box>
        <Box>
          <Field.Label>Ciudad</Field.Label>
          <Input
            readOnly={true}
            value={payment.harborDestination?.city?.name || ''}
          />
        </Box>
        <Box>
          <Field.Label>Longitud</Field.Label>
          <Input
            readOnly={true}
            value={
              payment.harborDestination?.longitude !== undefined &&
              payment.harborDestination?.longitude !== null
                ? `${payment.harborDestination?.longitude}`
                : ''
            }
            placeholder={
              payment.harborDestination?.longitude !== undefined &&
              payment.harborDestination?.longitude === null
                ? 'No se ha ingresado el valor'
                : ''
            }
          />
        </Box>
      </SimpleGrid>

      <Heading fontSize={'2xl'} p={'12px'}>
        Compra
      </Heading>
      <Separator mb={'16px'} />

      <SimpleGrid
        columns={{ base: 1, sm: 2 }}
        columnGap={5}
        rowGap={3}
        px={'20px'}
      >
        <Box>
          <Field.Label>Precio:</Field.Label>
          <InputGroup width={'100%'}
  startElement={<>$</>}
  startElementProps={{ pointerEvents: 'none', color: 'gray.400', fontSize: '1.2em' }}>
            
            <NumberInput.Root
              value={String(Number(payment.price).toFixed(2))}
              width={'100%'}
              readOnly={true}
              step={0.01}
            >
              <NumberInput.Input textAlign={'right'} />
            </NumberInput.Root>
          </InputGroup>
        </Box>
        <Box>
          <Field.Label>Subtotal1</Field.Label>
          <InputGroup width={'100%'}
  startElement={<>$</>}
  startElementProps={{ pointerEvents: 'none', color: 'gray.400', fontSize: '1.2em' }}>
            
            <NumberInput.Root
              value={String(Number(payment.subtotal1).toFixed(2))}
              width={'100%'}
              readOnly={true}
              step={0.01}
            >
              <NumberInput.Input textAlign={'right'} />
            </NumberInput.Root>
          </InputGroup>
        </Box>
      </SimpleGrid>

      <Heading fontSize={'2xl'} p={'12px'}>
        Gastos
      </Heading>
      <Separator mb={'16px'} />

      <SimpleGrid
        columns={{ base: 1, sm: 2 }}
        columnGap={5}
        rowGap={3}
        px={'20px'}
      >
        <Box>
          <Field.Label>Transporte:</Field.Label>
          <InputGroup width={'100%'}
  startElement={<>$</>}
  startElementProps={{ pointerEvents: 'none', color: 'gray.400', fontSize: '1.2em' }}>
            
            <NumberInput.Root
              value={String(Number(payment.transport).toFixed(2))}
              width={'100%'}
              readOnly={true}
              step={0.01}
            >
              <NumberInput.Input textAlign={'right'} />
            </NumberInput.Root>
          </InputGroup>
        </Box>
        <Box>
          <Field.Label>Materiales:</Field.Label>
          <InputGroup width={'100%'}
  startElement={<>$</>}
  startElementProps={{ pointerEvents: 'none', color: 'gray.400', fontSize: '1.2em' }}>
            
            <NumberInput.Root
              value={String(Number(payment.materials).toFixed(2))}
              width={'100%'}
              readOnly={true}
              step={0.01}
            >
              <NumberInput.Input textAlign={'right'} />
            </NumberInput.Root>
          </InputGroup>
        </Box>
        <Box>
          <Field.Label>Varios:</Field.Label>
          <InputGroup width={'100%'}
  startElement={<>$</>}
  startElementProps={{ pointerEvents: 'none', color: 'gray.400', fontSize: '1.2em' }}>
            
            <NumberInput.Root
              value={String(Number(payment.others).toFixed(2))}
              width={'100%'}
              readOnly={true}
              step={0.01}
            >
              <NumberInput.Input textAlign={'right'} />
            </NumberInput.Root>
          </InputGroup>
        </Box>
        <Box>
          <Field.Label>Subtotal2:</Field.Label>
          <InputGroup width={'100%'}
  startElement={<>$</>}
  startElementProps={{ pointerEvents: 'none', color: 'gray.400', fontSize: '1.2em' }}>
            
            <NumberInput.Root
              value={String(Number(payment.subtotal2).toFixed(2))}
              width={'100%'}
              readOnly={true}
              step={0.01}
            >
              <NumberInput.Input textAlign={'right'} />
            </NumberInput.Root>
          </InputGroup>
        </Box>
        <Box></Box>
        <Box>
          <Field.Label>Total:</Field.Label>
          <InputGroup width={'100%'}
  startElement={<>$</>}
  startElementProps={{ pointerEvents: 'none', color: 'gray.400', fontSize: '1.2em' }}>
            
            <NumberInput.Root
              value={String(Number(payment.total).toFixed(2))}
              width={'100%'}
              readOnly={true}
              step={0.01}
            >
              <NumberInput.Input textAlign={'right'} />
            </NumberInput.Root>
          </InputGroup>
        </Box>
      </SimpleGrid>

      <Box px={'20px'} mt={3}>
        <Field.Label>Descripción de los gastos:</Field.Label>
        <Textarea value={payment.description} readOnly={true} />
      </Box>

      <Heading fontSize={'2xl'} p={'12px'}>
        Cuenta Bancaria Origen
      </Heading>
      <Separator mb={'16px'} />

      <SimpleGrid
        columns={{ base: 1, sm: 2 }}
        columnGap={5}
        rowGap={3}
        px={'20px'}
      >
        <Box>
          <Field.Label>Tipo</Field.Label>
          <Input
            readOnly={true}
            value={payment.sourceBankAccount?.bank || ''}
          />
        </Box>
        <Box>
          <Field.Label>Tipo</Field.Label>
          <Input
            readOnly={true}
            value={payment.sourceBankAccount?.type || ''}
          />
        </Box>
        <Box>
          <Field.Label>Propietario</Field.Label>
          <Input
            readOnly={true}
            value={payment.sourceBankAccount?.owner || ''}
          />
        </Box>
        <Box>
          <Field.Label>Identificación</Field.Label>
          <Input
            readOnly={true}
            value={payment.sourceBankAccount?.ownerID || ''}
          />
        </Box>
      </SimpleGrid>

      <Heading fontSize={'2xl'} p={'12px'}>
        Cuenta Bancaria Destino
      </Heading>
      <Separator mb={'16px'} />

      <SimpleGrid
        columns={{ base: 1, sm: 2 }}
        columnGap={5}
        rowGap={3}
        px={'20px'}
      >
        <Box>
          <Field.Label>Tipo</Field.Label>
          <Input
            readOnly={true}
            value={payment.destinationBankAccount?.bank || ''}
          />
        </Box>
        <Box>
          <Field.Label>Tipo</Field.Label>
          <Input
            readOnly={true}
            value={payment.destinationBankAccount?.type || ''}
          />
        </Box>
        <Box>
          <Field.Label>Propietario</Field.Label>
          <Input
            readOnly={true}
            value={payment.destinationBankAccount?.owner || ''}
          />
        </Box>
        <Box>
          <Field.Label>Identificación</Field.Label>
          <Input
            readOnly={true}
            value={payment.destinationBankAccount?.ownerID || ''}
          />
        </Box>
      </SimpleGrid>
    </Card.Root>
  );
};

export default DetailInvoice;
