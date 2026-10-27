import { Input, InputGroup, Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';

interface InputFieldPlainProps {
  name: string;
  label?: string;
  unit?: string;
  inputMode?: 'decimal' | 'numeric' | 'text';
  placeholder?: string;
  suggestions?: string[];
}

// A plain input bound to its field and nothing else: InputFieldNumber drops
// the decimal point while typing and loses its value when a row above it is
// removed from a list, and InputFieldText clears its field when it mounts.
const InputFieldPlain: React.FC<InputFieldPlainProps> = ({
  name,
  label,
  unit,
  inputMode,
  placeholder,
  suggestions,
}) => {
  const [field, meta] = useField<string>(name);
  const listId = suggestions ? `${name.replace(/\W/g, '-')}-sugerencias` : '';
  return (
    <Field.Root invalid={!!meta.error && meta.touched}>
      {label && (
        <Field.Label fontSize='sm' mb='8px'>
          {label}
        </Field.Label>
      )}
      <InputGroup
        endElement={unit ? unit : undefined}
        endElementProps={{
          pointerEvents: 'none',
          color: 'fg.muted',
          width: 'auto',
          pr: '12px',
        }}
      >
        <Input
          {...field}
          value={field.value ?? ''}
          inputMode={inputMode}
          placeholder={placeholder ?? label}
          pr={unit ? '110px' : undefined}
          list={listId || undefined}
          autoComplete={suggestions ? 'off' : undefined}
        />
      </InputGroup>
      {suggestions && (
        <datalist id={listId}>
          {suggestions.map((suggestion) => (
            <option key={suggestion} value={suggestion} />
          ))}
        </datalist>
      )}
      <Field.ErrorText>{meta.error}</Field.ErrorText>
    </Field.Root>
  );
};

export default InputFieldPlain;
