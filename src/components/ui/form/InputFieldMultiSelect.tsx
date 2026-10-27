'use client';
import { Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';
import MultiSelectBase, { Option } from './MultiSelectBase';

interface InputFieldMultiSelectProps {
  name: string;
  label: string;
  placeholder: string;
  options: Option[];
}

const InputFieldMultiSelect: React.FC<InputFieldMultiSelectProps> = ({
  name,
  label,
  placeholder,
  options,
}) => {
  const [field, meta, helpers] = useField(name);

  return (
    <Field.Root id={name} invalid={!!meta.error && meta.touched} mt='10px'>
      <Field.Label fontSize='sm' mb='8px'>
        {label}
      </Field.Label>
      <MultiSelectBase
        name={name}
        field={field}
        placeholder={placeholder}
        options={options}
        onChange={(newValues: Option[]) =>
          helpers.setValue(newValues.map((item) => item.value))
        }
      />
      {meta.error && meta.touched && (
        <Field.ErrorText mt='8px' mb='16px'>
          {meta.error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default InputFieldMultiSelect;
