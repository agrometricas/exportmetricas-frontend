import {
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Select,
  Grid,
  Text,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { useField } from 'formik';
import Link_Next from 'next/link';
import React, { useEffect, useRef } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { LINE_TYPES } from './schemas/purchaseOrder.schema';
import { PurchaseOrderLine } from '../../types/purchaseOrder';
import { formatDayMonthYear } from '../../utils/dayMonthYear';
import BoxBrandSelectBase from '../box-brands/BoxBrandSelectBase';
import BusinessSelectBase from '../business/BusinessSelectBase';
import InputFieldPlain from '../ui/form/InputFieldPlain';

interface PurchaseOrderLineRowProps {
  index: number;
  merchant: number | undefined;
  orderId?: number;
  saved?: PurchaseOrderLine;
  canRemove: boolean;
  onRemove: () => void;
}

function SelectField({
  name,
  label,
  children,
}: {
  name: string;
  label: string;
  children: (field: ReturnType<typeof useField>) => React.ReactNode;
}): React.JSX.Element {
  const binding = useField(name);
  const meta = binding[1];
  return (
    <FormControl isInvalid={!!meta.error && meta.touched}>
      <FormLabel fontSize='sm' mb='8px'>
        {label}
      </FormLabel>
      {children(binding)}
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
}

function ExportStatus({
  orderId,
  saved,
}: {
  orderId?: number;
  saved?: PurchaseOrderLine;
}): React.JSX.Element | null {
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  if (!saved || !orderId) {
    return (
      <Text fontSize='sm' color={mutedColor}>
        Guarda la orden para crear la exportación de esta línea.
      </Text>
    );
  }
  if (saved.export) {
    const cutting = formatDayMonthYear(saved.export.cuttingDate);
    return (
      <Flex align='center' gap={2} wrap='wrap'>
        <Badge colorScheme='green' variant='subtle'>
          Exportación {saved.export.id}
        </Badge>
        <Text fontSize='sm' color={mutedColor}>
          {saved.export.boxQuantity} cajas{cutting ? ` · corte ${cutting}` : ''}
        </Text>
      </Flex>
    );
  }
  return (
    <Button
      as={Link_Next}
      href={`/dashboard/export/purchase-orders/${orderId}/export/${saved.id}`}
      size='sm'
      colorScheme='green'
      alignSelf='flex-start'
    >
      Crear exportación
    </Button>
  );
}

export default function PurchaseOrderLineRow({
  index,
  merchant,
  orderId,
  saved,
  canRemove,
  onRemove,
}: PurchaseOrderLineRowProps): React.JSX.Element {
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const prefix = `lines[${index}]`;
  const [, , businessHelpers] = useField(`${prefix}.businessId`);
  const previousMerchant = useRef(merchant);

  // A farm belongs to one producer: changing the producer empties it.
  useEffect(() => {
    if (previousMerchant.current === merchant) return;
    previousMerchant.current = merchant;
    businessHelpers.setValue('');
  }, [businessHelpers, merchant]);

  const exported = Boolean(saved?.export);

  return (
    <Box borderWidth='1px' borderColor={borderColor} borderRadius='lg' p={4}>
      <Grid
        templateColumns={{
          base: '1fr',
          md: '1fr 1fr',
          xl: '2fr 2fr 1fr 1fr',
        }}
        gap={4}
      >
        <SelectField name={`${prefix}.businessId`} label='Finca'>
          {([field, , helpers]) => (
            <BusinessSelectBase
              field={field}
              placeholder='Seleccione la finca'
              merchant={merchant}
              onChange={(value) => helpers.setValue(value?.id ?? '')}
            />
          )}
        </SelectField>
        <SelectField name={`${prefix}.boxBrandId`} label='Alícuota'>
          {([field, , helpers]) => (
            <BoxBrandSelectBase
              field={field}
              placeholder='Seleccione la alícuota'
              onChange={(value) => helpers.setValue(value?.id ?? '')}
            />
          )}
        </SelectField>
        <InputFieldPlain
          name={`${prefix}.boxQuantity`}
          label='Cajas'
          inputMode='numeric'
        />
        <SelectField name={`${prefix}.type`} label='Tipo'>
          {([field]) => (
            <Select
              name={field.name}
              value={field.value as string}
              onChange={field.onChange}
              onBlur={field.onBlur}
            >
              {LINE_TYPES.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </Select>
          )}
        </SelectField>
      </Grid>
      <Flex mt={3} justify='space-between' align='center' gap={3}>
        <ExportStatus orderId={orderId} saved={saved} />
        <Tooltip
          label={
            exported
              ? 'Cancela la exportación para quitar la línea'
              : 'Quitar la línea'
          }
        >
          <IconButton
            aria-label={`Quitar la línea ${index + 1}`}
            icon={<FiTrash2 />}
            variant='ghost'
            colorScheme='red'
            isDisabled={exported || !canRemove}
            onClick={onRemove}
          />
        </Tooltip>
      </Flex>
    </Box>
  );
}
