import { Flex, InputGroup, NumberInput, Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React, { useEffect, useState } from 'react';
import { useBanChange } from './useBanChange';

interface InputFieldProps {
  name: string;
  label?: string;
  quantity?: number | '';
  placeholder?: string;
  isReadOnly?: boolean;
  min?: number;
  max?: number;
  step?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  description?: string;
  flexDirection?: 'column' | 'row';
  isBan?: {
    state: boolean;
    setBanState?: () => void;
    firstChange: boolean;
  };
  unit?: string;
}

const InputFieldQuantity: React.FC<InputFieldProps> = ({
  name,
  label,
  placeholder,
  quantity,
  isReadOnly = false,
  min = 0,
  max = 40000,
  step = 1,
  flexDirection = 'column',
  size = 'md',
  isBan,
  unit,
}) => {
  const [field, meta, helpers] = useField(name);

  useEffect(() => {
    if (!!quantity) {
      field.value = quantity;
      helpers.setValue(Number(quantity));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantity]);

  useBanChange(isBan?.state, () => {
    if (!!isBan) {
      field.onChange;
      if (isBan.state) {
        field.value = 0;
        helpers.setValue(Number(0));
        if (isBan.firstChange) {
          helpers.setTouched(false);
        }
      } else {
        field.value = '';
        helpers.setValue('');
        if (isBan.firstChange) {
          helpers.setTouched(true);
        }
      }
    }
  });

  // The form holds a number and an empty box counts as 0, as it always has;
  // the text is kept apart so clearing the box does not show a 0 in it.
  const [text, setText] = useState(
    field.value === undefined || field.value === null ? '' : String(field.value)
  );
  useEffect(() => {
    if (Number(text) !== Number(field.value)) {
      setText(field.value === '' || field.value == null ? '' : String(field.value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.value]);

  return (
    <Field.Root
      id={name}
      invalid={!!meta.error && meta.touched}
      width={'100%'}
    >
      <Flex
        flexDirection={flexDirection}
        alignItems={flexDirection === 'row' ? 'center' : 'flex-start'}
      >
        {' '}
        {label && (
          <Flex
            flex={flexDirection === 'row' ? '1' : 'none'}
            minWidth={flexDirection === 'row' ? '15%' : '100%'}
            maxWidth={flexDirection === 'row' ? '25%' : '100%'}
            alignItems='center'
            marginRight={flexDirection === 'row' ? '2%' : '0'}
          >
            <Field.Label
              fontSize='sm'
              mb={flexDirection === 'column' ? '8px' : '0'}
              textAlign={flexDirection === 'row' ? 'left' : 'center'}
              overflow='hidden'
            >
              {label}
            </Field.Label>
          </Flex>
        )}
        <Flex flex={label ? '2' : '1'} width='100%'>
          <NumberInput.Root
            name={field.name}
            value={text}
            onValueChange={({ value }) => {
              setText(value);
              helpers.setValue(Number(value));
            }}
            readOnly={isReadOnly || isBan?.state}
            size={size}
            width='100%'
            min={min}
            max={max}
            step={step}
          >
            <InputGroup
              endElement={unit}
              endElementProps={{ color: 'fg.muted', width: 'auto', pr: '12px' }}
            >
              <NumberInput.Input
                placeholder={placeholder || label}
                onBlur={field.onBlur}
                pr={unit ? '96px' : undefined}
              />
            </InputGroup>
          </NumberInput.Root>
        </Flex>
      </Flex>
      {meta.error && meta.touched && (
        <Field.ErrorText mt='8px' mb='16px'>
          {meta.error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default InputFieldQuantity;
