import { Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';
import ShippingCompanySelectBase from './ShippingCompanySelectBase';
import { ShippingCompanyType } from '../../types/shippingCompany';

interface InputFieldShippingCompanySelectProps {
  name: string;
  label: string;
  placeholder: string;
  onSelect?: (company: Partial<ShippingCompanyType>) => void;
}

const InputFieldShippingCompanySelect: React.FC<
  InputFieldShippingCompanySelectProps
> = ({ name, label, placeholder, onSelect }) => {
  const [field, meta, helpers] = useField(name);
  return (
    <Field.Root id={name} invalid={!!meta.error && meta.touched}>
      <Field.Label fontSize='sm' mb='8px'>
        {label}
      </Field.Label>
      <ShippingCompanySelectBase
        name={name}
        placeholder={placeholder}
        value={field.value}
        onChange={(newValue) => {
          helpers.setValue(newValue?.id);
          if (onSelect) {
            onSelect(newValue as Partial<ShippingCompanyType>);
          }
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

export default InputFieldShippingCompanySelect;
