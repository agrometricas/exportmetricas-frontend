import { Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';
import AddShippingCompanyModal from './AddShippingCompanyModal';
import ShippingCompanyMultiSelectBase from './ShippingCompanyMultiSelectBase';
import { ShippingCompanyResponse } from '../../types/shippingCompany.response';

interface InputFieldShippingCompanyMultiSelectProps {
  name: string;
  label: string;
  placeholder: string;
  setShippingCompanies?: (
    shippingCompanies: Partial<ShippingCompanyResponse>[]
  ) => void;
}

const InputFieldShippingCompanyMultiSelect: React.FC<
  InputFieldShippingCompanyMultiSelectProps
> = ({ name, label, placeholder, setShippingCompanies }) => {
  const [field, meta, helpers] = useField(name);

  return (
    <Field.Root id={name} invalid={!!meta.error && meta.touched}>
      <Field.Label fontSize='sm' mb='8px'>
        {label} <AddShippingCompanyModal />
      </Field.Label>

      <ShippingCompanyMultiSelectBase
        name={name}
        placeholder={placeholder}
        onChange={(newValues) =>
          helpers.setValue(
            newValues.map((item: Partial<ShippingCompanyResponse>) => item.id)
          )
        }
        field={field}
        setShippingCompanies={setShippingCompanies}
      />

      {meta.error && meta.touched && (
        <Field.ErrorText mt='8px' mb='16px'>
          {meta.error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default InputFieldShippingCompanyMultiSelect;
