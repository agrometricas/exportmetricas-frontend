import { Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';
import CountrySelectBase from './CountrySelectBase';
import { Country } from '../../types/location/country';

interface InputFieldCountrySelectProps {
  name: string;
  label: string;
  placeholder: string;
  onChange?: (newValue: Country | null) => void;
}

const InputFieldCountrySelect: React.FC<InputFieldCountrySelectProps> = ({
  name,
  label,
  placeholder,
  onChange,
}) => {
  const [field, meta, helpers] = useField(name);

  return (
    <Field.Root id={name} invalid={!!meta.error && meta.touched}>
      <Field.Label fontSize='sm' mb='8px' h={'21px'}>
        {label}
      </Field.Label>

      <CountrySelectBase
        name={name}
        placeholder={placeholder}
        field={field}
        onChange={(newValue) => {
          helpers.setValue(newValue?.id || '');
          onChange?.(newValue || null);
        }}
      />

      {meta.error && meta.touched && (
        <Field.ErrorText mt='8px' mb='16px'>
          {meta.error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default InputFieldCountrySelect;
