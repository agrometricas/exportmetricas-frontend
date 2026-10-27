import { Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';
import HarborSelectBaseShipping from './HarborSelectBaseShipping';
import { HarborType } from '../../types/harbor';

interface InputFieldHarborShippingCompanyProps {
  name: string;
  label: string;
  placeholder: string;
  type: 'departure' | 'destination';
  shippingCompany?: {
    harbors?: Array<{
      harborDeparture: Partial<HarborType>;
      harborDestination: Partial<HarborType>;
    }>;
  } | null;
  setHarbor?: (harbor: Partial<HarborType>) => void;
}

const InputFieldHarborShippingCompany: React.FC<
  InputFieldHarborShippingCompanyProps
> = ({ name, label, placeholder, type, shippingCompany, setHarbor }) => {
  const [field, meta, helpers] = useField(name);

  return (
    <Field.Root id={name} invalid={!!meta.error && meta.touched}>
      <Field.Label fontSize='sm' mb='8px'>
        {label}
      </Field.Label>
      <HarborSelectBaseShipping
        name={name}
        placeholder={placeholder}
        type={type}
        shippingCompany={shippingCompany}
        value={field.value}
        onChange={(newValue) => helpers.setValue(newValue?.id)}
        setHarbor={setHarbor}
      />
      {meta.error && meta.touched && (
        <Field.ErrorText mt='8px' mb='16px'>
          {meta.error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default InputFieldHarborShippingCompany;
