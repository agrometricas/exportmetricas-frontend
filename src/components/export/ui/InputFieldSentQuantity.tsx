import { Grid, GridItem, Input, InputGroup, NumberInput, Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';

interface InputFieldSentQuantityProps {
  name: string;
  material: string;
  materialSelected: string;
  quantity: number | '';
  unit?: string;
  placeholder?: string;
}

const InputFieldSentQuantity: React.FC<InputFieldSentQuantityProps> = ({
  name,
  material,
  materialSelected,
  quantity,
  unit,
  placeholder,
}) => {
  const [field, meta, helpers] = useField(name);

  const handleBlur = (event: React.FocusEvent): void => {
    field.onBlur(event);

    helpers.setValue(Number(meta.value));
  };

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === 'Enter') {
      helpers.setValue(Number(field.value));
    }
  };

  return (materialSelected !== 'N/A' && (<Field.Root id={name} invalid={!!meta.error && meta.touched}>
    <Grid templateColumns='repeat(5, 1fr)' gap={1} alignItems='center'>
      <GridItem colSpan={1}>
        <Field.Label fontSize='sm' m={0} width={'100%'}>
          {material}:
        </Field.Label>
      </GridItem>
      <GridItem colSpan={2}>
        <Input
          name={materialSelected}
          id={materialSelected}
          value={materialSelected}
          readOnly={true}
          _hover={{ borderColor: 'border' }}
          cursor={'not-allowed'}
          // textAlign='right'
          opacity={0.8} />
      </GridItem>
      <Input
        name={`${name} need`}
        id={`${name} need`}
        value={quantity}
        readOnly={true}
        _hover={{ borderColor: 'border' }}
        cursor={'not-allowed'}
        textAlign='left'
        opacity={0.8} />
      <InputGroup width={'100%'}
  endElement={unit ? unit : undefined}
  endElementProps={{ pointerEvents: 'none', color: 'fg.muted', fontSize: '1em', mr: '8px' }}>
        
        <NumberInput.Root {...field}>
          <NumberInput.Input
            {...field}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || material}
            textAlign='left'
          />
        </NumberInput.Root>
      </InputGroup>
    </Grid>
    {meta.error && meta.touched && (
      <Field.ErrorText mt='8px' mb='16px'>
        {meta.error}
      </Field.ErrorText>
    )}
  </Field.Root>));
};

export default InputFieldSentQuantity;
