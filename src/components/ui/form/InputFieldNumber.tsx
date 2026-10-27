'use client';

import { Flex, Input, InputGroup, Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React, { useEffect, useRef, useState } from 'react';

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
  const [field, meta, helpers] = useField(name);
  // What the user is typing; otherwise the box shows what the form holds, so a
  // row that takes the place of a removed one shows its own number.
  const [draft, setDraft] = useState<string | null>(null);
  const lastValue = useRef<number | ''>('');

  const format = (n: number): string =>
    isGeo ? n.toFixed(6) : isDecimal ? n.toFixed(2) : n.toString();

  const held = field.value;
  const shown =
    draft ??
    (held === '' || held == null || isNaN(Number(held))
      ? ''
      : format(Number(held)));

  // value pushes a figure worked out elsewhere (a quote, a proposal) into the
  // form, and only when it changes: a form that arrives prefilled keeps it.
  useEffect(() => {
    if (value === lastValue.current) return;
    lastValue.current = value;
    setDraft(null);
    helpers.setValue(value === '' ? '' : Number(format(Number(value))));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, helpers]);

  const handleBlur = (): void => {
    if (draft === null) return;
    const parsed = parseFloat(draft);
    if (!isNaN(parsed)) {
      helpers.setValue(Number(format(parsed)));
    }
    setDraft(null);
  };

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === 'Enter') {
      handleBlur();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const valueStr = e.target.value;
    setDraft(valueStr);

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
              value={shown}
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
