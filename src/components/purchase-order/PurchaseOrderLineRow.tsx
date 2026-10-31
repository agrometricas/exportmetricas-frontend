import { Box, Grid, IconButton, Text, Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { PurchaseOrderLine } from '../../types/purchaseOrder';
import BoxBrandSelectBase from '../box-brands/BoxBrandSelectBase';
import InputFieldPlain from '../ui/form/InputFieldPlain';

interface PurchaseOrderLineRowProps {
  index: number;
  saved?: PurchaseOrderLine;
  canRemove: boolean;
  onRemove: () => void;
}

export default function PurchaseOrderLineRow({
  index,
  saved,
  canRemove,
  onRemove,
}: PurchaseOrderLineRowProps): React.JSX.Element {
  const prefix = `lines[${index}]`;
  const [field, meta, helpers] = useField<number | ''>(`${prefix}.boxBrandId`);

  return (
    <Box borderWidth='1px' borderColor='border' borderRadius='lg' p={4}>
      <Grid
        templateColumns={{ base: '1fr', md: '2fr 1fr 1fr auto' }}
        gap={4}
        alignItems='start'
      >
        <Field.Root invalid={!!meta.error && meta.touched}>
          <Field.Label fontSize='sm' mb='8px'>
            Alícuota
          </Field.Label>
          <BoxBrandSelectBase
            field={field}
            placeholder='Selecciona la alícuota'
            onChange={(value) => helpers.setValue(value?.id ?? '')}
          />
          <Field.ErrorText>{meta.error}</Field.ErrorText>
        </Field.Root>
        <InputFieldPlain
          name={`${prefix}.boxQuantity`}
          label='Cajas por semana'
          inputMode='numeric'
        />
        <InputFieldPlain
          name={`${prefix}.price`}
          label='Precio por caja (opcional)'
          inputMode='decimal'
        />
        <IconButton
          aria-label={`Quitar la alícuota ${index + 1}`}
          variant='ghost'
          colorPalette='red'
          mt={{ base: 0, md: 7 }}
          disabled={!canRemove}
          onClick={onRemove}
        >
          <FiTrash2 />
        </IconButton>
      </Grid>
      {saved && (
        <Text fontSize='xs' color='fg.muted' mt={2}>
          {saved.containers === 1
            ? '1 contenedor por semana'
            : `${saved.containers} contenedores por semana`}{' '}
          de {saved.boxBrand.boxQuantity} cajas
        </Text>
      )}
    </Box>
  );
}
