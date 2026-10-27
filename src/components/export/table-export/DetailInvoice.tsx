import {
  Box,
  Card,
  Input,
  InputGroup,
  NumberInput,
  SimpleGrid,
  Textarea,
} from '@chakra-ui/react';
import React from 'react';
import { FormSectionTitle } from '@/components/ui/form/FormSection';
import { ProducerPaymentType } from '../../../types/producerPayment';
import { FormLabel } from '../../ui/form/FormLabel';

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
      <FormSectionTitle>Liquidación a productor</FormSectionTitle>

      <FormSectionTitle>Productor</FormSectionTitle>

      <SimpleGrid
        columns={{ base: 1, sm: 2 }}
        columnGap={5}
        rowGap={3}
        px={'20px'}
      >
        <Box>
          <FormLabel>Productor/Razón social:</FormLabel>
          <Input readOnly={true} value={payment.merchant?.businessName || ''} />
        </Box>
        <Box>
          <FormLabel>RUC:</FormLabel>
          <Input readOnly={true} value={payment.merchant?.businessId || ''} />
        </Box>
        <Box>
          <FormLabel>Ciudad:</FormLabel>
          <Input
            readOnly={true}
            value={payment.merchant?.city || ''}
            placeholder={
              payment.merchant?.city ? 'No se ha agregado información' : ''
            }
          />
        </Box>
        <Box>
          <FormLabel>Dirección:</FormLabel>
          <Input
            readOnly={true}
            value={payment.merchant?.address || ''}
            placeholder={
              payment.merchant?.address ? 'No se ha agregado información' : ''
            }
          />
        </Box>
      </SimpleGrid>

      <FormSectionTitle>Puerto de salida</FormSectionTitle>

      <SimpleGrid
        columns={{ base: 1, sm: 2 }}
        columnGap={5}
        rowGap={3}
        px={'20px'}
      >
        <Box>
          <FormLabel>Nombre</FormLabel>
          <Input readOnly={true} value={payment.harborDeparture?.name || ''} />
        </Box>
        <Box>
          <FormLabel>País</FormLabel>
          <Input
            readOnly={true}
            value={payment.harborDeparture?.country?.name || ''}
          />
        </Box>
        <Box>
          <FormLabel>Latitud</FormLabel>
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
          <FormLabel>Ciudad</FormLabel>
          <Input
            readOnly={true}
            value={payment.harborDeparture?.city?.name || ''}
          />
        </Box>
        <Box>
          <FormLabel>Longitud</FormLabel>
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

      <FormSectionTitle>Puerto de destino</FormSectionTitle>

      <SimpleGrid
        columns={{ base: 1, sm: 2 }}
        columnGap={5}
        rowGap={3}
        px={'20px'}
      >
        <Box>
          <FormLabel>Nombre</FormLabel>
          <Input
            readOnly={true}
            value={payment.harborDestination?.name || ''}
          />
        </Box>
        <Box>
          <FormLabel>País</FormLabel>
          <Input
            readOnly={true}
            value={payment.harborDestination?.country?.name || ''}
          />
        </Box>
        <Box>
          <FormLabel>Latitud</FormLabel>
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
          <FormLabel>Ciudad</FormLabel>
          <Input
            readOnly={true}
            value={payment.harborDestination?.city?.name || ''}
          />
        </Box>
        <Box>
          <FormLabel>Longitud</FormLabel>
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

      <FormSectionTitle>Compra</FormSectionTitle>

      <SimpleGrid
        columns={{ base: 1, sm: 2 }}
        columnGap={5}
        rowGap={3}
        px={'20px'}
      >
        <Box>
          <FormLabel>Precio:</FormLabel>
          <InputGroup
            width={'100%'}
            startElement={<>$</>}
            startElementProps={{
              pointerEvents: 'none',
              color: 'fg.subtle',
              fontSize: '1.2em',
            }}
          >
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
          <FormLabel>Subtotal1</FormLabel>
          <InputGroup
            width={'100%'}
            startElement={<>$</>}
            startElementProps={{
              pointerEvents: 'none',
              color: 'fg.subtle',
              fontSize: '1.2em',
            }}
          >
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

      <FormSectionTitle>Gastos</FormSectionTitle>

      <SimpleGrid
        columns={{ base: 1, sm: 2 }}
        columnGap={5}
        rowGap={3}
        px={'20px'}
      >
        <Box>
          <FormLabel>Transporte:</FormLabel>
          <InputGroup
            width={'100%'}
            startElement={<>$</>}
            startElementProps={{
              pointerEvents: 'none',
              color: 'fg.subtle',
              fontSize: '1.2em',
            }}
          >
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
          <FormLabel>Materiales:</FormLabel>
          <InputGroup
            width={'100%'}
            startElement={<>$</>}
            startElementProps={{
              pointerEvents: 'none',
              color: 'fg.subtle',
              fontSize: '1.2em',
            }}
          >
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
          <FormLabel>Varios:</FormLabel>
          <InputGroup
            width={'100%'}
            startElement={<>$</>}
            startElementProps={{
              pointerEvents: 'none',
              color: 'fg.subtle',
              fontSize: '1.2em',
            }}
          >
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
          <FormLabel>Subtotal2:</FormLabel>
          <InputGroup
            width={'100%'}
            startElement={<>$</>}
            startElementProps={{
              pointerEvents: 'none',
              color: 'fg.subtle',
              fontSize: '1.2em',
            }}
          >
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
          <FormLabel>Total:</FormLabel>
          <InputGroup
            width={'100%'}
            startElement={<>$</>}
            startElementProps={{
              pointerEvents: 'none',
              color: 'fg.subtle',
              fontSize: '1.2em',
            }}
          >
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
        <FormLabel>Descripción de los gastos:</FormLabel>
        <Textarea value={payment.description} readOnly={true} />
      </Box>

      <FormSectionTitle>Cuenta bancaria origen</FormSectionTitle>

      <SimpleGrid
        columns={{ base: 1, sm: 2 }}
        columnGap={5}
        rowGap={3}
        px={'20px'}
      >
        <Box>
          <FormLabel>Tipo</FormLabel>
          <Input
            readOnly={true}
            value={payment.sourceBankAccount?.bank || ''}
          />
        </Box>
        <Box>
          <FormLabel>Tipo</FormLabel>
          <Input
            readOnly={true}
            value={payment.sourceBankAccount?.type || ''}
          />
        </Box>
        <Box>
          <FormLabel>Propietario</FormLabel>
          <Input
            readOnly={true}
            value={payment.sourceBankAccount?.owner || ''}
          />
        </Box>
        <Box>
          <FormLabel>Identificación</FormLabel>
          <Input
            readOnly={true}
            value={payment.sourceBankAccount?.ownerID || ''}
          />
        </Box>
      </SimpleGrid>

      <FormSectionTitle>Cuenta bancaria destino</FormSectionTitle>

      <SimpleGrid
        columns={{ base: 1, sm: 2 }}
        columnGap={5}
        rowGap={3}
        px={'20px'}
      >
        <Box>
          <FormLabel>Tipo</FormLabel>
          <Input
            readOnly={true}
            value={payment.destinationBankAccount?.bank || ''}
          />
        </Box>
        <Box>
          <FormLabel>Tipo</FormLabel>
          <Input
            readOnly={true}
            value={payment.destinationBankAccount?.type || ''}
          />
        </Box>
        <Box>
          <FormLabel>Propietario</FormLabel>
          <Input
            readOnly={true}
            value={payment.destinationBankAccount?.owner || ''}
          />
        </Box>
        <Box>
          <FormLabel>Identificación</FormLabel>
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
