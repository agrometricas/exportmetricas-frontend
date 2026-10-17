import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { useField } from 'formik';
import React, { useEffect, useState } from 'react';
import {
  formatDayMonthYear,
  maskDayMonthYear,
  parseDayMonthYear,
} from '../../../utils/dayMonthYear';

export const INVALID_DAY_DATE = 'invalid-date';

interface InputFieldDayDateProps {
  name: string;
  label?: string;
  helperText?: string;
  isReadOnly?: boolean;
}

// A native date input follows the browser language: in English, 09/10/2026 is
// September 10. This one always reads and shows DD/MM/AAAA, and holds local
// midnight as an ISO string like the other date fields.
const InputFieldDayDate: React.FC<InputFieldDayDateProps> = ({
  name,
  label,
  helperText,
  isReadOnly = false,
}) => {
  const [field, meta, helpers] = useField<string>(name);
  const [text, setText] = useState(formatDayMonthYear(field.value));

  useEffect(() => {
    if (field.value === INVALID_DAY_DATE) return;
    setText((current) =>
      parseDayMonthYear(current)?.toISOString() === field.value
        ? current
        : formatDayMonthYear(field.value),
    );
  }, [field.value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const masked = maskDayMonthYear(e.target.value);
    setText(masked);
    const date = parseDayMonthYear(masked);
    helpers.setValue(date ? date.toISOString() : masked ? INVALID_DAY_DATE : '');
  };

  return (
    <FormControl id={name} isInvalid={!!meta.error && meta.touched}>
      <Flex flexDirection='column'>
        {label && (
          <FormLabel fontSize='sm' mb='8px'>
            {label}
          </FormLabel>
        )}
        <Input
          name={field.name}
          onBlur={field.onBlur}
          value={text}
          onChange={handleChange}
          placeholder='DD/MM/AAAA'
          inputMode='numeric'
          isReadOnly={isReadOnly}
        />
        {helperText && !(meta.error && meta.touched) && (
          <FormHelperText>{helperText}</FormHelperText>
        )}
        {meta.error && meta.touched && (
          <FormErrorMessage mt='8px' mb='16px'>
            {meta.error}
          </FormErrorMessage>
        )}
      </Flex>
    </FormControl>
  );
};

export default InputFieldDayDate;
