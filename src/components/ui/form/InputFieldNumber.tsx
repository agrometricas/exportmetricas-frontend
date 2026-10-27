'use client';

import { Flex, Input, InputGroup, Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React, { useEffect, useState } from 'react';

interface InputFieldProps {
  name: string;
  label?: string;
  value?: number | '';
  placeholder?: string;
  isReadOnly?: boolean;
  isDecimal?: boolean;
  isDolar?: boolean;
  isGeo?: boolean;
  unit?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  flexDirection?: 'column' | 'row';
}

const InputFieldNumber: React.FC<InputFieldProps> = ({
  name,
  label,
  value = '',
  placeholder,
  isReadOnly = false,
  isDecimal = false,
  isDolar = false,
  isGeo = false,
  unit,
  size = 'md',
  flexDirection = 'column',
}) => {
  const [, meta, helpers] = useField(name);
  const [internalValue, setInternalValue] = useState<string>('');

  useEffect(() => {
    if (value !== '') {
      const formatted =
        isDecimal || isGeo
          ? Number(value).toFixed(isGeo ? 6 : 2)
          : String(value);
      setInternalValue(formatted);
      helpers.setValue(Number(formatted));
    } else {
      setInternalValue('');
      helpers.setValue('');
    }
  }, [helpers, isDecimal, isGeo, value]);

  const handleBlur = (): void => {
    const parsed = parseFloat(internalValue);
    if (!isNaN(parsed)) {
      const formatted = isGeo
        ? parsed.toFixed(6)
        : isDecimal
          ? parsed.toFixed(2)
          : parsed.toString();
      setInternalValue(formatted);
      helpers.setValue(Number(formatted));
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === 'Enter') {
      handleBlur();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const valueStr = e.target.value;
    setInternalValue(valueStr);

    if (
      valueStr === '' ||
      valueStr === '-' ||
      valueStr === '--' ||
      valueStr === '-.' ||
      valueStr === '.' ||
      valueStr === ','
    ) {
      helpers.setValue('');
    } else if (!isNaN(Number(valueStr))) {
      helpers.setValue(Number(valueStr));
    }
  };

  return (
    <Field.Root id={name} invalid={!!meta.error && meta.touched} w='100%'>
      <Flex
        flexDirection={flexDirection}
        alignItems={flexDirection === 'row' ? 'center' : 'flex-start'}
        w='100%'
      >
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
              mb={'8px'}
              textAlign={flexDirection === 'row' ? 'left' : 'center'}
              overflow='hidden'
            >
              {label}
            </Field.Label>
          </Flex>
        )}
        <Flex flex={label ? '2' : '1'} w='100%'>
          <InputGroup
            w='100%'
            startElement={isDolar ? '$' : undefined}
            startElementProps={{ color: 'fg.subtle', fontSize: '1.2em' }}
            endElement={unit}
            endElementProps={{ color: 'fg.muted', fontSize: '1em', mr: '8px' }}
          >
            <Input
              type='text'
              inputMode='decimal'
              readOnly={isReadOnly}
              placeholder={placeholder || label}
              textAlign={isDecimal && !isGeo ? 'right' : 'left'}
              size={size}
              value={internalValue}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
          </InputGroup>
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

export default InputFieldNumber;
