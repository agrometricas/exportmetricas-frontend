import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import { useField } from 'formik';
import React, { useEffect } from 'react';

interface InputFieldProps {
  name: string;
  label?: string;
  quantity?: number | '';
  placeholder?: string;
  isReadOnly?: boolean;
  min?: number;
  max?: number;
  step?: number;
  size?: string;
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

  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBan?.state]);

  const handleChange = (valueString: string): void => {
    helpers.setValue(Number(valueString));
  };

  return (
    <FormControl
      id={name}
      isInvalid={!!meta.error && meta.touched}
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
            <FormLabel
              fontSize='sm'
              mb={flexDirection === 'column' ? '8px' : '0'}
              textAlign={flexDirection === 'row' ? 'left' : 'center'}
              overflow='hidden'
            >
              {label}
            </FormLabel>
          </Flex>
        )}
        <InputGroup width={'100%'}>
          {unit && (
            <InputRightElement
              pointerEvents='none'
              color='gray.500'
              fontSize='1em'
              width='auto'
              pr={'12px'}
            >
              {unit}
            </InputRightElement>
          )}
          <Flex
            flex={label ? '2' : '1'}
            width='100%'
            marginLeft={label ? '0' : '0'}
          >
            <NumberInput
              {...field}
              onChange={handleChange}
              isReadOnly={isReadOnly || isBan?.state}
              size={size}
              width={'100%'}
              min={min}
              max={max}
              step={step}
            >
              <NumberInputField
                {...field}
                placeholder={placeholder || label}
                width={'100%'}
                pr={unit ? '96px' : undefined}
              />
            </NumberInput>
          </Flex>
        </InputGroup>
      </Flex>
      {meta.error && meta.touched && (
        <FormErrorMessage mt='8px' mb='16px'>
          {meta.error}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};

export default InputFieldQuantity;
