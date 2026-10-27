import { Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';
import ProvinceSelectBase from './ProvinceSelectBase';
import { Province } from '../../types/location/province';

interface InputFieldProvinceSelectProps {
  name: string;
  label: string;
  placeholder: string;
  countryId?: number;
  resetOnParentChange?: boolean;
  onChange?: (newValue: Province | null) => void;
}

const InputFieldProvinceSelect: React.FC<InputFieldProvinceSelectProps> = ({
  name,
  label,
  placeholder,
  countryId,
  resetOnParentChange = true,
  onChange,
}) => {
  const [field, meta, helpers] = useField(name);

  return (
    <Field.Root id={name} invalid={!!meta.error && meta.touched}>
      <Field.Label fontSize='sm' mb='8px' h='21px'>
        {label}
      </Field.Label>

      <ProvinceSelectBase
        name={name}
        placeholder={placeholder}
        countryId={countryId}
        field={field}
        onChange={(newValue) => {
          helpers.setValue(newValue?.id);
          onChange?.(newValue);
        }}
        resetOnParentChange={resetOnParentChange}
      />

      {meta.error && meta.touched && (
        <Field.ErrorText mt='8px' mb='16px'>
          {meta.error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default InputFieldProvinceSelect;
