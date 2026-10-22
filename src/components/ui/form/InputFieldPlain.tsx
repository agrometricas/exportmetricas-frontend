import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
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
    <FormControl isInvalid={!!meta.error && meta.touched}>
      {label && (
        <FormLabel fontSize='sm' mb='8px'>
          {label}
        </FormLabel>
      )}
      <InputGroup>
        <Input
          {...field}
          value={field.value ?? ''}
          inputMode={inputMode}
          placeholder={placeholder ?? label}
          pr={unit ? '110px' : undefined}
          list={listId || undefined}
          autoComplete={suggestions ? 'off' : undefined}
        />
        {suggestions && (
          <datalist id={listId}>
            {suggestions.map((suggestion) => (
              <option key={suggestion} value={suggestion} />
            ))}
          </datalist>
        )}
        {unit && (
          <InputRightElement
            pointerEvents='none'
            color='gray.500'
            width='auto'
            pr='12px'
          >
            {unit}
          </InputRightElement>
        )}
      </InputGroup>
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default InputFieldPlain;
